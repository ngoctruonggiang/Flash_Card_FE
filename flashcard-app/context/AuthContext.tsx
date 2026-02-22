'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USERS = [
  {
    id: '1',
    username: 'duchai1703',
    email: 'duchai1703@gmail.com',
    password: '123456',
    name: 'Đức Hải',
    avatar: '👨‍💻'
  },
  {
    id: '2',
    username: 'hao',
    email: 'hao@gmail.com',
    password: '123456',
    name: 'Hào',
    avatar: '👨‍🎓'
  },
  {
    id: '3',
    username: 'truongdanh',
    email: 'truongdanh@gmail.com',
    password: '123456',
    name: 'Trường Danh',
    avatar: '👨‍🔬'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = window.localStorage.getItem('flashlearn_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Error loading user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = FAKE_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar
      };
      
      setUser(userData);
      window.localStorage.setItem('flashlearn_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUser = FAKE_USERS.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      name: username,
      avatar: '🎓'
    };

    setUser(newUser);
    window.localStorage.setItem('flashlearn_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('flashlearn_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}