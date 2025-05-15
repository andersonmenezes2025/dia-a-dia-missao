
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Link2 } from 'lucide-react';

interface ExternalIntegrationsProps {
  userId: string;
}

const ExternalIntegrations: React.FC<ExternalIntegrationsProps> = ({ userId }) => {
  const { toast } = useToast();
  
  // Integration state
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = useState(false);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  
  // Form submission handler
  const handleSaveIntegrations = () => {
    // In a real app, this would save to backend
    localStorage.setItem(`missaoDoDia_integrations_${userId}`, JSON.stringify({
      n8nApiKey,
      n8nWebhookUrl,
      googleCalendarEnabled,
      telegramEnabled,
      whatsappEnabled,
      emailEnabled,
    }));
    
    toast({
      title: "Integrações salvas",
      description: "Suas configurações de integração foram salvas com sucesso.",
    });
  };
  
  // Test webhook handler
  const handleTestWebhook = async () => {
    if (!n8nWebhookUrl) {
      toast({
        title: "URL de webhook não configurada",
        description: "Por favor, insira a URL do webhook do n8n para testá-la.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real app, we would make a real HTTP request
      // This is just a simulation
      toast({
        title: "Webhook enviado",
        description: "Dados de teste enviados para o webhook do n8n.",
      });
    } catch (error) {
      toast({
        title: "Erro ao testar webhook",
        description: "Não foi possível se conectar ao webhook do n8n.",
        variant: "destructive",
      });
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
          Configure integrações com serviços externos para automatizar tarefas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Integração com n8n</h3>
          <div className="space-y-2">
            <Label htmlFor="n8n-api-key">Chave API do n8n</Label>
            <Input
              id="n8n-api-key"
              value={n8nApiKey}
              onChange={(e) => setN8nApiKey(e.target.value)}
              placeholder="Insira sua chave API do n8n"
              type="password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="n8n-webhook">URL do webhook do n8n</Label>
            <Input
              id="n8n-webhook"
              value={n8nWebhookUrl}
              onChange={(e) => setN8nWebhookUrl(e.target.value)}
              placeholder="https://seu-n8n.com/webhook/xyz"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleTestWebhook}
            className="mt-2"
          >
            Testar webhook
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Serviços</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="google-calendar">Sincronizar com Google Agenda</Label>
              <p className="text-sm text-muted-foreground">
                Adicionar missões ao seu Google Agenda
              </p>
            </div>
            <Switch
              id="google-calendar"
              checked={googleCalendarEnabled}
              onCheckedChange={setGoogleCalendarEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="telegram">Lembretes via Telegram</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações sobre suas missões via Telegram
              </p>
            </div>
            <Switch
              id="telegram"
              checked={telegramEnabled}
              onCheckedChange={setTelegramEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="whatsapp">Lembretes via WhatsApp</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações sobre suas missões via WhatsApp
              </p>
            </div>
            <Switch
              id="whatsapp"
              checked={whatsappEnabled}
              onCheckedChange={setWhatsappEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email">Relatórios por E-mail</Label>
              <p className="text-sm text-muted-foreground">
                Receber relatórios semanais por e-mail
              </p>
            </div>
            <Switch
              id="email"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveIntegrations}>Salvar configurações</Button>
      </CardFooter>
    </Card>
  );
};

export default ExternalIntegrations;
