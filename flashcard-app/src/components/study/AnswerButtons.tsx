import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Sm2Previews } from "@/src/types/dto";

interface AnswerButtonsProps {
  handleAnswer: (difficulty: "again" | "hard" | "good" | "easy") => void;
  intervalPreviews: Sm2Previews | null;
}

export const AnswerButtons = ({
  handleAnswer,
  intervalPreviews,
}: AnswerButtonsProps) => {
  return (
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
        <span className="text-xs opacity-80">
          {intervalPreviews?.Again || "<1 min"}
        </span>
      </motion.button>

      <motion.button
        onClick={() => handleAnswer("hard")}
        className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">😕</span>
        <span>Hard</span>
        <span className="text-xs opacity-80">
          {intervalPreviews?.Hard || "..."}
        </span>
      </motion.button>

      <motion.button
        onClick={() => handleAnswer("good")}
        className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">😊</span>
        <span>Good</span>
        <span className="text-xs opacity-80">
          {intervalPreviews?.Good || "..."}
        </span>
      </motion.button>

      <motion.button
        onClick={() => handleAnswer("easy")}
        className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <CheckCircle className="w-6 h-6" />
        <span>Easy</span>
        <span className="text-xs opacity-80">
          {intervalPreviews?.Easy || "..."}
        </span>
      </motion.button>
    </motion.div>
  );
};
