"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStudySession } from "@/src/hooks/useStudySession";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";
import { StudyHeader } from "@/src/components/study/StudyHeader";
import { Flashcard } from "@/src/components/study/Flashcard";
import { AnswerButtons } from "@/src/components/study/AnswerButtons";
import { CompletionScreen } from "@/src/components/study/CompletionScreen";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/src/components/study/LoadingErrorStates";

function StudyContent() {
  const { isLoading: isCheckingAuth } = useProtectedRoute();
  const {
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
  } = useStudySession();

  const searchParams = useSearchParams();
  const deckId = Number(searchParams.get("deckId"));

  // Completion screen
  if (isCompleted) {
    return (
      <CompletionScreen
        correctCards={correctCards}
        totalCards={cards.length}
        restartSession={restartSession}
        deckId={deckId}
      />
    );
  }

  if (isCheckingAuth || isLoading) {
    return <LoadingState message="Đang tải thẻ học..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (cards.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <StudyHeader
        currentCardIndex={completedCount}
        totalCards={initialCardCount}
        progress={progress}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col items-center">
          <Flashcard
            currentCard={currentCard}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />

          {/* Answer Buttons */}
          {isFlipped && (
            <AnswerButtons
              handleAnswer={handleAnswer}
              intervalPreviews={intervalPreviews}
            />
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

export default function StudyPage() {
  return (
    <Suspense fallback={<LoadingState message="Đang khởi tạo..." />}>
      <StudyContent />
    </Suspense>
  );
}
