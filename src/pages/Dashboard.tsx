
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTask, TaskCategory } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import PomodoroTimer from '@/components/PomodoroTimer';
import MotivationalAlert from '@/components/MotivationalAlert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Calendar as CalendarIcon, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { tasks, getTasksByDate } = useTask();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'todas'>('todas');
  const navigate = useNavigate();
  const [showMotivational, setShowMotivational] = useState(false);
  
  // Filtrar tarefas por data selecionada e categoria
  useEffect(() => {
    const tasksForDate = getTasksByDate(selectedDate);
    
    if (selectedCategory === 'todas') {
      setFilteredTasks(tasksForDate);
    } else {
      setFilteredTasks(tasksForDate.filter(task => task.category === selectedCategory));
    }
  }, [selectedDate, selectedCategory, tasks, getTasksByDate]);

  // Mostrar alerta motivacional a cada 25 minutos (simulação)
  useEffect(() => {
    const showMotivationalMessage = () => {
      setShowMotivational(true);
    };
    
    // Em uma aplicação real, poderia ser baseado em eventos do usuário ou temporizadores reais
    const interval = setInterval(showMotivationalMessage, 3 * 60 * 1000); // A cada 3 minutos para demo
    
    return () => clearInterval(interval);
  }, []);

  const categories: { value: TaskCategory | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'trabalho', label: 'Trabalho' },
    { value: 'casa', label: 'Casa' },
    { value: 'filhos', label: 'Filhos' },
    { value: 'saude', label: 'Saúde' }
  ];

  const getCategoryClass = (category: string) => {
    if (category === selectedCategory) {
      return 'bg-purple-500 text-white';
    }
    return 'bg-white text-gray-700 hover:bg-gray-100';
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Calendário e Filtros */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" /> Calendário
            </h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border shadow-sm pointer-events-auto"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Filtrar por Categoria</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant="outline"
                  size="sm"
                  className={getCategoryClass(category.value)}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Resumo de Progresso */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Award className="mr-2 h-5 w-5" /> Seu Progresso
            </h2>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Nível</span>
              <span className="text-lg font-bold text-purple-600">{currentUser?.level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${(currentUser?.points || 0) % 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pontos</span>
              <span>{(currentUser?.points || 0) % 100}/100 para o próximo nível</span>
            </div>
            
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Medalhas</h3>
              <div className="flex space-x-4 justify-center">
                <div className="flex flex-col items-center">
                  <div className="medal medal-bronze">{currentUser?.medals?.bronze || 0}</div>
                  <span className="text-xs mt-1">Bronze</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="medal medal-silver">{currentUser?.medals?.silver || 0}</div>
                  <span className="text-xs mt-1">Prata</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="medal medal-gold">{currentUser?.medals?.gold || 0}</div>
                  <span className="text-xs mt-1">Ouro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna central - Lista de Tarefas */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Missões do Dia</h2>
            <Button 
              onClick={() => navigate('/criar-tarefa')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-1" /> Nova Missão
            </Button>
          </div>
          
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={() => navigate(`/editar-tarefa/${task.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600">Não há missões para hoje</h3>
              <p className="text-gray-500 mt-2">Adicione uma nova missão ou selecione outra data</p>
              <Button 
                onClick={() => navigate('/criar-tarefa')}
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Missão
              </Button>
            </div>
          )}
        </div>
        
        {/* Coluna da direita - Pomodoro */}
        <div className="lg:col-span-1">
          <PomodoroTimer />
        </div>
      </div>
      
      {/* Alerta Motivacional */}
      <MotivationalAlert 
        show={showMotivational} 
        onClose={() => setShowMotivational(false)} 
      />
    </Layout>
  );
};

export default Dashboard;
