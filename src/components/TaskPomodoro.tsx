
import React, { useState } from 'react';
import { useTask } from '@/contexts/task';
import PomodoroTimer from './PomodoroTimer';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { useSpeech } from '@/hooks/use-speech';

interface TaskPomodoroProps {
  taskId: string;
  taskTitle: string;
}

const TaskPomodoro: React.FC<TaskPomodoroProps> = ({ taskId, taskTitle }) => {
  const [open, setOpen] = useState(false);
  const { startPomodoroForTask, voiceSettings } = useTask();
  const { speak } = useSpeech({
    voiceType: voiceSettings.voiceType,
    volume: voiceSettings.volume
  });

  const handlePomodoroComplete = () => {
    if (voiceSettings.enabled) {
      speak(`Tempo concluído para a missão: ${taskTitle}`);
    }
    
    toast({
      title: "Pomodoro concluído!",
      description: `Você completou uma sessão de trabalho para: ${taskTitle}`,
    });
  };

  const handleStartPomodoro = () => {
    startPomodoroForTask(taskId);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
          onClick={handleStartPomodoro}
        >
          <Timer className="h-4 w-4" />
          <span>Pomodoro</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pomodoro para: {taskTitle}</DialogTitle>
          <DialogDescription>
            Use o método Pomodoro para aumentar sua produtividade
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <PomodoroTimer onComplete={handlePomodoroComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskPomodoro;
