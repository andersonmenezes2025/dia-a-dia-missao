
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

interface MotivationalAlertProps {
  show: boolean;
  onClose: () => void;
}

const motivationalQuotes = [
  "Cada pequeno passo conta. Continue avançando!",
  "Você está indo muito bem! Foque em uma tarefa de cada vez.",
  "Divida e conquiste: quebre grandes tarefas em pequenas etapas.",
  "Celebre cada vitória, não importa o tamanho dela.",
  "A consistência é mais importante que a perfeição.",
  "Respire fundo, você consegue lidar com isso!",
  "Um pomodoro de cada vez, um passo de cada vez.",
  "Você já superou muito até aqui, continue!",
  "Organize o ambiente antes da tarefa para focar melhor.",
  "Até o maior projeto começa com um único passo.",
  "Se distrair é normal, retorne gentilmente ao foco.",
  "Lembre-se de suas conquistas quando se sentir desafiado.",
  "Sua atenção é seu super poder. Use-a com sabedoria."
];

const MotivationalAlert: React.FC<MotivationalAlertProps> = ({ show, onClose }) => {
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    if (show) {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[randomIndex]);
    }
  }, [show]);

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
