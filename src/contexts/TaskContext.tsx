
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type TaskCategory = 'trabalho' | 'casa' | 'filhos' | 'saude';

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
  childAssigned: boolean;
  childId?: string;
  pomodoroSessions?: number;
}

export interface Child {
  id: string;
  userId: string;
  name: string;
  age: number;
  points: number;
  avatarColor: string;
}

interface TaskContextType {
  tasks: Task[];
  childrenList: Child[];  // Renomeado de "children" para "childrenList" para evitar conflito
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addChild: (child: Omit<Child, 'id' | 'userId'>) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  getTasksByDate: (date: Date) => Task[];
  getWeeklyProgressData: () => { day: string; completed: number; total: number }[];
}

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
  const [childrenList, setChildrenList] = useState<Child[]>([]);  // Renomeado para evitar conflito
  const { currentUser } = useAuth();

  // Carregar tarefas do localStorage
  useEffect(() => {
    if (currentUser) {
      const storedTasks = localStorage.getItem(`missaoDoDia_tasks_${currentUser.id}`);
      const storedChildren = localStorage.getItem(`missaoDoDia_children_${currentUser.id}`);
      
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
        setChildrenList(JSON.parse(storedChildren));  // Usado o nome atualizado
      }
    } else {
      setTasks([]);
      setChildrenList([]);  // Usado o nome atualizado
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
      localStorage.setItem(`missaoDoDia_children_${currentUser.id}`, JSON.stringify(childrenList));  // Usado o nome atualizado
    }
  }, [childrenList, currentUser]);  // Usado o nome atualizado

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
    
    // Se a tarefa estiver atribuída a uma criança, atualizar os pontos da criança
    if (task.childAssigned && task.childId) {
      setChildrenList(childrenList.map(child =>  // Usado o nome atualizado
        child.id === task.childId 
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

  const value = {
    tasks,
    childrenList,  // Usado o nome atualizado
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    addChild,
    updateChild,
    deleteChild,
    getTasksByDate,
    getWeeklyProgressData
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
