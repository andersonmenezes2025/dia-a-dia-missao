
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bot, AlertCircle } from 'lucide-react';
import env from '@/config/environment';

// Import our new components
import ChatMessage from './chat-tdah/ChatMessage';
import ConnectionErrorAlert from './chat-tdah/ConnectionErrorAlert';
import ChatInput from './chat-tdah/ChatInput';
import useChatLogic from './chat-tdah/useChatLogic';

const ChatTDAH: React.FC = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    retryCount,
    connectionError,
    apiUrl,
    handleSendMessage
  } = useChatLogic();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Bot className="h-5 w-5" />
          Assistente TDAH - Mindfulness
          {connectionError && (
            <div className="ml-auto flex items-center text-amber-600 text-sm font-normal">
              <AlertCircle className="h-4 w-4 mr-1" />
              Problemas de conexão
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
        {connectionError && (
          <ConnectionErrorAlert apiUrl={apiUrl} isLocalhost={env.isLocalhost} />
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          connectionError={connectionError}
          retryCount={retryCount}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatTDAH;
