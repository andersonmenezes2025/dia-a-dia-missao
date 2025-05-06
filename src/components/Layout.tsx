import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Award, Calendar, User, Plus, BarChart3, LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Plus, label: 'Nova Missão', path: '/criar-tarefa' },
    { icon: Calendar, label: 'Missões', path: '/missoes' },
    { icon: Users, label: 'Filhos', path: '/filhos' },
    { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-3 px-4 md:px-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-500 mr-2" />
            <h1 className="text-xl font-bold text-purple-800">Missão do Dia</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center mr-4">
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Nível {currentUser?.level || 1}
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                {currentUser?.points || 0} pontos
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-6 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="md:hidden bg-white border-t border-purple-100 fixed bottom-0 left-0 right-0 px-4 py-2">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar for larger screens */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r border-purple-100 pt-16">
        <div className="flex flex-col h-full">
          <div className="px-4 py-6">
            <div className="mb-6 text-center">
              <div className="w-20 h-20 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
              </div>
              <p className="mt-2 font-semibold">{currentUser?.name || 'Usuário'}</p>
              <div className="flex justify-center gap-1 mt-2">
                <span className="medal medal-bronze">{currentUser?.medals?.bronze || 0}</span>
                <span className="medal medal-silver">{currentUser?.medals?.silver || 0}</span>
                <span className="medal medal-gold">{currentUser?.medals?.gold || 0}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 mt-4"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Adjust margin for sidebar on larger screens */}
      <div className="hidden md:block md:ml-64"></div>
    </div>
  );
};

export default Layout;
