
import React from 'react';
import { useTask } from '@/contexts/task';
import MedalProgress from './MedalProgress';
import MedalDetails from './MedalDetails';
import UpcomingTasks from './UpcomingTasks';
import MotivationalVoice from './MotivationalVoice';

interface DashboardWidgetsProps {
  completedTasksCount: number;
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ completedTasksCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <MedalProgress completedTasks={completedTasksCount} />
        <MotivationalVoice />
      </div>
      <div className="space-y-6">
        <UpcomingTasks />
        <MedalDetails completedTasks={completedTasksCount} />
      </div>
    </div>
  );
};

export default DashboardWidgets;
