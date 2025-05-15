
import React from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceReminderSettings: React.FC = () => {
  const { voiceSettings, updateVoiceSettings } = useTask();
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de lembrete por voz foram atualizadas.",
    });
  };
  
  // Test voice handler
  const handleTestVoice = () => {
    if ('speechSynthesis' in window && voiceSettings.enabled) {
      const utterance = new SpeechSynthesisUtterance("Este é um teste de lembrete por voz. Suas missões serão anunciadas nesta voz.");
      utterance.lang = 'pt-BR';
      utterance.volume = voiceSettings.volume / 100;
      
      // Try to find an appropriate voice
      const voices = speechSynthesis.getVoices();
      const brVoices = voices.filter(v => v.lang.includes('pt-BR'));
      
      if (brVoices.length > 0) {
        // Look for a voice matching the selected gender
        const genderVoices = voiceSettings.voiceType === 'female' 
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
    } else {
      toast({
        title: "Lembretes por voz desativados",
        description: "Ative os lembretes por voz para testar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-500" />
          Lembretes por Voz
        </CardTitle>
        <CardDescription>
          Configure como os lembretes de voz serão anunciados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice-enabled">Ativar lembretes por voz</Label>
            <p className="text-sm text-muted-foreground">
              Receba anúncios falados para suas missões
            </p>
          </div>
          <Switch
            id="voice-enabled"
            checked={voiceSettings.enabled}
            onCheckedChange={(checked) => updateVoiceSettings({ enabled: checked })}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="voice-volume">Volume ({voiceSettings.volume}%)</Label>
          <Slider
            id="voice-volume"
            disabled={!voiceSettings.enabled}
            value={[voiceSettings.volume]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => updateVoiceSettings({ volume: value[0] })}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="voice-type">Tipo de Voz</Label>
          <RadioGroup 
            id="voice-type" 
            value={voiceSettings.voiceType}
            onValueChange={(value) => updateVoiceSettings({ voiceType: value as 'female' | 'male' })}
            disabled={!voiceSettings.enabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="voice-female" />
              <Label htmlFor="voice-female">Feminina</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="voice-male" />
              <Label htmlFor="voice-male">Masculina</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-4">
          <Button 
            variant="outline" 
            onClick={handleTestVoice}
            disabled={!voiceSettings.enabled}
          >
            Testar voz
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings}>Salvar configurações</Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceReminderSettings;
