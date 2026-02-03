import { Button } from "@/components/ui/button";

export function ApiReadySection() {
  return (
    <section id="api" className="py-20">
      <div className="container grid gap-8 lg:grid-cols-[1fr,0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            API ready
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Plug in data, brokers, and analytics when you are ready.
          </h2>
          <p className="text-muted-foreground">
            The app ships with a lightweight client shell and placeholders for future service
            adapters so you can keep infrastructure decisions open.
          </p>
          <Button variant="secondary">See integration plan</Button>
        </div>
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-dashed p-4">
              <p className="font-medium text-foreground">/src/lib/api</p>
              <p>Organize API clients, adapters, and typed contracts here.</p>
            </div>
            <div className="rounded-lg border border-dashed p-4">
              <p className="font-medium text-foreground">/src/app/api</p>
              <p>Optional server routes for proxying or internal services.</p>
            </div>
            <div className="rounded-lg border border-dashed p-4">
              <p className="font-medium text-foreground">/src/components</p>
              <p>UI blocks stay framework-friendly and data agnostic.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
