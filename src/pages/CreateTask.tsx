import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTask, TaskCategory } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
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
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, BriefcaseIcon, HomeIcon, HeartIcon, BabyIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter no mínimo 3 caracteres' }),
  description: z.string().min(5, { message: 'A descrição deve ter no mínimo 5 caracteres' }),
  category: z.enum(['trabalho', 'casa', 'filhos', 'saude'] as const),
  points: z.coerce.number().min(1, { message: 'A pontuação deve ser no mínimo 1' }).max(100, { message: 'A pontuação máxima é 100' }),
  childAssigned: z.boolean().default(false),
  childId: z.string().optional(),
  dueDate: z.date().optional(),
  pomodoroSessions: z.coerce.number().min(0).default(0),
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
      pomodoroSessions: 0,
    },
  });

  const watchChildAssigned = form.watch('childAssigned');

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      addTask({
        title: data.title,
        description: data.description,
        category: data.category,
        points: data.points,
        dueDate: data.dueDate || null,
        childAssigned: data.childAssigned,
        childId: data.childId,
        pomodoroSessions: data.pomodoroSessions,
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
                name="childAssigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Atribuir a um Filho</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Essa missão será exibida no perfil de filho selecionado
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
                  name="childId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecionar Filho</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um filho" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {childrenList.map(child => (
                            <SelectItem key={child.id} value={child.id}>
                              {child.name} ({child.age} anos)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {watchChildAssigned && childrenList.length === 0 && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  Você não tem filhos cadastrados. Adicione um filho na seção de perfil de filhos primeiro.
                </div>
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
