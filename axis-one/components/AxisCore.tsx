"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { useLang } from "@/lib/i18n";
import { UI, localAnswer, type ChatMessage } from "@/lib/axis-core";
import {
  HEADCOUNTS,
  HOUR_BANDS,
  INDUSTRIES,
  MATURITIES,
  PROMPTS,
  RECOMMENDED,
  TASKS,
  tasksFor,
  type Answers,
  type HeadcountId,
  type IndustryId,
  type MaturityId,
  type Reading,
} from "@/lib/diagnosis";

/**
 * AXIS CORE — the assistant.
 *
 * Two modes in one panel. Free chat answers questions; the guided diagnosis
 * runs the five-question version of the paid product, which is the reason the
 * panel exists at all — it demonstrates the offer instead of describing it,
 * and gives the visitor a reason to leave an address.
 *
 * Chat answers come from `/api/axis-core` when a model is connected and from
 * the local knowledge core otherwise. The diagnosis is always scored on the
 * server, so the assumptions behind the arithmetic stay in one place.
 */

const OPEN_EVENT = "axis-core:open";

/** Open the panel from anywhere on the page. */
export function openAxisCore() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/* ---------- minimal Web Speech typings (not in lib.dom) ---------- */
interface SpeechResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
}
type RecognitionCtor = new () => Recognition;

function recognitionCtor(): RecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const subscribeNever = () => () => {};
const hasRecognition = () => recognitionCtor() !== null;
const voiceUnsupported = () => false;

