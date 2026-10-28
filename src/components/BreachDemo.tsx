import { useEffect, useRef, useState } from "react";
import type { Copy } from "../i18n";

const STEP_MS = 450;
const HOLD_STEPS = 10; // pause on the finished screen before replaying

// Two terminals replay the same attack side by side: a memory dump on a
// typical cloud leaks plaintext, the same dump on securify yields ciphertext.
export default function BreachDemo({ t }: { t: Copy }) {
  const b = t.breach;
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const total = b.commands.length + b.panes[0].lines.length + 1;

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce || !("IntersectionObserver" in window)) {
      setStep(total);
      return;
    }
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [total]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setStep((s) => (s >= total + HOLD_STEPS ? 0 : s + 1)), STEP_MS);
    return () => clearInterval(id);
  }, [running, total]);

  const shown = Math.min(step, total);
  const cmdCount = Math.min(shown, b.commands.length);
  const lineCount = Math.max(0, Math.min(shown - b.commands.length, b.panes[0].lines.length));
  const done = shown >= total;

  return (
    <section id="breach" className="bg-black py-20 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <p className="eyebrow">{b.eyebrow}</p>
        <h2 className="hero-title text-4xl md:text-6xl font-medium max-w-4xl">{b.title}</h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-snug text-white/90">{b.body}</p>

        <div ref={ref} className="mt-14 grid gap-4 md:grid-cols-2">
          {b.panes.map((pane, i) => {
            const safe = i === 1;
            return (
              <div
                key={pane.label}
                className={`rounded-3xl border bg-neutral-950 overflow-hidden ${
                  safe ? "border-sky-400/40 shadow-[0_0_60px_-20px_rgba(56,189,248,0.5)]" : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="ml-3 text-sm">{pane.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[11px] rounded-full px-3 py-1 ${
                      safe ? "bg-sky-400/15 text-sky-300" : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {pane.status}
                  </span>
                </div>
                <pre className="font-mono text-[12px] md:text-[13px] leading-relaxed p-5 min-h-[260px] whitespace-pre-wrap break-all">
                  {b.commands.slice(0, cmdCount).map((c) => (
                    <div key={c} className="text-white/60">{c}</div>
                  ))}
                  {pane.lines.slice(0, lineCount).map((l) => (
                    <div key={l} className={safe ? "text-sky-300/80" : "text-red-300"}>{l}</div>
                  ))}
                  {done ? (
                    <div className={`mt-3 font-medium ${safe ? "text-sky-300" : "text-red-400"}`}>{pane.verdict}</div>
                  ) : (
                    <span className="terminal-caret" aria-hidden="true" />
                  )}
                </pre>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-white/40">※ {b.note}</p>
      </div>
    </section>
  );
}
