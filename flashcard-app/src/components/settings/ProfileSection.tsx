import { User, Lock } from "lucide-react";
import { SettingsState } from "@/src/hooks/useSettings";

interface ProfileSectionProps {
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;
}

export const ProfileSection = ({
  settings,
  updateSettings,
}: ProfileSectionProps) => {
  return (
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
            onChange={(e) => updateSettings({ username: e.target.value })}
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
            onChange={(e) => updateSettings({ email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
          />
        </div>

        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>Đổi mật khẩu</span>
        </button>
      </div>
    </div>
  );
};
