import { BookOpen } from "lucide-react";

interface DeckInfoFormProps {
  deckName: string;
  setDeckName: (name: string) => void;
  deckDescription: string;
  setDeckDescription: (description: string) => void;
}

export const DeckInfoForm = ({
  deckName,
  setDeckName,
  deckDescription,
  setDeckDescription,
}: DeckInfoFormProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100 shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tên bộ thẻ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="VD: Từ vựng IELTS, Business English..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 font-medium"
            style={{ color: "#111827" }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            placeholder="Mô tả ngắn về bộ thẻ này..."
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-400"
            style={{ color: "#111827" }}
          />
        </div>
      </div>
    </div>
  );
};
