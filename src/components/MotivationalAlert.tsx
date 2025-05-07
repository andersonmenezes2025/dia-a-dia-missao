
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Award, Heart } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';

interface MotivationalAlertProps {
  show: boolean;
  onClose: () => void;
  taskTitle?: string;
  isReminder?: boolean;
}

const MotivationalAlert: React.FC<MotivationalAlertProps> = ({ 
  show, 
  onClose, 
  taskTitle = '', 
  isReminder = false 
}) => {
  const [quote, setQuote] = useState<string>('');
  const { getMotivationalPhrase } = useTask();

  useEffect(() => {
    if (show) {
      let phrase = getMotivationalPhrase();
      
      if (isReminder && taskTitle) {
        phrase = `Lembrete: "${taskTitle}" começa em breve!\n\n${phrase}\n\nLembre-se que seu trabalho é importante e sua família te ama muito!`;
      } else {
        phrase = `${phrase}\n\nSeu trabalho faz diferença e seus entes queridos valorizam seu esforço!`;
      }
      
      setQuote(phrase);
    }
  }, [show, getMotivationalPhrase, taskTitle, isReminder]);

  return (
    <AlertDialog open={show} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <AlertDialogHeader>
          <div className="flex justify-center mb-3">
            {isReminder ? (
              <Heart className="h-12 w-12 text-purple-500" />
            ) : (
              <Award className="h-12 w-12 text-purple-500" />
            )}
          </div>
          <AlertDialogTitle className="text-center text-purple-800">
            {isReminder ? 'Lembrete de Missão' : 'Momento TDAH'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg py-4 whitespace-pre-line">
            {quote}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center">
          <Button onClick={onClose}>
            {isReminder ? 'Preparar' : 'Entendi'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MotivationalAlert;
