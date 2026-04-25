"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/src/api/userApi";

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
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = window.localStorage.getItem("flashlearn_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Error loading user:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = (
        await userApi.signIn({
          email: email,
          password: password,
        })
      ).data.data!;

      window.localStorage.setItem("access_token", response.accessToken);
      window.localStorage.setItem("flashcard_user", JSON.stringify(response));

      // Set user from API response
      const userData = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        name: response.username, // Use username as name if not provided
        avatar: "🎓", // Default avatar
      };
      setUser(userData);
      window.localStorage.setItem("flashlearn_user", JSON.stringify(userData));

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login API error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = (
        await userApi.signUp({
          username: username,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        })
      ).data.data!;

      window.localStorage.setItem("access_token", response.accessToken);
      window.localStorage.setItem("flashcard_user", JSON.stringify(response));

      const userData = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        name: response.username,
        avatar: "🎓",
      };
      setUser(userData);
      window.localStorage.setItem("flashlearn_user", JSON.stringify(userData));

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Register API error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("flashlearn_user");
    router.push("/");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
