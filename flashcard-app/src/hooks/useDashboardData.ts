import { useState, useEffect } from "react";
import { deckApi, DeckResponse } from "@/src/api/deckApi";
import { Brain, Target, TrendingUp, Flame } from "lucide-react";

export const useDashboardData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [decks, setDecks] = useState<any[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);
  const [deckError, setDeckError] = useState<string | null>(null);

  // Mock data
  const userData = {
    name: "Đức Hải",
    username: "duchai1703",
    email: "duchai1703@example.com",
    avatar: "👨‍💻",
    streak: 7,
    totalCards: 156,
    studiedToday: 23,
    accuracy: 87,
  };

  // Fetch decks from API
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setIsLoadingDecks(true);
        setDeckError(null);
        const response = await deckApi.getAllForCurrentUser();

        // Transform API data to match UI expectations
        const transformedDecks = (response.data.data ?? []).map(
          (deck: DeckResponse, index: number) => {
            const totalCards = deck.cards?.length || 0;
            // For now, we'll use placeholder values for studiedCards and dueCards
            // These should come from the review data in a full implementation
            const studiedCards = 0;
            const dueCards = totalCards;

            // Cycle through color schemes and emojis
            const colorSchemes = [
              "from-blue-500 to-cyan-500",
              "from-purple-500 to-pink-500",
              "from-orange-500 to-red-500",
              "from-green-500 to-emerald-500",
              "from-indigo-500 to-purple-500",
              "from-pink-500 to-rose-500",
            ];
            const emojis = ["📘", "💼", "🎯", "✨", "📚", "🎓", "💡", "🚀"];

            return {
              id: deck.id,
              name: deck.title,
              description: deck.description || "No description",
              totalCards,
              studiedCards,
              dueCards,
              color: colorSchemes[index % colorSchemes.length],
              emoji: emojis[index % emojis.length],
            };
          }
        );

        setDecks(transformedDecks);
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
      change: "Kỷ lục: 15 ngày",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
  ];

  const recentActivity = [
    { date: "2025-10-30", cards: 23, accuracy: 89, time: "15 phút" },
    { date: "2025-10-29", cards: 35, accuracy: 85, time: "22 phút" },
    { date: "2025-10-28", cards: 28, accuracy: 91, time: "18 phút" },
    { date: "2025-10-27", cards: 42, accuracy: 83, time: "28 phút" },
  ];

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
