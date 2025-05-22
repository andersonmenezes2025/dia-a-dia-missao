
import React from 'react';
import { useTask } from '@/contexts/task';
import MedalProgress from './MedalProgress';
import MedalDetails from './MedalDetails';
import UpcomingTasks from './UpcomingTasks';
import MotivationalVoice from './MotivationalVoice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquareText, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardWidgetsProps {
  completedTasksCount: number;
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ completedTasksCount }) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <MedalProgress completedTasks={completedTasksCount} />
        <MotivationalVoice />
        
        {/* New TDAH Chat Widget */}
        <Card className="overflow-hidden border border-purple-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 py-4">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Brain className="h-5 w-5" />
              Assistente TDAH
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Converse com nosso assistente especializado em TDAH para receber orientações personalizadas e técnicas de mindfulness.
              </p>
              <Button 
                onClick={() => navigate('/chat-tdah')} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                <MessageSquareText className="h-4 w-4 mr-2" />
                Iniciar Conversa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <UpcomingTasks />
        <MedalDetails completedTasks={completedTasksCount} />
      </div>
    </div>
  );
};

export default DashboardWidgets;
