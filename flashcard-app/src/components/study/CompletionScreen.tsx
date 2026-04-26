import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompletionScreenProps {
  correctCards: number;
  totalCards: number;
  elapsedTime: number;
  restartSession: () => void;
}

export const CompletionScreen = ({
  correctCards,
  totalCards,
  elapsedTime,
  restartSession,
}: CompletionScreenProps) => {
  const router = useRouter();
  const accuracy = Math.round((correctCards / totalCards) * 100);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Xuất sắc!</h1>

        <p className="text-xl text-gray-600 mb-8">
          Bạn đã hoàn thành phiên học này!
        </p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-2xl p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalCards}
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
            onClick={restartSession}
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
};
