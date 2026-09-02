const META = [
  { label: "Engagement", value: "From two weeks" },
  { label: "Method", value: "Built, not advised" },
  { label: "Team", value: "Senior, end to end" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-line"
    >
      {/* Column rules and a single warm light source, behind everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "clamp(5rem, 14vw, 12rem) 100%",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 68%)",
        }}
      />

      <div className="shell grid gap-16 pt-28 pb-20 md:pt-36 md:pb-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-24">
        <div className="max-w-3xl">
          <p className="eyebrow animate-rise">AI-native product studio</p>

          <h1
            className="animate-rise mt-7 text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.98] font-medium tracking-[-0.035em] text-balance"
            style={{ animationDelay: "80ms" }}
          >
            Every system has an axis.
            <br />
            <span className="text-muted">Most companies never find theirs.</span>
          </h1>

          <p
            className="animate-rise mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            We work with teams who are done shipping AI features. Together we
            find the one decision the business turns on — then build the system
            that runs on it.
          </p>

          <div
            className="animate-rise mt-11 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#axis-core"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-base transition-opacity hover:opacity-90"
            >
              Run Axis Core
            </a>
            <a
              href="#work"
              className="rounded-full border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-ink"
            >
              See selected work
            </a>
          </div>
        </div>

        {/* The axis itself: one line, three planes. */}
        <div
          aria-hidden="true"
          className="animate-rise relative hidden self-center lg:block"
          style={{ animationDelay: "320ms" }}
        >
          <div className="relative flex h-[19rem] w-56 flex-col justify-between">
            <div className="animate-draw absolute top-0 bottom-0 left-[7px] w-px origin-top bg-gradient-to-b from-accent via-line to-transparent" />
            {["Intent", "System", "Surface"].map((plane, index) => (
              <div key={plane} className="relative flex items-center gap-5">
                <span
                  className={`h-[15px] w-[15px] rounded-full border ${
                    index === 0
                      ? "border-accent bg-accent"
                      : "border-line bg-base"
                  }`}
                />
                <span className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                  {plane}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shell hairline grid grid-cols-1 gap-px sm:grid-cols-3">
        {META.map((item) => (
          <div key={item.label} className="py-6 sm:py-8">
            <p className="eyebrow">{item.label}</p>
            <p className="mt-2 text-base text-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
