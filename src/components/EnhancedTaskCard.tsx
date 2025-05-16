
import React from 'react';
import { useTask } from '@/contexts/task';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Clock, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskPomodoro from './TaskPomodoro';
import { useSpeech } from '@/hooks/use-speech';

interface EnhancedTaskCardProps {
  task: any;
  onDelete?: (id: string) => void;
}

const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({ task, onDelete }) => {
  const { completeTask, voiceSettings } = useTask();
  const { speak } = useSpeech({
    voiceType: voiceSettings.voiceType,
    volume: voiceSettings.volume
  });
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trabalho': return 'bg-blue-100 text-blue-800';
      case 'casa': return 'bg-green-100 text-green-800';
      case 'filhos': return 'bg-purple-100 text-purple-800';
      case 'saude': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleComplete = () => {
    completeTask(task.id);
    
    if (voiceSettings.enabled) {
      speak(`Parabéns! Você completou a missão: ${task.title}`);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };
  
  const formatDate = (date: Date) => {
    if (!date) return '';
    
    const taskDate = new Date(date);
    return taskDate.toLocaleDateString('pt-BR');
  };
  
  return (
    <Card className={task.completed ? 'bg-gray-50 border-gray-200' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-semibold text-lg ${task.completed ? 'text-gray-500 line-through' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600">{formatDate(task.dueDate)}</p>
          </div>
          <Badge className={getCategoryColor(task.category)}>
            {task.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${task.completed ? 'text-gray-500' : 'text-gray-700'}`}>
          {task.description}
        </p>
        {task.startTime && (
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {task.startTime} {task.endTime && `- ${task.endTime}`}
          </div>
        )}
        {task.childAssigned && task.childId && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              Atribuída à criança
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          <Link to={`/editar-tarefa/${task.id}`}>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </Link>
          {onDelete && (
            <Button variant="ghost" size="sm" className="text-red-600" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Remover
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {!task.completed && (
            <>
              <TaskPomodoro taskId={task.id} taskTitle={task.title} />
              <Button variant="outline" size="sm" onClick={handleComplete}>
                <Check className="h-4 w-4 mr-1" />
                Concluir
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedTaskCard;
