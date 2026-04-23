import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Deck } from "@/src/hooks/useDeckList";

interface DeckGridProps {
  decks: Deck[];
}

export const DeckGrid = ({ decks }: DeckGridProps) => {
  const router = useRouter();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {decks.map((deck, index) => (
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
            <div
              className={`w-14 h-14 bg-gradient-to-br ${deck.color} rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}
            >
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
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {deck.description}
          </p>

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
                  width: `${(deck.studiedCards / deck.totalCards) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              📅 {new Date(deck.lastStudied).toLocaleDateString("vi-VN")}
            </span>
            <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
