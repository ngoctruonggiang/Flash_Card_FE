"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Save, Sparkles, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeckForm } from "@/src/hooks/useDeckForm";
import { DeckInfoForm } from "@/src/components/create-deck/DeckInfoForm";
import { CardList } from "@/src/components/create-deck/CardList";
import { ImportExportMenu } from "@/src/components/create-deck/ImportExportMenu";

function CreateDeckContent() {
  const router = useRouter();
  const {
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
    cards,
    isSaving,
    handleImportJSON,
    addCard,
    deleteCard,
    updateCard,
    handleSave,
    isLoading,
  } = useDeckForm();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
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

            <div className="flex items-center space-x-3">
              <ImportExportMenu handleImportJSON={handleImportJSON} />

              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
                whileHover={{ scale: isSaving ? 1 : 1.05 }}
                whileTap={{ scale: isSaving ? 1 : 0.95 }}
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Đang lưu..." : "Lưu bộ thẻ"}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tạo bộ thẻ mới
                </h1>
                <p className="text-gray-600">Tạo bộ flashcard của riêng bạn</p>
              </div>
            </div>
          </div>

          <DeckInfoForm
            deckName={deckName}
            setDeckName={setDeckName}
            deckDescription={deckDescription}
            setDeckDescription={setDeckDescription}
            iconName={iconName}
            setIconName={setIconName}
            colorCode={colorCode}
            setColorCode={setColorCode}
            languageMode={languageMode}
            setLanguageMode={setLanguageMode}
          />

          <CardList
            cards={cards}
            updateCard={updateCard}
            deleteCard={deleteCard}
            addCard={addCard}
            languageMode={languageMode}
          />

          {/* Tips Section */}
          <motion.div
            className="mt-8 bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  💡 Mẹo tạo flashcard hiệu quả:
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Giữ nội dung ngắn gọn, dễ nhớ (1-2 câu)</li>
                  <li>• Sử dụng ví dụ cụ thể thay vì định nghĩa chung chung</li>
                  <li>• Thêm ngữ cảnh để dễ liên tưởng</li>
                  <li>• Nhóm các từ vựng cùng chủ đề vào một bộ thẻ</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default function CreateDeckPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <CreateDeckContent />
    </Suspense>
  );
}
