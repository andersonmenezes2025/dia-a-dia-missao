
import { TaskProvider } from './TaskProvider';
import { useTask } from './useTask';
import type { 
  Task, 
  Child, 
  MenstrualCycle,
  TaskCategory,
  RecurrenceType, 
  MenstrualPhase,
  TaskContextType 
} from './types';

export { 
  TaskProvider, 
  useTask
};

// Re-export types using 'export type'
export type {
  Task, 
  Child, 
  MenstrualCycle,
  TaskCategory,
  RecurrenceType,
  MenstrualPhase,
  TaskContextType
};
