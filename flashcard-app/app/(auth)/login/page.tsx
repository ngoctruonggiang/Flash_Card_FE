"use client";

import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { LoginForm } from "@/src/components/auth/LoginForm";

export default function LoginPage() {
  const features = [
    { icon: "🎯", text: "Theo dõi tiến độ học tập chi tiết" },
    { icon: "🧠", text: "Thuật toán SM-2 thông minh" },
    { icon: "⚡", text: "Học nhanh hơn, nhớ lâu hơn" },
  ];

  return (
    <AuthLayout
      title="Chào mừng trở lại! 👋"
      subtitle="Tiếp tục hành trình học tập của bạn với phương pháp Spaced Repetition hiệu quả nhất."
      features={features}
    >
      <LoginForm />
    </AuthLayout>
  );
}
