import { Header } from "@/components/Header";
import { HeroAttestiva } from "@/components/HeroAttestiva";
import { GreenGradientHero } from "@/components/sections/GreenGradientHero";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { ComprehensionLiftSection } from "@/components/sections/ComprehensionLiftSection";
import LegalHandOffSectionA from "@/components/sections/LegalHandOffSectionA";
import { ComplianceImpactChartsSection } from "@/components/sections/ComplianceImpactChartsSection";
import { ChartStyleExamplesSection } from "@/components/sections/ChartStyleExamplesSection";
import { PoweredByRiata } from "@/components/PoweredByRiata";
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
        <ComprehensionLiftSection />
        <LegalHandOffSectionA />
        <ComplianceImpactChartsSection />
        <ChartStyleExamplesSection />
        <PoweredByRiata />
        <PricingSection />
      </div>
      <Footer />
    </main>
  );
}
