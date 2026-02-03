import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="cta" className="py-20">
      <div className="container">
        <div className="rounded-2xl border bg-muted/40 p-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to wire in your strategy?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Add your integrations when you are ready—this foundation is prepared for API
            expansion and real-time experiences.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg">Talk to us</Button>
            <Button variant="outline" size="lg">
              Explore roadmap
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
