import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { 
  Task, 
  Child, 
  MenstrualCycle, 
  TaskContextType,
  VoiceSettings
} from './types';
import { getRandomMotivationalPhrase, shouldShowTaskOnDate, normalizeDate } from './utils';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [menstrualCycle, setMenstrualCycle] = useState<MenstrualCycle>({
    currentPhase: 'none'
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    volume: 80,
    voiceType: 'female'
  });
  const { currentUser } = useAuth();

  // Load tasks from localStorage
  useEffect(() => {
    if (currentUser) {
      const storedTasks = localStorage.getItem(`missaoDoDia_tasks_${currentUser.id}`);
      const storedChildren = localStorage.getItem(`missaoDoDia_children_${currentUser.id}`);
      const storedMenstrualCycle = localStorage.getItem(`missaoDoDia_menstrualCycle_${currentUser.id}`);
      const storedVoiceSettings = localStorage.getItem(`missaoDoDia_voiceSettings_${currentUser.id}`);
      
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert date strings to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        }));
        setTasks(tasksWithDates);
      }
      
      if (storedChildren) {
        setChildrenList(JSON.parse(storedChildren));
      }
      
      if (storedMenstrualCycle) {
        const parsedCycle = JSON.parse(storedMenstrualCycle);
        setMenstrualCycle({
          ...parsedCycle,
          cycleStart: parsedCycle.cycleStart ? new Date(parsedCycle.cycleStart) : undefined,
          lastPeriod: parsedCycle.lastPeriod ? new Date(parsedCycle.lastPeriod) : undefined
        });
      }
      
      if (storedVoiceSettings) {
        const parsed = JSON.parse(storedVoiceSettings);
        // Ensure voiceType is either 'female' or 'male'
        const voiceType = parsed.voiceType === 'male' ? 'male' : 'female';
        setVoiceSettings({
          enabled: Boolean(parsed.enabled),
          volume: Number(parsed.volume) || 80,
          voiceType
        });
      }
    } else {
      setTasks([]);
      setChildrenList([]);
      setMenstrualCycle({ currentPhase: 'none' });
      setVoiceSettings({
        enabled: true,
        volume: 80,
        voiceType: 'female'
      });
    }
  }, [currentUser]);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`missaoDoDia_tasks_${currentUser.id}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  // Save children to localStorage when they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`missaoDoDia_children_${currentUser.id}`, JSON.stringify(childrenList));
    }
  }, [childrenList, currentUser]);

  // Save menstrual cycle when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`missaoDoDia_menstrualCycle_${currentUser.id}`, JSON.stringify(menstrualCycle));
    }
  }, [menstrualCycle, currentUser]);
  
  // Save voice settings when they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`missaoDoDia_voiceSettings_${currentUser.id}`, JSON.stringify(voiceSettings));
    }
  }, [voiceSettings, currentUser]);

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const upcomingTasks = tasks.filter(task => {
        if (!task.completed && task.dueDate && task.reminder && task.startTime) {
          const taskDate = new Date(task.dueDate);
          const [hours, minutes] = task.startTime.split(':').map(Number);
          
          taskDate.setHours(hours, minutes, 0, 0);
          
          // 15 minutes in milliseconds
          const fifteenMinutes = 15 * 60 * 1000;
          const timeDiff = taskDate.getTime() - now.getTime();
          
          // Return true if task is between 14 and 16 minutes from now
          // This gives a 2-minute window to avoid multiple alerts
          return timeDiff > 0 && timeDiff < fifteenMinutes && timeDiff > (fifteenMinutes - 2 * 60 * 1000);
        }
        return false;
      });
      
      if (upcomingTasks.length > 0 && voiceSettings.enabled) {
        // Play voice reminder for the first upcoming task
        const task = upcomingTasks[0];
        
        // Use Web Speech API for voice announcement
        if ('speechSynthesis' in window) {
          const announcement = `Atenção! A Missão ${task.title} começa em 15 minutos.`;
          
          const utterance = new SpeechSynthesisUtterance(announcement);
          utterance.lang = 'pt-BR';
          utterance.volume = voiceSettings.volume / 100;
          
          // Try to find an appropriate voice
          const voices = speechSynthesis.getVoices();
          const brVoices = voices.filter(v => v.lang.includes('pt-BR'));
          
          if (brVoices.length > 0) {
            // Look for a voice matching the selected gender
            const genderVoices = voiceSettings.voiceType === 'female' 
              ? brVoices.filter(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
              : brVoices.filter(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man'));
            
            if (genderVoices.length > 0) {
              utterance.voice = genderVoices[0];
            } else {
              // Fall back to any Portuguese voice
              utterance.voice = brVoices[0];
            }
          }
          
          speechSynthesis.speak(utterance);
        }
      }
    };
    
    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [tasks, voiceSettings]);

  // Task operations
  const addTask = (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>) => {
    if (!currentUser) return;
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      userId: currentUser.id,
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedFields } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completeTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;
    
    updateTask(id, { completed: true });
    
    // Update user points
    if (currentUser && !task.childAssigned) {
      const { updateUserPoints, addMedal } = useAuth();
      updateUserPoints(task.points);
      
      // Give medal based on task points
      if (task.points >= 50) {
        addMedal('gold');
      } else if (task.points >= 25) {
        addMedal('silver');
      } else {
        addMedal('bronze');
      }
    }
    
    // If the task is assigned to one or more children, update their points
    if (task.childAssigned && task.childId) {
      const childIds = Array.isArray(task.childId) ? task.childId : [task.childId];
      
      setChildrenList(childrenList.map(child => {
        if (childIds.includes(child.id)) {
          const newPoints = child.points + task.points;
          
          // Check if child earned a medal based on completed tasks count
          const completedTasksCount = tasks.filter(t => 
            t.completed && 
            t.childAssigned && 
            ((typeof t.childId === 'string' && t.childId === child.id) ||
             (Array.isArray(t.childId) && t.childId.includes(child.id)))
          ).length + 1; // +1 for the current task
          
          return { 
            ...child, 
            points: newPoints,
            // Track medals in child object if needed
          };
        }
        return child;
      }));
    }
  };

  // Child operations
  const addChild = (child: Omit<Child, 'id' | 'userId'>) => {
    if (!currentUser) return;
    
    const newChild: Child = {
      ...child,
      id: Date.now().toString(),
      userId: currentUser.id
    };
    
    setChildrenList([...childrenList, newChild]);
  };

  const updateChild = (id: string, updatedFields: Partial<Child>) => {
    setChildrenList(childrenList.map(child =>
      child.id === id ? { ...child, ...updatedFields } : child
    ));
  };

  const deleteChild = (id: string) => {
    setChildrenList(childrenList.filter(child => child.id !== id));
    
    // Remove task assignments for this child
    setTasks(tasks.map(task => 
      task.childId === id 
        ? { ...task, childAssigned: false, childId: undefined } 
        : task
    ));
  };

  // Task filtering and reporting
  const getTasksByDate = (date: Date) => {
    const normalizedTargetDate = normalizeDate(date);
    return tasks.filter(task => shouldShowTaskOnDate(task, normalizedTargetDate));
  };

  const getWeeklyProgressData = () => {
    const today = new Date();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const dayTasks = getTasksByDate(date);
      const completedTasks = dayTasks.filter(task => task.completed).length;
      const totalTasks = dayTasks.length;
      
      data.push({
        day: dayNames[date.getDay()],
        completed: completedTasks,
        total: totalTasks
      });
    }
    
    return data;
  };

  const getMotivationalPhrase = () => {
    return getRandomMotivationalPhrase();
  };

  // Menstrual cycle management
  const updateMenstrualCycle = (cycle: Partial<MenstrualCycle>) => {
    setMenstrualCycle(prev => ({ ...prev, ...cycle }));
  };
  
  // Voice settings management
  const updateVoiceSettings = (settings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => {
      // Ensure voiceType is either 'female' or 'male'
      const newSettings = { ...prev, ...settings };
      if (settings.voiceType && settings.voiceType !== 'female' && settings.voiceType !== 'male') {
        newSettings.voiceType = 'female';
      }
      return newSettings;
    });
  };

  // Medal requirements
  const getMedalRequirements = (medalType: 'bronze' | 'silver' | 'gold') => {
    switch(medalType) {
      case 'bronze': return 5;  // 5 completed tasks for bronze
      case 'silver': return 10; // 10 completed tasks for silver
      case 'gold': return 15;   // 15 completed tasks for gold
      default: return 0;
    }
  };

  // Reminders
  const getUpcomingReminders = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.completed && task.dueDate && task.reminder && task.startTime) {
        const taskDate = new Date(task.dueDate);
        const [hours, minutes] = task.startTime.split(':').map(Number);
        
        taskDate.setHours(hours, minutes, 0, 0);
        
        // 15 minutes in milliseconds
        const fifteenMinutes = 15 * 60 * 1000;
        const timeDiff = taskDate.getTime() - now.getTime();
        
        return timeDiff > 0 && timeDiff < fifteenMinutes;
      }
      return false;
    });
  };
  
  // Start Pomodoro for a task
  const startPomodoroForTask = (taskId: string) => {
    // Set task to "in progress" state if needed
    console.log(`Starting pomodoro for task ${taskId}`);
    // This could be expanded with additional functionality
  };

  const value: TaskContextType = {
    tasks,
    childrenList,
    menstrualCycle,
    voiceSettings,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    addChild,
    updateChild,
    deleteChild,
    getTasksByDate,
    getWeeklyProgressData,
    getMotivationalPhrase,
    updateMenstrualCycle,
    updateVoiceSettings,
    getMedalRequirements,
    getUpcomingReminders,
    startPomodoroForTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
