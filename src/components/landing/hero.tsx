import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-20">
      <div className="container grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Modular trading infrastructure
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Build the next generation of trading experiences faster.
          </h1>
          <p className="text-lg text-muted-foreground">
            VibeTrader brings a scalable UI foundation with dark mode, ready-to-wire API
            surfaces, and composable UI blocks to accelerate product delivery.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg">Start building</Button>
            <Button variant="outline" size="lg">
              View docs
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border bg-muted/40 p-6">
          <div className="space-y-4 rounded-xl border bg-background p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">Live preview</p>
            <div className="grid gap-3">
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-sm font-medium">Portfolio overview</p>
                <p className="text-xs text-muted-foreground">
                  Modules ready for real-time data feeds.
                </p>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-sm font-medium">Signals & alerts</p>
                <p className="text-xs text-muted-foreground">
                  Plug in ML or rules engines later.
                </p>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-sm font-medium">Execution workflows</p>
                <p className="text-xs text-muted-foreground">
                  Keep orchestration decoupled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
