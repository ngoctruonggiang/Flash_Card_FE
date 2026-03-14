import { useState, useEffect } from "react";
import { Brain, Zap, Target, Award } from "lucide-react";

const flashcards = [
  { front: "Xin chào", back: "Hello", emoji: "👋" },
  { front: "Học", back: "Learn", emoji: "📚" },
  { front: "Thành công", back: "Success", emoji: "🎯" },
];

const features = [
  {
    icon: Brain,
    title: "Spaced Repetition (SM-2)",
    description:
      "Thuật toán khoa học giúp bạn ghi nhớ lâu hơn với ít thời gian hơn",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Học nhanh, nhớ lâu",
    description: "Tối ưu hóa quá trình học với flashcard thông minh",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Target,
    title: "Theo dõi tiến độ",
    description: "Thống kê chi tiết giúp bạn nắm rõ quá trình học tập",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Award,
    title: "Tùy chỉnh linh hoạt",
    description: "Tạo bộ thẻ riêng, import/export dễ dàng",
    color: "from-green-500 to-emerald-500",
  },
];

const stats = [
  { value: "1000+", label: "Người dùng" },
  { value: "SM-2", label: "Algorithm" },
  { value: "100%", label: "Miễn phí" },
];

export const useLandingPage = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return {
    currentCard,
    isFlipped,
    setIsFlipped,
    flashcards,
    features,
    stats,
  };
};
