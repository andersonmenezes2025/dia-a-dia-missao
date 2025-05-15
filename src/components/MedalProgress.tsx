
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTask } from '@/contexts/TaskContext';
import { Award } from 'lucide-react';

interface MedalProgressProps {
  completedTasks: number;
  childMode?: boolean;
  childId?: string;
}

const MedalProgress: React.FC<MedalProgressProps> = ({ 
  completedTasks, 
  childMode = false,
  childId
}) => {
  const { getMedalRequirements } = useTask();
  
  // Get medal requirements
  const bronzeRequirement = getMedalRequirements('bronze');
  const silverRequirement = getMedalRequirements('silver');
  const goldRequirement = getMedalRequirements('gold');
  
  // Calculate progress percentages
  const bronzeProgress = Math.min(100, (completedTasks / bronzeRequirement) * 100);
  const silverProgress = Math.min(100, (completedTasks / silverRequirement) * 100);
  const goldProgress = Math.min(100, (completedTasks / goldRequirement) * 100);
  
  // Calculate remaining tasks
  const bronzeRemaining = Math.max(0, bronzeRequirement - completedTasks);
  const silverRemaining = Math.max(0, silverRequirement - completedTasks);
  const goldRemaining = Math.max(0, goldRequirement - completedTasks);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-purple-600" />
        <h3 className="font-medium text-lg">Progresso para Medalhas</h3>
      </div>
      
      {/* Bronze Medal Progress */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Badge className="bg-amber-700 mr-2">Bronze</Badge>
            <span className="text-sm font-medium">
              {bronzeRemaining > 0 ? (
                `Faltam ${bronzeRemaining} ${bronzeRemaining === 1 ? 'tarefa' : 'tarefas'}`
              ) : (
                'Conquistada!'
              )}
            </span>
          </div>
          <span className="text-xs">{completedTasks}/{bronzeRequirement}</span>
        </div>
        <Progress value={bronzeProgress} className="h-2" />
      </div>
      
      {/* Silver Medal Progress */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Badge className="bg-gray-400 mr-2">Prata</Badge>
            <span className="text-sm font-medium">
              {silverRemaining > 0 ? (
                `Faltam ${silverRemaining} ${silverRemaining === 1 ? 'tarefa' : 'tarefas'}`
              ) : (
                'Conquistada!'
              )}
            </span>
          </div>
          <span className="text-xs">{completedTasks}/{silverRequirement}</span>
        </div>
        <Progress value={silverProgress} className="h-2" />
      </div>
      
      {/* Gold Medal Progress */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Badge className="bg-yellow-400 mr-2">Ouro</Badge>
            <span className="text-sm font-medium">
              {goldRemaining > 0 ? (
                `Faltam ${goldRemaining} ${goldRemaining === 1 ? 'tarefa' : 'tarefas'}`
              ) : (
                'Conquistada!'
              )}
            </span>
          </div>
          <span className="text-xs">{completedTasks}/{goldRequirement}</span>
        </div>
        <Progress value={goldProgress} className="h-2" />
      </div>
      
      {childMode && childId && (
        <div className="mt-4 pt-3 border-t text-sm text-gray-600">
          <p>Complete tarefas para ganhar medalhas e pontos!</p>
        </div>
      )}
    </Card>
  );
};

export default MedalProgress;
