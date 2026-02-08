import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { ProblemSolution } from "./components/ProblemSolution";
import { StatsSection } from "./components/StatsSection";
import { BentoGrid } from "./components/BentoGrid";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
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