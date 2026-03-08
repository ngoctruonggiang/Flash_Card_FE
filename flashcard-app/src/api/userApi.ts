import type { AxiosResponse } from "axios";
import apiClient from "../axios/axios";

export interface SignUpDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string | Date;
  lastLoginAt?: string | Date | null;
  isEmailConfirmed?: boolean;
  passwordHash?: string; // Only returned in update response, should not be used by frontend
}

export interface ApiResponseDto<T> {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: T | null;
  path?: string;
}

export const userApi = {
  // Auth
  signUp: (data: SignUpDto) =>
    apiClient.post<ApiResponseDto<AuthResponseDto>>("/auth/register", data),

  signIn: (data: SignInDto) =>
    apiClient.post<ApiResponseDto<AuthResponseDto>>("/auth/login", data),

  // Current user actions (requires auth)
  getCurrentUser: () => apiClient.get<ApiResponseDto<UserResponse>>("/user"),

  updateCurrentUser: (data: UpdateUserDto) =>
    apiClient.patch<ApiResponseDto<UserResponse>>("/user", data),

  removeCurrentUser: () => apiClient.delete<void>("/user"),

  // Admin actions
  getUserById: (id: number) =>
    apiClient.get<ApiResponseDto<UserResponse>>(`/user/${id}`),
  getAllUsers: () => apiClient.get<ApiResponseDto<UserResponse[]>>("/user/all"),

  updateUserById: (id: number, data: UpdateUserDto) =>
    apiClient.patch<ApiResponseDto<UserResponse>>(`/user/${id}`, data),
  removeUserById: (id: number) => apiClient.delete<void>(`/user/${id}`),
};
