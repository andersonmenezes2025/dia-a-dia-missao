
import React from 'react';
import { useTask } from '@/contexts/task';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useSpeech } from '@/hooks/use-speech';
import { Card, CardContent } from '@/components/ui/card';

const MotivationalVoice: React.FC = () => {
  const { getMotivationalPhrase, voiceSettings } = useTask();
  const { speak, isSupported } = useSpeech({
    voiceType: voiceSettings.voiceType,
    volume: voiceSettings.volume
  });
  
  const handlePlayMotivation = () => {
    if (isSupported && voiceSettings.enabled) {
      const phrase = getMotivationalPhrase();
      speak(phrase);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <Button 
          onClick={handlePlayMotivation} 
          variant="outline" 
          className="w-full"
          disabled={!isSupported || !voiceSettings.enabled}
        >
          <Volume2 className="mr-2 h-4 w-4" />
          Ouvir motivação
        </Button>
      </CardContent>
    </Card>
  );
};

export default MotivationalVoice;
