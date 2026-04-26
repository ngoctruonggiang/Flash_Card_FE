import { Zap } from "lucide-react";
import { SettingsState } from "@/src/hooks/useSettings";

interface AppearanceSettingsSectionProps {
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;
}

export const AppearanceSettingsSection = ({
  settings,
  updateSettings,
}: AppearanceSettingsSectionProps) => {
  return (
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
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
          >
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>

        <label className="flex items-center justify-between py-3 cursor-pointer">
          <span className="text-gray-700 font-medium">
            Chế độ tối (coming soon)
          </span>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => updateSettings({ darkMode: e.target.checked })}
            disabled
            className="w-5 h-5 rounded text-blue-600 opacity-50 cursor-not-allowed"
          />
        </label>
      </div>
    </div>
  );
};
