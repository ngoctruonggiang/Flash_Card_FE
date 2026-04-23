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
  const cards = [
    {
      label: "Tổng số thẻ",
      value: stats.totalCards,
      subtext: "+12% so với tuần trước",
      subtextClass: "text-emerald-600",
      icon: BookOpen,
      gradient: "from-blue-500 to-indigo-600",
      delay: 0,
    },
    {
      label: "Trung bình/ngày",
      value: stats.cardsPerDay,
      subtext: "Mục tiêu: 50 thẻ",
      subtextClass: "text-blue-600",
      icon: Target,
      gradient: "from-violet-500 to-purple-600",
      delay: 0.1,
    },
    {
      label: "Độ chính xác",
      value: `${stats.averageAccuracy}%`,
      subtext: "+3% so với tuần trước",
      subtextClass: "text-emerald-600",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600",
      delay: 0.2,
    },
    {
      label: "Chuỗi ngày học",
      value: stats.currentStreak,
      subtext: `Kỷ lục: ${stats.longestStreak} ngày`,
      subtextClass: "text-orange-600",
      icon: Flame,
      gradient: "from-orange-500 to-red-600",
      delay: 0.3,
      isStreak: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
            {card.isStreak && (
              <span className="text-2xl animate-pulse">🔥</span>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {card.label}
            </p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {card.value}
            </h3>
            <p
              className={`text-xs font-semibold mt-2 ${card.subtextClass} flex items-center gap-1`}
            >
              {card.subtext}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
