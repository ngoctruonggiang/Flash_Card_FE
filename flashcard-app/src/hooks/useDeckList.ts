import { useState, useEffect } from "react";
import apiClient from "../axios/axios";
import { DeckResponse, ApiResponseDto } from "../types/dto";

export interface Deck {
  id: number;
  name: string;
  description: string;
  totalCards: number;
  studiedCards: number;
  dueCards: number;
  color: string;
  emoji: string;
  lastStudied: string;
}

const GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
  "from-red-500 to-pink-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
];

const EMOJIS = ["📘", "💼", "🎯", "✨", "📝", "⚕️", "💻", "💬", "📚", "🧠"];

export const useDeckList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "recent" | "progress">(
    "recent"
  );
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponseDto<DeckResponse[]>>(
        "/deck"
      );
      if (response.data && response.data.data) {
        const mappedDecks: Deck[] = response.data.data.map(
          (apiDeck: DeckResponse, index: number) => {
            // Calculate stats if cards are available
            const cards = apiDeck.cards || [];
            const totalCards = cards.length;
            // Simplified logic for stats since API might not return full review history in this endpoint
            const studiedCards = 0; // Placeholder
            const dueCards = 0; // Placeholder

            return {
              id: apiDeck.id,
              name: apiDeck.title,
              description: apiDeck.description || "",
              totalCards: totalCards,
              studiedCards: studiedCards,
              dueCards: dueCards,
              color: GRADIENTS[index % GRADIENTS.length],
              emoji: EMOJIS[index % EMOJIS.length],
              lastStudied: apiDeck.updatedAt || new Date().toISOString(),
            };
          }
        );
        setDecks(mappedDecks);
      }
    } catch (err) {
      console.error("Failed to fetch decks:", err);
      setError("Failed to load decks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // Filter and sort
  const filteredDecks = decks
    .filter(
      (deck) =>
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "recent")
        return (
          new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime()
        );
      if (sortBy === "progress") {
        const progressA = a.totalCards > 0 ? a.studiedCards / a.totalCards : 0;
        const progressB = b.totalCards > 0 ? b.studiedCards / b.totalCards : 0;
        return progressB - progressA;
      }
      return 0;
    });

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filteredDecks,
    loading,
    error,
    refreshDecks: fetchDecks,
  };
};
