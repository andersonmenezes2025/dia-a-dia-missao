
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Search, Plus, Clock, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import VoiceReminderSettings from '@/components/VoiceReminderSettings';
import { useToast } from '@/hooks/use-toast';

const ChildMissions = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { tasks, childrenList } = useTask();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Find current child
  const currentChild = childrenList.find(child => child.id === childId);

  useEffect(() => {
    if (!currentChild) {
      toast({
        title: "Filho não encontrado",
        description: "O filho selecionado não foi encontrado.",
        variant: "destructive"
      });
      navigate('/filhos');
    }
  }, [currentChild, navigate, toast]);

  // Filter tasks for this child
  useEffect(() => {
    const childTasks = tasks.filter(task => 
      task.childAssigned && 
      ((typeof task.childId === 'string' && task.childId === childId) ||
       (Array.isArray(task.childId) && task.childId.includes(childId as string)))
    );
    
    const filtered = childTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredTasks(filtered);
  }, [searchTerm, tasks, childId]);

  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const startPomodoro = (taskId: string) => {
    setSelectedTask(taskId);
    setShowPomodoro(true);
  };

  const getMedalRequirementsText = (medalType: string) => {
    switch(medalType) {
      case 'bronze': return 'Complete 5 tarefas para ganhar uma medalha de bronze';
      case 'silver': return 'Complete 10 tarefas para ganhar uma medalha de prata';
      case 'gold': return 'Complete 15 tarefas para ganhar uma medalha de ouro';
      default: return '';
    }
  };

  if (!currentChild) return null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/filhos')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Missões de {currentChild.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Child info and medal requirements */}
          <div>
            <Card className="p-4 mb-6">
              <div className="flex items-center mb-4">
                <div className={`${currentChild.avatarColor || 'bg-purple-500'} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                  {currentChild.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentChild.name}</h3>
                  <p className="text-sm text-gray-500">{currentChild.age} anos</p>
                </div>
              </div>
              
              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium">Pontos acumulados: <span className="font-bold text-purple-600">{currentChild.points}</span></p>
              </div>

              <div className="space-y-2 border-t pt-4">
                <h4 className="font-medium text-sm">Requisitos para Medalhas:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-700">Bronze</Badge>
                    <span>{getMedalRequirementsText('bronze')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-400">Prata</Badge>
                    <span>{getMedalRequirementsText('silver')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-400">Ouro</Badge>
                    <span>{getMedalRequirementsText('gold')}</span>
                  </div>
                </div>
              </div>
            </Card>

            <VoiceReminderSettings />
          </div>

          {/* Center column - Task list */}
          <div className="md:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar missões..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => navigate(`/criar-tarefa?childId=${childId}`)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-1" /> Nova Missão
              </Button>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="active">Ativas</TabsTrigger>
                <TabsTrigger value="completed">Concluídas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {activeTasks.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      {searchTerm 
                        ? "Nenhuma missão ativa encontrada" 
                        : `${currentChild.name} não tem missões ativas no momento`}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {activeTasks.map((task) => (
                      <div key={task.id} className="flex flex-col">
                        <TaskCard task={task} />
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => startPomodoro(task.id)}
                          className="mt-2 self-end"
                        >
                          <Clock className="h-4 w-4 mr-1" /> Iniciar Timer
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      {searchTerm 
                        ? "Nenhuma missão concluída encontrada" 
                        : `${currentChild.name} não tem missões concluídas`}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {completedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Pomodoro Modal */}
        {showPomodoro && selectedTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">Timer Pomodoro</h3>
                <p className="text-sm text-gray-500">
                  {tasks.find(t => t.id === selectedTask)?.title}
                </p>
              </div>
              <div className="p-4">
                <PomodoroTimer onComplete={() => toast({ title: "Tempo finalizado!", description: "Você completou uma sessão de pomodoro." })} />
              </div>
              <div className="p-4 border-t flex justify-end">
                <Button variant="outline" onClick={() => setShowPomodoro(false)}>Fechar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChildMissions;
