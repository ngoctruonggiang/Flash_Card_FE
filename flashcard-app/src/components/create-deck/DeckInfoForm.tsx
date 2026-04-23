import { DECK_ICONS, DECK_COLORS } from "@/src/constants/deck";

interface DeckInfoFormProps {
  deckName: string;
  setDeckName: (name: string) => void;
  deckDescription: string;
  setDeckDescription: (description: string) => void;
  iconName: string;
  setIconName: (name: string) => void;
  colorCode: string;
  setColorCode: (code: string) => void;
  languageMode: "VN_EN" | "EN_VN" | "BIDIRECTIONAL";
  setLanguageMode: (mode: "VN_EN" | "EN_VN" | "BIDIRECTIONAL") => void;
}

export const DeckInfoForm = ({
  deckName,
  setDeckName,
  deckDescription,
  setDeckDescription,
  iconName,
  setIconName,
  colorCode,
  setColorCode,
  languageMode,
  setLanguageMode,
}: DeckInfoFormProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100 shadow-lg space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
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

        <div className="space-y-6">
          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Biểu tượng
            </label>
            <div className="grid grid-cols-5 gap-2">
              {DECK_ICONS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setIconName(item.name)}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                    iconName === item.name
                      ? "bg-blue-100 text-blue-600 ring-2 ring-blue-500"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Màu sắc
            </label>
            <div className="flex flex-wrap gap-3">
              {DECK_COLORS.map((color) => (
                <button
                  key={color.code}
                  onClick={() => setColorCode(color.code)}
                  className={`w-8 h-8 rounded-full transition-all bg-linear-to-br ${
                    color.class
                  } ${
                    colorCode === color.code
                      ? "ring-4 ring-offset-2 ring-blue-200 scale-110"
                      : "hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language Mode */}
      <div className="pt-4 border-t border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Chế độ học
        </label>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setLanguageMode("VN_EN")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              languageMode === "VN_EN"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            <div className="font-bold text-gray-900 mb-1">🇻🇳 Việt → 🇬🇧 Anh</div>
            <p className="text-xs text-gray-500">
              Mặt trước Tiếng Việt, mặt sau Tiếng Anh
            </p>
          </button>

          <button
            onClick={() => setLanguageMode("EN_VN")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              languageMode === "EN_VN"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            <div className="font-bold text-gray-900 mb-1">🇬🇧 Anh → 🇻🇳 Việt</div>
            <p className="text-xs text-gray-500">
              Mặt trước Tiếng Anh, mặt sau Tiếng Việt
            </p>
          </button>

          <button
            onClick={() => setLanguageMode("BIDIRECTIONAL")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              languageMode === "BIDIRECTIONAL"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-200"
            }`}
          >
            <div className="font-bold text-gray-900 mb-1">🔄 Hai chiều</div>
            <p className="text-xs text-gray-500">
              Tự động tạo thẻ đảo ngược (Học cả 2 chiều)
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
