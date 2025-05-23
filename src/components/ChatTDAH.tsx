import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal, Bot, User, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import env from '@/config/environment';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatTDAH: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente especializado em TDAH. Como posso ajudar você hoje com técnicas de mindfulness ou outras questões?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionError, setConnectionError] = useState(false);
  const [apiUrl, setApiUrl] = useState(env.tdahApiUrl);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if the API URL is configured correctly
  useEffect(() => {
    console.log("Current API URL configuration:", apiUrl);
    console.log("Environment settings:", { 
      isLocalhost: env.isLocalhost, 
      isDevelopment: env.isDevelopment,
      isProduction: env.isProduction
    });
    
    if (!apiUrl) {
      console.error("API URL is not configured");
      setConnectionError(true);
      
      toast({
        title: "Configuração incorreta",
        description: "A URL da API não está configurada corretamente.",
        variant: "destructive",
      });
    }
  }, [apiUrl, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setConnectionError(false);
    
    try {
      // Ensure we have the correct webhook endpoint URL
      const webhookEndpoint = `${apiUrl}/webhook-test/tdah`;
      console.log("Sending message to:", webhookEndpoint);
      
      // Send message to n8n webhook
      const response = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: 'user-' + Date.now(), // Unique user identifier
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Falha na comunicação com o assistente: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Reset retry count on success
      setRetryCount(0);
      
      // Add assistant response
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.output || 'Desculpe, não consegui processar sua mensagem.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantResponse]);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setConnectionError(true);
      
      // Implement retry mechanism with exponential backoff
      const shouldRetry = retryCount < 2; // Max 3 attempts (0, 1, 2)
      
      toast({
        title: "Erro na comunicação",
        description: shouldRetry 
          ? "Tentando reconectar ao assistente..." 
          : `Não foi possível conectar ao assistente em ${apiUrl}/webhook-test/tdah. Verifique se o serviço está rodando.`,
        variant: "destructive",
      });
      
      // Add error message from assistant
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: shouldRetry
          ? "Estou com dificuldades para processar sua mensagem. Tentando novamente..."
          : `Desculpe, estou enfrentando dificuldades técnicas no momento. Verifique se o serviço n8n está rodando em ${apiUrl}/webhook-test/tdah`,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      if (shouldRetry) {
        setRetryCount(prev => prev + 1);
        // Retry with exponential backoff (1s, 2s, 4s)
        const retryDelay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => handleRetryMessage(inputMessage), retryDelay);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRetryMessage = async (message: string) => {
    setIsLoading(true);
    
    try {
      // Ensure we have the correct webhook endpoint URL 
      const webhookEndpoint = `${apiUrl}/webhook-test/tdah`;
      console.log("Retrying message to:", webhookEndpoint);
      
      const response = await fetch(webhookEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: 'user-retry-' + Date.now(),
          timestamp: new Date().toISOString(),
          isRetry: true,
          retryCount: retryCount
        }),
      });
      
      if (!response.ok) {
        throw new Error('Retry failed');
      }
      
      const data = await response.json();
      
      // Reset connection error state
      setConnectionError(false);
      
      // Reset retry count on success
      setRetryCount(0);
      
      // Add assistant response
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.output || 'Desculpe, não consegui processar sua mensagem.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantResponse]);
      
      toast({
        title: "Reconectado!",
        description: "A conexão com o assistente foi restaurada.",
        variant: "default",
      });
      
    } catch (error) {
      // Let the retry mechanism in handleSendMessage handle further retries
      console.error('Erro ao tentar novamente:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update API URL manually (for local testing)
  const handleUpdateApiUrl = (newUrl: string) => {
    setApiUrl(newUrl);
    localStorage.setItem('tdah_api_url', newUrl);
    toast({
      title: "URL da API Atualizada",
      description: `A URL da API foi atualizada para: ${newUrl}`,
    });
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
          <Alert variant="destructive" className="mb-4 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-1">Erro de conexão detectado</p>
              <p className="text-sm">
                O assistente está tentando se conectar a {apiUrl}/webhook-test/tdah
                {env.isLocalhost 
                  ? ". Verifique se o serviço n8n está rodando localmente na porta 5678."
                  : ". Verifique se a configuração da API está correta."}
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
                  {message.sender === 'user' ? (
                    <>
                      <span>Você</span>
                      <User className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3" />
                      <span>Assistente</span>
                    </>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs mt-1 opacity-70 text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
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
      </CardFooter>
    </Card>
  );
};

export default ChatTDAH;
