
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Volume, VolumeX, Volume1, Volume2, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceReminderSettings = () => {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [voiceType, setVoiceType] = useState<'female' | 'male'>('female');
  const { toast } = useToast();

  const handleTestVoice = () => {
    if (!enabled) {
      toast({
        title: "Lembretes por voz desativados",
        description: "Ative os lembretes por voz para testar."
      });
      return;
    }

    // Simulate voice announcement using Web Speech API
    const announcement = "Atenção! A Missão começa em 15 minutos.";
    
    const utterance = new SpeechSynthesisUtterance(announcement);
    utterance.lang = 'pt-BR';
    utterance.volume = volume / 100;
    
    // Try to find an appropriate voice
    const voices = speechSynthesis.getVoices();
    const brVoices = voices.filter(v => v.lang.includes('pt-BR'));
    
    if (brVoices.length > 0) {
      // Look for a voice matching the selected gender
      const genderVoices = voiceType === 'female' 
        ? brVoices.filter(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
        : brVoices.filter(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man'));
      
      if (genderVoices.length > 0) {
        utterance.voice = genderVoices[0];
      } else {
        // Fall back to any Portuguese voice
        utterance.voice = brVoices[0];
      }
    }
    
    speechSynthesis.speak(utterance);
    
    toast({
      title: "Testando lembrete por voz",
      description: `${voiceType === 'female' ? 'Voz feminina' : 'Voz masculina'} com volume ${volume}%`
    });
  };

  const getVolumeIcon = () => {
    if (volume === 0 || !enabled) return <VolumeX className="h-4 w-4" />;
    if (volume < 33) return <Volume className="h-4 w-4" />;
    if (volume < 66) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BellRing className="h-5 w-5 mr-2 text-purple-500" />
          Lembretes por Voz
        </h3>
        <Switch 
          checked={enabled} 
          onCheckedChange={setEnabled} 
        />
      </div>

      <div className={enabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Volume</Label>
            <div className="flex items-center">
              {getVolumeIcon()}
              <span className="ml-2 text-sm">{volume}%</span>
            </div>
          </div>
          <Slider
            value={[volume]}
            onValueChange={(values) => setVolume(values[0])}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Voz</Label>
          <RadioGroup 
            value={voiceType} 
            onValueChange={(value) => setVoiceType(value as 'female' | 'male')}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Feminina</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Masculina</Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          variant="outline"
          onClick={handleTestVoice}
          className="w-full"
        >
          Testar Voz
        </Button>
      </div>
    </Card>
  );
};

export default VoiceReminderSettings;