/** `**bold**` is the only markup the core emits. */
function renderMessage(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <b key={index}>{part.slice(2, -2)}</b>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

/** Where the guided diagnosis currently is. `off` means ordinary chat. */
type Flow =
  | { step: "off" }
  | { step: "industry" }
  | { step: "headcount" }
  | { step: "tasks"; picked: string[]; industry: IndustryId }
  | { step: "hours"; queue: string[]; at: number }
  | { step: "maturity" }
  | { step: "email" };

interface Option {
  id: string;
  label: string;
  selected?: boolean;
}

export default function AxisCore() {
  const { lang } = useLang();
  const copy = UI[lang];
  const prompts = PROMPTS[lang];

  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [flow, setFlow] = useState<Flow>({ step: "off" });

  const answers = useRef<{
    industry?: IndustryId;
    headcount?: HeadcountId;
    hours: Record<string, number>;
    maturity?: MaturityId;
  }>({ hours: {} });

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const spokeLast = useRef(false);
  const onlineRef = useRef<boolean | null>(null);
  const busy = useRef(false);

  const touch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const voiceSupported = useSyncExternalStore(
    subscribeNever,
    hasRecognition,
    voiceUnsupported,
  );

  const say = useCallback((content: string) => {
    setTurns((current) => [...current, { role: "assistant", content }]);
  }, []);

  const heard = useCallback((content: string) => {
    setTurns((current) => [...current, { role: "user", content }]);
  }, []);

  /* ---------- speaking ---------- */
  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return;
      const plain = text.replace(/\*\*/g, "").replace(/\n+/g, "。 ").slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(plain);
      utterance.lang = lang === "ja" ? "ja-JP" : "en-US";
      utterance.rate = lang === "ja" ? 1.0 : 1.02;
      utterance.pitch = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [lang],
  );

  /* ---------- free chat ---------- */
  const ask = useCallback(
    async (text: string, viaVoice = false) => {
      const question = text.trim();
      if (!question || busy.current) return;

      busy.current = true;
      spokeLast.current = viaVoice;
      setPending(true);
      setDraft("");
      if (inputRef.current) inputRef.current.style.height = "auto";

      const history = [...turns, { role: "user", content: question } as ChatMessage];
      setTurns(history);

      const settle = (answer: string, live: boolean) => {
        setTurns([...history, { role: "assistant", content: answer }]);
        setOnline(live);
        onlineRef.current = live;
        if (spokeLast.current) speak(answer);
        setPending(false);
        busy.current = false;
      };

      if (onlineRef.current === false) {
        window.setTimeout(() => settle(localAnswer(question, lang), false), 420);
        return;
      }

      try {
        const response = await fetch("/api/axis-core", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history, lang }),
        });
        const payload: { text?: string; error?: string; fallback?: boolean } =
          await response.json();

        if (!response.ok || !payload.text) {
          if (payload.fallback || response.status === 503) {
            settle(localAnswer(question, lang), false);
          } else {
            settle(payload.error ?? copy.error, false);
          }
          return;
        }
        settle(payload.text, true);
      } catch {
        settle(localAnswer(question, lang), false);
      }
    },
    [copy.error, lang, speak, turns],
  );

  /* ---------- the guided diagnosis ---------- */

  const startDiagnosis = useCallback(() => {
    answers.current = { hours: {} };
    say(prompts.intro);
    say(prompts.industry);
    setFlow({ step: "industry" });
  }, [prompts, say]);

  const exitDiagnosis = useCallback(() => {
    setFlow({ step: "off" });
  }, []);

  const submitDiagnosis = useCallback(
    async (email?: string) => {
      const { industry, headcount, maturity, hours } = answers.current;
      if (!industry || !headcount || !maturity) return;

      setPending(true);
      try {
        const response = await fetch("/api/diagnosis", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            answers: { industry, headcount, maturity, hours } satisfies Answers,
            lang,
            email,
          }),
        });
        const payload: { reading?: Reading; error?: string } = await response.json();
        if (!response.ok || !payload.reading) throw new Error(payload.error);

        if (email) {
          say(prompts.emailThanks);
          setFlow({ step: "off" });
          return;
        }

        const reading = payload.reading;
        const breakdown = reading.lines
          .map((line) => `・${line.label} … ${line.savedLow}〜${line.savedHigh}h`)
          .join("\n");
        const next = RECOMMENDED[reading.recommendation][lang];

        say(
          `**${reading.headline}**\n\n${breakdown}\n\n${reading.summary}\n\n` +
            `**${next.name}**\n${next.why}\n\n${prompts.disclaimer}`,
        );
        say(`${prompts.emailAsk}\n${prompts.privacy}`);
        setFlow({ step: "email" });
      } catch {
        say(copy.error);
        setFlow({ step: "off" });
      } finally {
        setPending(false);
      }
    },
    [copy.error, lang, prompts, say],
  );

  /** One tap answers the current question and moves to the next. */
  const choose = useCallback(
    (option: Option) => {
      if (pending) return;

      if (flow.step === "industry") {
        answers.current.industry = option.id as IndustryId;
        heard(option.label);
        say(prompts.headcount);
        setFlow({ step: "headcount" });
        return;
      }

      if (flow.step === "headcount") {
        answers.current.headcount = option.id as HeadcountId;
        heard(option.label);
        say(`${prompts.tasks}\n${prompts.tasksHint}`);
        setFlow({
          step: "tasks",
          picked: [],
          industry: answers.current.industry ?? "other",
        });
        return;
      }

      if (flow.step === "tasks") {
        const picked = flow.picked.includes(option.id)
          ? flow.picked.filter((id) => id !== option.id)
          : flow.picked.length >= 4
            ? flow.picked
            : [...flow.picked, option.id];
        setFlow({ step: "tasks", picked, industry: flow.industry });
        return;
      }

      if (flow.step === "hours") {
        const taskId = flow.queue[flow.at];
        answers.current.hours[taskId] = Number(option.id);
        heard(option.label);
        const next = flow.at + 1;
        if (next < flow.queue.length) {
          const task = TASKS.find((item) => item.id === flow.queue[next]);
          say(prompts.hours(task?.label[lang] ?? ""));
          setFlow({ step: "hours", queue: flow.queue, at: next });
        } else {
          say(prompts.maturity);
          setFlow({ step: "maturity" });
        }
        return;
      }

      if (flow.step === "maturity") {
        answers.current.maturity = option.id as MaturityId;
        heard(option.label);
        setFlow({ step: "off" });
        void submitDiagnosis();
      }
    },
    [flow, heard, lang, pending, prompts, say, submitDiagnosis],
  );

  const confirmTasks = useCallback(() => {
    if (flow.step !== "tasks" || flow.picked.length === 0) return;
    const labels = flow.picked
      .map((id) => TASKS.find((task) => task.id === id)?.label[lang] ?? id)
      .join(" / ");
    heard(labels);
    const first = TASKS.find((task) => task.id === flow.picked[0]);
    say(prompts.hours(first?.label[lang] ?? ""));
    setFlow({ step: "hours", queue: flow.picked, at: 0 });
  }, [flow, heard, lang, prompts, say]);

  /** Options for whichever question is on screen. */
  function currentOptions(): Option[] {
    if (flow.step === "industry") {
      return INDUSTRIES.map((item) => ({ id: item.id, label: item.label[lang] }));
    }
    if (flow.step === "headcount") {
      return HEADCOUNTS.map((item) => ({ id: item.id, label: item.label[lang] }));
    }
    if (flow.step === "tasks") {
      return tasksFor(flow.industry).map((task) => ({
        id: task.id,
        label: task.label[lang],
        selected: flow.picked.includes(task.id),
      }));
    }
    if (flow.step === "hours") {
      return HOUR_BANDS.map((band) => ({
        id: String(band.value),
        label: band.label[lang],
      }));
    }
    if (flow.step === "maturity") {
      return MATURITIES.map((item) => ({ id: item.id, label: item.label[lang] }));
    }
    return [];
  }

  /* ---------- panel open / close ---------- */
  const shut = useCallback(() => {
    setOpen(false);
    window.__lenis?.start();
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (touch) window.__lenis?.stop();
    const focus = window.setTimeout(() => {
      if (!touch) inputRef.current?.focus();
    }, 420);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") shut();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, shut, touch]);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 5200);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [turns, pending, open]);

  /* ---------- voice input ---------- */
  const listen = useCallback(() => {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }
    const Ctor = recognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.lang = lang === "ja" ? "ja-JP" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) void ask(transcript, true);
    };
    try {
      recognition.start();
    } catch {
      // Already running — onend resets the button.
    }
  }, [ask, lang, recording]);

  /* ---------- submitting the composer ---------- */
  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;

    if (flow.step === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        say(prompts.emailInvalid);
        return;
      }
      heard(value);
      setDraft("");
      void submitDiagnosis(value);
      return;
    }
    void ask(value);
  }

  const options = currentOptions();
  const guided = flow.step !== "off" && flow.step !== "email";
  const status = online ? copy.live : copy.local;

  return (
    <>
      <button
        className={`core${ready && !open ? " ready" : ""}`}
        aria-expanded={open}
        aria-controls="jarvis"
        aria-label={copy.open}
        data-cursor="AXIS"
        onClick={() => (open ? shut() : setOpen(true))}
      >
        <span className="halo" aria-hidden="true" />
        <span className="pip" aria-hidden="true" />
      </button>

      <aside
        className={`jarvis${open ? " open" : ""}`}
        id="jarvis"
        role="dialog"
        aria-modal="false"
        aria-labelledby="j-title"
      >
        <div className="j-head">
          <div>
            <div className="j-title" id="j-title">
              AXIS<i>·</i>CORE
            </div>
            <div className={`j-status${online ? " online" : ""}`}>
              <span className="led" />
              <span>{status}</span>
            </div>
          </div>
          <button className="j-close" aria-label={copy.close} onClick={shut}>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="j-log" ref={logRef} data-lenis-prevent aria-live="polite">
          <div className="m bot">
            <span className="tag">Axis Core</span>
            {renderMessage(copy.greet)}
          </div>

          {turns.map((turn, index) =>
            turn.role === "assistant" ? (
              <div className="m bot" key={index}>
                <span className="tag">Axis Core</span>
                {renderMessage(turn.content)}
              </div>
            ) : (
              <div className="m me" key={index}>
                {turn.content}
              </div>
            ),
          )}

          {pending ? (
            <div className="typing" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          ) : null}
        </div>

        <div className="j-chips">
          {options.length > 0 ? (
            <>
              {options.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={option.selected ? "on" : undefined}
                  onClick={() => choose(option)}
                >
                  {option.label}
                </button>
              ))}
              {flow.step === "tasks" ? (
                <button
                  type="button"
                  className="go"
                  disabled={flow.picked.length === 0}
                  onClick={confirmTasks}
                >
                  {prompts.tasksConfirm}
                </button>
              ) : null}
              <button type="button" onClick={exitDiagnosis}>
                {prompts.exit}
              </button>
            </>
          ) : flow.step === "email" ? (
            <button type="button" onClick={() => setFlow({ step: "off" })}>
              {prompts.skip}
            </button>
          ) : (
            <>
              <button type="button" className="go" onClick={startDiagnosis}>
                {prompts.start}
              </button>
              {copy.chips.map((chip) => (
                <button type="button" key={chip} onClick={() => void ask(chip)}>
                  {chip}
                </button>
              ))}
            </>
          )}
        </div>

        <form className="j-form" onSubmit={onSubmit}>
          <textarea
            id="j-input"
            ref={inputRef}
            rows={1}
            value={draft}
            disabled={guided}
            placeholder={
              guided
                ? prompts.tasksHint
                : flow.step === "email"
                  ? prompts.emailPlaceholder
                  : copy.placeholder
            }
            aria-label={copy.placeholder}
            onChange={(event) => {
              setDraft(event.target.value);
              const el = event.target;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit(event);
              }
            }}
          />

          {voiceSupported && !guided ? (
            <button
              type="button"
              className={`j-btn${recording ? " rec" : ""}`}
              aria-label={copy.voice}
              onClick={listen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </button>
          ) : null}

          <button
            type="submit"
            className="j-btn"
            aria-label={copy.send}
            disabled={pending || guided}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <div className="j-foot">{flow.step === "email" ? prompts.privacy : copy.hint}</div>
      </aside>
    </>
  );
}
