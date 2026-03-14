import { Search, Filter, Grid3x3, List } from "lucide-react";
import { motion } from "framer-motion";

interface DeckFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "name" | "recent" | "progress";
  setSortBy: (sort: "name" | "recent" | "progress") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  totalDecks: number;
}

export const DeckFilter = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalDecks,
}: DeckFilterProps) => {
  return (
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
          Tìm thấy <span className="font-bold text-gray-900">{totalDecks}</span>{" "}
          bộ thẻ
        </p>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Grid3x3 className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <List className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
