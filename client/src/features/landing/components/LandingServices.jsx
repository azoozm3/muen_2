import { servicesData } from "@/features/landing/landing.data";

export default function LandingServices() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Services
        </p>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything important is grouped into one clear journey.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {servicesData.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.5rem] border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <Icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}