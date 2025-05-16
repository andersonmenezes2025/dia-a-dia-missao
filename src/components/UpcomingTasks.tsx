
import React, { useEffect, useState } from 'react';
import { useTask } from '@/contexts/task';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/use-speech';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UpcomingTasks: React.FC = () => {
  const { tasks, voiceSettings, getUpcomingReminders } = useTask();
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const { speak } = useSpeech({
    voiceType: voiceSettings.voiceType,
    volume: voiceSettings.volume
  });

  // Refresh upcoming tasks every minute
  useEffect(() => {
    const updateUpcomingTasks = () => {
      const upcoming = getUpcomingReminders();
      setUpcomingTasks(upcoming);
    };
    
    updateUpcomingTasks(); // Initial call
    const interval = setInterval(updateUpcomingTasks, 60000);
    
    return () => clearInterval(interval);
  }, [tasks, getUpcomingReminders]);

  const handleAnnounceTask = (task: any) => {
    if (voiceSettings.enabled) {
      const message = `Atenção! A missão ${task.title} está agendada para ${
        task.startTime ? 'às ' + task.startTime : 'hoje'
      }. ${task.description}`;
      
      speak(message);
    }
  };

  // Get tasks scheduled for today
  const today = new Date();
  const todaysTasks = tasks.filter(task => {
    if (!task.completed && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }
    return false;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-500" />
          Próximas Missões
        </CardTitle>
        <CardDescription>
          Missões agendadas para serem realizadas em breve
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingTasks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-amber-600">Em até 15 minutos</h3>
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-500">
                      {task.startTime} - {task.endTime || 'Não definido'}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleAnnounceTask(task)}
                  className="text-amber-700"
                >
                  Anunciar
                </Button>
              </div>
            ))}
          </div>
        ) : null}
        
        {todaysTasks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-purple-600">Para hoje</h3>
            {todaysTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-500">
                      {task.startTime ? format(new Date(`2022-01-01T${task.startTime}`), 'HH:mm', { locale: ptBR }) : 'Não definido'}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleAnnounceTask(task)}
                  className="text-purple-700"
                >
                  Anunciar
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Não há missões agendadas para hoje</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTasks;
