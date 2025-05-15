
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link2, Save, Loader2 } from 'lucide-react';

interface ExternalIntegrationsProps {
  userId: string;
}

const ExternalIntegrations: React.FC<ExternalIntegrationsProps> = ({ userId }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load saved integration settings from localStorage
  React.useEffect(() => {
    const savedSettings = localStorage.getItem(`missaoDoDia_integrations_${userId}`);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setApiKey(parsed.apiKey || '');
        setWebhookUrl(parsed.webhookUrl || '');
      } catch (error) {
        console.error('Failed to parse saved integration settings:', error);
      }
    }
  }, [userId]);

  // Save integration settings
  const handleSaveIntegrations = () => {
    setIsLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem(`missaoDoDia_integrations_${userId}`, JSON.stringify({
        apiKey,
        webhookUrl
      }));
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações de integração foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Failed to save integration settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test webhook connection
  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Webhook URL não definida",
        description: "Por favor, insira uma URL de webhook para testar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send a test payload to the webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Use no-cors to handle CORS issues with external webhooks
        body: JSON.stringify({
          event: "test",
          message: "This is a test connection from Missão do Dia app",
          timestamp: new Date().toISOString(),
          userId
        }),
      });
      
      // Since we're using no-cors, we won't get a proper response status
      toast({
        title: "Solicitação enviada",
        description: "A solicitação de teste foi enviada. Verifique seu n8n para confirmar.",
      });
    } catch (error) {
      console.error('Failed to test webhook:', error);
      toast({
        title: "Erro ao testar webhook",
        description: "Não foi possível conectar ao webhook. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-purple-500" />
          Integrações Externas
        </CardTitle>
        <CardDescription>
          Configure integrações com n8n, Telegram, WhatsApp, E-mail e Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Chave API (n8n ou outro serviço)</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Insira sua chave API"
          />
          <p className="text-sm text-gray-500">
            Esta chave será usada para autenticar com serviços externos.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook (n8n)</Label>
          <Input
            id="webhook-url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://seu-servidor-n8n.com/webhook/..."
          />
          <p className="text-sm text-gray-500">
            Os eventos da aplicação serão enviados para este webhook para automação.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={handleSaveIntegrations}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar Configurações
          </Button>
          
          <Button
            variant="outline"
            onClick={handleTestWebhook}
            disabled={!webhookUrl || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Link2 className="h-4 w-4 mr-2" />}
            Testar Conexão
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-medium text-sm mb-2">O que você pode fazer com estas integrações:</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>Enviar tarefas concluídas para planilhas ou bancos de dados</li>
            <li>Receber lembretes via Telegram, WhatsApp ou E-mail</li>
            <li>Sincronizar eventos com o Google Calendar</li>
            <li>Automatizar tarefas baseadas em sua rotina</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalIntegrations;
