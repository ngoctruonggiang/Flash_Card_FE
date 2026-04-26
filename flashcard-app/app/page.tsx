"use client";

import { useLandingPage } from "@/src/hooks/useLandingPage";
import { LandingNavbar } from "@/src/components/landing/LandingNavbar";
import { HeroSection } from "@/src/components/landing/HeroSection";
import { FeatureSection } from "@/src/components/landing/FeatureSection";
import { CtaSection } from "@/src/components/landing/CtaSection";
import { Footer } from "@/src/components/landing/Footer";
import { BackgroundElements } from "@/src/components/landing/BackgroundElements";

export default function WelcomePage() {
  const { currentCard, isFlipped, setIsFlipped, flashcards, features, stats } =
    useLandingPage();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <BackgroundElements />

      <LandingNavbar />

      <HeroSection
        currentCard={currentCard}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        flashcards={flashcards}
        stats={stats}
      />

      <FeatureSection features={features} />

      <CtaSection />

      <Footer />
    </div>
  );
}
