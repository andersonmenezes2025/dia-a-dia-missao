
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { 
  Task, 
  Child, 
  MenstrualCycle, 
  TaskContextType 
} from './types';
import { getRandomMotivationalPhrase, shouldShowTaskOnDate, normalizeDate } from './utils';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [menstrualCycle, setMenstrualCycle] = useState<MenstrualCycle>({
    currentPhase: 'none'
  });
  const { currentUser } = useAuth();

  // Load tasks from localStorage
  useEffect(() => {
    if (currentUser) {
      const storedTasks = localStorage.getItem(`missaoDoDia_tasks_${currentUser.id}`);
      const storedChildren = localStorage.getItem(`missaoDoDia_children_${currentUser.id}`);
      const storedMenstrualCycle = localStorage.getItem(`missaoDoDia_menstrualCycle_${currentUser.id}`);
      
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
    } else {
      setTasks([]);
      setChildrenList([]);
      setMenstrualCycle({ currentPhase: 'none' });
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
      
      if (upcomingTasks.length > 0) {
        // We could trigger an alert here, but we'll let the dashboard component handle it
        console.log('Tasks with upcoming reminders:', upcomingTasks);
      }
    };
    
    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [tasks]);

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
      
      setChildrenList(childrenList.map(child => 
        childIds.includes(child.id) 
          ? { ...child, points: child.points + task.points } 
          : child
      ));
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

  const value = {
    tasks,
    childrenList,
    menstrualCycle,
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
    getUpcomingReminders
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
