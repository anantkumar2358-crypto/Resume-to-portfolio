"use client";

import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <ProblemSolution />
      <BentoGrid />
      <CTASection />
      <Footer />
    </div>
  );
}
