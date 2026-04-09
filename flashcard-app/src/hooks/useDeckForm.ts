import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "../axios/axios";
import {
  CreateDeckDto,
  DeckResponse,
  CreateCardDto,
  CardResponse,
  ApiResponseDto,
  UpdateDeckDto,
  UpdateCardDto,
} from "@/src/types/dto";

export interface Card {
  id: string;
  front: string;
  back: string;
  wordType?: string;
  pronunciation?: string;
  examples?: { id: string; sentence: string; translation: string }[];
}

export const useDeckForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editDeckId = searchParams.get("edit");

  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [iconName, setIconName] = useState("book");
  const [colorCode, setColorCode] = useState("#3B82F6");
  const [languageMode, setLanguageMode] = useState<
    "VN_EN" | "EN_VN" | "BIDIRECTIONAL"
  >("VN_EN");

  const [cards, setCards] = useState<Card[]>([
    { id: "1", front: "", back: "", examples: [] },
    { id: "2", front: "", back: "", examples: [] },
  ]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch deck data if in edit mode
  useEffect(() => {
    if (!editDeckId) return;

    const fetchDeckData = async () => {
      try {
        setIsLoading(true);
        const [deckRes, cardsRes] = await Promise.all([
          apiClient.get<ApiResponseDto<DeckResponse>>(`/deck/${editDeckId}`),
          apiClient.get<ApiResponseDto<CardResponse[]>>("/card", {
            params: { deckId: editDeckId },
          }),
        ]);

        if (deckRes.data.data) {
          const deck = deckRes.data.data;
          setDeckName(deck.title);
          setDeckDescription(deck.description || "");
          setIconName(deck.iconName || "book");
          setColorCode(deck.colorCode || "#3B82F6");
          setLanguageMode(deck.languageMode || "VN_EN");
        }

        if (cardsRes.data.data) {
          const fetchedCards = cardsRes.data.data.map((c) => ({
            id: c.id.toString(),
            front: c.front,
            back: c.back,
            wordType: c.wordType,
            pronunciation: c.pronunciation,
            examples: Array.isArray(c.examples)
              ? c.examples.map((ex: any, idx: number) => ({
                  id: idx.toString(), // Example IDs are not persistent in DB usually, just for UI
                  sentence: ex.sentence,
                  translation: ex.translation,
                }))
              : [],
          }));
          setCards(fetchedCards);
          setOriginalCards(fetchedCards);
        }
      } catch (error) {
        console.error("Error fetching deck details:", error);
        alert("❌ Không thể tải thông tin bộ thẻ!");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeckData();
  }, [editDeckId, router]);

  // Import từ JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (data.name) setDeckName(data.name);
        if (data.description) setDeckDescription(data.description);
        if (data.cards && Array.isArray(data.cards)) {
          const importedCards = data.cards.map((card: any, index: number) => ({
            id: Date.now().toString() + index,
            front: card.front || "",
            back: card.back || "",
            tags: card.tags || null,
            wordType: card.wordType || undefined,
            pronunciation: card.pronunciation || undefined,
            examples: Array.isArray(card.examples)
              ? card.examples.map((ex: any, idx: number) => ({
                  id: Date.now().toString() + idx,
                  sentence: ex.sentence || "",
                  translation: ex.translation || "",
                }))
              : [],
          }));
          setCards(importedCards);
          alert(`✅ Đã import ${importedCards.length} thẻ từ JSON!`);
        }
      } catch (error) {
        alert("❌ File JSON không hợp lệ!");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const addCard = () => {
    const newCard: Card = {
      id: Date.now().toString(),
      front: "",
      back: "",
      examples: [],
    };
    setCards([...cards, newCard]);
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== id));
    } else if (editDeckId) {
      // Allow deleting the last card if in edit mode (user might want to delete all cards?)
      // But UI prevents deleting the last card usually.
      // Let's keep the restriction for now to avoid empty decks if that's an issue.
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  const updateCard = (id: string, field: keyof Card, value: any) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const handleSave = async () => {
    if (!deckName.trim()) {
      alert("⚠️ Vui lòng nhập tên bộ thẻ!");
      return;
    }

    const filledCards = cards.filter(
      (card) => card.front.trim() && card.back.trim()
    );

    if (filledCards.length === 0) {
      alert("⚠️ Vui lòng thêm ít nhất 1 thẻ có nội dung!");
      return;
    }

    setIsSaving(true);

    try {
      if (editDeckId) {
        // --- UPDATE MODE ---

        // 1. Update Deck Details
        const updateDeckData: UpdateDeckDto = {
          title: deckName,
          description: deckDescription || undefined,
          iconName,
          colorCode,
          languageMode,
        };
        await apiClient.patch(`/deck/${editDeckId}`, updateDeckData);

        // 2. Handle Cards (Create, Update, Delete)
        const originalIds = new Set(originalCards.map((c) => c.id));
        const currentIds = new Set(filledCards.map((c) => c.id));

        // Identify actions
        const cardsToCreate = filledCards.filter((c) => !originalIds.has(c.id));
        const cardsToUpdate = filledCards.filter((c) => originalIds.has(c.id));
        const cardsToDelete = originalCards.filter(
          (c) => !currentIds.has(c.id)
        );

        const promises = [];

        // Create new cards
        for (const card of cardsToCreate) {
          const cardData: CreateCardDto = {
            deckId: parseInt(editDeckId),
            front: card.front,
            back: card.back,
            wordType: card.wordType,
            pronunciation: card.pronunciation,
            examples: card.examples?.map((ex) => ({
              sentence: ex.sentence,
              translation: ex.translation,
            })),
          };
          promises.push(apiClient.post("/card", cardData));
        }

        // Update existing cards
        for (const card of cardsToUpdate) {
          const cardData: UpdateCardDto = {
            front: card.front,
            back: card.back,
            wordType: card.wordType,
            pronunciation: card.pronunciation,
            examples: card.examples?.map((ex) => ({
              sentence: ex.sentence,
              translation: ex.translation,
            })),
          };
          promises.push(apiClient.patch(`/card/${card.id}`, cardData));
        }

        // Delete removed cards
        for (const card of cardsToDelete) {
          promises.push(apiClient.delete(`/card/${card.id}`));
        }

        await Promise.all(promises);
        alert(`🎉 Đã cập nhật bộ thẻ "${deckName}" thành công!`);
        router.back();
      } else {
        // --- CREATE MODE ---

        // Step 1: Create the deck
        const deckData: CreateDeckDto = {
          title: deckName,
          description: deckDescription || undefined,
          iconName,
          colorCode,
          languageMode,
        };

        const deckResponse = await apiClient.post<ApiResponseDto<DeckResponse>>(
          "/deck",
          deckData
        );

        if (!deckResponse.data.data) {
          throw new Error(
            "Failed to create deck: Invalid response from server"
          );
        }

        const newDeckId = deckResponse.data.data.id;

        // Step 2: Create cards for the deck
        const cardCreationResults = await Promise.allSettled(
          filledCards.map((card) => {
            const cardData: CreateCardDto = {
              deckId: newDeckId,
              front: card.front,
              back: card.back,
              wordType: card.wordType,
              pronunciation: card.pronunciation,
              examples: card.examples?.map((ex) => ({
                sentence: ex.sentence,
                translation: ex.translation,
              })),
            };

            return apiClient.post<ApiResponseDto<CardResponse>>(
              "/card",
              cardData
            );
          })
        );

        const successfulCards = cardCreationResults.filter(
          (result) => result.status === "fulfilled"
        ).length;
        const failedCards = cardCreationResults.filter(
          (result) => result.status === "rejected"
        ).length;

        if (failedCards === 0) {
          alert(
            `🎉 Đã tạo bộ thẻ "${deckName}" với ${successfulCards} thẻ thành công!`
          );
          router.back();
        } else if (successfulCards > 0) {
          alert(
            `⚠️ Đã tạo bộ thẻ "${deckName}" nhưng chỉ ${successfulCards}/${filledCards.length} thẻ được tạo thành công. ${failedCards} thẻ bị lỗi.`
          );
          router.back();
        } else {
          alert(
            `❌ Đã tạo bộ thẻ "${deckName}" nhưng không thể tạo thẻ nào. Vui lòng thử lại sau.`
          );
          router.back();
        }
      }
    } catch (error: any) {
      console.error("Error saving deck:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      alert(`❌ Lỗi khi lưu bộ thẻ: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    iconName,
    setIconName,
    colorCode,
    setColorCode,
    languageMode,
    setLanguageMode,
    cards,
    isSaving,
    isLoading,
    handleImportJSON,
    addCard,
    deleteCard,
    updateCard,
    handleSave,
  };
};
