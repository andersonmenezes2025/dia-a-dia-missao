
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type TaskCategory = 'trabalho' | 'casa' | 'filhos' | 'saude';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';
export type MenstrualPhase = 'menstrual' | 'folicular' | 'ovulacao' | 'lutea' | 'tpm' | 'none';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: TaskCategory;
  points: number;
  completed: boolean;
  createdAt: Date;
  dueDate: Date | null;
  startTime?: string;
  endTime?: string;
  reminder?: boolean;
  childAssigned: boolean;
  childId?: string | string[]; // Modified to support multiple children
  pomodoroSessions?: number;
  recurrence?: RecurrenceType;
  soundAlert?: string;
}

interface Child {
  id: string;
  userId: string;
  name: string;
  age: number;
  points: number;
  avatarColor: string;
}

interface MenstrualCycle {
  currentPhase: MenstrualPhase;
  cycleStart?: Date;
  cycleLength?: number;
  lastPeriod?: Date;
}

interface TaskContextType {
  tasks: Task[];
  childrenList: Child[]; 
  menstrualCycle: MenstrualCycle;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addChild: (child: Omit<Child, 'id' | 'userId'>) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  getTasksByDate: (date: Date) => Task[];
  getWeeklyProgressData: () => { day: string; completed: number; total: number }[];
  getMotivationalPhrase: () => string;
  updateMenstrualCycle: (cycle: Partial<MenstrualCycle>) => void;
  getUpcomingReminders: () => Task[];
}

