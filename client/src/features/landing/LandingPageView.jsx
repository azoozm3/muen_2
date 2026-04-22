import LandingHero from "@/features/landing/components/LandingHero";
import LandingAbout from "@/features/landing/components/LandingAbout";
import LandingServices from "@/features/landing/components/LandingServices";
import LandingWorkflow from "@/features/landing/components/LandingWorkflow";
import LandingCTA from "@/features/landing/components/LandingCTA";
import LandingFooter from "@/features/landing/components/LandingFooter";

export default function LandingPageView() {
  return (
    <div className="min-h-screen bg-background">
      <main className="space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <LandingHero />
          <LandingAbout />
          <LandingServices />
          <LandingWorkflow />
          <LandingCTA />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}