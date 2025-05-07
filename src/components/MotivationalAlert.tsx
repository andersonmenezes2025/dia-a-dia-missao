
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
import { Award } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';

interface MotivationalAlertProps {
  show: boolean;
  onClose: () => void;
}

const MotivationalAlert: React.FC<MotivationalAlertProps> = ({ show, onClose }) => {
  const [quote, setQuote] = useState<string>('');
  const { getMotivationalPhrase } = useTask();

  useEffect(() => {
    if (show) {
      setQuote(getMotivationalPhrase());
    }
  }, [show, getMotivationalPhrase]);

  return (
    <AlertDialog open={show} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <AlertDialogHeader>
          <div className="flex justify-center mb-3">
            <Award className="h-12 w-12 text-purple-500" />
          </div>
          <AlertDialogTitle className="text-center text-purple-800">
            Momento TDAH
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg py-4">
            {quote}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center">
          <Button onClick={onClose}>Entendi</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MotivationalAlert;
