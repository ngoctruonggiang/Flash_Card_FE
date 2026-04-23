// User DTOs
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

// Deck DTOs
export interface CreateDeckDto {
  title: string;
  description?: string;
  iconName?: string;
  colorCode?: string;
  languageMode?: "VN_EN" | "EN_VN" | "BIDIRECTIONAL";
}

export interface UpdateDeckDto {
  title?: string;
  description?: string;
  iconName?: string;
  colorCode?: string;
  languageMode?: "VN_EN" | "EN_VN" | "BIDIRECTIONAL";
}

export interface DeckResponse {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  iconName?: string;
  colorCode?: string;
  languageMode?: "VN_EN" | "EN_VN" | "BIDIRECTIONAL";
  cards?: CardResponse[];
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

// Card DTOs
export interface CreateCardDto {
  deckId: number;
  front: string;
  back: string;
  tags?: string;
  wordType?: string;
  pronunciation?: string;
  examples?: { sentence: string; translation: string }[];
}

export interface UpdateCardDto {
  front?: string;
  back?: string;
  tags?: string;
  wordType?: string;
  pronunciation?: string;
  examples?: { sentence: string; translation: string }[];
}

export interface CardResponse {
  id: number;
  deckId: number;
  front: string;
  back: string;
  tags: string | null;
  wordType?: string;
  pronunciation?: string;
  examples?: { sentence: string; translation: string }[] | string; // API might return JSON string
  createdAt?: string;
  updatedAt?: string;
  reviews?: ReviewResponse[]; // Array of review objects
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

// Study DTOs
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
  previousStatus?: string;
  newStatus?: string;
}

export interface CardReview {
  cardId: number;
  quality: string;
}

export interface SubmitReviewDto {
  CardReviews: CardReview[];
  reviewedAt: string;
}

export interface ConsecutiveDaysResponse {
  consecutiveDays: number;
  streakStartDate: string | null;
  lastStudyDate: string | null;
}

export interface Sm2Previews {
  Again: string;
  Hard: string;
  Good: string;
  Easy: string;
}

// Statistics DTOs
export interface UserStatisticsResponse {
  totalCards: number;
  studiedToday: number;
  studiedThisWeek: number;
  studiedThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  totalStudyTime: number; // in seconds
  cardsPerDay: number;
  bestDay: string; // e.g., "Monday"
  totalDecks: number;
  totalReviews: number;
}

export interface DailyBreakdownItem {
  date: string; // YYYY-MM-DD format
  dayOfWeek: string; // e.g., "Monday"
  cardsReviewed: number;
  accuracy: number;
  studyTime: number; // in seconds
  decksStudied: number;
}

export interface DailyBreakdownSummary {
  totalCardsReviewed: number;
  averageAccuracy: number;
  totalStudyTime: number;
  daysStudied: number;
  totalDaysInRange: number;
}

export interface UserDailyBreakdownResponse {
  startDate: string;
  endDate: string;
  dailyBreakdown: DailyBreakdownItem[];
  summary: DailyBreakdownSummary;
}

export interface RecentActivityItem {
  id: number;
  type: "study" | "deck_created" | "cards_added";
  date: string; // ISO 8601 timestamp
  deckId: number;
  deckName: string;
  cardsReviewed: number;
  accuracy: number;
  studyTime: number; // in seconds
  newCards: number;
  reviewCards: number;
}
