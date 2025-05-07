
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const hasSpeechRecognition = 'SpeechRecognition' in window;
    const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
    
    if (!hasSpeechRecognition && !hasWebkitSpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Recurso não suportado',
        description: 'Seu navegador não suporta reconhecimento de voz.',
      });
      return;
    }

    // Initialize SpeechRecognition
    let SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined;
    
    if (hasSpeechRecognition) {
      SpeechRecognitionAPI = window.SpeechRecognition;
    } else if (hasWebkitSpeechRecognition) {
      SpeechRecognitionAPI = window.webkitSpeechRecognition;
    }
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'pt-BR';
        
        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex;
          const result = event.results[current];
          
          const transcriptText = result[0].transcript;
          setTranscript(transcriptText);
          
          if (result.isFinal) {
            onTranscription(transcriptText);
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
          toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Erro ao reconhecer voz. Tente novamente.',
          });
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscription, toast]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      toast({
        title: 'Gravação finalizada',
        description: 'Transcrição concluída com sucesso.',
      });
    } else {
      setTranscript('');
      recognitionRef.current.start();
      toast({
        title: 'Gravação iniciada',
        description: 'Fale agora para criar sua missão.',
      });
    }
    
    setIsRecording(!isRecording);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "outline"}
          className="flex gap-2 items-center"
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isRecording ? 'Parar Gravação' : 'Gravar Missão'}
        </Button>
        
        {transcript && (
          <Button
            type="button" 
            variant="ghost" 
            onClick={() => setTranscript('')}
            className="text-xs"
          >
            Limpar
          </Button>
        )}
      </div>
      
      {transcript && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
          <p className="text-sm italic text-purple-700">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
