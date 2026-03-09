"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Trophy,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { studyApi, CardReview } from "@/src/api/studyApi";
import { CardResponse } from "@/src/api/cardApi";

export default function StudyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");

  const [cards, setCards] = useState<any[]>([]);
  const [reviews, setReviews] = useState<CardReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  // Completion screen
  if (isCompleted) {
    const accuracy = Math.round((correctCards / cards.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Xuất sắc!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Bạn đã hoàn thành phiên học này!
          </p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {cards.length}
              </div>
              <div className="text-sm text-gray-600">Tổng số thẻ</div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-sm text-gray-600">Thời gian</div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button
              onClick={() => {
                setCurrentCardIndex(0);
                setStudiedCards(0);
                setCorrectCards(0);
                setReviews([]);
                setIsCompleted(false);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Học lại
            </motion.button>

            <motion.button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Về Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải thẻ học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Đã có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <div className="text-green-500 text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Không có thẻ cần học
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn đã hoàn thành tất cả các thẻ trong bộ này rồi!
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Quay lại</span>
              </button>
            </Link>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{formatTime(elapsedTime)}</span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Brain className="w-5 h-5" />
                <span className="font-medium">
                  {currentCardIndex + 1}/{cards.length}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col items-center">
          {/* Flashcard */}
          <div
            className="w-full max-w-2xl mb-8"
            style={{ perspective: "1000px" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardIndex}
                className="relative w-full h-96 cursor-pointer"
                initial={{ rotateY: 0, opacity: 0, x: 100 }}
                animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front - Tiếng Việt */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border-2 border-blue-100 p-12 flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="text-8xl mb-8">{currentCard.emoji}</div>
                  <h2 className="text-5xl font-bold text-gray-900 mb-4 text-center">
                    {currentCard.front}
                  </h2>
                  <p className="text-gray-500">🇻🇳 Tiếng Việt - Click để lật</p>

                  <button className="mt-6 p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                    <Volume2 className="w-6 h-6 text-blue-600" />
                  </button>
                </div>

                {/* Back - Tiếng Anh */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="text-8xl mb-8">{currentCard.emoji}</div>
                  <h2 className="text-5xl font-bold text-white mb-4 text-center">
                    {currentCard.back}
                  </h2>
                  <p className="text-blue-100">🇬🇧 English Translation</p>

                  <button className="mt-6 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Volume2 className="w-6 h-6 text-white" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Answer Buttons */}
          {isFlipped && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => handleAnswer("again")}
                className="bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle className="w-6 h-6" />
                <span>Again</span>
                <span className="text-xs opacity-80">&lt;1 min</span>
              </motion.button>

              <motion.button
                onClick={() => handleAnswer("hard")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">😕</span>
                <span>Hard</span>
                <span className="text-xs opacity-80">3 ngày</span>
              </motion.button>

              <motion.button
                onClick={() => handleAnswer("good")}
                className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">😊</span>
                <span>Good</span>
                <span className="text-xs opacity-80">7 ngày</span>
              </motion.button>

              <motion.button
                onClick={() => handleAnswer("easy")}
                className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-6 h-6" />
                <span>Easy</span>
                <span className="text-xs opacity-80">14 ngày</span>
              </motion.button>
            </motion.div>
          )}

          {!isFlipped && (
            <p className="text-gray-500 text-center mt-8">
              💡 Click vào thẻ để xem nghĩa tiếng Anh
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
