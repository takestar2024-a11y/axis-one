const STEPS = [
  {
    label: "You write",
    body: "Two paragraphs: what you are trying to win at, and what is in the way. No brief, no deck.",
  },
  {
    label: "We answer",
    body: "Within two working days — a first read of your axis, or a straight no with the reason.",
  },
  {
    label: "We sit down",
    body: "Ninety minutes with the people who decide. Paid work starts after that session, never before it.",
  },
];

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 68%)",
        }}
      />

      <div className="shell">
        <div className="reveal grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-24">
          <div>
            <p className="eyebrow">07 / Start</p>
            <h2 className="mt-7 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.035em] text-balance">
              Find your axis.
              <br />
              <span className="text-muted">Then build on it.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              We take on a small number of engagements at a time, because we
              build rather than advise. If the axis is already clear to you, say
              so — we will tell you honestly whether you need us.
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-4">
              <a
                href="mailto:hello@axis-one.example.com"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-base transition-opacity hover:opacity-90"
              >
                hello@axis-one.example.com
              </a>
              <a
                href="#axis-core"
                className="rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-ink"
              >
                Run Axis Core first
              </a>
            </div>
          </div>

          <ol className="border-t border-line">
            {STEPS.map((step, index) => (
              <li
                key={step.label}
                className="grid gap-3 border-b border-line py-6 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-6"
              >
                <span className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-mono text-xs tracking-[0.2em] uppercase">
                    {step.label}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
