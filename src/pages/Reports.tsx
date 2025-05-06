
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const Reports: React.FC = () => {
  const { tasks, getWeeklyProgressData } = useTask();
  
  // Dados para o gráfico semanal
  const weeklyData = getWeeklyProgressData();
  
  // Dados para o gráfico de categorias
  const calculateCategoryData = () => {
    const categories: Record<string, number> = {
      trabalho: 0,
      casa: 0,
      filhos: 0,
      saude: 0
    };
    
    tasks.forEach(task => {
      if (categories[task.category] !== undefined) {
        categories[task.category]++;
      }
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };
  
  const categoryData = calculateCategoryData();
  const categoryColors = ['#2563eb', '#10b981', '#8b5cf6', '#f97316'];
  
  // Dados para o gráfico de conclusão
  const completionData = [
    { name: 'Concluídas', value: tasks.filter(task => task.completed).length },
    { name: 'Pendentes', value: tasks.filter(task => !task.completed).length }
  ];
  const completionColors = ['#22c55e', '#f59e0b'];
  
  // Cálculo de estatísticas
  const calculateStatistics = () => {
    const completedTasks = tasks.filter(task => task.completed);
    const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
    const tasksThisWeek = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return taskDate >= oneWeekAgo && taskDate <= today;
    });
    const completedThisWeek = tasksThisWeek.filter(task => task.completed);
    
    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate: tasks.length ? (completedTasks.length / tasks.length * 100).toFixed(0) : 0,
      totalPoints,
      tasksThisWeek: tasksThisWeek.length,
      completedThisWeek: completedThisWeek.length
    };
  };
  
  const statistics = calculateStatistics();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Relatórios de Progresso</h1>
        
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Missões</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{statistics.totalTasks}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Missões Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{statistics.completedTasks}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Taxa de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">{statistics.completionRate}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Pontos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-500">{statistics.totalPoints}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Progresso semanal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Progresso Semanal</CardTitle>
            <CardDescription>Acompanhe suas missões concluídas nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    return [value, name === 'completed' ? 'Concluídas' : 'Total'];
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend 
                  formatter={(value) => (value === 'completed' ? 'Concluídas' : 'Total')}
                />
                <Bar dataKey="total" name="Total" fill="#8884d8" opacity={0.7} />
                <Bar dataKey="completed" name="Concluídas" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Distribuição por categorias */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Missões por área de foco</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name }) => name.charAt(0).toUpperCase() + name.slice(1)}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tarefas`]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Status de conclusão */}
          <Card>
            <CardHeader>
              <CardTitle>Status de Conclusão</CardTitle>
              <CardDescription>Proporção entre tarefas concluídas e pendentes</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={completionColors[index % completionColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tarefas`]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
