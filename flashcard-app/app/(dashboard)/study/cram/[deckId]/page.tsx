"use client";

import React from "react";
import { useParams } from "next/navigation";
import CramSession from "@/src/components/study/CramSession";

export default function CramPage() {
  const params = useParams();
  const deckId = params.deckId as string;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CramSession deckId={deckId} />
    </div>
  );
}
