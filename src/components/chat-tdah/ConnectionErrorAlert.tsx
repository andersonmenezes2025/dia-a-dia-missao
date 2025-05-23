
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConnectionErrorAlertProps {
  apiUrl: string;
  isLocalhost: boolean;
}

const ConnectionErrorAlert: React.FC<ConnectionErrorAlertProps> = ({ apiUrl, isLocalhost }) => {
  return (
    <Alert variant="destructive" className="mb-4 bg-red-50">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <p className="font-semibold mb-1">Erro de conexão detectado</p>
        <p className="text-sm">
          O assistente está tentando se conectar a {apiUrl}/webhook-test/tdah
          {isLocalhost 
            ? ". Verifique se o serviço n8n está rodando localmente na porta 5678."
            : ". Verifique se a configuração da API está correta."}
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionErrorAlert;
