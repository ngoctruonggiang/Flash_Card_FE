"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/src/hooks/useSettings";
import { ProfileSection } from "@/src/components/settings/ProfileSection";
import { StudySettingsSection } from "@/src/components/settings/StudySettingsSection";
import { NotificationSettingsSection } from "@/src/components/settings/NotificationSettingsSection";
import { AppearanceSettingsSection } from "@/src/components/settings/AppearanceSettingsSection";
import { DangerZoneSection } from "@/src/components/settings/DangerZoneSection";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, handleSave, handleDeleteAccount } =
    useSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
          <p className="text-gray-600 mb-8">
            Quản lý tài khoản và tùy chọn học tập
          </p>

          <div className="space-y-6">
            {/* Profile Section */}
            <ProfileSection
              settings={settings}
              updateSettings={updateSettings}
            />

            {/* Study Settings */}
            <StudySettingsSection
              settings={settings}
              updateSettings={updateSettings}
            />

            {/* Notifications */}
            <NotificationSettingsSection
              settings={settings}
              updateSettings={updateSettings}
            />

            {/* Appearance */}
            <AppearanceSettingsSection
              settings={settings}
              updateSettings={updateSettings}
            />

            {/* Danger Zone */}
            <DangerZoneSection handleDeleteAccount={handleDeleteAccount} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
