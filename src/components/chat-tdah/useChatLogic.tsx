import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import env from '@/config/environment';
import { Message } from './types';

export const useChatLogic = () => {
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
  const { toast } = useToast();

  // Check if the API URL is configured correctly
  useEffect(() => {
    console.log("Current API URL configuration:", env.tdahApiUrl);
    console.log("Environment settings:", { 
      isLocalhost: env.isLocalhost, 
      isDevelopment: env.isDevelopment,
      isProduction: env.isProduction
    });
    
    if (!env.tdahApiUrl) {
      console.error("API URL is not configured");
      setConnectionError(true);
      
      toast({
        title: "Configuração incorreta",
        description: "A URL da API não está configurada corretamente.",
        variant: "destructive",
      });
    }
  }, [env.tdahApiUrl, toast]);

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
      const webhookEndpoint = `${env.tdahApiUrl}/webhook-test/tdah`;
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
          : `Não foi possível conectar ao assistente em ${env.tdahApiUrl}/webhook-test/tdah. Verifique se o serviço está rodando.`,
        variant: "destructive",
      });
      
      // Add error message from assistant
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: shouldRetry
          ? "Estou com dificuldades para processar sua mensagem. Tentando novamente..."
          : `Desculpe, estou enfrentando dificuldades técnicas no momento. Verifique se o serviço n8n está rodando em ${env.tdahApiUrl}/webhook-test/tdah`,
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
      const webhookEndpoint = `${env.tdahApiUrl}/webhook-test/tdah`;
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

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    retryCount,
    connectionError,
    apiUrl: env.tdahApiUrl,
    handleSendMessage,
    handleRetryMessage,
    handleUpdateApiUrl
  };
};

export default useChatLogic;
