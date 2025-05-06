
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTask, TaskCategory } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import PomodoroTimer from '@/components/PomodoroTimer';
import MotivationalAlert from '@/components/MotivationalAlert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Calendar as CalendarIcon, Award, Star, Clock } from 'lucide-react';
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

  const categories: { value: TaskCategory | 'todas'; label: string; color: string }[] = [
    { value: 'todas', label: 'Todas', color: 'bg-gradient-to-r from-purple-500 to-indigo-600' },
    { value: 'trabalho', label: 'Trabalho', color: 'bg-blue-500' },
    { value: 'casa', label: 'Casa', color: 'bg-green-500' },
    { value: 'filhos', label: 'Filhos', color: 'bg-amber-500' },
    { value: 'saude', label: 'Saúde', color: 'bg-red-500' }
  ];

  const getCategoryClass = (category: TaskCategory | 'todas') => {
    const categoryInfo = categories.find(c => c.value === category);
    if (category === selectedCategory) {
      return `${categoryInfo?.color} text-white shadow-md`;
    }
    return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Calendário e Filtros */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-purple-800">
              <CalendarIcon className="mr-2 h-5 w-5 text-purple-600" /> Calendário
            </h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0 shadow-none"
              classNames={{
                day_selected: "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
                day_today: "bg-purple-100 text-purple-800",
              }}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-purple-800">Filtrar por Categoria</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant="outline"
                  size="sm"
                  className={`rounded-full px-4 transition-all duration-200 ${getCategoryClass(category.value)}`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Resumo de Progresso */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 flex items-center text-purple-800">
              <Award className="mr-2 h-5 w-5 text-purple-600" /> Seu Progresso
            </h2>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Nível</span>
              <span className="text-lg font-bold text-purple-600">{currentUser?.level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${(currentUser?.points || 0) % 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <span>Pontos</span>
              <span>{(currentUser?.points || 0) % 100}/100 para o próximo nível</span>
            </div>
            
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-md font-semibold mb-3 flex items-center text-purple-800">
                <Star className="mr-2 h-5 w-5 text-amber-500" /> Medalhas
              </h3>
              <div className="flex space-x-6 justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {currentUser?.medals?.bronze || 0}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600">Bronze</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {currentUser?.medals?.silver || 0}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600">Prata</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {currentUser?.medals?.gold || 0}
                  </div>
                  <span className="text-xs mt-2 font-medium text-gray-600">Ouro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna central - Lista de Tarefas */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-purple-800">Missões do Dia</h2>
            <Button 
              onClick={() => navigate('/criar-tarefa')}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md"
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
            <div className="text-center py-10 px-4 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/50">
              <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-purple-800">Não há missões para hoje</h3>
              <p className="text-gray-500 mt-2 mb-4">Adicione uma nova missão ou selecione outra data</p>
              <Button 
                onClick={() => navigate('/criar-tarefa')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Missão
              </Button>
            </div>
          )}
        </div>
        
        {/* Coluna da direita - Pomodoro */}
        <div className="lg:col-span-1">
          <div className="mb-5 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            <h2 className="text-xl font-bold text-purple-800">Foco & Tempo</h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <PomodoroTimer />
          </div>
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
