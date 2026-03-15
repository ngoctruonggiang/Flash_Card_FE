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

export interface CardReviewStatusResponse {
  cardId: number;
  lastReviewedAt: string | null;
  nextReviewDate: string | null;
  hasBeenReviewed: boolean;
}

export const cardApi = {
  create: (data: CreateCardDto) =>
    apiClient.post<ApiResponseDto<CardResponse>>("/card", data),

  // If deckId is provided it will be sent as a query param (API section 4.2)
  findAll: (deckId?: number) =>
    apiClient.get<ApiResponseDto<CardResponse[]>>("/card", {
      params: deckId !== undefined ? { deckId } : undefined,
    }),

  // Get card by ID (API section 4.3)
  findOne: (id: number) =>
    apiClient.get<ApiResponseDto<CardResponse>>(`/card/${id}`),

  // Update card (API section 4.4)
  update: (id: number, data: UpdateCardDto) =>
    apiClient.patch<ApiResponseDto<CardResponse>>(`/card/${id}`, data),

  // Delete card (API section 4.5)
  remove: (id: number) => apiClient.delete<void>(`/card/${id}`),

  // Get card review status (API section 4.6)
  getReviewStatus: (id: number) =>
    apiClient.get<ApiResponseDto<CardReviewStatusResponse>>(
      `/card/${id}/review-status`
    ),
};
