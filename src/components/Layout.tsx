
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
      {/* Sidebar for desktop - fixed positioning with proper z-index */}
      <aside className="hidden md:block w-64 h-full fixed left-0 top-0 overflow-hidden shadow-lg z-10 bg-white border-r border-purple-100">
        <div className="p-5 border-b border-purple-100 bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Missão do Dia</h1>
          </div>
        </div>

        <div className="flex flex-col justify-between h-[calc(100vh-76px)]">
          <div className="space-y-6 p-5 overflow-y-auto">
            {/* User info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-purple-200">
                <span className="text-xl font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
              </div>
              <p className="mt-3 font-semibold text-gray-800">{currentUser?.name || 'Usuário'}</p>
              <div className="flex justify-center gap-2 mt-2">
                <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  Nível {currentUser?.level || 1}
                </div>
                <div className="bg-gradient-to-r from-purple-200 to-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  {currentUser?.points || 0} pts
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex flex-col items-center">
                  <span className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md transform hover:scale-110 transition-all">
                    {currentUser?.medals?.bronze || 0}
                  </span>
                  <span className="text-xs mt-1 text-gray-600">Bronze</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md transform hover:scale-110 transition-all">
                    {currentUser?.medals?.silver || 0}
                  </span>
                  <span className="text-xs mt-1 text-gray-600">Prata</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md transform hover:scale-110 transition-all">
                    {currentUser?.medals?.gold || 0}
                  </span>
                  <span className="text-xs mt-1 text-gray-600">Ouro</span>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-200/50' 
                        : 'hover:bg-purple-50 text-gray-700 hover:text-purple-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Logout button */}
          <div className="p-5 border-t border-purple-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3 text-red-500" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content - with proper padding to account for fixed sidebar */}
      <div className="flex flex-col flex-1 w-full min-h-screen md:ml-64">
        {/* Mobile header with improved styling */}
        <header className="md:hidden bg-white border-b border-purple-100 py-3 px-4 shadow-sm sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Award className="h-7 w-7 text-purple-600 mr-2" />
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Missão do Dia</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-purple-800">Nv {currentUser?.level || 1}</span>
                <span className="mx-1 text-purple-300">|</span>
                <span className="text-xs font-medium text-indigo-800">{currentUser?.points || 0} pts</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content with proper padding */}
        <main className="flex-1 p-5 md:p-7 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* Bottom Navigation for mobile - sticky positioning */}
        <nav className="md:hidden bg-white border-t border-purple-100 sticky bottom-0 left-0 right-0 px-2 py-1 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <div className="flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center p-2 ${
                    isActive 
                      ? 'text-purple-600' 
                      : 'text-gray-500'
                  }`}
                >
                  <div className={`p-1.5 rounded-full ${isActive ? 'bg-purple-100' : ''}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
