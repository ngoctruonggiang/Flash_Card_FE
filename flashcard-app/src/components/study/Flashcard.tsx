import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";

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
  return (
    <div className="w-full max-w-2xl mb-8" style={{ perspective: "1000px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id} // Use card ID as key to trigger animation on card change
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
  );
};
