"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Play,
  LogOut,
  Settings,
  Search,
  BarChart2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDashboardData } from "@/src/hooks/useDashboardData";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/src/components/dashboard/StatsGrid";
import { DeckList } from "@/src/components/dashboard/DeckList";
import { RecentActivity } from "@/src/components/dashboard/RecentActivity";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

export default function DashboardPage() {
  const { isLoading: isCheckingAuth } = useProtectedRoute();
  const { logout } = useAuth();
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    decks,
    isLoadingDecks,
    deckError,
    userData,
    stats,
    recentActivity,
  } = useDashboardData();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "success" | "info" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Đăng xuất"
      />
      {/* Header/Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FlashLearn
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bộ thẻ..."
                  className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link href="/statistics">
                <motion.button
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Thống kê"
                >
                  <BarChart2 className="w-5 h-5 text-gray-600" />
                </motion.button>
              </Link>

              <motion.button
                onClick={() => router.push("/settings")}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </motion.button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500">@{userData.username}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  {userData.avatar}
                </div>
              </div>

              <motion.button
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: "Đăng xuất",
                    message: "Bạn có chắc muốn đăng xuất?",
                    type: "danger",
                    onConfirm: logout,
                  });
                }}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader userName={userData.name} />

        <StatsGrid stats={stats} />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.button
            onClick={() => router.push("/deck")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6" />
            <span>Mở bộ sưu tập thẻ</span>
          </motion.button>

          <motion.button
            onClick={() => router.push("/create-deck")}
            className="bg-white border-2 border-gray-200 text-gray-700 p-6 rounded-2xl font-semibold text-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-6 h-6" />
            <span>Tạo bộ thẻ mới</span>
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Decks Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Bộ thẻ của bạn
              </h2>
            </div>

            <DeckList
              decks={decks}
              isLoading={isLoadingDecks}
              error={deckError}
            />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <RecentActivity
            streak={userData.streak}
            activities={recentActivity}
          />
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
}
