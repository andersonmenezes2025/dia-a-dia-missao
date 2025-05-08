
import { ReactNode } from 'react';

export type MenstrualPhase = 'none' | 'menstrual' | 'folicular' | 'ovulacao' | 'lutea' | 'tpm';

export type TaskCategory = 'trabalho' | 'casa' | 'filhos' | 'saude';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: TaskCategory;
  completed: boolean;
  points: number;
  createdAt: Date;
  dueDate: Date | null;
  startTime?: string;
  endTime?: string;
  reminder?: boolean;
  childAssigned?: boolean;
  childId?: string | string[];
  pomodoroSessions?: number;
  recurrence?: RecurrenceType;
  soundAlert?: string;
}

export interface Child {
  id: string;
  userId: string;
  name: string;
  age: number;
  avatarUrl?: string;
  avatarColor?: string;
  points: number;
  birthDate?: Date;
}

export interface MenstrualCycle {
  currentPhase: MenstrualPhase;
  cycleStart?: Date;
  lastPeriod?: Date;
  cycleLength?: number;
  periodLength?: number;
}

export interface TaskContextType {
  tasks: Task[];
  childrenList: Child[];
  menstrualCycle: MenstrualCycle;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addChild: (child: Omit<Child, 'id' | 'userId'>) => void;
  updateChild: (id: string, updatedFields: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  getTasksByDate: (date: Date) => Task[];
  getWeeklyProgressData: () => any[];
  getMotivationalPhrase: () => string;
  updateMenstrualCycle: (cycle: Partial<MenstrualCycle>) => void;
  getUpcomingReminders: () => Task[];
}
