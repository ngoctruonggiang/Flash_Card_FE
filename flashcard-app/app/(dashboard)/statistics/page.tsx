"use client";

import { useStatistics } from "@/src/hooks/useStatistics";
import { StatsOverview } from "@/src/components/statistics/StatsOverview";
import { WeeklyChart } from "@/src/components/statistics/WeeklyChart";
import { RecentActivityList } from "@/src/components/statistics/RecentActivityList";
import { AdditionalStats } from "@/src/components/statistics/AdditionalStats";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";

export default function StatisticsPage() {
  const { isLoading: isCheckingAuth } = useProtectedRoute();
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

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-3 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Quay lại Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Thống kê học tập
            </h1>
            <p className="text-slate-500 mt-1">
              Theo dõi tiến độ và hiệu suất của bạn theo thời gian thực
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-3 bg-white text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all border border-slate-200 shadow-sm"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Overview Rows */}
        <StatsOverview stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Charts & Lists) */}
          <div className="lg:col-span-2 space-y-8">
            {weeklyData.length > 0 && (
              <WeeklyChart weeklyData={weeklyData} maxCards={maxCards} />
            )}

            {activities.length > 0 && (
              <RecentActivityList activities={activities} />
            )}
          </div>

          {/* Right Column (Summary & Extra Stats) */}
          <div className="space-y-8">
            <AdditionalStats
              totalStudyTime={stats.totalStudyTime}
              bestDay={stats.bestDay}
              formatTime={formatTime}
            />

            {/* Summary Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
            >
              {/* Decorative background circles */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-2xl pointer-events-none"></div>

              <h3 className="text-lg font-bold mb-6 relative z-10 flex items-center gap-2">
                <span>Tổng quan</span>
                <span className="w-full h-px bg-indigo-400/30"></span>
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-indigo-200 text-sm mb-1">
                    Tổng lượt ôn tập
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.totalReviews.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-indigo-200 text-sm mb-1">
                    Bộ thẻ đang học
                  </p>
                  <p className="text-3xl font-bold">{stats.totalDecks}</p>
                </div>

                <div className="pt-4 border-t border-indigo-500/30">
                  <p className="text-indigo-200 text-xs text-center">
                    "Không có gì là không thể với sự kiên trì."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
