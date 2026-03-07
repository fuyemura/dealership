import { Navbar } from "@/components/features/landing/navbar";
import { HeroSection } from "@/components/features/landing/hero-section";
import { FeaturesSection } from "@/components/features/landing/features-section";
import { WhyChooseSection } from "@/components/features/landing/why-choose-section";
import { PricingSection } from "@/components/features/landing/pricing-section";
import { CtaSection } from "@/components/features/landing/cta-section";
import { Footer } from "@/components/features/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhyChooseSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
