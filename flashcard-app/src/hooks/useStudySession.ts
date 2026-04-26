import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { studyApi, CardReview } from "@/src/api/studyApi";
import { CardResponse } from "@/src/api/cardApi";
import { calculateSm2Intervals, Sm2Previews } from "@/src/utils/sm2";

export const useStudySession = () => {
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");

  const [cards, setCards] = useState<any[]>([]);
  const [reviews, setReviews] = useState<CardReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intervalPreviews, setIntervalPreviews] = useState<Sm2Previews | null>(
    null
  );

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState(0);
  const [correctCards, setCorrectCards] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      if (!deckId) {
        setError("No deck ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await studyApi.startSession(Number(deckId));
        // Transform API data to match UI expectations if needed
        const fetchedCards = (response.data.data || []).map(
          (card: CardResponse) => ({
            ...card,
            emoji: "📝", // Default emoji since API doesn't seem to return one
          })
        );

        setCards(fetchedCards);
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
  useEffect(() => {
    if (isFlipped && cards[currentCardIndex]) {
      const previews = calculateSm2Intervals(cards[currentCardIndex]);
      setIntervalPreviews(previews);
    } else {
      setIntervalPreviews(null);
    }
  }, [isFlipped, currentCardIndex, cards]);

  const currentCard = cards[currentCardIndex];
  const progress =
    cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

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

    // Add to reviews
    const newReview: CardReview = {
      cardId: currentCard.id,
      quality: quality,
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    if (difficulty === "good" || difficulty === "easy") {
      setCorrectCards(correctCards + 1);
    }

    setTimeout(async () => {
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setStudiedCards(studiedCards + 1);
      } else {
        // Submit all reviews
        try {
          await studyApi.submitReview({
            CardReviews: updatedReviews,
            reviewedAt: new Date().toISOString(),
          });
          setIsCompleted(true);
        } catch (err) {
          console.error("Failed to submit reviews:", err);
          alert("Failed to save progress. Please try again.");
          setIsCompleted(true);
        }
      }
    }, 300);
  };

  const restartSession = () => {
    setCurrentCardIndex(0);
    setStudiedCards(0);
    setCorrectCards(0);
    setReviews([]);
    setIsCompleted(false);
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
    elapsedTime,
    intervalPreviews,
    handleAnswer,
    isCompleted,
    correctCards,
    restartSession,
  };
};
