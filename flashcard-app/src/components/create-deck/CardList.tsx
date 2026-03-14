import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertCircle, Plus } from "lucide-react";
import { Card } from "@/src/hooks/useDeckForm";

interface CardListProps {
  cards: Card[];
  updateCard: (id: string, field: "front" | "back", value: string) => void;
  deleteCard: (id: string) => void;
  addCard: () => void;
}

export const CardList = ({
  cards,
  updateCard,
  deleteCard,
  addCard,
}: CardListProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Flashcards ({cards.length})
        </h2>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4" />
          <span>Mặt trước: Tiếng Việt | Mặt sau: Tiếng Anh</span>
        </div>
      </div>

      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>

              <div className="flex-1 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🇻🇳 Mặt trước (Tiếng Việt)
                  </label>
                  <input
                    type="text"
                    value={card.front}
                    onChange={(e) =>
                      updateCard(card.id, "front", e.target.value)
                    }
                    placeholder="VD: Xin chào"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 font-medium"
                    style={{ color: "#111827" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🇬🇧 Mặt sau (Tiếng Anh)
                  </label>
                  <input
                    type="text"
                    value={card.back}
                    onChange={(e) =>
                      updateCard(card.id, "back", e.target.value)
                    }
                    placeholder="VD: Hello"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 font-medium"
                    style={{ color: "#111827" }}
                  />
                </div>
              </div>

              <motion.button
                onClick={() => deleteCard(card.id)}
                disabled={cards.length === 1}
                className="flex-shrink-0 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                whileHover={{ scale: cards.length > 1 ? 1.1 : 1 }}
                whileTap={{ scale: cards.length > 1 ? 0.9 : 1 }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Card Button */}
      <motion.button
        onClick={addCard}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        <span>Thêm thẻ mới</span>
      </motion.button>
    </div>
  );
};
