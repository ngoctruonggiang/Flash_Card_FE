'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft,
  Play,
  Edit,
  Trash2,
  Plus,
  Download,
  BarChart3,
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeckDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock deck data
  const deck = {
    id: params.id,
    name: 'Từ vựng IELTS',
    description: 'Từ vựng quan trọng cho kỳ thi IELTS',
    emoji: '📘',
    color: 'from-blue-500 to-cyan-500',
    totalCards: 200,
    studiedCards: 45,
    dueCards: 12,
    accuracy: 87,
    lastStudied: '2025-10-30',
    created: '2025-10-01',
    streak: 7
  };

  const cards = [
    { id: 1, front: 'Abundant', back: 'Dồi dào, phong phú', lastReview: '2025-10-30', nextReview: '2025-11-06', difficulty: 'easy' },
    { id: 2, front: 'Adequate', back: 'Đầy đủ, thích hợp', lastReview: '2025-10-29', nextReview: '2025-11-02', difficulty: 'good' },
    { id: 3, front: 'Beneficial', back: 'Có lợi, có ích', lastReview: '2025-10-28', nextReview: '2025-10-31', difficulty: 'hard' },
    { id: 4, front: 'Comprehensive', back: 'Toàn diện, bao quát', lastReview: '2025-10-30', nextReview: '2025-11-13', difficulty: 'easy' },
    { id: 5, front: 'Contribute', back: 'Đóng góp, góp phần', lastReview: '2025-10-27', nextReview: '2025-10-30', difficulty: 'again' },
    { id: 6, front: 'Efficient', back: 'Hiệu quả', lastReview: '2025-10-30', nextReview: '2025-11-04', difficulty: 'good' },
    { id: 7, front: 'Fundamental', back: 'Cơ bản, nền tảng', lastReview: '2025-10-29', nextReview: '2025-11-05', difficulty: 'good' },
    { id: 8, front: 'Implement', back: 'Thực hiện, áp dụng', lastReview: '2025-10-28', nextReview: '2025-10-31', difficulty: 'hard' }
  ];

  const stats = [
    { icon: BookOpen, label: 'Tổng số thẻ', value: deck.totalCards, color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Đã học', value: deck.studiedCards, color: 'from-purple-500 to-pink-500' },
    { icon: Clock, label: 'Cần học hôm nay', value: deck.dueCards, color: 'from-orange-500 to-red-500' },
    { icon: TrendingUp, label: 'Độ chính xác', value: `${deck.accuracy}%`, color: 'from-green-500 to-emerald-500' }
  ];

  const difficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-blue-100 text-blue-700';
      case 'good': return 'bg-green-100 text-green-700';
      case 'hard': return 'bg-orange-100 text-orange-700';
      case 'again': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCards = cards.filter(card => 
    card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.back.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = () => {
    router.push(`/create-deck?edit=${deck.id}`);
  };

  const handleDelete = () => {
    if (confirm('⚠️ Bạn có chắc muốn xóa bộ thẻ này? Hành động này không thể hoàn tác!')) {
      alert(`🗑️ Đã xóa bộ thẻ "${deck.name}"`);
      router.push('/dashboard');
    }
  };

  const handleExport = () => {
    const data = {
      name: deck.name,
      description: deck.description,
      cards: cards.map(c => ({ front: c.front, back: c.back }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`📥 Đã export bộ thẻ "${deck.name}"`);
  };

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

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={handleEdit}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </motion.button>

              <motion.button
                onClick={handleDelete}
                className="px-4 py-2 bg-white border-2 border-red-200 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Deck Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${deck.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                {deck.emoji}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{deck.name}</h1>
                <p className="text-lg text-gray-600">{deck.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Tạo ngày: {new Date(deck.created).toLocaleDateString('vi-VN')}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Học lần cuối: {new Date(deck.lastStudied).toLocaleDateString('vi-VN')}</span>
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => router.push('/study')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              <span>Bắt đầu học</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.button
            onClick={() => router.push('/create-deck')}
            className="bg-white border-2 border-gray-200 p-4 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Thêm thẻ mới</span>
          </motion.button>

          <motion.button
            onClick={() => router.push('/statistics')}
            className="bg-white border-2 border-gray-200 p-4 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Thống kê</span>
          </motion.button>

          <motion.button
            onClick={handleExport}
            className="bg-white border-2 border-gray-200 p-4 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </motion.button>
        </div>

        {/* Cards List */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Danh sách thẻ ({filteredCards.length})
            </h2>

            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thẻ..."
                className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                style={{ color: '#111827' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">{card.front}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-lg text-gray-600">{card.back}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Học lần cuối: {new Date(card.lastReview).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>Học tiếp: {new Date(card.nextReview).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor(card.difficulty)}`}>
                    {card.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}