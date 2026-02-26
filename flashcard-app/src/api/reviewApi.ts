import apiClient from "../axios/axios";
import { ApiResponseDto } from "./userApi";

export interface CreateReviewDto {
  rating: number;
}

export interface ReviewResponse {
  id: number;
  cardId: number;
  reviewedAt: Date;
  rating: number;
}

export const reviewApi = {
  create: (cardId: number, data: CreateReviewDto) =>
    apiClient.post<ApiResponseDto<ReviewResponse>>(
      `/cards/${cardId}/reviews`,
      data
    ),

  findAll: (cardId: number) =>
    apiClient.get<ApiResponseDto<ReviewResponse[]>>(`/cards/${cardId}/reviews`),
};
