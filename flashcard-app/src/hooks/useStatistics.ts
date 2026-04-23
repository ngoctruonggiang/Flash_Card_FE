import { useState, useEffect, useCallback } from "react";
import apiClient from "../axios/axios";
import {
  ApiResponseDto,
  UserStatisticsResponse,
  UserDailyBreakdownResponse,
  DailyBreakdownItem,
  RecentActivityItem,
} from "@/src/types/dto";

// Types exported for use by UI components
export interface WeeklyData {
  day: string; // Day abbreviation (e.g., "T2", "T3")
  date: string; // ISO date
  cards: number;
  accuracy: number;
  time: number; // in minutes
}

export interface ActivityItem {
  type: "study" | "created";
  deck: string;
  date: string;
  cards?: number;
  accuracy?: number;
  time?: number; // in minutes
}

export interface StatisticsData {
  totalCards: number;
  cardsPerDay: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  studiedToday: number;
  studiedThisWeek: number;
  studiedThisMonth: number;
  totalStudyTime: number; // in minutes
  bestDay: string;
  totalDecks: number;
  totalReviews: number;
}

// Helper to get Vietnamese day abbreviation
const getVietnameseDayAbbr = (dayOfWeek: string): string => {
  const dayMap: Record<string, string> = {
    Monday: "T2",
    Tuesday: "T3",
    Wednesday: "T4",
    Thursday: "T5",
    Friday: "T6",
    Saturday: "T7",
    Sunday: "CN",
  };
  return dayMap[dayOfWeek] || dayOfWeek.substring(0, 2);
};

// Helper to format date for display (relative or absolute)
const formatActivityDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return "Vừa xong";
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

// Helper to get date range for weekly breakdown
const getWeekDateRange = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0];

  const startDateObj = new Date(now);
  startDateObj.setDate(startDateObj.getDate() - 6); // Last 7 days including today
  const startDate = startDateObj.toISOString().split("T")[0];

  return { startDate, endDate };
};

export const useStatistics = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user statistics
  const fetchUserStatistics = useCallback(async () => {
    try {
      const response = await apiClient.get<
        ApiResponseDto<UserStatisticsResponse>
      >("/study/user-statistics");

      const data = response.data.data;
      if (data) {
        setStats({
          totalCards: data.totalCards,
          cardsPerDay: Math.round(data.cardsPerDay * 10) / 10, // Round to 1 decimal
          averageAccuracy: Math.round(data.averageAccuracy * 10) / 10,
          currentStreak: data.currentStreak,
          longestStreak: data.longestStreak,
          studiedToday: data.studiedToday,
          studiedThisWeek: data.studiedThisWeek,
          studiedThisMonth: data.studiedThisMonth,
          totalStudyTime: Math.round(data.totalStudyTime / 60), // Convert seconds to minutes
          bestDay: data.bestDay,
          totalDecks: data.totalDecks,
          totalReviews: data.totalReviews,
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch user statistics:", err);
      throw err;
    }
  }, []);

  // Fetch daily breakdown for weekly chart
  const fetchDailyBreakdown = useCallback(async () => {
    try {
      const { startDate, endDate } = getWeekDateRange();

      const response = await apiClient.get<
        ApiResponseDto<UserDailyBreakdownResponse>
      >(
        `/study/user-daily-breakdown?startDate=${startDate}&endDate=${endDate}`
      );

      console.log("=== DAILY BREAKDOWN API RESPONSE ===", response.data);

      const data = response.data.data;
      if (data && data.dailyBreakdown) {
        console.log("=== DAILY BREAKDOWN DATA ===", data.dailyBreakdown);

        const transformedData: WeeklyData[] = data.dailyBreakdown.map(
          (day: DailyBreakdownItem) => {
            console.log("Processing day:", day);
            return {
              day: getVietnameseDayAbbr(day.dayOfWeek),
              date: day.date,
              cards: day.cardsReviewed,
              accuracy: Math.round(day.accuracy),
              time: Math.round(day.studyTime / 60), // Convert seconds to minutes
            };
          }
        );
        console.log("=== TRANSFORMED WEEKLY DATA ===", transformedData);
        setWeeklyData(transformedData);
      } else {
        console.log("=== NO DAILY BREAKDOWN DATA ===", data);
      }
    } catch (err: any) {
      console.error("Failed to fetch daily breakdown:", err);
      throw err;
    }
  }, []);

  // Fetch recent activity
  const fetchRecentActivity = useCallback(async () => {
    try {
      const response = await apiClient.get<
        ApiResponseDto<RecentActivityItem[]>
      >("/study/recent-activity?limit=10");

      const data = response.data.data;
      if (data && Array.isArray(data)) {
        const transformedActivities: ActivityItem[] = data.map(
          (item: RecentActivityItem) => ({
            type: item.type === "study" ? "study" : "created",
            deck: item.deckName,
            date: formatActivityDate(item.date),
            cards: item.cardsReviewed,
            accuracy: Math.round(item.accuracy),
            time: Math.round(item.studyTime / 60), // Convert seconds to minutes
          })
        );
        setActivities(transformedActivities);
      }
    } catch (err: any) {
      console.error("Failed to fetch recent activity:", err);
      throw err;
    }
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchUserStatistics(),
          fetchDailyBreakdown(),
          fetchRecentActivity(),
        ]);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load statistics. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [fetchUserStatistics, fetchDailyBreakdown, fetchRecentActivity]);

  // Refresh data when window regains focus (e.g., after completing a study session)
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if not currently loading and we have data
      if (!isLoading && stats) {
        // Silently refresh without showing loading state
        Promise.all([
          fetchUserStatistics(),
          fetchDailyBreakdown(),
          fetchRecentActivity(),
        ]).catch((err) => {
          console.error("Failed to refresh statistics on focus:", err);
        });
      }
    };

    window.addEventListener("focus", handleFocus);

    // Also handle visibility change for tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isLoading && stats) {
        Promise.all([
          fetchUserStatistics(),
          fetchDailyBreakdown(),
          fetchRecentActivity(),
        ]).catch((err) => {
          console.error("Failed to refresh statistics on visibility:", err);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    isLoading,
    stats,
    fetchUserStatistics,
    fetchDailyBreakdown,
    fetchRecentActivity,
  ]);

  // Refresh data
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchUserStatistics(),
        fetchDailyBreakdown(),
        fetchRecentActivity(),
      ]);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to load statistics. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserStatistics, fetchDailyBreakdown, fetchRecentActivity]);

  // Calculate max cards for chart scaling
  const maxCards = Math.max(...weeklyData.map((d) => d.cards), 1);

  // Format time helper for components
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} giờ`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  return {
    stats,
    weeklyData,
    activities,
    isLoading,
    error,
    refresh,
    maxCards,
    formatTime,
  };
};
