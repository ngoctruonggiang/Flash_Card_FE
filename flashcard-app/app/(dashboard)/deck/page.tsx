'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  TrendingUp,
  Clock,
  Star,
  Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AllDecksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'progress'>('recent');

  // Mock data - tất cả bộ thẻ
  const allDecks = [
    {
      id: 1,
      name: 'Từ vựng IELTS',
      description: 'Từ vựng quan trọng cho kỳ thi IELTS',
      totalCards: 200,
      studiedCards: 45,
      dueCards: 12,
      color: 'from-blue-500 to-cyan-500',
      emoji: '📘',
      lastStudied: '2025-10-30'
    },
    {
      id: 2,
      name: 'Business English',
      description: 'Thuật ngữ tiếng Anh thương mại',
      totalCards: 150,
      studiedCards: 80,
      dueCards: 5,
      color: 'from-purple-500 to-pink-500',
      emoji: '💼',
      lastStudied: '2025-10-29'
    },
    {
      id: 3,
      name: 'Phrasal Verbs',
      description: 'Động từ cụm thông dụng',
      totalCards: 300,
      studiedCards: 120,
      dueCards: 25,
      color: 'from-orange-500 to-red-500',
      emoji: '🎯',
      lastStudied: '2025-10-28'
    },
    {
      id: 4,
      name: 'Idioms & Expressions',
      description: 'Thành ngữ và cách diễn đạt',
      totalCards: 180,
      studiedCards: 60,
      dueCards: 8,
      color: 'from-green-500 to-emerald-500',
      emoji: '✨',
      lastStudied: '2025-10-30'
    },
    {
      id: 5,
      name: 'TOEIC Vocabulary',
      description: 'Từ vựng thiết yếu cho TOEIC',
      totalCards: 250,
      studiedCards: 30,
      dueCards: 15,
      color: 'from-yellow-500 to-orange-500',
      emoji: '📝',
      lastStudied: '2025-10-27'
    },
    {
      id: 6,
      name: 'Medical Terms',
      description: 'Thuật ngữ y khoa cơ bản',
      totalCards: 120,
      studiedCards: 90,
      dueCards: 3,
      color: 'from-red-500 to-pink-500',
      emoji: '⚕️',
      lastStudied: '2025-10-30'
    },
    {
      id: 7,
      name: 'Tech & IT',
      description: 'Từ vựng công nghệ thông tin',
      totalCards: 180,
      studiedCards: 100,
      dueCards: 10,
      color: 'from-indigo-500 to-purple-500',
      emoji: '💻',
      lastStudied: '2025-10-29'
    },
    {
      id: 8,
      name: 'Daily Conversation',
      description: 'Hội thoại hàng ngày',
      totalCards: 100,
      studiedCards: 70,
      dueCards: 5,
      color: 'from-pink-500 to-rose-500',
      emoji: '💬',
      lastStudied: '2025-10-28'
    }
  ];

  // Filter and sort
  const filteredDecks = allDecks
    .filter(deck => 
      deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') return new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime();
      if (sortBy === 'progress') return (b.studiedCards / b.totalCards) - (a.studiedCards / a.totalCards);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại Dashboard</span>
            </motion.button>

            <motion.button
              onClick={() => router.push('/create-deck')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bộ thẻ mới</span>
            </motion.button>
          </div>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tất cả bộ thẻ</h1>
            <p className="text-gray-600">Quản lý và học tất cả bộ flashcard của bạn</p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100 shadow-lg">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm bộ thẻ..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                >
                  <option value="recent">📅 Học gần đây</option>
                  <option value="name">🔤 Tên A-Z</option>
                  <option value="progress">📊 Tiến độ</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-bold text-gray-900">{filteredDecks.length}</span> bộ thẻ
              </p>

              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Grid3x3 className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Decks Grid/List */}
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDecks.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => router.push(`/deck/${deck.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${deck.color} rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {deck.emoji}
                    </div>
                    {deck.dueCards > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        {deck.dueCards}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {deck.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{deck.description}</p>

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

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>📅 {new Date(deck.lastStudied).toLocaleDateString('vi-VN')}</span>
                    <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredDecks.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  onClick={() => router.push(`/deck/${deck.id}`)}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${deck.color} rounded-xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0`}>
                      {deck.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {deck.name}
                          </h3>
                          <p className="text-sm text-gray-600">{deck.description}</p>
                        </div>
                        {deck.dueCards > 0 && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full ml-4">
                            {deck.dueCards} cần học
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tổng số thẻ</p>
                          <p className="text-lg font-bold text-gray-900">{deck.totalCards}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Đã học</p>
                          <p className="text-lg font-bold text-blue-600">{deck.studiedCards}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tiến độ</p>
                          <p className="text-lg font-bold text-green-600">
                            {Math.round((deck.studiedCards / deck.totalCards) * 100)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${deck.color} transition-all duration-500`}
                            style={{ width: `${(deck.studiedCards / deck.totalCards) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/study');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-4 h-4" />
                      <span>Học ngay</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredDecks.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bộ thẻ</h3>
              <p className="text-gray-600 mb-6">Thử tìm kiếm với từ khóa khác</p>
              <motion.button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xóa bộ lọc
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}