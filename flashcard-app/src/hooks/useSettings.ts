import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface SettingsState {
  username: string;
  email: string;
  emailNotifications: boolean;
  studyReminders: boolean;
  weeklyReport: boolean;
  cardsPerDay: number;
  newCardsPerDay: number;
  autoPlayAudio: boolean;
  darkMode: boolean;
  language: string;
}

export const useSettings = () => {
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState<SettingsState>({
    // Profile
    username: user?.username || "",
    email: user?.email || "",

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
    language: "vi",
  });

  const updateSettings = (updates: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("✅ Đã lưu cài đặt!");
    console.log("Settings saved:", settings);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirm(false);
    logout();
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };

  return {
    settings,
    updateSettings,
    handleSave,
    handleDeleteAccount,
    showDeleteConfirm,
    confirmDeleteAccount,
    cancelDeleteAccount,
  };
};
