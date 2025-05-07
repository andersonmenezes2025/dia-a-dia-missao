
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

export interface Child {
  id: string;
  userId: string;
  name: string;
  age: number;
  points: number;
  avatarColor: string;
}

export interface MenstrualCycle {
  currentPhase: MenstrualPhase;
  cycleStart?: Date;
  cycleLength?: number;
  lastPeriod?: Date;
}

export interface TaskContextType {
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
