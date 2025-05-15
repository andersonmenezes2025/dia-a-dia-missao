import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  medals: {
    bronze: number;
    silver: number;
    gold: number;
  };
  age?: number;
  gender?: 'male' | 'female' | 'other';
  biologicalSex?: 'male' | 'female';
  preferences?: {
    darkMode: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

interface UserProfileUpdate {
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  biologicalSex?: 'male' | 'female';
  preferences?: {
    darkMode: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  addMedal: (type: 'bronze' | 'silver' | 'gold') => void;
  updateUserProfile: (profileData: UserProfileUpdate) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário do localStorage se existir
    const storedUser = localStorage.getItem('missaoDoDiaUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Salva o usuário no localStorage toda vez que mudar
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('missaoDoDiaUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    // Simulando um login (em uma versão real, isso seria uma chamada API)
    setLoading(true);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar se o usuário existe no localStorage
    const storedUsers = JSON.parse(localStorage.getItem('missaoDoDiaUsers') || '[]');
    const user = storedUsers.find((u: any) => u.email === email);
    
    if (!user || user.password !== password) {
      setLoading(false);
      throw new Error('Email ou senha inválidos');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulando um registro (em uma versão real, isso seria uma chamada API)
    setLoading(true);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar se o usuário já existe
    const storedUsers = JSON.parse(localStorage.getItem('missaoDoDiaUsers') || '[]');
    
    if (storedUsers.some((u: any) => u.email === email)) {
      setLoading(false);
      throw new Error('Este email já está em uso');
    }
    
    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      points: 0,
      level: 1,
      medals: {
        bronze: 0,
        silver: 0,
        gold: 0
      }
    };
    
    // Salvar no "banco de dados"
    localStorage.setItem('missaoDoDiaUsers', JSON.stringify([...storedUsers, newUser]));
    
    // Fazer login automático
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('missaoDoDiaUser');
    setCurrentUser(null);
  };

  const updateUserPoints = (points: number) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      points: currentUser.points + points,
      // Atualizar o nível com base nos pontos a cada 100 pontos
      level: Math.floor((currentUser.points + points) / 100) + 1
    };
    
    setCurrentUser(updatedUser);
    
    // Atualizar no "banco de dados"
    const storedUsers = JSON.parse(localStorage.getItem('missaoDoDiaUsers') || '[]');
    const updatedUsers = storedUsers.map((u: any) => 
      u.id === currentUser.id ? { ...u, points: updatedUser.points, level: updatedUser.level } : u
    );
    
    localStorage.setItem('missaoDoDiaUsers', JSON.stringify(updatedUsers));
  };

  const addMedal = (type: 'bronze' | 'silver' | 'gold') => {
    if (!currentUser) return;
    
    const updatedMedals = {
      ...currentUser.medals,
      [type]: currentUser.medals[type] + 1
    };
    
    const updatedUser = {
      ...currentUser,
      medals: updatedMedals
    };
    
    setCurrentUser(updatedUser);
    
    // Atualizar no "banco de dados"
    const storedUsers = JSON.parse(localStorage.getItem('missaoDoDiaUsers') || '[]');
    const updatedUsers = storedUsers.map((u: any) => 
      u.id === currentUser.id ? { ...u, medals: updatedMedals } : u
    );
    
    localStorage.setItem('missaoDoDiaUsers', JSON.stringify(updatedUsers));
  };

  const updateUserProfile = (profileData: UserProfileUpdate) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      ...profileData
    };
    
    setCurrentUser(updatedUser);
    
    // Update in the "database"
    const storedUsers = JSON.parse(localStorage.getItem('missaoDoDiaUsers') || '[]');
    const updatedUsers = storedUsers.map((u: any) => 
      u.id === currentUser.id ? { ...u, ...profileData } : u
    );
    
    localStorage.setItem('missaoDoDiaUsers', JSON.stringify(updatedUsers));
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUserPoints,
    addMedal,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
