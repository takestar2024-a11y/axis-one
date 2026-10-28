import type { Copy } from "../i18n";
import { VIDEO } from "./Hero";
import MotionImage from "./MotionImage";
import { showcase } from "../showcase";

const wrap = "mx-auto w-full max-w-6xl px-6 md:px-10";
const eyebrow = "eyebrow";
const h2 = "hero-title text-4xl md:text-6xl font-medium max-w-3xl";
const cta =
  "inline-flex items-center justify-center bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors";
const ctaGhost =
  "inline-flex items-center justify-center bg-neutral-900/90 text-white text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-800 transition-colors";

export function Trust({ t }: { t: Copy }) {
  return (
    <section className="bg-black pb-20 md:pb-28">
      <div className={wrap}>
        <p className="text-xs md:text-sm text-white/70 text-center">{t.trust.label}</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {t.trust.names.map((n) => (
            <span key={n} className="text-lg md:text-xl font-medium tracking-tight text-white/40">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Problem({ t }: { t: Copy }) {
  return (
    <section className="bg-black py-20 md:py-32">
      <div className={wrap}>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className={eyebrow}>{t.problem.eyebrow}</p>
            <h2 className={h2}>{t.problem.title}</h2>
            <p className="mt-6 max-w-xl text-[15px] leading-snug text-white/90">{t.problem.body}</p>
          </div>
          <MotionImage {...showcase.strategy} />
        </div>
        <div className="mt-14 grid gap-px md:grid-cols-3 bg-white/10 rounded-3xl overflow-hidden">
          {t.problem.points.map((p) => (
            <div key={p.k} className="bg-black p-8 md:p-10">
              <div className="hero-title text-5xl md:text-6xl font-medium">{p.k}</div>
              <p className="mt-4 text-sm text-white/70 max-w-[220px]">{p.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Features({ t }: { t: Copy }) {
  return (
    <section id="features" className="bg-black py-20 md:py-32">
      <div className={wrap}>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <MotionImage {...showcase.threats} className="order-last md:order-first" />
          <div>
            <p className={eyebrow}>{t.features.eyebrow}</p>
            <h2 className={h2}>{t.features.title}</h2>
          </div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {t.features.items.map((f, i) => (
            <article
              key={f.title}
              className="rounded-3xl bg-neutral-900/90 p-8 min-h-[260px] flex flex-col justify-between border border-white/5 hover:border-white/20 transition-colors"
            >
              <span className="text-sm text-white/40">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl font-medium tracking-tight">{f.title}</h3>
                <p className="mt-3 text-sm leading-snug text-white/70">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Confidential({ t }: { t: Copy }) {
  const c = t.confidential;
  return (
    <section id="confidential" className="bg-black py-20 md:py-32">
      <div className={wrap}>
        <div className="flex items-center gap-3 mb-4">
          <p className="eyebrow !mb-0">{c.eyebrow}</p>
          <span className="font-mono text-[11px] border border-sky-400/50 text-sky-300 rounded-full px-3 py-1">{c.badge}</span>
        </div>
        <h2 className={h2}>{c.title}</h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-snug text-white/90">{c.body}</p>

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900/90 text-white/70">
              <tr>
                {c.headers.map((h) => (
                  <th key={h} scope="col" className="px-4 md:px-8 py-4 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {c.rows.map(([state, legacy, ours]) => (
                <tr key={state}>
                  <th scope="row" className="px-4 md:px-8 py-5 font-medium">{state}</th>
                  <td className="px-4 md:px-8 py-5 text-white/70">{legacy}</td>
                  <td className="px-4 md:px-8 py-5">{ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-20 text-2xl md:text-3xl font-medium tracking-tight">{c.layersTitle}</h3>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {c.layers.map((l, i) => (
            <li
              key={l.title}
              className={`rounded-3xl p-8 ${i === 1 ? "bg-white text-black" : "bg-neutral-900/90"}`}
            >
              <span className={`text-sm ${i === 1 ? "text-black/50" : "text-white/40"}`}>layer {i + 1}</span>
              <h4 className="mt-6 text-xl font-medium tracking-tight">{l.title}</h4>
              <p className={`mt-3 text-sm leading-snug ${i === 1 ? "text-black/70" : "text-white/70"}`}>{l.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-xs text-white/40 max-w-2xl">※ {c.note}</p>
      </div>
    </section>
  );
}

export function How({ t }: { t: Copy }) {
  return (
    <section id="how" className="bg-black py-20 md:py-32">
      <div className={wrap}>
        <p className={eyebrow}>{t.how.eyebrow}</p>
        <h2 className={h2}>{t.how.title}</h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <li key={s.title} className="border-t border-white/40 pt-6">
              <span className="text-4xl md:text-5xl font-medium tracking-tight">{i + 1}</span>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-snug text-white/70 max-w-xs">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Numbers({ t }: { t: Copy }) {
  return (
    <section className="bg-black py-20 md:py-28">
      <div className={`${wrap} grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6`}>
        {t.numbers.map((n) => (
          <div key={n.label}>
            <div className="hero-title text-4xl md:text-6xl font-medium">{n.value}</div>
            <p className="mt-2 text-xs md:text-sm text-white/70 max-w-[180px]">{n.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Voices({ t }: { t: Copy }) {
  return (
    <section className="bg-black py-20 md:py-32">
      <div className={wrap}>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className={eyebrow}>{t.voices.eyebrow}</p>
            <h2 className={h2}>{t.voices.title}</h2>
          </div>
          <MotionImage {...showcase.confidence} className="max-w-md md:ml-auto" />
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {t.voices.items.map((v) => (
            <figure key={v.name} className="rounded-3xl bg-neutral-900/90 p-8 flex flex-col justify-between gap-10">
              <blockquote className="text-[15px] leading-snug text-white/90">“{v.quote}”</blockquote>
              <figcaption>
                <div className="text-sm font-medium">{v.name}</div>
                <div className="text-xs text-white/70 mt-1">{v.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing({ t }: { t: Copy }) {
  return (
    <section id="pricing" className="bg-black py-20 md:py-32">
      <div className={wrap}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
          <MotionImage {...showcase.investment} className="order-last md:order-first max-w-md" />
          <div>
            <p className={eyebrow}>{t.pricing.eyebrow}</p>
            <h2 className={h2}>{t.pricing.title}</h2>
            <p className="mt-6 text-[15px] text-white/70">{t.pricing.note}</p>
          </div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3 items-stretch">
          {t.pricing.plans.map((p, i) => {
            const featured = i === 1;
            return (
              <div
                key={p.name}
                className={`rounded-3xl p-8 flex flex-col ${
                  featured ? "bg-white text-black" : "bg-neutral-900/90 text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium tracking-tight">{p.name}</h3>
                  {featured && (
                    <span className="text-xs bg-black text-white rounded-full px-3 py-1">{t.pricing.popular}</span>
                  )}
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="hero-title text-4xl md:text-5xl font-medium">{p.price}</span>
                  <span className={`text-sm ${featured ? "text-black/60" : "text-white/70"}`}>{p.unit}</span>
                </div>
                <p className={`mt-4 text-sm leading-snug ${featured ? "text-black/70" : "text-white/70"}`}>{p.body}</p>
                <ul className="mt-8 space-y-3 text-sm flex-1">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span aria-hidden="true">+</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`mt-10 inline-flex items-center justify-center text-sm rounded-full px-6 py-3 transition-colors ${
                    featured
                      ? "bg-black text-white hover:bg-neutral-800"
                      : "bg-white text-black hover:bg-neutral-200"
                  }`}
                >
                  {p.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Faq({ t }: { t: Copy }) {
  return (
    <section id="faq" className="bg-black py-20 md:py-32">
      <div className={`${wrap} grid gap-12 md:grid-cols-[1fr_1.4fr]`}>
        <div>
          <p className={eyebrow}>{t.faq.eyebrow}</p>
          <h2 className="hero-title text-4xl md:text-6xl font-medium">{t.faq.title}</h2>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {t.faq.items.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium tracking-tight">
                {f.q}
                <span className="text-white/70 group-open:rotate-45 inline-block" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-snug text-white/70 max-w-xl">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ t }: { t: Copy }) {
  return (
    <section className="bg-black py-20 md:py-32">
      <div className={wrap}>
        <div className="relative overflow-hidden rounded-[2rem] bg-neutral-900 px-8 md:px-16 py-16 md:py-20 border border-white/5">
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            autoPlay
            loop
            muted
            playsInline
            src={VIDEO}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          <div className="relative grid gap-12 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="text-center md:text-left">
              <h2 className="hero-title text-5xl md:text-7xl font-medium">{t.finalCta.title}</h2>
              <p className="mx-auto md:mx-0 mt-6 max-w-xl text-[15px] leading-snug text-white/70">{t.finalCta.body}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <a href="#pricing" className={cta}>{t.finalCta.primary}</a>
                <a href="#faq" className={ctaGhost}>{t.finalCta.secondary}</a>
              </div>
            </div>
            <MotionImage {...showcase.consult} href="#pricing" className="mx-auto w-full max-w-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ t }: { t: Copy }) {
  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className={`${wrap} grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]`}>
        <div>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 256 256" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#ffffff"
                d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z"
              />
            </svg>
            <span className="text-sm tracking-tight">securify</span>
          </div>
          <p className="mt-4 text-sm text-white/70 max-w-[240px]">{t.footer.tagline}</p>
        </div>
        {t.footer.groups.map((g) => (
          <div key={g.title}>
            <h4 className="text-sm text-white/70">{g.title}</h4>
            <ul className="mt-4 space-y-3">
              {g.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-neutral-300 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`${wrap} mt-16 text-xs text-white/40`}>{t.footer.rights}</p>
    </footer>
  );
}
