'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Award,
  Flame,
  BookOpen,
  Brain,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StatisticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data
  const stats = {
    totalCards: 856,
    studiedToday: 23,
    studiedThisWeek: 156,
    studiedThisMonth: 623,
    currentStreak: 7,
    longestStreak: 15,
    averageAccuracy: 87,
    totalStudyTime: 3420, // minutes
    cardsPerDay: 22,
    bestDay: 'Thứ Hai'
  };

  const weeklyData = [
    { day: 'T2', cards: 35, accuracy: 89, time: 28 },
    { day: 'T3', cards: 28, accuracy: 91, time: 22 },
    { day: 'T4', cards: 42, accuracy: 83, time: 35 },
    { day: 'T5', cards: 23, accuracy: 87, time: 18 },
    { day: 'T6', cards: 18, accuracy: 92, time: 15 },
    { day: 'T7', cards: 10, accuracy: 88, time: 8 },
    { day: 'CN', cards: 0, accuracy: 0, time: 0 }
  ];

  const recentActivity = [
    {
      date: '2025-10-30 09:30',
      deck: 'Từ vựng IELTS',
      cards: 23,
      accuracy: 89,
      time: 15,
      type: 'study'
    },
    {
      date: '2025-10-29 14:20',
      deck: 'Business English',
      cards: 35,
      accuracy: 85,
      time: 22,
      type: 'study'
    },
    {
      date: '2025-10-29 10:15',
      deck: 'Phrasal Verbs',
      cards: 0,
      accuracy: 0,
      time: 0,
      type: 'created'
    },
    {
      date: '2025-10-28 16:45',
      deck: 'Từ vựng IELTS',
      cards: 28,
      accuracy: 91,
      time: 18,
      type: 'study'
    },
    {
      date: '2025-10-27 11:30',
      deck: 'Medical Terms',
      cards: 42,
      accuracy: 83,
      time: 28,
      type: 'study'
    }
  ];

  const maxCards = Math.max(...weeklyData.map(d => d.cards));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Thống kê học tập</h1>
            <p className="text-gray-600">Theo dõi tiến độ và hiệu suất học tập của bạn</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-3 mb-6">
            {(['week', 'month', 'year'] as const).map((range) => (
              <motion.button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {range === 'week' ? '7 ngày' : range === 'month' ? '30 ngày' : 'Năm nay'}
              </motion.button>
            ))}
          </div>

          {/* Stats Grid */}
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
              <p className="text-3xl font-bold text-gray-900">{stats.averageAccuracy}%</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.currentStreak} 🔥</p>
              <p className="text-xs text-orange-600 mt-2">Kỷ lục: {stats.longestStreak} ngày</p>
            </motion.div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Biểu đồ tuần này</h2>
            
            <div className="grid grid-cols-7 gap-4">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={day.day}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="mb-2">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-xl mx-auto transition-all duration-500"
                      style={{ 
                        height: `${(day.cards / maxCards) * 120 + 20}px`,
                        opacity: day.cards === 0 ? 0.3 : 1
                      }}
                    ></div>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{day.cards}</p>
                  <p className="text-xs text-gray-500 mt-1">{day.day}</p>
                  {day.cards > 0 && (
                    <>
                      <p className="text-xs text-green-600 mt-1">{day.accuracy}%</p>
                      <p className="text-xs text-blue-600">{day.time}m</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🕐 Hoạt động gần đây</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'study' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}>
                      {activity.type === 'study' ? (
                        <Brain className="w-5 h-5 text-white" />
                      ) : (
                        <Zap className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-semibold text-gray-900">
                        {activity.type === 'study' ? 'Đã học' : 'Đã tạo'} • {activity.deck}
                      </p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>

                  {activity.type === 'study' && (
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{activity.cards}</p>
                        <p className="text-gray-500">thẻ</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-600">{activity.accuracy}%</p>
                        <p className="text-gray-500">đúng</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-blue-600">{activity.time}m</p>
                        <p className="text-gray-500">thời gian</p>
                      </div>
                    </div>
                  )}

                  {activity.type === 'created' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Mới tạo
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Thời gian học tập</span>
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatTime(stats.totalStudyTime)}
              </p>
              <p className="text-sm text-gray-600">Tổng thời gian tháng này</p>
              <p className="text-sm text-blue-600 mt-2">
                Trung bình {formatTime(Math.floor(stats.totalStudyTime / 30))}/ngày
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Ngày học tốt nhất</span>
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.bestDay}</p>
              <p className="text-sm text-gray-600">42 thẻ với độ chính xác 83%</p>
              <p className="text-sm text-purple-600 mt-2">Tiếp tục phát huy! 💪</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}