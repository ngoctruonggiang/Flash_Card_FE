import apiClient from "../axios/axios";
import { ApiResponseDto, UserResponse } from "./userApi";

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
  user?: UserResponse; // Returned when getting deck by ID
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewedCountResponse {
  deckId: number;
  reviewedCount: number;
  totalCards: number;
}

export interface ReviewedCountDayResponse {
  deckId: number;
  date: string;
  reviewedCount: number;
  totalCards: number;
}

export interface DeckStatisticsResponse {
  totalReviews: number;
  correctReviews: number;
  correctPercentage: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
}

export interface LastStudiedResponse {
  deckId: number;
  lastStudiedAt: string | null;
}

export const deckApi = {
  create: (data: CreateDeckDto) =>
    apiClient.post<ApiResponseDto<DeckResponse>>("/deck", data),

  // Get all decks for current user (API section 3.2)
  getAllForCurrentUser: () =>
    apiClient.get<ApiResponseDto<DeckResponse[]>>("/deck"),

  // Find decks with optional userId filter (API section 3.3)
  findBy: (userId?: number) =>
    apiClient.get<ApiResponseDto<DeckResponse[]>>("/deck/by", {
      params: userId !== undefined ? { userId } : undefined,
    }),

  // Get deck by ID (API section 3.4)
  findOne: (id: number) =>
    apiClient.get<ApiResponseDto<DeckResponse>>(`/deck/${id}`),

  // Update deck (API section 3.5)
  update: (id: number, data: UpdateDeckDto) =>
    apiClient.patch<ApiResponseDto<DeckResponse>>(`/deck/${id}`, data),

  // Delete deck (API section 3.6)
  remove: (id: number) => apiClient.delete<void>(`/deck/${id}`),

  // Get reviewed cards count (API section 3.7)
  getReviewedCount: (id: number) =>
    apiClient.get<ReviewedCountResponse>(`/deck/${id}/reviewed-count`),

  // Get reviewed cards count for a specific day (API section 3.8)
  getReviewedCountDay: (id: number, date?: string) =>
    apiClient.get<ApiResponseDto<ReviewedCountDayResponse>>(
      `/deck/${id}/reviewed-count-day`,
      {
        params: date ? { date } : undefined,
      }
    ),

  // Get cards due today (API section 3.9)
  getDueToday: (id: number) =>
    apiClient.get<ApiResponseDto<any[]>>(`/deck/${id}/due-today`),

  // Get deck statistics (API section 3.10)
  getStatistics: (id: number) =>
    apiClient.get<ApiResponseDto<DeckStatisticsResponse>>(
      `/deck/${id}/statistics`
    ),

  // Get deck last studied date (API section 3.11)
  getLastStudied: (id: number) =>
    apiClient.get<ApiResponseDto<LastStudiedResponse>>(
      `/deck/${id}/last-studied`
    ),
};
