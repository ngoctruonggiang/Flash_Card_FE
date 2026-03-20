import {
  BookOpen,
  Globe,
  GraduationCap,
  Languages,
  Layout,
  Library,
  Lightbulb,
  MessageCircle,
  Music,
  PenTool,
  Rocket,
  School,
  Smile,
  Star,
  Zap,
} from "lucide-react";

export const DECK_ICONS = [
  { name: "book", icon: BookOpen },
  { name: "school", icon: School },
  { name: "graduation-cap", icon: GraduationCap },
  { name: "languages", icon: Languages },
  { name: "globe", icon: Globe },
  { name: "library", icon: Library },
  { name: "lightbulb", icon: Lightbulb },
  { name: "rocket", icon: Rocket },
  { name: "star", icon: Star },
  { name: "zap", icon: Zap },
  { name: "smile", icon: Smile },
  { name: "music", icon: Music },
  { name: "message-circle", icon: MessageCircle },
  { name: "pen-tool", icon: PenTool },
  { name: "layout", icon: Layout },
];

export const DECK_COLORS = [
  { name: "Blue", code: "#3B82F6", class: "from-blue-500 to-cyan-500" },
  { name: "Red", code: "#EF4444", class: "from-red-500 to-orange-500" },
  { name: "Green", code: "#10B981", class: "from-green-500 to-emerald-500" },
  { name: "Yellow", code: "#F59E0B", class: "from-yellow-500 to-orange-500" },
  { name: "Purple", code: "#8B5CF6", class: "from-purple-500 to-indigo-500" },
  { name: "Pink", code: "#EC4899", class: "from-pink-500 to-rose-500" },
  { name: "Indigo", code: "#6366F1", class: "from-indigo-500 to-blue-500" },
  { name: "Orange", code: "#F97316", class: "from-orange-500 to-red-500" },
];

export const getDeckColorClass = (hex?: string) => {
  if (!hex) return DECK_COLORS[0].class;
  const color = DECK_COLORS.find((c) => c.code === hex);
  return color ? color.class : DECK_COLORS[0].class;
};

export const getDeckIcon = (name?: string) => {
  if (!name) return BookOpen;
  const icon = DECK_ICONS.find((i) => i.name === name);
  return icon ? icon.icon : BookOpen;
};
