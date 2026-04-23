import React, { useState, useEffect } from "react";
import { useCramSession } from "@/src/hooks/useCramSession";
import { Flashcard } from "./Flashcard";

import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CramSession({ deckId }: { deckId: string }) {
  const {
    currentCard,
    loading,
    isFinished,
    error,
    submitReview,
    totalCards,
    remainingCards,
    restartSession,
  } = useCramSession(deckId);

  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Practice Session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
          <RotateCcw className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Practice Complete!
          </h2>
          <p className="text-gray-600 mb-8">
            You've reviewed all {totalCards} cards in this session. Great job
            getting some extra practice in!
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={restartSession}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Deck
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Practice Mode
          </span>
          <span className="text-xs text-gray-400">
            {totalCards - remainingCards + 1} / {totalCards}
          </span>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Warning Badge */}
      <div className="flex justify-center mb-6">
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          ⚠️ No schedules updated
        </span>
      </div>

      <div className="flex flex-col items-center">
        <Flashcard
          currentCard={currentCard}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />

        <div className="w-full max-w-2xl h-24 flex items-center justify-center">
          {!isFlipped ? (
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Show Answer
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              <button
                onClick={() => submitReview(false)}
                className="bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2 hover:scale-105 active:scale-95"
              >
                <span className="text-2xl">🤔</span>
                <span>Chưa thuộc</span>
                <span className="text-xs opacity-80">Học lại sau</span>
              </button>

              <button
                onClick={() => submitReview(true)}
                className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2 hover:scale-105 active:scale-95"
              >
                <span className="text-2xl">😎</span>
                <span>Đã thuộc</span>
                <span className="text-xs opacity-80">Qua thẻ tiếp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
