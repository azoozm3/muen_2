import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ctaData } from "@/features/landing/landing.data";

export default function LandingCTA() {
  const [, navigate] = useLocation();

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {ctaData.title}
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {ctaData.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className="rounded-xl px-6"
            onClick={() => navigate("/signup")}
          >
            {ctaData.primaryAction.label}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-xl px-6"
            onClick={() => navigate("/signin")}
          >
            {ctaData.secondaryAction.label}
          </Button>
        </div>
      </div>
    </section>
  );
}