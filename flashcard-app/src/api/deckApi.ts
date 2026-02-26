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

  // optional userId query param to filter decks by user
  findAll: (userId?: number) =>
    apiClient.get<ApiResponseDto<DeckResponse[]>>("/deck", {
      params: userId !== undefined ? { userId } : undefined,
    }),

  findOne: (id: number) =>
    apiClient.get<ApiResponseDto<DeckResponse>>(`/deck/${id}`),

  update: (id: number, data: UpdateDeckDto) =>
    apiClient.patch<ApiResponseDto<DeckResponse>>(`/deck/${id}`, data),

  remove: (id: number) => apiClient.delete<void>(`/deck/${id}`),
};
