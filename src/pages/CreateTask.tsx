
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTask, TaskCategory, RecurrenceType } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, BriefcaseIcon, HomeIcon, HeartIcon, BabyIcon, RepeatIcon, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const soundOptions = [
  { value: 'bell', label: 'Sino' },
  { value: 'chime', label: 'Carrilhão' },
  { value: 'notification', label: 'Notificação' },
  { value: 'success', label: 'Sucesso' },
  { value: 'alert', label: 'Alerta' },
  { value: 'none', label: 'Sem Som' },
];

const recurrenceOptions = [
  { value: 'none', label: 'Sem Recorrência' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
];

const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter no mínimo 3 caracteres' }),
  description: z.string().min(5, { message: 'A descrição deve ter no mínimo 5 caracteres' }),
  category: z.enum(['trabalho', 'casa', 'filhos', 'saude'] as const),
  points: z.coerce.number().min(1, { message: 'A pontuação deve ser no mínimo 1' }).max(100, { message: 'A pontuação máxima é 100' }),
  childAssigned: z.boolean().default(false),
  childIds: z.array(z.string()).optional(),
  dueDate: z.date().optional(),
  pomodoroSessions: z.coerce.number().min(0).default(0),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly'] as const).default('none'),
  soundAlert: z.string().default('notification'),
});

const CreateTask: React.FC = () => {
  const { addTask, childrenList } = useTask();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'trabalho',
      points: 10,
      childAssigned: false,
      childIds: [],
      pomodoroSessions: 0,
      recurrence: 'none',
      soundAlert: 'notification',
    },
  });

  const watchChildAssigned = form.watch('childAssigned');
  const watchRecurrence = form.watch('recurrence');

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      // Process for single or multiple children
      const childId = data.childIds && data.childIds.length > 0 ? data.childIds : undefined;
      
      addTask({
        title: data.title,
        description: data.description,
        category: data.category,
        points: data.points,
        dueDate: data.dueDate || null,
        childAssigned: data.childAssigned,
        childId: childId,
        pomodoroSessions: data.pomodoroSessions,
        recurrence: data.recurrence as RecurrenceType,
        soundAlert: data.soundAlert,
      });
      
      toast({
        title: 'Missão criada',
        description: 'Sua nova missão foi adicionada com sucesso!',
      });
      
      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao criar a missão.',
      });
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'trabalho':
        return <BriefcaseIcon className="h-4 w-4" />;
      case 'casa':
        return <HomeIcon className="h-4 w-4" />;
      case 'filhos':
        return <BabyIcon className="h-4 w-4" />;
      case 'saude':
        return <HeartIcon className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Criar Nova Missão</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Missão</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Concluir relatório" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os detalhes da sua missão"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="trabalho">
                            <div className="flex items-center">
                              <BriefcaseIcon className="h-4 w-4 mr-2" />
                              <span>Trabalho</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="casa">
                            <div className="flex items-center">
                              <HomeIcon className="h-4 w-4 mr-2" />
                              <span>Casa</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="filhos">
                            <div className="flex items-center">
                              <BabyIcon className="h-4 w-4 mr-2" />
                              <span>Filhos</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="saude">
                            <div className="flex items-center">
                              <HeartIcon className="h-4 w-4 mr-2" />
                              <span>Saúde</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontos (1-100)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Conclusão</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <FormField
                  control={form.control}
                  name="recurrence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recorrência</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a recorrência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {recurrenceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                {option.value !== 'none' && <RepeatIcon className="h-4 w-4 mr-2" />}
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {watchRecurrence !== 'none' && 
                          <span className="text-purple-600">Esta missão será repetida automaticamente.</span>
                        }
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pomodoroSessions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sessões Pomodoro Necessárias</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="soundAlert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Som de Alerta</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o som" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {soundOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <Music className="h-4 w-4 mr-2" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="childAssigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Atribuir a Filhos</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Essa missão será exibida no perfil dos filhos selecionados
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {watchChildAssigned && childrenList.length > 0 && (
                <FormField
                  control={form.control}
                  name="childIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Selecionar Filhos</FormLabel>
                      <div className="space-y-2 border rounded-md p-4">
                        {childrenList.map((child) => (
                          <div key={child.id} className="flex items-center space-x-2">
                            <Controller
                              name="childIds"
                              control={form.control}
                              render={({ field }) => {
                                return (
                                  <Checkbox
                                    checked={(field.value || []).includes(child.id)}
                                    onCheckedChange={(checked) => {
                                      const updated = checked
                                        ? [...(field.value || []), child.id]
                                        : (field.value || []).filter((value) => value !== child.id);
                                      field.onChange(updated);
                                    }}
                                  />
                                );
                              }}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {child.name} ({child.age} anos)
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {watchChildAssigned && childrenList.length === 0 && (
                <Alert variant="destructive" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  <AlertDescription>
                    Você não tem filhos cadastrados. Adicione um filho na seção de perfil de filhos primeiro.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Criar Missão
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTask;
