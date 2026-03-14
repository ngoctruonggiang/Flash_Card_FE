import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Deck {
  id: string;
  name: string;
  description: string;
  totalCards: number;
  studiedCards: number;
  dueCards: number;
  color: string;
  emoji: string;
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
      {decks.map((deck, index) => (
        <motion.div
          key={deck.id}
          className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          whileHover={{ y: -5 }}
          onClick={() => router.push(`/study?deckId=${deck.id}`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-14 h-14 bg-gradient-to-br ${deck.color} rounded-xl flex items-center justify-center text-3xl`}
            >
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
                style={{
                  width: `${
                    deck.totalCards > 0
                      ? (deck.studiedCards / deck.totalCards) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
