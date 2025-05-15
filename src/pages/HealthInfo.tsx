import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { 
  Pill,
  CalendarClock, 
  FileText, 
  AlertCircle, 
  Save, 
  Plus, 
  Calendar as CalendarIcon,
  Heart
} from 'lucide-react';

// Type definitions for health information
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminder: boolean;
  time?: string;
}

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: Date;
  time: string;
  reminder: boolean;
}

interface MoodEntry {
  date: Date;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  notes?: string;
}

const HealthInfo: React.FC = () => {
  const { currentUser } = useAuth();
  const { menstrualCycle } = useTask();
  const { toast } = useToast();
  
  // Health information state
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  
  // Form state
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    frequency: '',
    reminder: false,
  });
  
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    title: '',
    doctor: '',
    date: new Date(),
    time: '',
    reminder: false,
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood']>('neutral');
  const [moodNotes, setMoodNotes] = useState('');

  // Add medication handler
  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e a dosagem do medicamento.",
        variant: "destructive",
      });
      return;
    }
    
    const medication: Medication = {
      id: Date.now().toString(),
      ...newMedication,
    };
    
    setMedications([...medications, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      reminder: false,
    });
    
    toast({
      title: "Medicamento adicionado",
      description: "O medicamento foi adicionado com sucesso.",
    });
  };
  
  // Add appointment handler
  const handleAddAppointment = () => {
    if (!newAppointment.title || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título, data e hora da consulta.",
        variant: "destructive",
      });
      return;
    }
    
    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
    };
    
    setAppointments([...appointments, appointment]);
    setNewAppointment({
      title: '',
      doctor: '',
      date: new Date(),
      time: '',
      reminder: false,
    });
    
    toast({
      title: "Consulta agendada",
      description: "A consulta foi agendada com sucesso.",
    });
  };
  
  // Save medical notes handler
  const handleSaveMedicalNotes = () => {
    toast({
      title: "Notas médicas salvas",
      description: "Suas notas médicas foram salvas com sucesso.",
    });
  };
  
  // Add mood entry handler
  const handleAddMoodEntry = () => {
    if (!selectedDate) {
      toast({
        title: "Data não selecionada",
        description: "Por favor, selecione uma data para o registro de humor.",
        variant: "destructive",
      });
      return;
    }
    
    const entry: MoodEntry = {
      date: selectedDate,
      mood: selectedMood,
      notes: moodNotes || undefined,
    };
    
    // Replace entry if same date exists
    const existingEntryIndex = moodEntries.findIndex(
      (e) => e.date.toDateString() === selectedDate.toDateString()
    );
    
    if (existingEntryIndex >= 0) {
      const updatedEntries = [...moodEntries];
      updatedEntries[existingEntryIndex] = entry;
      setMoodEntries(updatedEntries);
    } else {
      setMoodEntries([...moodEntries, entry]);
    }
    
    setMoodNotes('');
    
    toast({
      title: "Humor registrado",
      description: "Seu humor foi registrado com sucesso.",
    });
  };
  
  // Get mood emoji
  const getMoodEmoji = (mood: MoodEntry['mood']) => {
    switch (mood) {
      case 'excellent': return '😁';
      case 'good': return '🙂';
      case 'neutral': return '😐';
      case 'bad': return '😔';
      case 'terrible': return '😢';
      default: return '😐';
    }
  };
  
  // Check if user is female to show menstrual cycle section
  // Safely check if gender exists before comparing
  const showMenstrualCycle = currentUser?.biologicalSex === 'female';

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Informações de Saúde</h1>
        </div>
        
        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              <span className="hidden md:inline">Medicamentos</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span className="hidden md:inline">Consultas</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Humor</span>
            </TabsTrigger>
            <TabsTrigger value="medical-history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Histórico</span>
            </TabsTrigger>
            {showMenstrualCycle && (
              <TabsTrigger value="menstrual-cycle" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="hidden md:inline">Ciclo</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-purple-500" />
                  Adicionar Medicamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="med-name">Nome do Medicamento *</Label>
                      <Input 
                        id="med-name"
                        value={newMedication.name}
                        onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                        placeholder="Ex: Ritalina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="med-dosage">Dosagem *</Label>
                      <Input 
                        id="med-dosage"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                        placeholder="Ex: 10mg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="med-frequency">Frequência</Label>
                      <Input 
                        id="med-frequency"
                        value={newMedication.frequency}
                        onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                        placeholder="Ex: 2x ao dia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="med-time">Horário do Lembrete</Label>
                      <Input 
                        id="med-time"
                        type="time"
                        value={newMedication.time || ''}
                        onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                        disabled={!newMedication.reminder}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="med-reminder"
                      checked={newMedication.reminder}
                      onChange={(e) => setNewMedication({...newMedication, reminder: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="med-reminder">Ativar lembrete por voz</Label>
                  </div>
                  <Button 
                    onClick={handleAddMedication}
                    className="w-full md:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Medicamento
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Medications List */}
            {medications.length > 0 ? (
              <div className="space-y-4">
                {medications.map((med) => (
                  <Card key={med.id}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">{med.name}</h3>
                        <p className="text-sm text-gray-500">
                          {med.dosage} - {med.frequency}
                          {med.reminder && med.time && (
                            <span className="ml-2 text-purple-600">
                              Lembrete às {med.time}
                            </span>
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setMedications(medications.filter((m) => m.id !== med.id))}
                      >
                        Remover
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <Pill className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum medicamento cadastrado</h3>
                <p className="text-gray-500">Adicione seus medicamentos para receber lembretes</p>
              </div>
            )}
          </TabsContent>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-purple-500" />
                  Agendar Consulta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="app-title">Título da Consulta *</Label>
                      <Input 
                        id="app-title"
                        value={newAppointment.title}
                        onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                        placeholder="Ex: Consulta Psiquiatra"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="app-doctor">Nome do Médico</Label>
                      <Input 
                        id="app-doctor"
                        value={newAppointment.doctor}
                        onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
                        placeholder="Ex: Dr. Silva"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data da Consulta *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newAppointment.date
                              ? format(newAppointment.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newAppointment.date}
                            onSelect={(date) => date && setNewAppointment({...newAppointment, date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="app-time">Horário da Consulta *</Label>
                      <Input 
                        id="app-time"
                        type="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="app-reminder"
                      checked={newAppointment.reminder}
                      onChange={(e) => setNewAppointment({...newAppointment, reminder: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="app-reminder">Ativar lembrete por voz</Label>
                  </div>
                  <Button 
                    onClick={handleAddAppointment}
                    className="w-full md:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Agendar Consulta
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Appointments List */}
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-lg">{app.title}</h3>
                        <p className="text-sm text-gray-500">
                          {format(app.date, "dd 'de' MMMM", { locale: ptBR })} às {app.time}
                          {app.doctor && <span className="ml-2">• {app.doctor}</span>}
                          {app.reminder && (
                            <span className="ml-2 text-purple-600">
                              Com lembrete
                            </span>
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setAppointments(appointments.filter((a) => a.id !== app.id))}
                      >
                        Remover
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <CalendarClock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma consulta agendada</h3>
                <p className="text-gray-500">Agende suas consultas para receber lembretes</p>
              </div>
            )}
          </TabsContent>
          
          {/* Mood Tab */}
          <TabsContent value="mood" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-500" />
                  Registrar Humor do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Como está seu humor hoje?</Label>
                      <div className="flex justify-between items-center pt-2">
                        {(['terrible', 'bad', 'neutral', 'good', 'excellent'] as const).map((mood) => (
                          <button
                            key={mood}
                            type="button"
                            onClick={() => setSelectedMood(mood)}
                            className={`text-3xl transition-transform ${
                              selectedMood === mood ? 'scale-125' : 'opacity-50'
                            }`}
                            aria-label={`Humor ${mood}`}
                          >
                            {getMoodEmoji(mood)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mood-notes">Anotações (opcional)</Label>
                    <Textarea 
                      id="mood-notes"
                      value={moodNotes}
                      onChange={(e) => setMoodNotes(e.target.value)}
                      placeholder="Como você está se sentindo? O que aconteceu hoje?"
                      rows={4}
                    />
                  </div>
                  <Button 
                    onClick={handleAddMoodEntry}
                    className="w-full md:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" /> Salvar Registro
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Mood Entries List */}
            {moodEntries.length > 0 ? (
              <div className="space-y-4">
                {moodEntries.slice().sort((a, b) => b.date.getTime() - a.date.getTime()).map((entry, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">
                          {format(entry.date, "dd 'de' MMMM", { locale: ptBR })}
                        </h3>
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-700 border-t pt-2 mt-2">
                          {entry.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum registro de humor</h3>
                <p className="text-gray-500">Registre seu humor diariamente para acompanhar seu bem-estar</p>
              </div>
            )}
          </TabsContent>
          
          {/* Medical History Tab */}
          <TabsContent value="medical-history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Histórico Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medical-notes">Anotações médicas importantes</Label>
                    <Textarea 
                      id="medical-notes"
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      placeholder="Digite aqui informações importantes sobre seu histórico médico, alergias, condições crônicas, etc."
                      rows={8}
                    />
                  </div>
                  <Button 
                    onClick={handleSaveMedicalNotes}
                    className="w-full md:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" /> Salvar Histórico
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Menstrual Cycle Tab (conditionally rendered) */}
          {showMenstrualCycle && (
            <TabsContent value="menstrual-cycle">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-purple-500" />
                    Ciclo Menstrual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-medium text-purple-800 mb-2">Fase atual do ciclo</h3>
                      <p className="text-lg font-bold capitalize">
                        {menstrualCycle.currentPhase === 'none' ? 'Não definido' : menstrualCycle.currentPhase}
                      </p>
                      {menstrualCycle.lastPeriod && (
                        <p className="text-sm text-gray-600 mt-2">
                          Último período: {format(new Date(menstrualCycle.lastPeriod), "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">
                        Para configurar seu ciclo menstrual, acesse a seção de perfil.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default HealthInfo;
