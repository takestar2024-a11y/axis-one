const ENGAGEMENTS = [
  {
    name: "Axis Sprint",
    duration: "2 weeks",
    body: "We read the three planes with the people who actually decide, then hand back the axis in writing: what you win on, what that rules out, and the first system worth building.",
    deliverables: [
      "Axis statement",
      "Plane reading",
      "Decision map",
      "Build plan",
    ],
  },
  {
    name: "Core Build",
    duration: "8–14 weeks",
    body: "We build the system the axis implies — instrumentation, data capture, the model layer, an evaluation harness, and the surface people use without being asked to.",
    deliverables: [
      "Production system",
      "Eval harness",
      "Instrumented workflow",
      "Team handover",
    ],
  },
  {
    name: "Embedded Axis",
    duration: "Ongoing",
    body: "A senior pair inside your team holding the loop: evals reviewed weekly, model changes absorbed before they bite, the surface tightened against real usage.",
    deliverables: [
      "Weekly eval review",
      "Model migration",
      "Loop-based planning",
      "On-call for the core",
    ],
  },
  {
    name: "Systems Audit",
    duration: "3 weeks",
    body: "For teams already running AI in production with no way to tell whether it is improving. We establish the baseline, name the failure modes, and sequence the fixes.",
    deliverables: [
      "Eval baseline",
      "Failure taxonomy",
      "Cost and latency profile",
      "Remediation sequence",
    ],
  },
];

export default function WhatWeBuild() {
  return (
    <section id="build" className="border-b border-line py-24 md:py-32">
      <div className="shell">
        <div className="reveal grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <p className="eyebrow lg:pt-3">04 / What We Build</p>
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
              Four ways in. All of them end in something running.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted">
              We do not sell strategy decks and we do not staff bodies. Every
              engagement ends with a system in production, an evaluation that
              proves it works, and a team that can carry it without us.
            </p>
          </div>
        </div>

        <div className="mt-20 grid border-t border-line md:mt-24 md:grid-cols-2">
          {ENGAGEMENTS.map((engagement) => (
            <article
              key={engagement.name}
              className="reveal flex flex-col gap-6 border-b border-line px-0 py-10 md:px-10 md:odd:border-r md:odd:pl-0 md:even:pr-0"
            >
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="text-2xl font-medium tracking-[-0.02em]">
                  {engagement.name}
                </h3>
                <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
                  {engagement.duration}
                </p>
              </div>

              <p className="max-w-xl leading-relaxed text-muted">
                {engagement.body}
              </p>

              <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                {engagement.deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.06em] text-muted"
                  >
                    {deliverable}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
