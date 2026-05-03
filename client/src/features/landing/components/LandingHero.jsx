import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { heroData, heroHighlights } from "@/features/landing/landing.data";
import { HeartPulse } from "lucide-react";
import logo from "@/assets/logo.png";

export default function LandingHero() {
  const [, navigate] = useLocation();

  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-8 lg:p-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-primary">
            <HeartPulse className="h-4 w-4" />
            <span>{heroData.badge}</span>
          </div>

          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              {heroData.title}
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              {heroData.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-xl px-6"
              onClick={() => navigate("/signup")}
            >
              {heroData.primaryAction.label}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-xl px-6"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {heroData.secondaryAction.label}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
          {heroHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.5rem] border bg-background p-5 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}