const WORK = [
  {
    sector: "Commercial insurance",
    scope: "Underwriting core",
    year: "2025",
    axis: "We win on the speed of a defensible decision, not the size of the risk book.",
    body: "A twelve-step referral queue became a judgment system: it drafts the rationale, cites the clauses it relied on, and escalates only genuine exceptions.",
    metrics: [
      { value: "6h", label: "Median referral, from 4.5 days" },
      { value: "71%", label: "Cleared without a human touch" },
      { value: "2.4k", label: "Historical cases in the eval suite" },
    ],
  },
  {
    sector: "National logistics",
    scope: "Dispatch surface",
    year: "2025",
    axis: "Driver attention is the scarce resource. Everything else is inventory.",
    body: "A dispatch surface that proposes, explains itself, and hands control back the moment confidence drops — designed around the override, not around the model.",
    metrics: [
      { value: "18%", label: "Fewer late re-routes" },
      { value: "92%", label: "Adoption in six weeks, unmandated" },
      { value: "0", label: "Mandates required to get there" },
    ],
  },
  {
    sector: "B2B software",
    scope: "Support intelligence",
    year: "2024",
    axis: "Support is the fastest research function in the company.",
    body: "Sixty thousand tickets became a labelled decision corpus, a triage model, and a weekly evaluation loop that feeds the product roadmap instead of the backlog.",
    metrics: [
      { value: "38%", label: "Lift in first-contact resolution" },
      { value: "9", label: "Product changes sourced in a quarter" },
      { value: "Weekly", label: "Cadence of the evaluation loop" },
    ],
  },
];

export default function SelectedWork() {
  return (
    <section id="work" className="border-b border-line py-24 md:py-32">
      <div className="shell">
        <div className="reveal grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <p className="eyebrow lg:pt-3">05 / Selected Work</p>
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
              Three axes, found and built on.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted">
              Client names are withheld. The axis is the part worth reading
              anyway — each of these engagements turned on one sentence the
              company had never written down.
            </p>
          </div>
        </div>

        <div className="mt-20 border-t border-line md:mt-24">
          {WORK.map((project, index) => (
            <article
              key={project.sector}
              className="reveal grid gap-8 border-b border-line py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16"
            >
              <div className="flex items-baseline gap-4 lg:block">
                <p className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase lg:mt-4">
                  {project.year}
                </p>
              </div>

              <div className="max-w-3xl">
                <h3 className="text-xl font-medium tracking-[-0.01em]">
                  {project.sector}
                  <span className="text-muted"> — {project.scope}</span>
                </h3>

                <blockquote className="mt-6 border-l border-accent pl-6 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug tracking-[-0.02em] text-balance">
                  “{project.axis}”
                </blockquote>

                <p className="mt-6 leading-relaxed text-muted">{project.body}</p>

                <dl className="mt-9 grid gap-8 sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="sr-only">{metric.label}</dt>
                      <dd>
                        <p className="font-mono text-3xl tracking-[-0.03em]">
                          {metric.value}
                        </p>
                        <p className="mt-2 text-sm leading-snug text-muted">
                          {metric.label}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
