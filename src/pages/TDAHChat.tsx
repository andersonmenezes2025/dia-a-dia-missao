
import React from 'react';
import Layout from '@/components/Layout';
import ChatTDAH from '@/components/ChatTDAH';

const TDAHChat: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-purple-800">Assistente TDAH</h1>
          <p className="text-gray-600">
            Converse com nosso assistente especializado em TDAH para receber orientações sobre técnicas de mindfulness
            e gerenciamento de sintomas.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 md:p-6 shadow">
          <ChatTDAH />
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
          <p>
            <span className="font-semibold">Lembre-se:</span> Este assistente não substitui a orientação médica profissional.
            Se você estiver enfrentando desafios significativos, é importante consultar um profissional de saúde qualificado.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TDAHChat;
