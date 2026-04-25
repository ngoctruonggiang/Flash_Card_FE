import apiClient from "../axios/axios";
import { ApiResponseDto } from "./userApi";
import type { CardResponse } from "./cardApi";

export interface CreateReviewDto {
  cardId: number;
  quality: string; // Changed from rating (number) to quality (string) based on docs example "Good"
}

export interface ReviewResponse {
  id: number;
  cardId: number;
  reviewedAt: string;
  quality: string;
  // SM-2 Algorithm fields
  repetitions: number;
  interval: number;
  eFactor: number;
  nextReviewDate: string;
}

export interface CardReview {
  cardId: number;
  quality: string;
}

export interface SubmitReviewDto {
  CardReviews: CardReview[];
  reviewedAt: string;
}

export const studyApi = {
  // 5.1 Start Study Session
  startSession: (deckId: number) =>
    apiClient.get<ApiResponseDto<CardResponse[]>>(`/study/start/${deckId}`),

  // 5.2 Submit Card Review
  submitReview: (data: SubmitReviewDto) =>
    apiClient.post<ApiResponseDto<ReviewResponse[]>>("/study/review", data),
};
