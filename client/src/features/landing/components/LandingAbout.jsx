import { aboutData } from "@/features/landing/landing.data";

export default function LandingAbout() {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            {aboutData.eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {aboutData.title}
          </h2>
        </div>

        <p className="text-lg leading-8 text-muted-foreground">
          {aboutData.description}
        </p>
      </div>
    </section>
  );
}