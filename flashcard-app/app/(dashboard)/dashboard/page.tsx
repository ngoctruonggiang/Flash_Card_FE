'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Plus,
  Play,
  BarChart3,
  Calendar,
  Flame,
  LogOut,
  Settings,
  User,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const userData = {
    name: 'Đức Hải',
    username: 'duchai1703',
    email: 'duchai1703@example.com',
    avatar: '👨‍💻',
    streak: 7,
    totalCards: 156,
    studiedToday: 23,
    accuracy: 87
  };

  const stats = [
    {
      icon: Brain,
      label: 'Tổng số thẻ',
      value: userData.totalCards,
      change: '+12 tuần này',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      label: 'Đã học hôm nay',
      value: userData.studiedToday,
      change: 'Mục tiêu: 50',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      label: 'Độ chính xác',
      value: `${userData.accuracy}%`,
      change: '+3% so với tuần trước',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Flame,
      label: 'Chuỗi ngày học',
      value: `${userData.streak} ngày`,
      change: 'Kỷ lục: 15 ngày',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const decks = [
    {
      id: 1,
      name: 'Từ vựng IELTS',
      description: 'Từ vựng quan trọng cho kỳ thi IELTS',
      totalCards: 200,
      studiedCards: 45,
      dueCards: 12,
      color: 'from-blue-500 to-cyan-500',
      emoji: '📘'
    },
    {
      id: 2,
      name: 'Business English',
      description: 'Thuật ngữ tiếng Anh thương mại',
      totalCards: 150,
      studiedCards: 80,
      dueCards: 5,
      color: 'from-purple-500 to-pink-500',
      emoji: '💼'
    },
    {
      id: 3,
      name: 'Phrasal Verbs',
      description: 'Động từ cụm thông dụng',
      totalCards: 300,
      studiedCards: 120,
      dueCards: 25,
      color: 'from-orange-500 to-red-500',
      emoji: '🎯'
    },
    {
      id: 4,
      name: 'Idioms & Expressions',
      description: 'Thành ngữ và cách diễn đạt',
      totalCards: 180,
      studiedCards: 60,
      dueCards: 8,
      color: 'from-green-500 to-emerald-500',
      emoji: '✨'
    }
  ];

  const recentActivity = [
    { date: '2025-10-30', cards: 23, accuracy: 89, time: '15 phút' },
    { date: '2025-10-29', cards: 35, accuracy: 85, time: '22 phút' },
    { date: '2025-10-28', cards: 28, accuracy: 91, time: '18 phút' },
    { date: '2025-10-27', cards: 42, accuracy: 83, time: '28 phút' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header/Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FlashLearn
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bộ thẻ..."
                  className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => router.push('/settings')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </motion.button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">@{userData.username}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  {userData.avatar}
                </div>
              </div>

              <motion.button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn đăng xuất?')) {
                    router.push('/');
                  }
                }}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại, {userData.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Hôm nay là <span className="font-semibold">Thứ Năm, 30 Tháng 10, 2025</span>. Sẵn sàng học chưa?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.button
            onClick={() => router.push('/study')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6" />
            <span>Bắt đầu học ngay</span>
          </motion.button>

          <motion.button
            onClick={() => router.push('/create-deck')}
            className="bg-white border-2 border-gray-200 text-gray-700 p-6 rounded-2xl font-semibold text-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-6 h-6" />
            <span>Tạo bộ thẻ mới</span>
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Decks Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Bộ thẻ của bạn</h2>
              <button 
                onClick={() => router.push('/deck')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
                    Xem tất cả →
                </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {decks.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => alert(`📚 Mở bộ thẻ: ${deck.name}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${deck.color} rounded-xl flex items-center justify-center text-3xl`}>
                      {deck.emoji}
                    </div>
                    {deck.dueCards > 0 && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        {deck.dueCards} cần học
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{deck.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{deck.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-semibold text-gray-900">
                        {deck.studiedCards}/{deck.totalCards}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${deck.color} transition-all duration-500`}
                        style={{ width: `${(deck.studiedCards / deck.totalCards) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h2>
            
            <motion.div
              className="bg-white rounded-2xl p-6 border-2 border-gray-100 mb-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chuỗi ngày học</p>
                  <p className="text-2xl font-bold text-gray-900">{userData.streak} ngày 🔥</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Hãy tiếp tục phấn đấu! Bạn đang làm rất tốt!
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 border-2 border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>7 ngày qua</span>
              </h3>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {activity.cards} thẻ
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('vi-VN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {activity.accuracy}%
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}