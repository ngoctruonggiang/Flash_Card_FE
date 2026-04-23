import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  AlertCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Card } from "@/src/hooks/useDeckForm";
import { useState } from "react";

interface CardListProps {
  cards: Card[];
  updateCard: (id: string, field: keyof Card, value: any) => void;
  deleteCard: (id: string) => void;
  addCard: () => void;
  languageMode: "VN_EN" | "EN_VN" | "BIDIRECTIONAL";
}

export const CardList = ({
  cards,
  updateCard,
  deleteCard,
  addCard,
  languageMode,
}: CardListProps) => {
  // Helper to get labels based on mode
  const getLabels = () => {
    switch (languageMode) {
      case "EN_VN":
        return {
          front: "🇬🇧 Mặt trước (Tiếng Anh)",
          back: "🇻🇳 Mặt sau (Tiếng Việt)",
          frontPlaceholder: "VD: Hello",
          backPlaceholder: "VD: Xin chào",
        };
      case "VN_EN":
      case "BIDIRECTIONAL":
      default:
        return {
          front: "🇻🇳 Mặt trước (Tiếng Việt)",
          back: "🇬🇧 Mặt sau (Tiếng Anh)",
          frontPlaceholder: "VD: Xin chào",
          backPlaceholder: "VD: Hello",
        };
    }
  };

  const labels = getLabels();

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Flashcards ({cards.length})
        </h2>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4" />
          <span>
            {languageMode === "BIDIRECTIONAL"
              ? "Chế độ 2 chiều: Tự động tạo thẻ ngược lại"
              : "Điền thông tin cho thẻ"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            index={index}
            updateCard={updateCard}
            deleteCard={deleteCard}
            labels={labels}
            canDelete={cards.length > 1}
          />
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

interface CardItemProps {
  card: Card;
  index: number;
  updateCard: (id: string, field: keyof Card, value: any) => void;
  deleteCard: (id: string) => void;
  labels: {
    front: string;
    back: string;
    frontPlaceholder: string;
    backPlaceholder: string;
  };
  canDelete: boolean;
}

const CardItem = ({
  card,
  index,
  updateCard,
  deleteCard,
  labels,
  canDelete,
}: CardItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const addExample = () => {
    const newExample = {
      id: Date.now().toString(),
      sentence: "",
      translation: "",
    };
    const currentExamples = card.examples || [];
    updateCard(card.id, "examples", [...currentExamples, newExample]);
  };

  const updateExample = (
    exampleId: string,
    field: "sentence" | "translation",
    value: string
  ) => {
    const currentExamples = card.examples || [];
    const updatedExamples = currentExamples.map((ex) =>
      ex.id === exampleId ? { ...ex, [field]: value } : ex
    );
    updateCard(card.id, "examples", updatedExamples);
  };

  const removeExample = (exampleId: string) => {
    const currentExamples = card.examples || [];
    updateCard(
      card.id,
      "examples",
      currentExamples.filter((ex) => ex.id !== exampleId)
    );
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start space-x-4">
        <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
          {index + 1}
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {labels.front}
              </label>
              <input
                type="text"
                value={card.front}
                onChange={(e) => updateCard(card.id, "front", e.target.value)}
                placeholder={labels.frontPlaceholder}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 font-medium"
                style={{ color: "#111827" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {labels.back}
              </label>
              <input
                type="text"
                value={card.back}
                onChange={(e) => updateCard(card.id, "back", e.target.value)}
                placeholder={labels.backPlaceholder}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 font-medium"
                style={{ color: "#111827" }}
              />
            </div>
          </div>

          {/* Optional Fields Toggle */}
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-sm text-blue-600 font-medium hover:text-blue-700"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {isExpanded ? "Thu gọn chi tiết" : "Thêm chi tiết (Tùy chọn)"}
              </span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4 border-t border-gray-100 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Loại từ
                        </label>
                        <select
                          value={card.wordType || ""}
                          onChange={(e) =>
                            updateCard(card.id, "wordType", e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                          style={{ color: "#111827" }}
                        >
                          <option value="">Chọn loại từ...</option>
                          <option value="noun">Danh từ (Noun)</option>
                          <option value="verb">Động từ (Verb)</option>
                          <option value="adjective">Tính từ (Adjective)</option>
                          <option value="adverb">Trạng từ (Adverb)</option>
                          <option value="preposition">
                            Giới từ (Preposition)
                          </option>
                          <option value="phrase">Cụm từ (Phrase)</option>
                          <option value="sentence">Câu (Sentence)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phiên âm
                        </label>
                        <input
                          type="text"
                          value={card.pronunciation || ""}
                          onChange={(e) =>
                            updateCard(card.id, "pronunciation", e.target.value)
                          }
                          placeholder="VD: /həˈləʊ/"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                          style={{ color: "#111827" }}
                        />
                      </div>
                    </div>

                    {/* Examples Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Ví dụ
                        </label>
                        <button
                          onClick={addExample}
                          className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Thêm ví dụ</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {card.examples?.map((example, exIndex) => (
                          <div
                            key={example.id}
                            className="flex items-start space-x-2 bg-gray-50 p-3 rounded-xl"
                          >
                            <div className="flex-1 grid gap-2">
                              <input
                                type="text"
                                value={example.sentence}
                                onChange={(e) =>
                                  updateExample(
                                    example.id,
                                    "sentence",
                                    e.target.value
                                  )
                                }
                                placeholder="Câu ví dụ (Tiếng Anh)"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none text-gray-900"
                                style={{ color: "#111827" }}
                              />
                              <input
                                type="text"
                                value={example.translation}
                                onChange={(e) =>
                                  updateExample(
                                    example.id,
                                    "translation",
                                    e.target.value
                                  )
                                }
                                placeholder="Dịch nghĩa (Tiếng Việt)"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none text-gray-900"
                                style={{ color: "#111827" }}
                              />
                            </div>
                            <button
                              onClick={() => removeExample(example.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          onClick={() => deleteCard(card.id)}
          disabled={!canDelete}
          className="shrink-0 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          whileHover={{ scale: canDelete ? 1.1 : 1 }}
          whileTap={{ scale: canDelete ? 0.9 : 1 }}
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
