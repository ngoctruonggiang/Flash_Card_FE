"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/src/axios/axios";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
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
      const savedUser = window.sessionStorage.getItem("flashlearn_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Error loading user:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = (
        await apiClient.post("/auth/login", {
          email: email,
          password: password,
        })
      ).data.data!;

      window.sessionStorage.setItem("access_token", response.accessToken);
      window.sessionStorage.setItem("flashcard_user", JSON.stringify(response));

      // Set user from API response
      const userData = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        name: response.username, // Use username as name if not provided
        avatar: "🎓", // Default avatar
      };
      setUser(userData);
      window.sessionStorage.setItem(
        "flashlearn_user",
        JSON.stringify(userData)
      );

      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error("Login API error:", error);
      let errorMessage = "Đăng nhập thất bại";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage[0];
        }
      }
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = (
        await apiClient.post("/auth/register", {
          username: username,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        })
      ).data.data!;

      window.sessionStorage.setItem("access_token", response.accessToken);
      window.sessionStorage.setItem("flashcard_user", JSON.stringify(response));

      const userData = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        name: response.username,
        avatar: "🎓",
      };
      setUser(userData);
      window.sessionStorage.setItem(
        "flashlearn_user",
        JSON.stringify(userData)
      );

      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error("Register API error:", error);
      let errorMessage = "Đăng ký thất bại";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage[0];
        }
      }
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Clear all authentication state
    setUser(null);
    // Use clear() to remove ALL localStorage items
    window.sessionStorage.clear();
    // Use location.replace to prevent back button navigation
    window.location.replace("/");
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
