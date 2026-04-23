import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import apiClient from "../axios/axios";
import {
  CardReview,
  Sm2Previews,
  CardResponse,
  ApiResponseDto,
  ReviewResponse,
  SubmitReviewDto,
} from "@/src/types/dto";

export const useStudySession = () => {
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");

  const [cards, setCards] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intervalPreviews, setIntervalPreviews] = useState<Sm2Previews | null>(
    null
  );

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState(0);
  const [correctCards, setCorrectCards] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [initialCardCount, setInitialCardCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      if (!deckId) {
        setError("No deck ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiClient.get<ApiResponseDto<CardResponse[]>>(
          `/study/start/${deckId}`
        );
        console.log("=== STUDY API RESPONSE ===", response.data.data);

        // Transform API data to match UI expectations if needed
        const fetchedCards = (response.data.data || []).map(
          (card: CardResponse) => {
            let parsedExamples = card.examples;

            // Parse examples if it's a string (API might return JSON string)
            if (typeof card.examples === "string") {
              try {
                parsedExamples = JSON.parse(card.examples);
              } catch (e) {
                console.error("Failed to parse examples for card", card.id, e);
                parsedExamples = [];
              }
            }

            console.log("Card data:", card.id, "Examples:", parsedExamples);
            return {
              ...card,
              examples: parsedExamples,
              emoji: "📝", // Default emoji since API doesn't seem to return one
            };
          }
        );

        setCards(fetchedCards);
        setInitialCardCount(fetchedCards.length);
      } catch (err: any) {
        console.error("Failed to fetch study cards:", err);
        setError(err.response?.data?.message || "Failed to load cards");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [deckId]);

  // Calculate previews when card is flipped
  // Calculate previews when card is flipped
  useEffect(() => {
    const fetchPreviews = async () => {
      if (isFlipped && cards[currentCardIndex]) {
        try {
          const response = await apiClient.get<ApiResponseDto<Sm2Previews>>(
            `/study/preview/${cards[currentCardIndex].id}`
          );
          setIntervalPreviews(response.data.data);
        } catch (error) {
          console.error("Failed to fetch previews:", error);
          setIntervalPreviews(null);
        }
      } else {
        setIntervalPreviews(null);
      }
    };

    fetchPreviews();
  }, [isFlipped, currentCardIndex, cards]);

  const currentCard = cards[currentCardIndex];
  const progress =
    initialCardCount > 0 ? (completedCount / initialCardCount) * 100 : 0;

  // Handle answer
  const handleAnswer = async (
    difficulty: "again" | "hard" | "good" | "easy"
  ) => {
    setIsFlipped(false);

    // Map difficulty to quality string expected by API
    const qualityMap: Record<string, string> = {
      again: "Again",
      hard: "Hard",
      good: "Good",
      easy: "Easy",
    };

    const quality = qualityMap[difficulty];

    try {
      // Submit review immediately
      const submitData: SubmitReviewDto = {
        CardReviews: [
          {
            cardId: currentCard.id,
            quality: quality,
          },
        ],
        reviewedAt: new Date().toISOString(),
      };

      const response = await apiClient.post<ApiResponseDto<ReviewResponse[]>>(
        "/study/review",
        submitData
      );

      const reviewResult = response.data.data?.[0];

      if (difficulty === "good" || difficulty === "easy") {
        setCorrectCards((prev) => prev + 1);
      }

      // Check if we need to requeue
      let nextCards = [...cards];
      let isRequeued = false;
      if (
        reviewResult &&
        (reviewResult.newStatus === "learning" ||
          reviewResult.newStatus === "relearning")
      ) {
        // Requeue the current card to the end
        // We clone it to ensure it's treated as a new entry in the list
        nextCards.push({ ...currentCard });
        setCards(nextCards);
        isRequeued = true;
      }

      if (!isRequeued) {
        setCompletedCount((prev) => prev + 1);
      }

      setTimeout(() => {
        if (currentCardIndex < nextCards.length - 1) {
          setCurrentCardIndex((prev) => prev + 1);
          setStudiedCards((prev) => prev + 1);
        } else {
          setIsCompleted(true);
        }
      }, 300);
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to save progress. Please try again.");
      // We don't advance if submission fails, allowing user to retry
    }
  };

  const restartSession = () => {
    setCurrentCardIndex(0);
    setStudiedCards(0);
    setCorrectCards(0);
    setIsCompleted(false);
    setCompletedCount(0);
  };

  return {
    cards,
    isLoading,
    error,
    currentCard,
    currentCardIndex,
    isFlipped,
    setIsFlipped,
    progress,
    intervalPreviews,
    handleAnswer,
    isCompleted,
    correctCards,
    restartSession,
    initialCardCount,
    completedCount,
  };
};
