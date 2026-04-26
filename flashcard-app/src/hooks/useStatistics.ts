import { useState } from "react";

export type TimeRange = "week" | "month" | "year";

export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: any; // Using any for Lucide icons to avoid complex type issues
  color: string;
  subtext?: string;
}

export interface WeeklyData {
  day: string;
  cards: number;
  accuracy: number;
  time: number;
}

export interface ActivityItem {
  date: string;
  deck: string;
  cards: number;
  accuracy: number;
  time: number;
  type: "study" | "created";
}

export const useStatistics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  // Mock data - In a real app, this would come from an API based on timeRange
  const stats = {
    totalCards: 856,
    studiedToday: 23,
    studiedThisWeek: 156,
    studiedThisMonth: 623,
    currentStreak: 7,
    longestStreak: 15,
    averageAccuracy: 87,
    totalStudyTime: 3420, // minutes
    cardsPerDay: 22,
    bestDay: "Thứ Hai",
  };

  const weeklyData: WeeklyData[] = [
    { day: "T2", cards: 35, accuracy: 89, time: 28 },
    { day: "T3", cards: 28, accuracy: 91, time: 22 },
    { day: "T4", cards: 42, accuracy: 83, time: 35 },
    { day: "T5", cards: 23, accuracy: 87, time: 18 },
    { day: "T6", cards: 18, accuracy: 92, time: 15 },
    { day: "T7", cards: 10, accuracy: 88, time: 8 },
    { day: "CN", cards: 0, accuracy: 0, time: 0 },
  ];

  const recentActivity: ActivityItem[] = [
    {
      date: "2025-10-30 09:30",
      deck: "Từ vựng IELTS",
      cards: 23,
      accuracy: 89,
      time: 15,
      type: "study",
    },
    {
      date: "2025-10-29 14:20",
      deck: "Business English",
      cards: 35,
      accuracy: 85,
      time: 22,
      type: "study",
    },
    {
      date: "2025-10-29 10:15",
      deck: "Phrasal Verbs",
      cards: 0,
      accuracy: 0,
      time: 0,
      type: "created",
    },
    {
      date: "2025-10-28 16:45",
      deck: "Từ vựng IELTS",
      cards: 28,
      accuracy: 91,
      time: 18,
      type: "study",
    },
    {
      date: "2025-10-27 11:30",
      deck: "Medical Terms",
      cards: 42,
      accuracy: 83,
      time: 28,
      type: "study",
    },
  ];

  const maxCards = Math.max(...weeklyData.map((d) => d.cards));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return {
    timeRange,
    setTimeRange,
    stats,
    weeklyData,
    recentActivity,
    maxCards,
    formatTime,
  };
};
