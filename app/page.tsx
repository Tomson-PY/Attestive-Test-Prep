import { Header } from "@/components/Header";
import { HeroAttestiva } from "@/components/HeroAttestiva";
import { GreenGradientHero } from "@/components/sections/GreenGradientHero";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import LegalHandOffSectionA from "@/components/sections/LegalHandOffSectionA";
import { PoweredByRiata } from "@/components/PoweredByRiata";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ValueCarousel } from "@/components/ValueCarousel";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Header transparent />
      <div className="flex-grow">
        <HeroAttestiva />
        <TestimonialSection />
        <GreenGradientHero />
        <LegalHandOffSectionA />
        <PoweredByRiata />
        <FeatureGrid />
        <ValueCarousel />
        <PricingSection />
      </div>
      <Footer />
    </main>
  );
}
