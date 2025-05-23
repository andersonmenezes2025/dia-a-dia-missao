
import React, { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  isLoading: boolean;
  connectionError: boolean;
  retryCount: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  connectionError,
  retryCount
}) => {
  return (
    <form onSubmit={handleSendMessage} className="w-full flex gap-2">
      <Input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Escreva sua mensagem aqui..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !inputMessage.trim() || (connectionError && retryCount >= 2)}
        className="bg-gradient-to-r from-purple-600 to-indigo-600"
      >
        <SendHorizontal className="h-4 w-4 mr-2" />
        {isLoading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
};

export default ChatInput;
