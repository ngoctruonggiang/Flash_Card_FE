"use client";

import { useStatistics } from "@/src/hooks/useStatistics";
import { StatsOverview } from "@/src/components/statistics/StatsOverview";
import { WeeklyChart } from "@/src/components/statistics/WeeklyChart";
import { RecentActivityList } from "@/src/components/statistics/RecentActivityList";
import { AdditionalStats } from "@/src/components/statistics/AdditionalStats";
import { motion } from "framer-motion";
import { RefreshCw, BarChart3 } from "lucide-react";

export default function StatisticsPage() {
  const {
    stats,
    weeklyData,
    activities,
    isLoading,
    error,
    refresh,
    maxCards,
    formatTime,
  } = useStatistics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Không thể tải thống kê
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Thống kê học tập
              </h1>
              <p className="text-gray-600">
                Theo dõi tiến độ và hiệu suất học tập của bạn
              </p>
            </div>
            <button
              onClick={refresh}
              className="p-3 bg-white rounded-xl border-2 border-gray-100 shadow-lg hover:border-blue-200 transition-colors"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Weekly Chart */}
        {weeklyData.length > 0 && (
          <WeeklyChart weeklyData={weeklyData} maxCards={maxCards} />
        )}

        {/* Recent Activity and Additional Stats Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          {activities.length > 0 && (
            <RecentActivityList activities={activities} />
          )}

          {/* Additional Stats */}
          <div className="space-y-6">
            <AdditionalStats
              totalStudyTime={stats.totalStudyTime}
              bestDay={stats.bestDay}
              formatTime={formatTime}
            />
          </div>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Tổng quan</h3>
              <p className="text-blue-100">
                Bạn đã học{" "}
                <strong>{stats.totalReviews.toLocaleString()}</strong> lượt qua{" "}
                <strong>{stats.totalDecks}</strong> bộ thẻ
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{stats.currentStreak}</p>
              <p className="text-blue-100">ngày streak 🔥</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
