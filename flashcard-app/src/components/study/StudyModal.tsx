import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Zap, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface StudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: number;
}

export const StudyModal: React.FC<StudyModalProps> = ({
  isOpen,
  onClose,
  deckId,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chọn chế độ học
            </h2>
            <p className="text-gray-600">
              Chọn chế độ học phù hợp với mục tiêu của bạn
            </p>
          </div>

          <div className="space-y-4">
            {/* Standard Mode */}
            <button
              onClick={() => router.push(`/study?deckId=${deckId}`)}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-100 hover:border-blue-200 rounded-2xl flex items-center space-x-4 transition-all group text-left"
            >
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Học theo lộ trình</h3>
                <p className="text-sm text-gray-600">
                  Ôn tập theo thuật toán SRS (Spaced Repetition)
                </p>
              </div>
            </button>

            {/* Cram Mode */}
            <button
              onClick={() => router.push(`/study/cram/${deckId}`)}
              className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-2 border-yellow-100 hover:border-yellow-200 rounded-2xl flex items-center space-x-4 transition-all group text-left"
            >
              <div className="w-12 h-12 bg-yellow-500 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Luyện tập cấp tốc</h3>
                <p className="text-sm text-gray-600">
                  Ôn tập nhanh không ảnh hưởng tiến độ
                </p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
