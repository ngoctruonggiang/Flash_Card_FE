import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Deck } from "@/src/hooks/useDeckList";

interface DeckListProps {
  decks: Deck[];
}

export const DeckList = ({ decks }: DeckListProps) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {decks.map((deck, index) => (
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
            <div
              className={`w-16 h-16 bg-gradient-to-br ${deck.color} rounded-xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0`}
            >
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
                  <p className="text-lg font-bold text-gray-900">
                    {deck.totalCards}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Đã học</p>
                  <p className="text-lg font-bold text-blue-600">
                    {deck.studiedCards}
                  </p>
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
                    style={{
                      width: `${(deck.studiedCards / deck.totalCards) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/study");
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
  );
};
