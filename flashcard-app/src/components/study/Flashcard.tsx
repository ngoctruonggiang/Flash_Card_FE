import { motion, AnimatePresence } from "framer-motion";

interface FlashcardProps {
  currentCard: any;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export const Flashcard = ({
  currentCard,
  isFlipped,
  setIsFlipped,
}: FlashcardProps) => {
  // Helper to detect Vietnamese text (contains specific Vietnamese characters)
  const isVietnamese = (text: string) => {
    if (!text) return false;
    const vietnameseRegex =
      /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    return vietnameseRegex.test(text);
  };

  // Determine if the front is English (Front is NOT Vietnamese AND Back IS Vietnamese)
  // This covers the case where Front is English and Back is Vietnamese
  const isFrontEnglish =
    !isVietnamese(currentCard.front) && isVietnamese(currentCard.back);

  return (
    <div className="w-full max-w-2xl mb-8" style={{ perspective: "1000px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          className="relative w-full min-h-[450px] cursor-pointer"
          initial={{ rotateY: 0, opacity: 0, x: 100 }}
          animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-linear-to-br from-white to-blue-50 rounded-3xl shadow-2xl border-2 border-blue-100 p-8 flex flex-col items-center justify-center backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="text-center w-full max-w-lg">
              <div className="flex flex-col items-center gap-2 mb-4">
                <h2 className="text-5xl font-bold text-gray-900">
                  {currentCard.front}
                </h2>
                {currentCard.wordType && (
                  <span className="text-xs px-2 py-1 bg-blue-100 rounded-lg text-blue-700 italic border border-blue-200">
                    {currentCard.wordType}
                  </span>
                )}

                {/* Show details on Front if it's English - REMOVED as per requirement */}
                {/* User wants ONLY word and word type on front, regardless of language */}
              </div>

              <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mt-4">
                Click để xem nghĩa
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-white"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center w-full max-w-lg">
              <div className="flex flex-col items-center gap-2 mb-4">
                <h2 className="text-4xl font-bold">{currentCard.back}</h2>
                <div className="flex items-center gap-2">
                  {currentCard.wordType && (
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-lg text-blue-200 italic border border-white/10">
                      {currentCard.wordType}
                    </span>
                  )}
                  {/* Show pronunciation on Back ALWAYS if it exists */}
                  {currentCard.pronunciation && (
                    <span className="text-gray-400 font-mono text-lg">
                      {currentCard.pronunciation}
                    </span>
                  )}
                </div>
              </div>

              {/* Show examples on Back ALWAYS if they exist */}
              {currentCard.examples &&
                Array.isArray(currentCard.examples) &&
                currentCard.examples.length > 0 && (
                  <div className="mt-4 text-left bg-white/5 rounded-xl p-4 w-full border border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-bold">
                      Ví dụ
                    </p>
                    <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {currentCard.examples.map((ex: any, idx: number) => (
                        <div key={idx} className="text-sm group">
                          <p className="text-blue-100 mb-1 font-medium">
                            {ex.sentence}
                          </p>
                          <p className="text-gray-400 italic text-xs">
                            {ex.translation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
