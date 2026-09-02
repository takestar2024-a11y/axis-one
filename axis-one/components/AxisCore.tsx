"use client";

import { useRef, useState } from "react";
import {
  PLANES,
  SCALE_LABELS,
  SIGNALS,
  type AxisReading,
  bandLabel,
  signalsFor,
} from "@/lib/axis-core";

type Draft = Record<string, number | undefined>;

const BAND_TONE: Record<AxisReading["band"], string> = {
  aligned: "text-accent",
  holding: "text-ink",
  drifting: "text-ink",
  "off-axis": "text-muted",
};

export default function AxisCore() {
  const [draft, setDraft] = useState<Draft>({});
  const [reading, setReading] = useState<AxisReading | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const answered = SIGNALS.filter(
    (signal) => draft[signal.id] !== undefined,
  ).length;
  const complete = answered === SIGNALS.length;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!complete || pending) return;

    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/axis-core", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ responses: draft }),
      });
      const payload: { reading?: AxisReading; error?: string } =
        await response.json();

      if (!response.ok || !payload.reading) {
        throw new Error(payload.error ?? "The reading could not be scored.");
      }

      setReading(payload.reading);
      // Move focus to the result so keyboard and screen-reader users land on it.
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The reading could not be scored.",
      );
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setDraft({});
    setReading(null);
    setError(null);
  }

  return (
    <section id="axis-core" className="border-b border-line py-24 md:py-32">
      <div className="shell">
        <div className="reveal grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <p className="eyebrow lg:pt-3">03 / Axis Core</p>
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
              Read your own axis in two minutes.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted">
              Nine statements, three planes, one index. Answer as the company
              is today — not as the deck describes it. Scoring runs server-side
              on the same engine we use in the first week of an engagement.
            </p>
          </div>
        </div>

        <div className="mt-16 border border-line md:mt-20">
          {reading ? (
            <Result
              ref={resultRef}
              reading={reading}
              onReset={reset}
            />
          ) : (
            <form onSubmit={onSubmit}>
              {PLANES.map((plane) => (
                <div key={plane.id} className="border-b border-line">
                  <div className="flex items-baseline justify-between gap-6 bg-raised px-6 py-4 md:px-10">
                    <h3 className="font-mono text-xs tracking-[0.2em] uppercase">
                      {String(plane.position).padStart(2, "0")} — {plane.name}
                    </h3>
                    <p className="hidden text-sm text-muted sm:block">
                      {plane.claim}
                    </p>
                  </div>

                  {signalsFor(plane.id).map((signal) => (
                    <fieldset
                      key={signal.id}
                      className="grid gap-5 border-t border-line px-6 py-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:px-10"
                    >
                      <legend className="sr-only">{signal.statement}</legend>
                      <p aria-hidden="true" className="leading-relaxed">
                        {signal.statement}
                      </p>

                      <div className="flex items-center gap-1.5">
                        {SCALE_LABELS.map((label, value) => (
                          <label
                            key={value}
                            className="cursor-pointer"
                            title={label}
                          >
                            <input
                              type="radio"
                              name={signal.id}
                              value={value}
                              checked={draft[signal.id] === value}
                              onChange={() =>
                                setDraft((current) => ({
                                  ...current,
                                  [signal.id]: value,
                                }))
                              }
                              className="peer sr-only"
                            />
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line font-mono text-xs text-muted transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-base peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink hover:text-ink">
                              {value}
                            </span>
                            <span className="sr-only">{label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              ))}

              <div className="flex flex-col gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-10">
                <p className="font-mono text-xs text-muted">
                  <span className="text-ink">{answered}</span> / {SIGNALS.length}{" "}
                  answered
                  <span className="ml-3 hidden sm:inline">
                    0 = not true · {SCALE_LABELS.length - 1} = true today
                  </span>
                </p>

                <div className="flex items-center gap-4">
                  {error ? (
                    <p role="alert" className="text-sm text-accent">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={!complete || pending}
                    className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-base transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
                  >
                    {pending ? "Reading…" : "Run the reading"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Result({
  ref,
  reading,
  onReset,
}: {
  ref: React.Ref<HTMLDivElement>;
  reading: AxisReading;
  onReset: () => void;
}) {
  return (
    <div ref={ref} tabIndex={-1} className="focus:outline-none">
      <div className="grid gap-10 px-6 py-10 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-14 md:px-10 md:py-12">
        <div>
          <p className="eyebrow">Alignment index</p>
          <p
            className={`mt-3 font-mono text-7xl leading-none tracking-[-0.04em] ${BAND_TONE[reading.band]}`}
          >
            {reading.index}
          </p>
          <p className="mt-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">
            {bandLabel(reading.band)}
          </p>
        </div>

        <div className="max-w-2xl">
          <h3 className="text-2xl leading-tight font-medium tracking-[-0.02em] md:text-3xl">
            {reading.headline}
          </h3>
          <p className="mt-5 leading-relaxed text-muted">{reading.summary}</p>
        </div>
      </div>

      <dl className="border-t border-line">
        {reading.planes.map((plane) => (
          <div
            key={plane.plane}
            className="grid gap-3 border-b border-line px-6 py-6 md:grid-cols-[14rem_minmax(0,1fr)_5rem] md:items-center md:gap-14 md:px-10"
          >
            <dt className="font-mono text-xs tracking-[0.2em] uppercase">
              {plane.name}
            </dt>
            <dd className="order-3 text-sm text-muted md:order-none">
              <div className="h-0.5 w-full bg-line">
                <div
                  className={`h-0.5 ${
                    plane.plane === reading.drift.plane
                      ? "bg-accent"
                      : "bg-ink/70"
                  }`}
                  style={{ width: `${Math.max(plane.score, 2)}%` }}
                />
              </div>
              <p className="mt-3">{plane.note}</p>
            </dd>
            <dd className="font-mono text-sm text-muted md:text-right">
              {plane.score}
            </dd>
          </div>
        ))}
      </dl>

      <div className="px-6 py-10 md:px-10 md:py-12">
        <p className="eyebrow">Next moves</p>
        <ol className="mt-6 grid gap-5">
          {reading.moves.map((move, index) => (
            <li key={move} className="flex gap-5">
              <span className="font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="max-w-3xl leading-relaxed">{move}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-base transition-opacity hover:opacity-90"
          >
            Take this to a conversation
          </a>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-ink"
          >
            Run it again
          </button>
        </div>
      </div>
    </div>
  );
}
