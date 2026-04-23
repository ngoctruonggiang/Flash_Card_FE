import { Target } from "lucide-react";
import { SettingsState } from "@/src/hooks/useSettings";

interface StudySettingsSectionProps {
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;
}

export const StudySettingsSection = ({
  settings,
  updateSettings,
}: StudySettingsSectionProps) => {
  return (
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
            <span className="text-blue-600 font-bold">
              {settings.cardsPerDay}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={settings.cardsPerDay}
            onChange={(e) =>
              updateSettings({ cardsPerDay: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              Số thẻ mới mỗi ngày
            </label>
            <span className="text-purple-600 font-bold">
              {settings.newCardsPerDay}
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={settings.newCardsPerDay}
            onChange={(e) =>
              updateSettings({ newCardsPerDay: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>

        <label className="flex items-center justify-between py-3 cursor-pointer">
          <span className="text-gray-700 font-medium">
            Tự động phát âm thanh
          </span>
          <input
            type="checkbox"
            checked={settings.autoPlayAudio}
            onChange={(e) =>
              updateSettings({ autoPlayAudio: e.target.checked })
            }
            className="w-5 h-5 rounded text-blue-600"
          />
        </label>
      </div>
    </div>
  );
};
