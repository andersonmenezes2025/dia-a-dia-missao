
import React, { useState, useEffect } from 'react';
import { Play, Pause, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  onComplete?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(mode === 'work' ? 25 * 60 : 5 * 60);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      if (mode === 'work') {
        toast({
          title: 'Tempo de trabalho finalizado!',
          description: 'Hora de fazer uma pausa curta.',
        });
        setMode('break');
        setSeconds(5 * 60);
        if (onComplete) {
          onComplete();
        }
      } else {
        toast({
          title: 'Pausa finalizada!',
          description: 'Hora de voltar ao trabalho.',
        });
        setMode('work');
        setSeconds(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, mode, toast, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMode('break');
      setSeconds(5 * 60);
    } else {
      setMode('work');
      setSeconds(25 * 60);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
    return (seconds / totalSeconds) * 100;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Pomodoro Timer</h3>
        <div className="flex space-x-2">
          <Button
            variant={mode === 'work' ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (mode !== 'work') switchMode();
            }}
          >
            Trabalho
          </Button>
          <Button
            variant={mode === 'break' ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (mode !== 'break') switchMode();
            }}
          >
            Pausa
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center my-6">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <Timer className="h-8 w-8 text-gray-400" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold mt-8">{formatTime(seconds)}</div>
          </div>
          <svg className="w-40 h-40" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={mode === 'work' ? '#8B5CF6' : '#F97316'}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * getProgressPercentage()) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTimer}
          className="rounded-full"
        >
          {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button
          variant="outline"
          onClick={resetTimer}
          className="rounded-md"
        >
          Reiniciar
        </Button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
