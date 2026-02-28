'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/src/api/userApi';

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

export const FAKE_USERS = [
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
  },
  {
    id: '4',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123456',
    name: 'Administrator',
    avatar: '👑'
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


    // Legacy Code
    {
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          name: foundUser.name,
          avatar: foundUser.avatar
        };
        setUser(userData);
      }
      else
      {
        setIsLoading(false);
        return false;
      }
    }
        
    try {
      const response = (await userApi.signIn({ 
        email: email, 
        password: password 
      })).data.data!;

      window.localStorage.setItem('access_token', response.accessToken);
      window.localStorage.setItem('flashcard_user', JSON.stringify(response));
      setIsLoading(false);
      return true;
    } 
    catch (error) {
      console.error('Login API error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUser = FAKE_USERS.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    // Legacy code
    {
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        name: username,
        avatar: '🎓'
      };
      
      setUser(newUser);
      window.localStorage.setItem('flashlearn_user', JSON.stringify(newUser));
    }

    
    try {
      const response = (await userApi.signUp({ 
        username: username,
        email: email, 
        password: password,
      })).data.data!;

      window.localStorage.setItem('access_token', response.accessToken);
      window.localStorage.setItem('flashcard_user', JSON.stringify(response));
      setIsLoading(false);
      return true;
    } 
    catch (error) {
      console.error('Login API error:', error);
      setIsLoading(false);
      return false;
    }
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