"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Search,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { deckApi } from "@/src/api/deckApi";
import { cardApi, type CardResponse } from "@/src/api/cardApi";
import { studyApi } from "@/src/api/studyApi";

interface DeckData {
  id: number;
  title: string;
  description: string | null;
  totalCards: number;
  studiedCards: number;
  dueCards: number;
  accuracy: number;
  lastStudied: string | null;
  created: string;
  streak: number;
  emoji: string;
  color: string;
}

export default function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [cards, setCards] = useState<CardResponse[]>([]);

  useEffect(() => {
    const fetchDeckData = async () => {
      try {
        setLoading(true);
        setError(null);

        const deckId = parseInt(resolvedParams.id);

        // Fetch all data in parallel
        const [
          deckResponse,
          cardsResponse,
          reviewedCountResponse,
          dueCardsResponse,
          statsResponse,
          lastStudiedResponse,
          streakResponse,
        ] = await Promise.all([
          deckApi.findOne(deckId),
          cardApi.findAll(deckId),
          deckApi.getReviewedCountDay(deckId), // Today's reviewed count
          deckApi.getDueToday(deckId),
          deckApi.getStatistics(deckId),
          deckApi.getLastStudied(deckId),
          studyApi.getConsecutiveDays(deckId),
        ]);

        if (!deckResponse.data.data) {
          throw new Error("Deck not found");
        }

        const deckData = deckResponse.data.data;
        const cardsData = cardsResponse.data.data || [];
        const reviewedCount =
          reviewedCountResponse.data.data?.reviewedCount || 0;
        const dueCards = dueCardsResponse.data.data || [];
        const stats = statsResponse.data.data;
        const lastStudied =
          lastStudiedResponse.data.data?.lastStudiedAt || null;
        const streak = streakResponse.data.data?.consecutiveDays || 0;

        setDeck({
          id: deckData.id,
          title: deckData.title,
          description: deckData.description,
          totalCards: cardsData.length,
          studiedCards: reviewedCount,
          dueCards: dueCards.length,
          accuracy: stats?.correctPercentage || 0,
          lastStudied: lastStudied,
          created: deckData.createdAt || new Date().toISOString(),
          streak: streak,
          emoji: "📚", // Default emoji - will be customizable in future
          color: "from-blue-500 to-cyan-500", // Default color - will be customizable in future
        });

        setCards(cardsData);
      } catch (err: any) {
        console.error("Error fetching deck data:", err);
        setError(err.message || "Failed to load deck data");
      } finally {
        setLoading(false);
      }
    };

    fetchDeckData();
  }, [resolvedParams.id]);

  const filteredCards = cards.filter(
    (card) =>
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = () => {
    if (deck) {
      router.push(`/create-deck?edit=${deck.id}`);
    }
  };

  const handleDelete = async () => {
    if (!deck) return;

    if (
      confirm(
        "⚠️ Bạn có chắc muốn xóa bộ thẻ này? Hành động này không thể hoàn tác!"
      )
    ) {
      try {
        await deckApi.remove(deck.id);
        alert(`🗑️ Đã xóa bộ thẻ "${deck.title}"`);
        router.push("/dashboard");
      } catch (err: any) {
        alert(`❌ Lỗi khi xóa bộ thẻ: ${err.message}`);
      }
    }
  };

  const handleExport = () => {
    if (!deck) return;

    const data = {
      name: deck.title,
      description: deck.description,
      cards: cards.map((c) => ({ front: c.front, back: c.back })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.title}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`📥 Đã export bộ thẻ "${deck.title}"`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Không tìm thấy bộ thẻ"}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: BookOpen,
      label: "Tổng số thẻ",
      value: deck.totalCards,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      label: "Đã học hôm nay",
      value: deck.studiedCards,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      label: "Cần học hôm nay",
      value: deck.dueCards,
      color: "from-orange-500 to-red-500",
    },
    {
      icon: TrendingUp,
      label: "Độ chính xác",
      value: `${deck.accuracy.toFixed(1)}%`,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.push("/dashboard")}
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
              <div
                className={`w-16 h-16 bg-gradient-to-br ${deck.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}
              >
                {deck.emoji}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {deck.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {deck.description || "Không có mô tả"}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Tạo ngày:{" "}
                      {new Date(deck.created).toLocaleDateString("vi-VN")}
                    </span>
                  </span>
                  {deck.lastStudied && (
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        Học lần cuối:{" "}
                        {new Date(deck.lastStudied).toLocaleDateString("vi-VN")}
                      </span>
                    </span>
                  )}
                  {deck.streak > 0 && (
                    <span className="flex items-center space-x-1">
                      <span>🔥</span>
                      <span>{deck.streak} ngày liên tiếp</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => router.push(`/study?deckId=${deck.id}`)}
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
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}
              >
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
            onClick={() => router.push("/create-deck")}
            className="bg-white border-2 border-gray-200 p-4 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Thêm thẻ mới</span>
          </motion.button>

          <motion.button
            onClick={() => router.push("/statistics")}
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
                style={{ color: "#111827" }}
              />
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {cards.length === 0
                  ? "Chưa có thẻ nào. Hãy thêm thẻ mới!"
                  : "Không tìm thấy thẻ nào phù hợp."}
              </p>
            </div>
          ) : (
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
                        <span className="text-lg font-bold text-gray-900">
                          {card.front}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-lg text-gray-600">
                          {card.back}
                        </span>
                      </div>
                      {card.tags && (
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">Tags:</span>
                          <span className="text-blue-600">{card.tags}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
