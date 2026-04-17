"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { RegisterForm } from "@/src/components/auth/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Don't render the form if user is logged in (will redirect)
  if (user) {
    return null;
  }

  const features = [
    { icon: "✨", text: "Hoàn toàn miễn phí, không giới hạn" },
    { icon: "🎯", text: "Tạo và quản lý flashcard dễ dàng" },
    { icon: "📊", text: "Theo dõi tiến độ chi tiết" },
    { icon: "🧠", text: "Thuật toán SM-2 thông minh" },
  ];

  return (
    <AuthLayout
      title="Bắt đầu hành trình học tập! 🚀"
      subtitle="Tham gia cùng hàng nghìn người học đang cải thiện vốn từ vựng mỗi ngày."
      features={features}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
