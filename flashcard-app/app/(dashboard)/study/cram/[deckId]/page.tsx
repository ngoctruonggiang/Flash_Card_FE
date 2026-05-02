"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProtectedRoute } from "@/src/hooks/useProtectedRoute";
import CramSession from "@/src/components/study/CramSession";

export default function CramPage() {
  const { isLoading: isCheckingAuth } = useProtectedRoute();
  const params = useParams();
  const deckId = params.deckId as string;

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CramSession deckId={deckId} />
    </div>
  );
}
