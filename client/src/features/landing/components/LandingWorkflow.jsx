import { workflowSteps } from "@/features/landing/landing.data";

export default function LandingWorkflow() {
  return (
    <section id="how-it-works" className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          How it works
        </p>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          A simple path from request to support.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workflowSteps.map((step) => (
          <div
            key={step.number}
            className="rounded-[1.5rem] border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 text-sm font-bold tracking-[0.2em] text-primary">
              {step.number}
            </div>

            <h3 className="text-xl font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}