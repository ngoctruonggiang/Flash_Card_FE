"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeckList } from "@/src/hooks/useDeckList";
import { DeckFilter } from "@/src/components/deck/DeckFilter";
import { DeckGrid } from "@/src/components/deck/DeckGrid";
import { DeckList } from "@/src/components/deck/DeckList";

export default function AllDecksPage() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filteredDecks,
  } = useDeckList();

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

            <motion.button
              onClick={() => router.push("/create-deck")}
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Tất cả bộ thẻ
            </h1>
            <p className="text-gray-600">
              Quản lý và học tất cả bộ flashcard của bạn
            </p>
          </div>

          {/* Filter & Search */}
          <DeckFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalDecks={filteredDecks.length}
          />

          {/* Decks Grid/List */}
          {viewMode === "grid" ? (
            <DeckGrid decks={filteredDecks} />
          ) : (
            <DeckList decks={filteredDecks} />
          )}

          {/* Empty State */}
          {filteredDecks.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Không tìm thấy bộ thẻ
              </h3>
              <p className="text-gray-600 mb-6">
                Thử tìm kiếm với từ khóa khác
              </p>
              <motion.button
                onClick={() => setSearchQuery("")}
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
