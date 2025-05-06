
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
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Sidebar for larger screens - fixed positioning */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-purple-100 fixed h-full shadow-sm z-10">
        <div className="p-4 border-b border-purple-100">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Missão do Dia</h1>
          </div>
        </div>

        <div className="flex flex-col justify-between h-full p-4">
          <div className="space-y-6">
            {/* User info */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <span className="text-xl font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
              </div>
              <p className="mt-2 font-semibold">{currentUser?.name || 'Usuário'}</p>
              <div className="flex justify-center gap-2 mt-2">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  Nível {currentUser?.level || 1}
                </div>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                  {currentUser?.points || 0} pts
                </div>
              </div>
              
              <div className="flex justify-center space-x-2 mt-3">
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs">{currentUser?.medals?.bronze || 0}</span>
                  <span className="text-xs mt-1">Bronze</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">{currentUser?.medals?.silver || 0}</span>
                  <span className="text-xs mt-1">Prata</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs">{currentUser?.medals?.gold || 0}</span>
                  <span className="text-xs mt-1">Ouro</span>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md' 
                        : 'hover:bg-purple-50 text-gray-700 hover:text-purple-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 mt-auto"
          >
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content - with padding to account for fixed sidebar */}
      <div className="flex flex-col flex-1 min-h-screen md:ml-64">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-purple-100 py-3 px-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="h-7 w-7 text-purple-600 mr-2" />
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Missão do Dia</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  Nv {currentUser?.level || 1}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium ml-1">
                  {currentUser?.points || 0} pts
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
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>

        {/* Bottom Navigation for mobile */}
        <nav className="md:hidden bg-white border-t border-purple-100 fixed bottom-0 left-0 right-0 px-2 py-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10">
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
        
        {/* Space to prevent content being hidden behind the mobile navigation */}
        <div className="h-16 md:hidden"></div>
      </div>
    </div>
  );
};

export default Layout;
