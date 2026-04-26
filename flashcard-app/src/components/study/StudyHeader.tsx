import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Brain } from "lucide-react";

interface StudyHeaderProps {
  elapsedTime: number;
  currentCardIndex: number;
  totalCards: number;
  progress: number;
}

export const StudyHeader = ({
  elapsedTime,
  currentCardIndex,
  totalCards,
  progress,
}: StudyHeaderProps) => {
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
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
                {currentCardIndex + 1}/{totalCards}
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
  );
};
