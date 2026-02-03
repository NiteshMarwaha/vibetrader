import { ApiReadySection } from "@/components/landing/api-ready";
import { CtaSection } from "@/components/landing/cta";
import { FeaturesSection } from "@/components/landing/features";
import { HeroSection } from "@/components/landing/hero";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <ApiReadySection />
      <CtaSection />
    </div>
  );
}