// List of motivational phrases
const motivationalPhrases = [
  "Cada pequeno passo te aproxima do seu objetivo!",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Você é mais forte do que imagina. Continue avançando!",
  "Sua persistência hoje constrói seu sucesso amanhã.",
  "Acredite em você mesmo e tudo se torna possível.",
  "O foco é sua maior ferramenta para vencer a procrastinação.",
  "Transforme seus desafios em oportunidades de crescimento.",
  "Não tenha medo de falhar, tenha medo de não tentar.",
  "Sua capacidade de organização é seu superpoder!",
  "Pequenas vitórias diárias constroem grandes conquistas.",
  "A disciplina é a ponte entre objetivos e realizações.",
  "Cada tarefa concluída é uma prova do seu potencial.",
  "Sua dedicação de hoje será sua realização de amanhã.",
  "Mantenha o foco no progresso, não na perfeição.",
  "O tempo é seu recurso mais valioso, use-o com sabedoria.",
  "Você é amado e valorizado por quem importa na sua vida.",
  "Seu trabalho tem impacto, mesmo nos dias difíceis.",
  "Sua família reconhece seu esforço e dedicação.",
  "Cuide de si com o mesmo amor que dedica aos outros.",
  "Momentos de descanso são tão importantes quanto os de produtividade."
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [menstrualCycle, setMenstrualCycle] = useState<MenstrualCycle>({
    currentPhase: 'none'
  });
  const { currentUser } = useAuth();

  // Carregar tarefas do localStorage
  useEffect(() => {
    if (currentUser) {
      const storedTasks = localStorage.getItem(`missaoDoDia_tasks_${currentUser.id}`);
      const storedChildren = localStorage.getItem(`missaoDoDia_children_${currentUser.id}`);
      const storedMenstrualCycle = localStorage.getItem(`missaoDoDia_menstrualCycle_${currentUser.id}`);
      
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Converter strings de data para objetos Date
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

  // Salvar tarefas no localStorage quando mudar
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`missaoDoDia_tasks_${currentUser.id}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  // Salvar crianças no localStorage quando mudar
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`missaoDoDia_children_${currentUser.id}`, JSON.stringify(childrenList));
    }
  }, [childrenList, currentUser]);

  // Salvar ciclo menstrual quando mudar
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`missaoDoDia_menstrualCycle_${currentUser.id}`, JSON.stringify(menstrualCycle));
    }
  }, [menstrualCycle, currentUser]);

  // Checar por lembretes a cada minuto
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const upcomingTasks = tasks.filter(task => {
        if (!task.completed && task.dueDate && task.reminder && task.startTime) {
          const taskDate = new Date(task.dueDate);
          const [hours, minutes] = task.startTime.split(':').map(Number);
          
          taskDate.setHours(hours, minutes, 0, 0);
          
          // 15 minutos em milissegundos
          const fifteenMinutes = 15 * 60 * 1000;
          const timeDiff = taskDate.getTime() - now.getTime();
          
          // Retorna true se a tarefa estiver entre 14 e 16 minutos do agora
          // Isso dá uma janela de 2 minutos para evitar múltiplos alertas
          return timeDiff > 0 && timeDiff < fifteenMinutes && timeDiff > (fifteenMinutes - 2 * 60 * 1000);
        }
        return false;
      });
      
      if (upcomingTasks.length > 0) {
        // Poderiamos disparar um alerta aqui, mas vamos deixar para o componente de dashboard
        console.log('Tarefas com lembretes próximos:', upcomingTasks);
      }
    };
    
    const intervalId = setInterval(checkReminders, 60000); // Checar a cada minuto
    
    return () => clearInterval(intervalId);
  }, [tasks]);

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
    
    // Atualizar pontos do usuário
    if (currentUser && !task.childAssigned) {
      const { updateUserPoints, addMedal } = useAuth();
      updateUserPoints(task.points);
      
      // Dar medalha baseada nos pontos da tarefa
      if (task.points >= 50) {
        addMedal('gold');
      } else if (task.points >= 25) {
        addMedal('silver');
      } else {
        addMedal('bronze');
      }
    }
    
    // Se a tarefa estiver atribuída a uma ou mais crianças, atualizar os pontos das crianças
    if (task.childAssigned && task.childId) {
      const childIds = Array.isArray(task.childId) ? task.childId : [task.childId];
      
      setChildrenList(childrenList.map(child => 
        childIds.includes(child.id) 
          ? { ...child, points: child.points + task.points } 
          : child
      ));
    }
  };

  const addChild = (child: Omit<Child, 'id' | 'userId'>) => {
    if (!currentUser) return;
    
    const newChild: Child = {
      ...child,
      id: Date.now().toString(),
      userId: currentUser.id
    };
    
    setChildrenList([...childrenList, newChild]);  // Usado o nome atualizado
  };

  const updateChild = (id: string, updatedFields: Partial<Child>) => {
    setChildrenList(childrenList.map(child =>  // Usado o nome atualizado
      child.id === id ? { ...child, ...updatedFields } : child
    ));
  };

  const deleteChild = (id: string) => {
    setChildrenList(childrenList.filter(child => child.id !== id));  // Usado o nome atualizado
    
    // Remover atribuições de tarefas para esta criança
    setTasks(tasks.map(task => 
      task.childId === id 
        ? { ...task, childAssigned: false, childId: undefined } 
        : task
    ));
  };

  const getTasksByDate = (date: Date) => {
    // Resetar as horas para comparar apenas a data
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      // Check for recurring tasks
      if (task.recurrence) {
        const daysDiff = Math.floor((targetDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch(task.recurrence) {
          case 'daily':
            return daysDiff >= 0;
          case 'weekly':
            return daysDiff >= 0 && daysDiff % 7 === 0;
          case 'monthly':
            const taskDay = taskDate.getDate();
            return targetDate.getDate() === taskDay && targetDate >= taskDate;
          default:
            return taskDate.getTime() === targetDate.getTime();
        }
      }
      
      return taskDate.getTime() === targetDate.getTime();
    });
  };

  const getWeeklyProgressData = () => {
    const today = new Date();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      });
      
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

  // Get a random motivational phrase
  const getMotivationalPhrase = () => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    return motivationalPhrases[randomIndex];
  };

  // Update menstrual cycle information
  const updateMenstrualCycle = (cycle: Partial<MenstrualCycle>) => {
    setMenstrualCycle(prev => ({ ...prev, ...cycle }));
  };

  // Get tasks with upcoming reminders
  const getUpcomingReminders = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.completed && task.dueDate && task.reminder && task.startTime) {
        const taskDate = new Date(task.dueDate);
        const [hours, minutes] = task.startTime.split(':').map(Number);
        
        taskDate.setHours(hours, minutes, 0, 0);
        
        // 15 minutos em milissegundos
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
