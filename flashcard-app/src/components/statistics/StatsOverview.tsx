import { motion } from "framer-motion";
import { BookOpen, Target, TrendingUp, Flame } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalCards: number;
    cardsPerDay: number;
    averageAccuracy: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg"
        whileHover={{ y: -5 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-gray-600 mb-1">Tổng số thẻ</p>
        <p className="text-3xl font-bold text-gray-900">{stats.totalCards}</p>
        <p className="text-xs text-green-600 mt-2">+12% so với tuần trước</p>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg"
        whileHover={{ y: -5 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-gray-600 mb-1">Trung bình/ngày</p>
        <p className="text-3xl font-bold text-gray-900">{stats.cardsPerDay}</p>
        <p className="text-xs text-blue-600 mt-2">Mục tiêu: 50 thẻ</p>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg"
        whileHover={{ y: -5 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-gray-600 mb-1">Độ chính xác</p>
        <p className="text-3xl font-bold text-gray-900">
          {stats.averageAccuracy}%
        </p>
        <p className="text-xs text-green-600 mt-2">+3% so với tuần trước</p>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg"
        whileHover={{ y: -5 }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-gray-600 mb-1">Chuỗi ngày học</p>
        <p className="text-3xl font-bold text-gray-900">
          {stats.currentStreak} 🔥
        </p>
        <p className="text-xs text-orange-600 mt-2">
          Kỷ lục: {stats.longestStreak} ngày
        </p>
      </motion.div>
    </div>
  );
};
