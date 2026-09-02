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

/**
 * AXIS CORE — the assistant.
 *
 * Answers come from `/api/axis-core` when the site is connected to a model,
 * and from the local knowledge core otherwise. The visitor cannot tell the
 * difference except for the status line, and the panel never fails to reply.
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

export default function AxisCore() {
  const { lang } = useLang();
  const copy = UI[lang];

  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState("");

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const spokeLast = useRef(false);
  const onlineRef = useRef<boolean | null>(null);
  const busy = useRef(false);

  const touch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

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

  /* ---------- asking ---------- */
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

      // Once the endpoint has told us there is no model, stop asking it.
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
          // A missing model falls back silently; a real failure says so.
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

  /* the core wakes up once the hero has settled */
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 5200);
    return () => window.clearTimeout(id);
  }, []);

  /* keep the log pinned to the newest message */
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
      // Already running — the onend handler will reset the button.
    }
  }, [ask, lang, recording]);

  // Capability detection is external state that never changes after load, and
  // it must not run during SSR — hence the server snapshot of `false`.
  const voiceSupported = useSyncExternalStore(
    subscribeNever,
    hasRecognition,
    voiceUnsupported,
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void ask(draft);
  }

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
          {copy.chips.map((chip) => (
            <button type="button" key={chip} onClick={() => void ask(chip)}>
              {chip}
            </button>
          ))}
        </div>

        <form className="j-form" onSubmit={onSubmit}>
          <textarea
            id="j-input"
            ref={inputRef}
            rows={1}
            value={draft}
            placeholder={copy.placeholder}
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
                void ask(draft);
              }
            }}
          />

          {voiceSupported ? (
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

          <button type="submit" className="j-btn" aria-label={copy.send} disabled={pending}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <div className="j-foot">{copy.hint}</div>
      </aside>
    </>
  );
}
