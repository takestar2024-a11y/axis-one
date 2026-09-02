const PRINCIPLES = [
  {
    title: "One axis, or none.",
    body: "A second priority of equal weight is not a strategy, it is a negotiation you will hold again every week. Rank them once, in public, and spend the argument only once.",
  },
  {
    title: "Build the loop before the feature.",
    body: "Anything you cannot measure weekly will drift, and drift stays invisible until it is expensive. The evaluation comes first — it is what makes the next twelve months cheap.",
  },
  {
    title: "The failure state is the product.",
    body: "People decide whether to trust a system by watching what it does when it is wrong. Design the low-confidence path with the same care as the happy one.",
  },
  {
    title: "Legibility beats cleverness.",
    body: "A system your team can explain is a system your team can improve. Anything else is a permanent dependency on us, and we are not interested in being one.",
  },
  {
    title: "Ship into the path people already walk.",
    body: "Adoption you have to announce is not adoption. If the workaround is faster than the product, the workaround is the honest feedback.",
  },
];

export default function Philosophy() {
  return (
    <section id="philosophy" className="border-b border-line py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">06 / Philosophy</p>
          <h2 className="mt-7 text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
            Five things we will not argue about.
          </h2>
          <p className="mt-7 leading-relaxed text-muted">
            Everything else is open — the stack, the sequence, the scope, who
            does what. These five are the reason engagements finish.
          </p>
        </div>

        <ol className="border-t border-line">
          {PRINCIPLES.map((principle, index) => (
            <li
              key={principle.title}
              className="reveal grid gap-4 border-b border-line py-9 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-8"
            >
              <span className="font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-medium tracking-[-0.01em]">
                  {principle.title}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {principle.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
