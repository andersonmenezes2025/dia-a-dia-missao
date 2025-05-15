import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import VoiceReminderSettings from '@/components/VoiceReminderSettings';
import ExternalIntegrations from '@/components/ExternalIntegrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User, Settings, Bell, Calendar as CalendarIcon, Link2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { menstrualCycle, updateMenstrualCycle } = useTask();
  const { toast } = useToast();

  // User profile state
  const [name, setName] = useState(currentUser?.name || '');
  const [age, setAge] = useState(currentUser?.age?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentUser?.gender || 'other');
  const [biologicalSex, setBiologicalSex] = useState<'male' | 'female'>(
    currentUser?.biologicalSex || gender === 'female' ? 'female' : 'male'
  );
  const [darkMode, setDarkMode] = useState(currentUser?.preferences?.darkMode || false);
  const [highContrast, setHighContrast] = useState(currentUser?.preferences?.highContrast || false);
  const [largeText, setLargeText] = useState(currentUser?.preferences?.largeText || false);

  // Menstrual cycle state
  const [cycleStart, setCycleStart] = useState<Date | undefined>(
    menstrualCycle.cycleStart ? new Date(menstrualCycle.cycleStart) : undefined
  );
  const [lastPeriod, setLastPeriod] = useState<Date | undefined>(
    menstrualCycle.lastPeriod ? new Date(menstrualCycle.lastPeriod) : undefined
  );
  const [cycleLength, setCycleLength] = useState(menstrualCycle.cycleLength?.toString() || '28');
  const [periodLength, setPeriodLength] = useState(menstrualCycle.periodLength?.toString() || '5');

  // Update profile handler
  const handleUpdateProfile = () => {
    if (!name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira seu nome.",
        variant: "destructive",
      });
      return;
    }

    const ageNum = age ? parseInt(age) : undefined;
    if (age && (isNaN(ageNum!) || ageNum! <= 0)) {
      toast({
        title: "Idade inválida",
        description: "Por favor, insira uma idade válida.",
        variant: "destructive",
      });
      return;
    }

    updateUserProfile({
      name,
      age: ageNum,
      gender,
      biologicalSex,
      preferences: {
        darkMode,
        highContrast,
        largeText
      }
    });

    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  // Update menstrual cycle handler
  const handleUpdateCycle = () => {
    if (biologicalSex !== 'female') {
      return;
    }

    const cycleLengthNum = parseInt(cycleLength);
    const periodLengthNum = parseInt(periodLength);

    if (isNaN(cycleLengthNum) || cycleLengthNum < 20 || cycleLengthNum > 45) {
      toast({
        title: "Duração de ciclo inválida",
        description: "A duração do ciclo deve ser entre 20 e 45 dias.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(periodLengthNum) || periodLengthNum < 1 || periodLengthNum > 10) {
      toast({
        title: "Duração de período inválida",
        description: "A duração do período deve ser entre 1 e 10 dias.",
        variant: "destructive",
      });
      return;
    }

    updateMenstrualCycle({
      cycleStart,
      lastPeriod,
      cycleLength: cycleLengthNum,
      periodLength: periodLengthNum,
      // Keep current phase if already set, otherwise default to none
      currentPhase: menstrualCycle.currentPhase || 'none'
    });

    toast({
      title: "Ciclo atualizado",
      description: "Suas informações de ciclo foram atualizadas com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Meu Perfil</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Preferências</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span className="hidden md:inline">Integrações</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-500" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e preferências
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Sua idade"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <RadioGroup value={gender} onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Feminino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="gender-other" />
                      <Label htmlFor="gender-other">Outro / Prefiro não informar</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Sexo Biológico (para funcionalidades de saúde)</Label>
                  <RadioGroup value={biologicalSex} onValueChange={(value) => setBiologicalSex(value as 'male' | 'female')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="sex-male" />
                      <Label htmlFor="sex-male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="sex-female" />
                      <Label htmlFor="sex-female">Feminino</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-gray-500">
                    Esta informação é usada para funcionalidades específicas de saúde, como ciclo menstrual.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfile}>Salvar alterações</Button>
              </CardFooter>
            </Card>

            {biologicalSex === 'female' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-500" />
                    Ciclo Menstrual
                  </CardTitle>
                  <CardDescription>
                    Configure seu ciclo para acompanhamento e lembretes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data do início do último período</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {lastPeriod
                              ? format(lastPeriod, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={lastPeriod}
                            onSelect={setLastPeriod}
                            initialFocus
                            disabled={(date) => date > new Date() || date < addDays(new Date(), -90)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Início do ciclo atual (se diferente)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {cycleStart
                              ? format(cycleStart, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={cycleStart}
                            onSelect={setCycleStart}
                            initialFocus
                            disabled={(date) => date > new Date() || date < addDays(new Date(), -90)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cycle-length">Duração do ciclo (dias)</Label>
                      <Input
                        id="cycle-length"
                        type="number"
                        value={cycleLength}
                        onChange={(e) => setCycleLength(e.target.value)}
                        placeholder="28"
                        min="20"
                        max="45"
                      />
                      <p className="text-xs text-gray-500">
                        Normalmente entre 21 e 35 dias
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="period-length">Duração do período (dias)</Label>
                      <Input
                        id="period-length"
                        type="number"
                        value={periodLength}
                        onChange={(e) => setPeriodLength(e.target.value)}
                        placeholder="5"
                        min="1"
                        max="10"
                      />
                      <p className="text-xs text-gray-500">
                        Normalmente entre 3 e 7 dias
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpdateCycle}>Salvar configurações do ciclo</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  Preferências de Acessibilidade
                </CardTitle>
                <CardDescription>
                  Ajuste a interface para melhorar sua experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Ative para reduzir o cansaço visual em ambientes escuros
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">Alto Contraste</Label>
                    <p className="text-sm text-muted-foreground">
                      Melhora a visibilidade dos elementos na tela
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="large-text">Texto Grande</Label>
                    <p className="text-sm text-muted-foreground">
                      Aumenta o tamanho dos textos para facilitar a leitura
                    </p>
                  </div>
                  <Switch
                    id="large-text"
                    checked={largeText}
                    onCheckedChange={setLargeText}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfile}>Salvar preferências</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <VoiceReminderSettings />
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            {currentUser && <ExternalIntegrations userId={currentUser.id} />}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
