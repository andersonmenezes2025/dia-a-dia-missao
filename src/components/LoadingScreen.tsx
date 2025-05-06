
import React from 'react';
import { Award } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-purple-50">
      <div className="animate-bounce-small">
        <Award size={48} className="text-purple-500 mb-4" />
      </div>
      <h1 className="text-2xl font-bold text-purple-800 mb-2">Missão do Dia</h1>
      <div className="w-48 h-2 bg-purple-200 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-purple-500 animate-pulse-light"></div>
      </div>
      <p className="mt-4 text-purple-600">Carregando missões...</p>
    </div>
  );
};

export default LoadingScreen;
