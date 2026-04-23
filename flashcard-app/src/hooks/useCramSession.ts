import { useState, useEffect, useCallback } from "react";
import apiClient from "../axios/axios";
import { CardResponse, ApiResponseDto } from "../types/dto";

export const useCramSession = (deckId: string | number, limit: number = 50) => {
  const [queue, setQueue] = useState<CardResponse[]>([]);
  const [currentCard, setCurrentCard] = useState<CardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCards, setTotalCards] = useState(0);

  // 1. Fetch Cards on Mount
  useEffect(() => {
    const fetchCramCards = async () => {
      if (!deckId) return;

      try {
        setLoading(true);
        // Using the real API endpoint as confirmed by user
        const res = await apiClient.get<ApiResponseDto<CardResponse[]>>(
          `/study/cram/${deckId}`,
          {
            params: { limit },
          }
        );

        console.log("=== CRAM SESSION RESPONSE ===", res.data);

        // Handle nested data structure: res.data.data.data
        let cardsData = res.data.data;
        let cards: any[] = [];

        if (Array.isArray(cardsData)) {
          cards = cardsData;
        } else if (
          cardsData &&
          typeof cardsData === "object" &&
          "data" in cardsData &&
          Array.isArray((cardsData as any).data)
        ) {
          cards = (cardsData as any).data;
        } else {
          console.warn("Could not find cards array in response:", cardsData);
          cards = [];
        }

        // Parse examples if needed (similar to useStudySession)
        const parsedCards = cards.map((card) => {
          let parsedExamples = card.examples;
          if (typeof card.examples === "string") {
            try {
              parsedExamples = JSON.parse(card.examples);
            } catch (e) {
              console.error("Failed to parse examples for card", card.id, e);
              parsedExamples = [];
            }
          }
          return { ...card, examples: parsedExamples };
        });

        setQueue(parsedCards);
        setTotalCards(parsedCards.length);

        if (parsedCards.length > 0) {
          setCurrentCard(parsedCards[0]);
        } else {
          setIsFinished(true);
        }
      } catch (err: any) {
        console.error("Failed to load cram session:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load cram session"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCramCards();
  }, [deckId, limit]);

  // 2. Handle User Rating (The "Next" Logic)
  // In Cram Mode:
  // - isMemorized = true ('Đã thuộc'): Remove from queue
  // - isMemorized = false ('Chưa thuộc'): Move to end of queue
  const submitReview = useCallback(
    async (isMemorized: boolean) => {
      if (!currentCard) return;

      // Fire and forget API call to count streak
      const reviewData = {
        CardReviews: [
          {
            cardId: currentCard.id,
            quality: isMemorized ? "Good" : "Again",
          },
        ],
        reviewedAt: new Date().toISOString(),
      };

      apiClient
        .post("/study/cram/review", reviewData)
        .catch((err) => console.error("Failed to record cram review:", err));

      setQueue((prev) => {
        const current = prev[0];
        const nextQueue = prev.slice(1); // Remove current card from head

        if (!isMemorized && current) {
          // Requeue if not memorized
          nextQueue.push(current);
        }

        if (nextQueue.length === 0) {
          setIsFinished(true);
          setCurrentCard(null);
        } else {
          setCurrentCard(nextQueue[0]);
        }

        return nextQueue;
      });
    },
    [currentCard]
  );

  const restartSession = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    currentCard,
    loading,
    isFinished,
    error,
    submitReview,
    totalCards,
    remainingCards: queue.length,
    restartSession,
  };
};
