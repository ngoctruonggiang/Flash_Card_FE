import { useState, useEffect } from "react";
import apiClient from "../axios/axios";
import {
  DeckResponse,
  ApiResponseDto,
  UserStatisticsResponse,
  RecentActivityItem,
} from "@/src/types/dto";
import { Brain, Target, TrendingUp, Flame } from "lucide-react";

export const useDashboardData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [decks, setDecks] = useState<any[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [deckError, setDeckError] = useState<string | null>(null);

  const [userData, setUserData] = useState({
    name: "Loading...",
    username: "loading",
    email: "loading...",
    avatar: "👨‍💻",
    streak: 0,
    longestStreak: 0,
    totalCards: 0,
    studiedToday: 0,
    accuracy: 0,
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<ApiResponseDto<any>>("/user");
        const user = response.data.data;
        setUserData((prev) => ({
          ...prev,
          name: user.username, // API doesn't have name, use username
          username: user.username,
          email: user.email,
        }));
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await apiClient.get<
          ApiResponseDto<UserStatisticsResponse>
        >("/study/user-statistics");
        const stats = response.data.data;
        if (stats) {
          setUserData((prev) => ({
            ...prev,
            streak: stats.currentStreak,
            longestStreak: stats.longestStreak,
            totalCards: stats.totalCards,
            studiedToday: stats.studiedToday,
            accuracy: Math.round(stats.averageAccuracy),
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user statistics:", error);
      }
    };
    fetchUserStatistics();
  }, []);

  // Fetch decks from API
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setIsLoadingDecks(true);
        setDeckError(null);
        const response = await apiClient.get<ApiResponseDto<DeckResponse[]>>(
          "/deck"
        );

        let totalCardsCount = 0;

        // Transform API data to match UI expectations
        const transformedDecks = (response.data.data ?? []).map(
          (deck: DeckResponse, index: number) => {
            const totalCards = deck.cards?.length || 0;
            totalCardsCount += totalCards;

            // Calculate due cards
            const now = new Date();
            const dueCards = (deck.cards || []).filter((card) => {
              if (!card.nextReviewDate) return true; // New cards are due
              return new Date(card.nextReviewDate) <= now; // Due if review date is in the past or today
            }).length;

            const studiedCards = 0; // Placeholder as we are removing the progress bar

            // Cycle through color schemes and emojis as fallback
            const colorSchemes = [
              "from-blue-500 to-cyan-500",
              "from-purple-500 to-pink-500",
              "from-orange-500 to-red-500",
              "from-green-500 to-emerald-500",
              "from-indigo-500 to-purple-500",
              "from-pink-500 to-rose-500",
            ];
            const emojis = ["📘", "💼", "🎯", "✨", "📚", "🎓", "💡", "🚀"];

            // Helper to get color class from hex code
            const getColorClass = (hex?: string) => {
              if (!hex) return colorSchemes[index % colorSchemes.length];
              // Map hex codes to tailwind classes (simplified mapping)
              const colorMap: Record<string, string> = {
                "#3B82F6": "from-blue-500 to-cyan-500",
                "#EF4444": "from-red-500 to-orange-500",
                "#10B981": "from-green-500 to-emerald-500",
                "#F59E0B": "from-yellow-500 to-orange-500",
                "#8B5CF6": "from-purple-500 to-indigo-500",
                "#EC4899": "from-pink-500 to-rose-500",
                "#6366F1": "from-indigo-500 to-blue-500",
                "#F97316": "from-orange-500 to-red-500",
              };
              return colorMap[hex] || colorSchemes[index % colorSchemes.length];
            };

            return {
              id: deck.id,
              name: deck.title,
              description: deck.description || "No description",
              totalCards,
              studiedCards,
              dueCards,
              color: getColorClass(deck.colorCode),
              emoji: deck.iconName || emojis[index % emojis.length], // Pass iconName directly
              iconName: deck.iconName, // Also pass as specific field
            };
          }
        );

        setDecks(transformedDecks);
        setUserData((prev) => ({ ...prev, totalCards: totalCardsCount }));
      } catch (error: any) {
        console.error("Failed to fetch decks:", error);
        setDeckError(
          error.response?.data?.message ||
            "Failed to load decks. Please try again."
        );
      } finally {
        setIsLoadingDecks(false);
      }
    };

    fetchDecks();
  }, []);

  const stats = [
    {
      icon: Brain,
      label: "Tổng số thẻ",
      value: userData.totalCards,
      change: "+12 tuần này",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Target,
      label: "Đã học hôm nay",
      value: userData.studiedToday,
      change: "Mục tiêu: 50",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: TrendingUp,
      label: "Độ chính xác",
      value: `${userData.accuracy}%`,
      change: "+3% so với tuần trước",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Flame,
      label: "Chuỗi ngày học",
      value: `${userData.streak} ngày`,
      change: `Kỷ lục: ${userData.longestStreak} ngày`,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
  ];

  // State for recent activity
  const [recentActivity, setRecentActivity] = useState<
    Array<{ date: string; cards: number; accuracy: number; time: string }>
  >([]);

  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await apiClient.get<
          ApiResponseDto<RecentActivityItem[]>
        >("/study/recent-activity?limit=10");
        const data = response.data.data;
        if (data && Array.isArray(data)) {
          // Transform API response to match UI expectations
          const transformed = data.map((item) => {
            const studyTimeMinutes = Math.round(item.studyTime / 60);
            return {
              date: new Date(item.date).toISOString().split("T")[0],
              cards: item.cardsReviewed,
              accuracy: Math.round(item.accuracy),
              timeMinutes: studyTimeMinutes,
            };
          });

          // Group activities by date
          const groupedByDate = transformed.reduce((acc, activity) => {
            const existing = acc.find((item) => item.date === activity.date);
            if (existing) {
              // Combine activities from the same date
              existing.cards += activity.cards;
              existing.timeMinutes += activity.timeMinutes;
              // Calculate weighted average accuracy
              existing.totalAccuracy += activity.accuracy;
              existing.count += 1;
            } else {
              acc.push({
                date: activity.date,
                cards: activity.cards,
                timeMinutes: activity.timeMinutes,
                totalAccuracy: activity.accuracy,
                count: 1,
              });
            }
            return acc;
          }, [] as Array<{ date: string; cards: number; timeMinutes: number; totalAccuracy: number; count: number }>);

          // Convert to final format and calculate average accuracy
          const finalActivities = groupedByDate
            .map((item) => ({
              date: item.date,
              cards: item.cards,
              accuracy: Math.round(item.totalAccuracy / item.count),
              time: `${item.timeMinutes} phút`,
            }))
            .slice(0, 4); // Limit to 4 entries after grouping

          setRecentActivity(finalActivities);
        }
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      }
    };
    fetchRecentActivity();
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    decks,
    isLoadingDecks,
    deckError,
    userData,
    stats,
    recentActivity,
  };
};
