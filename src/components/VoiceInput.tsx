
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onResult: (text: string) => void;
  placeholder?: string;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onResult,
  placeholder = "Clique para falar...",
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Setup speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'pt-BR';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Erro de reconhecimento",
          description: "Não foi possível reconhecer sua voz. Tente novamente.",
          variant: "destructive",
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onResult, toast]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Não suportado",
        description: "Reconhecimento de voz não é suportado no seu navegador.",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "default" : "outline"}
      onClick={toggleListening}
      className={`flex items-center gap-2 ${className}`}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span>Pare de falar...</span>
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          <span>{placeholder}</span>
        </>
      )}
    </Button>
  );
};

export default VoiceInput;
