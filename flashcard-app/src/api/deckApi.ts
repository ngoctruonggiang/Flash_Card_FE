import apiClient from "../axios/axios";
import { ApiResponseDto } from "./userApi";

export interface CreateDeckDto {
  title: string;
  description?: string;
}

export interface UpdateDeckDto {
  title?: string;
  description?: string;
}

export interface DeckResponse {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  cards?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export const deckApi = {
  create: (data: CreateDeckDto) =>
    apiClient.post<ApiResponseDto<DeckResponse>>("/deck", data),

  // Get all decks for current user (API section 2.2)
  getAllForCurrentUser: () =>
    apiClient.get<ApiResponseDto<DeckResponse[]>>("/deck"),

  // Find decks with optional userId filter (API section 2.3)
  findBy: (userId?: number) =>
    apiClient.get<ApiResponseDto<DeckResponse[]>>("/deck/by", {
      params: userId !== undefined ? { userId } : undefined,
    }),

  findOne: (id: number) =>
    apiClient.get<ApiResponseDto<DeckResponse>>(`/deck/${id}`),

  update: (id: number, data: UpdateDeckDto) =>
    apiClient.patch<ApiResponseDto<DeckResponse>>(`/deck/${id}`, data),

  remove: (id: number) => apiClient.delete<void>(`/deck/${id}`),
};
