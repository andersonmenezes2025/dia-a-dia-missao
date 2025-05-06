
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Medal, Star, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  const calculateNextLevelProgress = () => {
    const currentPoints = currentUser.points || 0;
    return (currentPoints % 100);
  };

  const calculateTotalMedals = () => {
    if (!currentUser.medals) return 0;
    return currentUser.medals.bronze + currentUser.medals.silver + currentUser.medals.gold;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Seu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Perfil Básico */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <CardTitle>{currentUser.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Nível de Missões</p>
                  <p className="text-2xl font-bold text-purple-600">{currentUser.level}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total de Medalhas</p>
                  <p className="text-2xl font-bold text-amber-500">{calculateTotalMedals()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Estatísticas */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" /> Progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Próximo Nível</p>
                  <p className="text-sm">{calculateNextLevelProgress()}/100</p>
                </div>
                <Progress value={calculateNextLevelProgress()} className="h-2" />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-3">Medalhas Conquistadas</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center mb-1">
                      <Medal className="h-6 w-6 text-amber-800" />
                    </div>
                    <p className="text-xs text-muted-foreground">Bronze</p>
                    <p className="font-bold">{currentUser.medals?.bronze || 0}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-1">
                      <Medal className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-xs text-muted-foreground">Prata</p>
                    <p className="font-bold">{currentUser.medals?.silver || 0}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center mb-1">
                      <Medal className="h-6 w-6 text-yellow-800" />
                    </div>
                    <p className="text-xs text-muted-foreground">Ouro</p>
                    <p className="font-bold">{currentUser.medals?.gold || 0}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Dados de Jogador</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Total de Pontos</p>
                    <p className="text-lg font-bold">{currentUser.points || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Conquistas</p>
                    <p className="text-lg font-bold">{calculateTotalMedals()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Conquistas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" /> Níveis e Recompensas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Acompanhe seu progresso e desbloqueie novas recompensas ao subir de nível!</p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${currentUser.level >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    1
                  </div>
                  <div>
                    <h3 className={`font-medium ${currentUser.level >= 1 ? 'text-purple-800' : 'text-gray-400'}`}>Iniciante</h3>
                    <p className="text-sm text-muted-foreground">Começou sua jornada com o Missão do Dia</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${currentUser.level >= 5 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    5
                  </div>
                  <div>
                    <h3 className={`font-medium ${currentUser.level >= 5 ? 'text-purple-800' : 'text-gray-400'}`}>Organizado</h3>
                    <p className="text-sm text-muted-foreground">Completou várias missões e está no caminho certo</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${currentUser.level >= 10 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    10
                  </div>
                  <div>
                    <h3 className={`font-medium ${currentUser.level >= 10 ? 'text-purple-800' : 'text-gray-400'}`}>Gerenciador de Tarefas</h3>
                    <p className="text-sm text-muted-foreground">Especialista em concluir missões complexas</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${currentUser.level >= 20 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    20
                  </div>
                  <div>
                    <h3 className={`font-medium ${currentUser.level >= 20 ? 'text-purple-800' : 'text-gray-400'}`}>Mestre das Missões</h3>
                    <p className="text-sm text-muted-foreground">Desbloqueou todos os recursos e se tornou um mestre da produtividade</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
