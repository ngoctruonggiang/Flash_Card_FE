export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

// User DTOs
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

// Deck DTOs
export interface CreateDeckDto {
  title: string;
  description?: string;
}

export interface UpdateDeckDto {
  title?: string;
  description?: string;
}

export interface DeckResponseDto {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  cards?: CardResponseDto[];
}

// Card DTOs
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

export interface CardResponseDto {
  id: number;
  deckId: number;
  front: string;
  back: string;
  tags: string | null;
}

// Review DTOs
export interface CreateReviewDto {
  rating: number;
}

export interface ReviewResponseDto {
  id: number;
  cardId: number;
  reviewedAt: Date;
  rating: number;
}

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserResponseDto;
}
