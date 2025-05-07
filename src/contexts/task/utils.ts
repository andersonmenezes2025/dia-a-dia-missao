
import { Task } from './types';

// List of motivational phrases
export const motivationalPhrases = [
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

// Get a random motivational phrase
export const getRandomMotivationalPhrase = () => {
  const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
  return motivationalPhrases[randomIndex];
};

// Format a date for comparison (reset hours)
export const normalizeDate = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Check if a task should be shown on a specific date based on recurrence
export const shouldShowTaskOnDate = (task: Task, targetDate: Date): boolean => {
  if (!task.dueDate) return false;
  
  const normalizedTargetDate = normalizeDate(targetDate);
  const normalizedTaskDate = normalizeDate(task.dueDate);
  
  // If not recurring, only show on the exact date
  if (!task.recurrence || task.recurrence === 'none') {
    return normalizedTaskDate.getTime() === normalizedTargetDate.getTime();
  }

  // For recurring tasks
  const daysDiff = Math.floor(
    (normalizedTargetDate.getTime() - normalizedTaskDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysDiff < 0) return false; // Don't show tasks before their start date
  
  switch(task.recurrence) {
    case 'daily':
      return true;
    case 'weekly':
      return daysDiff % 7 === 0;
    case 'monthly':
      return normalizedTargetDate.getDate() === normalizedTaskDate.getDate();
    default:
      return normalizedTaskDate.getTime() === normalizedTargetDate.getTime();
  }
};
