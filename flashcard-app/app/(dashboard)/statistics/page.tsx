"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStatistics } from "@/src/hooks/useStatistics";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";
import { StatsOverview } from "@/src/components/statistics/StatsOverview";
import { WeeklyChart } from "@/src/components/statistics/WeeklyChart";
import { RecentActivityList } from "@/src/components/statistics/RecentActivityList";
import { AdditionalStats } from "@/src/components/statistics/AdditionalStats";

export default function StatisticsPage() {
  const { isLoading: isCheckingAuth } = useProtectedRoute();
  const router = useRouter();
  const {
    timeRange,
    setTimeRange,
    stats,
    weeklyData,
    recentActivity,
    maxCards,
    formatTime,
  } = useStatistics();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </motion.button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📊 Thống kê học tập
            </h1>
            <p className="text-gray-600">
              Theo dõi tiến độ và hiệu suất học tập của bạn
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-3 mb-6">
            {(["week", "month", "year"] as const).map((range) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  timeRange === range
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range === "week"
                  ? "7 ngày"
                  : range === "month"
                  ? "30 ngày"
                  : "Năm nay"}
              </motion.button>
            ))}
          </div>

          {/* Stats Grid */}
          <StatsOverview stats={stats} />

          {/* Weekly Chart */}
          <WeeklyChart weeklyData={weeklyData} maxCards={maxCards} />

          {/* Recent Activity */}
          <RecentActivityList activities={recentActivity} />

          {/* Additional Stats */}
          <AdditionalStats
            totalStudyTime={stats.totalStudyTime}
            bestDay={stats.bestDay}
            formatTime={formatTime}
          />
        </motion.div>
      </main>
    </div>
  );
}
