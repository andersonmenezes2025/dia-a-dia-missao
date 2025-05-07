
import React from 'react';
import { Check, Clock, Edit, Trash2, RepeatIcon, Music, AlarmClock, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/contexts/task/types';
import { useTask } from '@/contexts/task';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { completeTask, deleteTask } = useTask();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trabalho':
        return 'bg-blue-100 text-blue-700';
      case 'casa':
        return 'bg-green-100 text-green-700';
      case 'filhos':
        return 'bg-purple-100 text-purple-700';
      case 'saude':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trabalho':
        return '💼';
      case 'casa':
        return '🏠';
      case 'filhos':
        return '👶';
      case 'saude':
        return '❤️';
      default:
        return '📝';
    }
  };
  
  const getRecurrenceText = (recurrence?: string) => {
    switch (recurrence) {
      case 'daily':
        return 'Diária';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensal';
      default:
        return '';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time;
  };

  return (
    <Card className={`shadow-md transition-all duration-300 overflow-hidden ${task.completed ? 'opacity-70' : 'hover:shadow-lg'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={getCategoryColor(task.category)}>
            {getCategoryIcon(task.category)} {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </Badge>
          <Badge variant="outline">{task.points} pontos</Badge>
        </div>
        <CardTitle className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm text-gray-600 ${task.completed ? 'line-through' : ''}`}>
          {task.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.startTime && (
            <div className="flex items-center text-sm text-gray-500">
              <AlarmClock className="h-3 w-3 mr-1" />
              <span>Início: {formatTime(task.startTime)}</span>
            </div>
          )}
          
          {task.endTime && (
            <div className="flex items-center text-sm text-gray-500 ml-3">
              <AlarmClock className="h-3 w-3 mr-1" />
              <span>Término: {formatTime(task.endTime)}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {task.recurrence && task.recurrence !== 'none' && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
              <RepeatIcon className="h-3 w-3" /> {getRecurrenceText(task.recurrence)}
            </Badge>
          )}
          
          {task.soundAlert && task.soundAlert !== 'none' && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 flex items-center gap-1">
              <Music className="h-3 w-3" /> Som
            </Badge>
          )}
          
          {task.reminder && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
              <BellRing className="h-3 w-3" /> Lembrete
            </Badge>
          )}
        </div>
        
        {task.childAssigned && task.childId && (
          <div className="mt-2">
            <Badge variant="outline" className="bg-purple-50">
              👶 {Array.isArray(task.childId) ? `${task.childId.length} filho(s)` : 'Tarefa para filho'}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!task.completed ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => completeTask(task.id)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-1" /> Completar
            </Button>
            <div className="flex gap-2">
              {onEdit && (
                <Button size="sm" variant="ghost" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Badge variant="default" className="bg-green-500">Concluído</Badge>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
