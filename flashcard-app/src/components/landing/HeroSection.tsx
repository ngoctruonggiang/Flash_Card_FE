import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface Flashcard {
  front: string;
  back: string;
  emoji: string;
}

interface Stat {
  value: string;
  label: string;
}

interface HeroSectionProps {
  currentCard: number;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  flashcards: Flashcard[];
  stats: Stat[];
}

export const HeroSection = ({
  currentCard,
  isFlipped,
  setIsFlipped,
  flashcards,
  stats,
}: HeroSectionProps) => {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-32">
          {/* Left Content */}
          <motion.div
            className="space-y-6 md:space-y-8 text-center lg:text-left z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                🎓 Học từ vựng thông minh
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Learn faster.{" "}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Remember longer.
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Học từ vựng tiếng Anh hiệu quả với phương pháp Spaced Repetition
              (SM-2). Ghi nhớ lâu hơn với ít thời gian hơn.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => router.push("/register")}
                className="group px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Bắt đầu miễn phí</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => alert("🎬 Demo sẽ có sớm thôi!")}
                className="group px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                <span>Xem demo</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right 3D Cards */}
          <motion.div
            className="relative h-[400px] sm:h-[450px] md:h-[500px] z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative w-full max-w-sm"
                style={{ perspective: "1000px" }}
              >
                <AnimatePresence mode="wait">
                  {flashcards.map((card, index) => {
                    const offset = index - currentCard;
                    const absOffset = Math.abs(offset);

                    if (absOffset > 1) return null;

                    return (
                      <motion.div
                        key={index}
                        className="absolute inset-0 w-full"
                        initial={{
                          rotateY: 0,
                          scale: 1 - absOffset * 0.1,
                          x: offset * 30,
                          y: absOffset * 20,
                          opacity: 1 - absOffset * 0.3,
                          zIndex: 10 - absOffset,
                        }}
                        animate={{
                          rotateY: isFlipped && offset === 0 ? 180 : 0,
                          scale: 1 - absOffset * 0.1,
                          x: offset * 30,
                          y: absOffset * 20,
                          opacity: 1 - absOffset * 0.3,
                          zIndex: 10 - absOffset,
                        }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div
                          className="relative w-full h-80 cursor-pointer"
                          onClick={() =>
                            offset === 0 && setIsFlipped(!isFlipped)
                          }
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          {/* Front - TIẾNG VIỆT */}
                          <div
                            className="absolute inset-0 bg-linear-to-br from-white to-blue-50 rounded-3xl shadow-2xl border-2 border-blue-100 p-8 flex flex-col items-center justify-center"
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                            }}
                          >
                            <div className="text-6xl mb-6">{card.emoji}</div>
                            <h3 className="text-4xl font-bold text-gray-900 mb-2">
                              {card.front}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              �� Tiếng Việt - Click để lật
                            </p>
                          </div>

                          {/* Back - TIẾNG ANH */}
                          <div
                            className="absolute inset-0 bg-linear-to-br from-purple-500 to-blue-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                          >
                            <div
                              className="text-6xl mb-6"
                              style={{ transform: "scaleX(1)" }}
                            >
                              {card.emoji}
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-2">
                              {card.back}
                            </h3>
                            <p className="text-blue-100 text-sm">
                              🇬🇧 English Translation
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Floating Buttons */}
            <div className="hidden sm:block absolute inset-0 pointer-events-none">
              {["Again", "Hard", "Good", "Easy"].map((btn, i) => (
                <motion.div
                  key={btn}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${15 + i * 20}%`,
                    bottom: `${25 + (i % 2) * 15}%`,
                  }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                >
                  <div className="px-4 py-2 bg-white rounded-lg shadow-lg text-sm font-medium text-gray-700 border border-gray-200">
                    {btn}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};
