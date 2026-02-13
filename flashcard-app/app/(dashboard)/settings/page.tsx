'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Moon,
  Zap,
  Trash2,
  Save,
  Shield,
  Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState({
    // Profile
    username: user?.username || '',
    email: user?.email || '',
    
    // Notifications
    emailNotifications: true,
    studyReminders: true,
    weeklyReport: false,
    
    // Study Settings
    cardsPerDay: 50,
    newCardsPerDay: 20,
    autoPlayAudio: false,
    
    // Appearance
    darkMode: false,
    language: 'vi'
  });

  const handleSave = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('✅ Đã lưu cài đặt!');
    console.log('Settings saved:', settings);
  };

  const handleDeleteAccount = () => {
    if (confirm('⚠️ Bạn có chắc muốn XÓA TÀI KHOẢN? Hành động này không thể hoàn tác!')) {
      alert('🗑️ Tài khoản đã bị xóa!');
      logout();
    }
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

            <motion.button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cài đặt</h1>
          <p className="text-gray-600 mb-8">Quản lý tài khoản và tùy chọn học tập</p>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên người dùng
                  </label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => setSettings({...settings, username: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                  />
                </div>

                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Đổi mật khẩu</span>
                </button>
              </div>
            </div>

            {/* Study Settings */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Cài đặt học tập</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Số thẻ mục tiêu mỗi ngày
                    </label>
                    <span className="text-blue-600 font-bold">{settings.cardsPerDay}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={settings.cardsPerDay}
                    onChange={(e) => setSettings({...settings, cardsPerDay: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Số thẻ mới mỗi ngày
                    </label>
                    <span className="text-purple-600 font-bold">{settings.newCardsPerDay}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={settings.newCardsPerDay}
                    onChange={(e) => setSettings({...settings, newCardsPerDay: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <span className="text-gray-700 font-medium">Tự động phát âm thanh</span>
                  <input
                    type="checkbox"
                    checked={settings.autoPlayAudio}
                    onChange={(e) => setSettings({...settings, autoPlayAudio: e.target.checked})}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Thông báo</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <span className="text-gray-700 font-medium">Thông báo qua email</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <span className="text-gray-700 font-medium">Nhắc nhở học tập hàng ngày</span>
                  <input
                    type="checkbox"
                    checked={settings.studyReminders}
                    onChange={(e) => setSettings({...settings, studyReminders: e.target.checked})}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <span className="text-gray-700 font-medium">Báo cáo tuần</span>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReport}
                    onChange={(e) => setSettings({...settings, weeklyReport: e.target.checked})}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Giao diện</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngôn ngữ
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                  >
                    <option value="vi">🇻🇳 Tiếng Việt</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>

                <label className="flex items-center justify-between py-3 cursor-pointer">
                  <span className="text-gray-700 font-medium">Chế độ tối (coming soon)</span>
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                    disabled
                    className="w-5 h-5 rounded text-blue-600 opacity-50 cursor-not-allowed"
                  />
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-red-900">Vùng nguy hiểm</h2>
              </div>

              <p className="text-red-700 mb-4">
                Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
              </p>

              <motion.button
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa tài khoản</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}