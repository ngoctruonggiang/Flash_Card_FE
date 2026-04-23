import { Bell } from "lucide-react";
import { SettingsState } from "@/src/hooks/useSettings";

interface NotificationSettingsSectionProps {
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;
}

export const NotificationSettingsSection = ({
  settings,
  updateSettings,
}: NotificationSettingsSectionProps) => {
  return (
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
            onChange={(e) =>
              updateSettings({ emailNotifications: e.target.checked })
            }
            className="w-5 h-5 rounded text-blue-600"
          />
        </label>

        <label className="flex items-center justify-between py-3 cursor-pointer">
          <span className="text-gray-700 font-medium">
            Nhắc nhở học tập hàng ngày
          </span>
          <input
            type="checkbox"
            checked={settings.studyReminders}
            onChange={(e) =>
              updateSettings({ studyReminders: e.target.checked })
            }
            className="w-5 h-5 rounded text-blue-600"
          />
        </label>

        <label className="flex items-center justify-between py-3 cursor-pointer">
          <span className="text-gray-700 font-medium">Báo cáo tuần</span>
          <input
            type="checkbox"
            checked={settings.weeklyReport}
            onChange={(e) => updateSettings({ weeklyReport: e.target.checked })}
            className="w-5 h-5 rounded text-blue-600"
          />
        </label>
      </div>
    </div>
  );
};
