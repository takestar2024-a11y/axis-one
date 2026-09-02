const SHIFTS = [
  {
    from: "Features",
    to: "Judgment",
    body: "A feature is finished the day it ships. A judgment system is worth more every week it runs. The question stopped being what the product does and became what it decides.",
  },
  {
    from: "Headcount",
    to: "Leverage",
    body: "Capacity used to scale with people. It now scales with how much of the work is legible to a machine. Teams that instrument their decisions pull away from teams that hire against them.",
  },
  {
    from: "Roadmaps",
    to: "Loops",
    body: "A roadmap is a bet on a year that no longer holds still. Ship, measure, feed back — the loop is the only planning unit that survives contact with a model that changes underneath you.",
  },
];

export default function TheShift() {
  return (
    <section id="shift" className="border-b border-line py-24 md:py-32">
      <div className="shell">
        <div className="reveal grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <p className="eyebrow lg:pt-3">01 / The Shift</p>
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
              Software used to be a tool. Now it holds judgment.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted">
              The last decade rewarded companies that shipped features faster
              than their competitors. That edge is spent: the features are
              commodity and the model that writes them is available to everyone.
              What is left to compete on is the quality of the judgment a
              company encodes — and how quickly that judgment improves.
            </p>
          </div>
        </div>

        <ol className="mt-20 grid gap-px md:mt-24">
          {SHIFTS.map((shift, index) => (
            <li
              key={shift.to}
              className="reveal hairline grid gap-6 py-9 md:grid-cols-[3rem_18rem_minmax(0,1fr)] md:items-baseline md:gap-10"
            >
              <span className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="flex items-baseline gap-3 text-xl tracking-[-0.01em]">
                <span className="text-muted line-through decoration-line">
                  {shift.from}
                </span>
                <span aria-hidden="true" className="text-accent">
                  →
                </span>
                <span className="font-medium">{shift.to}</span>
              </p>
              <p className="leading-relaxed text-muted">{shift.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
