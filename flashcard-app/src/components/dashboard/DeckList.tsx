import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getDeckColorClass, getDeckIcon } from "@/src/constants/deck";

interface Deck {
  id: string;
  name: string;
  description: string;
  totalCards: number;
  studiedCards: number;
  dueCards: number;
  color: string;
  emoji: string;
  iconName?: string;
}

interface DeckListProps {
  decks: Deck[];
  isLoading: boolean;
  error: string | null;
}

export const DeckList = ({ decks, isLoading, error }: DeckListProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="col-span-2 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Đang tải bộ thẻ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-2 text-center py-12">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="col-span-2 text-center py-12">
        <div className="text-gray-400 mb-4 text-5xl">📚</div>
        <p className="text-gray-600 font-semibold mb-2">Chưa có bộ thẻ nào</p>
        <p className="text-gray-500 text-sm mb-4">
          Tạo bộ thẻ đầu tiên của bạn để bắt đầu học!
        </p>
        <button
          onClick={() => router.push("/create-deck")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tạo bộ thẻ mới
        </button>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {decks.map((deck, index) => {
        const Icon = getDeckIcon(deck.iconName);
        const colorClass = deck.color.startsWith("from-")
          ? deck.color
          : getDeckColorClass(deck.color);

        return (
          <motion.div
            key={deck.id}
            className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => router.push(`/deck/${deck.id}`)}
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${colorClass} opacity-5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`}
            />

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div
                className={`w-14 h-14 bg-linear-to-br ${colorClass} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-7 h-7" />
              </div>
              {deck.dueCards > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {deck.dueCards} cần học
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">
              {deck.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 relative z-10">
              {deck.description}
            </p>

            <div className="space-y-2 relative z-10">
              {/* Progress bar removed as requested */}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
