import { PLANES } from "@/lib/axis-core";

export default function TheAxis() {
  return (
    <section id="axis" className="border-b border-line py-24 md:py-32">
      <div className="shell">
        <div className="reveal grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <p className="eyebrow lg:pt-3">02 / The Axis</p>
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
              One axis. Three planes. Everything else is detail.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted">
              An axis is the line a company turns on: the single thing that,
              once decided, decides a hundred smaller questions for you. It runs
              through three planes. Strength in one plane cannot cover weakness
              in another — a sharp strategy on unusable data is a memo, and a
              beautiful interface over a system that never learns is a
              screenshot.
            </p>
          </div>
        </div>

        <div className="mt-20 md:mt-24">
          {PLANES.map((plane, index) => (
            <article
              key={plane.id}
              className="reveal group relative grid gap-6 border-t border-line py-10 last:border-b md:grid-cols-[3rem_16rem_minmax(0,1fr)] md:gap-10"
            >
              <div className="flex items-center gap-4 md:block">
                <span className="font-mono text-xs text-accent">
                  {String(plane.position).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">
                {plane.name}
              </h3>

              <div className="max-w-2xl">
                <p className="text-lg leading-relaxed text-ink">
                  {plane.claim}
                </p>
                <p className="mt-4 flex gap-3 leading-relaxed text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-6 shrink-0 bg-accent"
                  />
                  <span>
                    <span className="text-ink/70">When it is weakest: </span>
                    {plane.drift}
                  </span>
                </p>
              </div>

              {index === 0 ? null : (
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-[3px] hidden h-px w-6 bg-accent md:block"
                />
              )}
            </article>
          ))}
        </div>

        <p className="reveal mt-12 max-w-2xl text-muted">
          Every engagement starts by reading these three planes honestly. You can
          start that yourself, right now.
        </p>
      </div>
    </section>
  );
}
