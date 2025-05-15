
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Trash2, Star, Calendar, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TaskCard from '@/components/TaskCard';
import { useNavigate } from 'react-router-dom';

const ChildrenProfile: React.FC = () => {
  const { childrenList, tasks, addChild, updateChild, deleteChild } = useTask();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  
  const getChildTasks = (childId: string) => {
    return tasks.filter(task => task.childAssigned && task.childId === childId);
  };
  
  const handleAddChild = () => {
    if (!newChildName.trim() || !newChildAge.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o nome e a idade.',
      });
      return;
    }
    
    const age = parseInt(newChildAge);
    if (isNaN(age) || age <= 0 || age > 18) {
      toast({
        variant: 'destructive',
        title: 'Idade inválida',
        description: 'A idade deve ser um número entre 1 e 18.',
      });
      return;
    }
    
    // Gerar uma cor aleatória para o avatar
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    addChild({
      name: newChildName,
      age,
      points: 0,
      avatarColor: randomColor,
    });
    
    toast({
      title: 'Filho adicionado',
      description: `${newChildName} foi adicionado com sucesso!`,
    });
    
    setNewChildName('');
    setNewChildAge('');
    setIsAddingChild(false);
  };
  
  const handleDeleteChild = (childId: string, childName: string) => {
    deleteChild(childId);
    toast({
      title: 'Filho removido',
      description: `${childName} foi removido com sucesso.`,
    });
  };
  
  const getAvatarInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Perfil dos Filhos</h1>
          <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-1" /> Adicionar Filho
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Filho</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Nome</Label>
                  <Input
                    id="childName"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Nome do seu filho"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childAge">Idade</Label>
                  <Input
                    id="childAge"
                    type="number"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    placeholder="Idade (1-18)"
                    min="1"
                    max="18"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingChild(false)}>Cancelar</Button>
                <Button onClick={handleAddChild}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {childrenList.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum filho cadastrado</h3>
            <p className="text-gray-500 mb-4">Adicione um filho para gerenciar tarefas infantis</p>
            <Button 
              onClick={() => setIsAddingChild(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar Filho
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {childrenList.map((child) => (
              <Card key={child.id} className="shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`${child.avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                        {getAvatarInitial(child.name)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{child.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{child.age} anos</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/missoes-filho/${child.id}`)}
                        className="flex items-center gap-1"
                      >
                        <List className="h-4 w-4" /> 
                        Missões
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteChild(child.id, child.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="text-yellow-500 h-5 w-5 mr-1" />
                      <span className="font-medium">{child.points} pontos</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="text-purple-500 h-5 w-5 mr-1" />
                      <span className="font-medium">{getChildTasks(child.id).length} tarefas</span>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-gray-50">
                    <h4 className="text-sm font-medium mb-2">Requisitos para Medalhas:</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">B</div>
                        <span className="text-xs mt-1">5 tarefas</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">P</div>
                        <span className="text-xs mt-1">10 tarefas</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">O</div>
                        <span className="text-xs mt-1">15 tarefas</span>
                      </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="active" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="active">Missões Ativas</TabsTrigger>
                      <TabsTrigger value="completed">Missões Concluídas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="pt-4">
                      {getChildTasks(child.id).filter(task => !task.completed).length > 0 ? (
                        <div className="space-y-3">
                          {getChildTasks(child.id)
                            .filter(task => !task.completed)
                            .map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          }
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          Nenhuma missão ativa. Adicione uma missão para seu filho!
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="completed" className="pt-4">
                      {getChildTasks(child.id).filter(task => task.completed).length > 0 ? (
                        <div className="space-y-3">
                          {getChildTasks(child.id)
                            .filter(task => task.completed)
                            .map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          }
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          Nenhuma missão concluída ainda.
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChildrenProfile;
