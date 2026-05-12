import { motion } from "framer-motion";
import { Trophy, CheckCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompletionScreenProps {
  correctCards: number;
  totalCards: number;
  restartSession: () => void;
  deckId: number;
}

export const CompletionScreen = ({
  correctCards,
  totalCards,
  restartSession,
  deckId,
}: CompletionScreenProps) => {
  const router = useRouter();
  const accuracy = Math.round((correctCards / totalCards) * 100);

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

        <p className="text-xl text-gray-600 mb-4">
          Bạn đã hoàn thành phiên học này!
        </p>

        <p className="text-lg text-gray-700 mb-8">Kết quả</p>

        <div className="grid grid-cols-2 gap-6 mb-8">
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
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={() => router.back()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle className="w-5 h-5 inline mr-2" />
            Hoàn thành
          </motion.button>

          <motion.button
            onClick={() => router.push(`/study/cram/${deckId}`)}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-blue-500 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-5 h-5 inline mr-2" />
            Tự luyện tập
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
