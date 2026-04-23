"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { LoginForm } from "@/src/components/auth/LoginForm";

export default function LoginPage() {
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
