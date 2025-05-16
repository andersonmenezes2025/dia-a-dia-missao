
import React from 'react';
import { useTask } from '@/contexts/task';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Star } from 'lucide-react';

interface MedalDetailsProps {
  completedTasks: number;
  childMode?: boolean;
  childId?: string;
}

const MedalDetails: React.FC<MedalDetailsProps> = ({ 
  completedTasks, 
  childMode = false,
  childId
}) => {
  const { getMedalRequirements } = useTask();
  
  const bronzeRequirement = getMedalRequirements('bronze');
  const silverRequirement = getMedalRequirements('silver');
  const goldRequirement = getMedalRequirements('gold');
  
  const hasBronze = completedTasks >= bronzeRequirement;
  const hasSilver = completedTasks >= silverRequirement;
  const hasGold = completedTasks >= goldRequirement;
  
  const medals = [
    { 
      type: 'bronze', 
      name: 'Bronze',
      earned: hasBronze,
      color: 'bg-amber-700',
      requirement: bronzeRequirement 
    },
    { 
      type: 'silver', 
      name: 'Prata', 
      earned: hasSilver,
      color: 'bg-gray-400',
      requirement: silverRequirement 
    },
    { 
      type: 'gold', 
      name: 'Ouro', 
      earned: hasGold,
      color: 'bg-yellow-400',
      requirement: goldRequirement 
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          Medalhas Conquistadas
        </CardTitle>
        <CardDescription>
          Suas conquistas baseadas em tarefas completadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {medals.map(medal => (
            <div 
              key={medal.type}
              className={`flex flex-col items-center p-3 rounded-lg border ${medal.earned ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${medal.earned ? medal.color : 'bg-gray-200'}`}>
                {medal.earned ? (
                  <Star className="h-6 w-6 text-white" />
                ) : (
                  <Star className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <span className={`text-sm font-medium ${medal.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                {medal.name}
              </span>
              <span className="text-xs text-gray-500">
                {medal.earned ? 'Conquistada!' : `${medal.requirement} tarefas`}
              </span>
            </div>
          ))}
        </div>
        
        {!hasGold && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Próxima medalha</h4>
            {!hasBronze && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Bronze</span>
                  <span>{completedTasks}/{bronzeRequirement}</span>
                </div>
                <Progress value={(completedTasks / bronzeRequirement) * 100} className="h-2" />
              </div>
            )}
            
            {hasBronze && !hasSilver && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Prata</span>
                  <span>{completedTasks}/{silverRequirement}</span>
                </div>
                <Progress value={(completedTasks / silverRequirement) * 100} className="h-2" />
              </div>
            )}
            
            {hasSilver && !hasGold && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Ouro</span>
                  <span>{completedTasks}/{goldRequirement}</span>
                </div>
                <Progress value={(completedTasks / goldRequirement) * 100} className="h-2" />
              </div>
            )}
          </div>
        )}
        
        {childMode && childId && (
          <div className="mt-4 pt-3 border-t text-sm text-gray-600">
            <p>Complete tarefas para ganhar medalhas e pontos!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedalDetails;
