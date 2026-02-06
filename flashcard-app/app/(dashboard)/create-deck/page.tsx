'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Upload,
  Download,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Card {
  id: string;
  front: string;
  back: string;
}

export default function CreateDeckPage() {
  const router = useRouter();
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [cards, setCards] = useState<Card[]>([
    { id: '1', front: '', back: '' },
    { id: '2', front: '', back: '' }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  // Import từ CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Parse CSV (format: front,back)
      const importedCards: Card[] = lines.map((line, index) => {
        const [front, back] = line.split(',').map(s => s.trim());
        return {
          id: Date.now().toString() + index,
          front: front || '',
          back: back || ''
        };
      }).filter(card => card.front && card.back);

      if (importedCards.length > 0) {
        setCards([...cards, ...importedCards]);
        alert(`✅ Đã import ${importedCards.length} thẻ từ CSV!`);
      } else {
        alert('⚠️ File CSV không hợp lệ! Format: "Tiếng Việt,English"');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Import từ JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.name) setDeckName(data.name);
        if (data.description) setDeckDescription(data.description);
        if (data.cards && Array.isArray(data.cards)) {
          const importedCards = data.cards.map((card: any, index: number) => ({
            id: Date.now().toString() + index,
            front: card.front || '',
            back: card.back || ''
          }));
          setCards(importedCards);
          alert(`✅ Đã import ${importedCards.length} thẻ từ JSON!`);
        }
      } catch (error) {
        alert('❌ File JSON không hợp lệ!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export CSV
  const handleExportCSV = () => {
    const filledCards = cards.filter(c => c.front && c.back);
    if (filledCards.length === 0) {
      alert('⚠️ Chưa có thẻ nào để export!');
      return;
    }

    const csv = filledCards.map(card => `${card.front},${card.back}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deckName || 'flashcards'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`📤 Đã export ${filledCards.length} thẻ sang CSV!`);
  };

  // Export JSON
  const handleExportJSON = () => {
    const filledCards = cards.filter(c => c.front && c.back);
    if (filledCards.length === 0) {
      alert('⚠️ Chưa có thẻ nào để export!');
      return;
    }

    const data = {
      name: deckName,
      description: deckDescription,
      cards: filledCards
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deckName || 'deck'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`📤 Đã export ${filledCards.length} thẻ sang JSON!`);
  };

  const addCard = () => {
    const newCard: Card = {
      id: Date.now().toString(),
      front: '',
      back: ''
    };
    setCards([...cards, newCard]);
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const updateCard = (id: string, field: 'front' | 'back', value: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSave = async () => {
    if (!deckName.trim()) {
      alert('⚠️ Vui lòng nhập tên bộ thẻ!');
      return;
    }

    const filledCards = cards.filter(card => card.front.trim() && card.back.trim());
    
    if (filledCards.length === 0) {
      alert('⚠️ Vui lòng thêm ít nhất 1 thẻ có nội dung!');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Deck created:', {
      name: deckName,
      description: deckDescription,
      cards: filledCards
    });

    alert(`🎉 Đã tạo bộ thẻ "${deckName}" với ${filledCards.length} thẻ!`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại Dashboard</span>
            </motion.button>

            <div className="flex items-center space-x-3">
              {/* Import Dropdown */}
              <div className="relative group">
                <motion.button
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </motion.button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-48">
                  <label className="block px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>📄</span>
                      <span className="font-medium">Import CSV</span>
                    </div>
                  </label>
                  
                  <label className="block px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-t border-gray-100">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>📋</span>
                      <span className="font-medium">Import JSON</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Export Dropdown */}
              <div className="relative group">
                <motion.button
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </motion.button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-48">
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>📄</span>
                      <span className="font-medium">Export CSV</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleExportJSON}
                    className="w-full px-4 py-3 hover:bg-blue-50 transition-colors border-t border-gray-100 text-left"
                  >
                    <div className="flex items-center space-x-2 text-gray-700">
                      <span>📋</span>
                      <span className="font-medium">Export JSON</span>
                    </div>
                  </button>
                </div>
              </div>

              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
                whileHover={{ scale: isSaving ? 1 : 1.05 }}
                whileTap={{ scale: isSaving ? 1 : 0.95 }}
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu bộ thẻ'}</span>
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
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tạo bộ thẻ mới</h1>
                <p className="text-gray-600">Tạo bộ flashcard của riêng bạn</p>
              </div>
            </div>
          </div>

          {/* Deck Info */}
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
                  style={{ color: '#111827' }}
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
                  style={{ color: '#111827' }}
                />
              </div>
            </div>
          </div>

          {/* Cards List */}
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
                          onChange={(e) => updateCard(card.id, 'front', e.target.value)}
                          placeholder="VD: Xin chào"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 font-medium"
                          style={{ color: '#111827' }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          🇬🇧 Mặt sau (Tiếng Anh)
                        </label>
                        <input
                          type="text"
                          value={card.back}
                          onChange={(e) => updateCard(card.id, 'back', e.target.value)}
                          placeholder="VD: Hello"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 font-medium"
                          style={{ color: '#111827' }}
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
          </div>

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

          {/* Tips Section */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">💡 Mẹo tạo flashcard hiệu quả:</h3>
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