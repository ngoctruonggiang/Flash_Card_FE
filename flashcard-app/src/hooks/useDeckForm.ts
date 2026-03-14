import { useState } from "react";
import { useRouter } from "next/navigation";
import { deckApi } from "@/src/api/deckApi";
import { cardApi } from "@/src/api/cardApi";

export interface Card {
  id: string;
  front: string;
  back: string;
}

export const useDeckForm = () => {
  const router = useRouter();
  const [deckName, setDeckName] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [cards, setCards] = useState<Card[]>([
    { id: "1", front: "", back: "" },
    { id: "2", front: "", back: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  // Import từ CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());

      // Parse CSV (format: front,back)
      const importedCards: Card[] = lines
        .map((line, index) => {
          const [front, back] = line.split(",").map((s) => s.trim());
          return {
            id: Date.now().toString() + index,
            front: front || "",
            back: back || "",
          };
        })
        .filter((card) => card.front && card.back);

      if (importedCards.length > 0) {
        setCards([...cards, ...importedCards]);
        alert(`✅ Đã import ${importedCards.length} thẻ từ CSV!`);
      } else {
        alert('⚠️ File CSV không hợp lệ! Format: "Tiếng Việt,English"');
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

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

  // Export CSV
  const handleExportCSV = () => {
    const filledCards = cards.filter((c) => c.front && c.back);
    if (filledCards.length === 0) {
      alert("⚠️ Chưa có thẻ nào để export!");
      return;
    }

    const csv = filledCards
      .map((card) => `${card.front},${card.back}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deckName || "flashcards"}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`📤 Đã export ${filledCards.length} thẻ sang CSV!`);
  };

  // Export JSON
  const handleExportJSON = () => {
    const filledCards = cards.filter((c) => c.front && c.back);
    if (filledCards.length === 0) {
      alert("⚠️ Chưa có thẻ nào để export!");
      return;
    }

    const data = {
      name: deckName,
      description: deckDescription,
      cards: filledCards,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deckName || "deck"}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`📤 Đã export ${filledCards.length} thẻ sang JSON!`);
  };

  const addCard = () => {
    const newCard: Card = {
      id: Date.now().toString(),
      front: "",
      back: "",
    };
    setCards([...cards, newCard]);
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  const updateCard = (id: string, field: "front" | "back", value: string) => {
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
      // Step 1: Create the deck
      const deckResponse = await deckApi.create({
        title: deckName,
        description: deckDescription || undefined,
      });

      // Check if the response data is valid
      if (!deckResponse.data.data) {
        throw new Error("Failed to create deck: Invalid response from server");
      }

      const newDeckId = deckResponse.data.data.id;
      console.log("Deck created:", deckResponse.data.data);

      // Step 2: Create cards for the deck
      const cardCreationResults = await Promise.allSettled(
        filledCards.map((card) =>
          cardApi.create({
            deckId: newDeckId,
            front: card.front,
            back: card.back,
          })
        )
      );

      // Count successful and failed card creations
      const successfulCards = cardCreationResults.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failedCards = cardCreationResults.filter(
        (result) => result.status === "rejected"
      ).length;

      // Show appropriate message based on results
      if (failedCards === 0) {
        alert(
          `🎉 Đã tạo bộ thẻ "${deckName}" với ${successfulCards} thẻ thành công!`
        );
        router.push("/dashboard");
      } else if (successfulCards > 0) {
        alert(
          `⚠️ Đã tạo bộ thẻ "${deckName}" nhưng chỉ ${successfulCards}/${filledCards.length} thẻ được tạo thành công. ${failedCards} thẻ bị lỗi.`
        );
        router.push("/dashboard");
      } else {
        alert(
          `❌ Đã tạo bộ thẻ "${deckName}" nhưng không thể tạo thẻ nào. Vui lòng thử lại sau.`
        );
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error creating deck:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Lỗi từ server";
        alert(`❌ Không thể tạo bộ thẻ: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response
        alert(
          "❌ Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        // Something else happened
        alert("❌ Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    deckName,
    setDeckName,
    deckDescription,
    setDeckDescription,
    cards,
    isSaving,
    handleImportCSV,
    handleImportJSON,
    handleExportCSV,
    handleExportJSON,
    addCard,
    deleteCard,
    updateCard,
    handleSave,
  };
};
