const features = [
  {
    title: "Composable layout",
    description:
      "Reusable sections and clear layout primitives keep the UI modular and easy to extend.",
  },
  {
    title: "Dark mode ready",
    description:
      "Theme tokens are wired for instant light/dark switching across every component.",
  },
  {
    title: "API-ready foundation",
    description:
      "Client utilities are prepared for future integrations without coupling to business logic.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container space-y-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Built to scale
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to launch quickly.
          </h2>
          <p className="text-muted-foreground">
            A clean structure keeps teams moving fast while leaving the strategy layer open for
            future business logic.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-background p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
