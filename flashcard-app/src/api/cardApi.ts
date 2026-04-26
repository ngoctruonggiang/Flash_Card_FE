import apiClient from "../axios/axios";
import { ApiResponseDto } from "./userApi";
import type { DeckResponse } from "./deckApi";

export interface CreateCardDto {
  deckId: number;
  front: string;
  back: string;
  tags?: string;
}

export interface UpdateCardDto {
  front?: string;
  back?: string;
  tags?: string;
}

export interface CardResponse {
  id: number;
  deckId: number;
  front: string;
  back: string;
  tags: string | null;
  createdAt?: string;
  updatedAt?: string;
  reviews?: any[]; // Array of review objects
  deck?: DeckResponse; // Returned when getting card by ID
  // SM-2 Algorithm fields (optional, may be returned by startSession)
  repetitions?: number;
  interval?: number;
  eFactor?: number;
  nextReviewDate?: string;
}

export const cardApi = {
  create: (data: CreateCardDto) =>
    apiClient.post<ApiResponseDto<CardResponse>>("/card", data),

  // If deckId is provided it will be sent as a query param
  findAll: (deckId?: number) =>
    apiClient.get<ApiResponseDto<CardResponse[]>>("/card", {
      params: deckId !== undefined ? { deckId } : undefined,
    }),

  findOne: (id: number) =>
    apiClient.get<ApiResponseDto<CardResponse>>(`/card/${id}`),
  update: (id: number, data: UpdateCardDto) =>
    apiClient.patch<ApiResponseDto<CardResponse>>(`/card/${id}`, data),

  remove: (id: number) => apiClient.delete<void>(`/card/${id}`),
};
