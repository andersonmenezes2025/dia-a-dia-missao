
import { useState, useEffect } from 'react';

interface UseSpeechOptions {
  voiceType?: 'female' | 'male';
  volume?: number;
}

export function useSpeech({ voiceType = 'female', volume = 80 }: UseSpeechOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
    }
  }, []);
  
  const speak = (text: string) => {
    if (!isSupported) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.volume = volume / 100;
    
    // Try to find an appropriate voice
    const brVoices = voices.filter(v => v.lang.includes('pt') || v.lang.includes('pt-BR'));
    
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
    
    window.speechSynthesis.speak(utterance);
  };
  
  return {
    speak,
    isSupported,
    voices,
  };
}
