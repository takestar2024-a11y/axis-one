"use client";

/**
 * AXIS ONE — i18n (JA / EN)
 *
 * Copy lives in one dictionary so a third language is a data change, not a
 * template change. Values are ReactNode, which keeps inline markup (line
 * breaks, accent spans) in the copy instead of scattering it through the
 * components — and avoids dangerouslySetInnerHTML entirely.
 *
 * Brand-locked English (the hero title, the wordmark) is not in here: it
 * carries `.keep-en` in the markup and never translates.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Lang = "en" | "ja";

type Entry = { en: ReactNode; ja: ReactNode };

export const COPY = {
  "nav.shift": { en: "Shift", ja: "変化" },
  "nav.axis": { en: "Axis", ja: "軸" },
  "nav.build": { en: "Build", ja: "事業領域" },
  "nav.work": { en: "Work", ja: "実績" },
  "nav.philosophy": { en: "Philosophy", ja: "思想" },
  "nav.cta": { en: "Start a project", ja: "相談する" },

  "hero.sub": {
    en: "Building systems for the next generation of business.",
    ja: "次の時代のビジネスに、その仕組みを。",
  },
  "hero.footLeft": {
    en: "Creative Growth Company",
    ja: "クリエイティブ・グロース・カンパニー",
  },
  "hero.footRight": { en: "Est. Tokyo", ja: "東京" },
  "hero.scroll": { en: "Scroll", ja: "スクロール" },

  "shift.label": { en: "The shift", ja: "変化" },
  "shift.1": {
    en: (
      <>
        The world
        <br />
        is changing.
      </>
    ),
    ja: (
      <>
        世界は、
        <br />
        変わり続けている。
      </>
    ),
  },
  "shift.2": {
    en: (
      <>
        The way you build
        <br />
        <span className="gold">must change too.</span>
      </>
    ),
    ja: (
      <>
        つくり方も、
        <br />
        <span className="gold">変えなければならない。</span>
      </>
    ),
  },
  "shift.3": {
    en: "Tools got cheaper. Speed got cheaper. What did not get cheaper is judgment — knowing what to build, and why.",
    ja: "ツールは安くなった。スピードも安くなった。安くならなかったのは判断だけだ。何を、なぜつくるのか。",
  },

  "axis.1": {
    en: (
      <>
        Everything needs
        <br />
        an axis.
      </>
    ),
    ja: (
      <>
        すべてには、
        <br />
        軸が要る。
      </>
    ),
  },
  "axis.2": {
    en: (
      <>
        You are
        <br />
        <span className="violet">the center.</span>
      </>
    ),
    ja: (
      <>
        中心は、
        <br />
        <span className="violet">あなただ。</span>
      </>
    ),
  },
  "axis.metaLeft": { en: "Fig. 03 — The Axis", ja: "図 03 — 軸" },
  "axis.metaRight": { en: "Structure before speed", ja: "速さより、構造を" },

  "build.title": { en: "What we build", ja: "私たちがつくるもの" },
  "build.lead": {
    en: "Four disciplines, one operating system. Each one is designed to make the next one compound.",
    ja: "4つの領域を、ひとつの仕組みとして設計する。それぞれが次を加速させる。",
  },
  "build.1.name": { en: "AI Systems", ja: "AIシステム" },
  "build.1.desc": {
    en: "Agents, pipelines and internal tools that make a team behave like one ten times its size.",
    ja: "エージェント、パイプライン、社内ツール。10倍の規模のチームのように動く組織をつくる。",
  },
  "build.2.name": { en: "Creative", ja: "クリエイティブ" },
  "build.2.desc": {
    en: "Identity, film and interface — built as one language, not three deliverables.",
    ja: "ブランド、映像、インターフェース。3つの納品物ではなく、ひとつの言語として設計する。",
  },
  "build.3.name": { en: "Automation", ja: "自動化" },
  "build.3.desc": {
    en: "The invisible layer. Everything repeatable stops being done by hand.",
    ja: "見えない層をつくる。繰り返される作業は、人の手から離す。",
  },
  "build.4.name": { en: "Growth", ja: "グロース" },
  "build.4.desc": {
    en: "Acquisition designed as a system, measured to the yen, rebuilt every quarter.",
    ja: "集客を仕組みとして設計し、円単位で計測し、四半期ごとに組み直す。",
  },

  "work.title": {
    en: (
      <>
        Selected
        <br />
        work
      </>
    ),
    ja: (
      <>
        主な
        <br />
        実績
      </>
    ),
  },
  "work.lead": {
    en: "Three projects, three problems. Each one started as a question about the business, not about the pixels.",
    ja: "3つのプロジェクト、3つの課題。すべては見た目ではなく、事業への問いから始まった。",
  },
  "work.1.idx": { en: "Project 01", ja: "プロジェクト 01" },
  "work.1.title": { en: "AI Video", ja: "AI映像" },
  "work.1.tags": { en: "Film system", ja: "映像制作の仕組み化" },
  "work.2.idx": { en: "Project 02", ja: "プロジェクト 02" },
  "work.2.title": {
    en: (
      <>
        Brand
        <br />
        Experience
      </>
    ),
    ja: (
      <>
        ブランド
        <br />
        体験設計
      </>
    ),
  },
  "work.2.tags": { en: "Identity · Web", ja: "ブランド・Web" },
  "work.3.idx": { en: "Project 03", ja: "プロジェクト 03" },
  "work.3.title": {
    en: (
      <>
        Growth
        <br />
        System
      </>
    ),
    ja: (
      <>
        グロース
        <br />
        基盤
      </>
    ),
  },
  "work.3.tags": { en: "Automation", ja: "自動化" },
  "work.end": { en: "See the full index", ja: "すべての実績を見る" },

  "philo.1": {
    en: (
      <>
        AI is <span className="serif-it">the tool.</span>
      </>
    ),
    ja: (
      <>
        AIは、<span className="serif-it">道具。</span>
      </>
    ),
  },
  "philo.2": {
    en: (
      <>
        Creativity is <span className="gold serif-it">the power.</span>
      </>
    ),
    ja: (
      <>
        創造性が、<span className="gold serif-it">力。</span>
      </>
    ),
  },
  "philo.3": {
    en: (
      <>
        You are <span className="violet serif-it">the axis.</span>
      </>
    ),
    ja: (
      <>
        あなたが、<span className="violet serif-it">軸。</span>
      </>
    ),
  },

  "cta.line1": { en: "Build what's", ja: "次を、" },
  "cta.line2": { en: "next.", ja: "つくろう。" },
  "cta.lead": {
    en: "Tell us the outcome you need. We will come back with the system that produces it.",
    ja: "必要な成果を教えてください。それを生み出す仕組みを設計してお返しします。",
  },
  "cta.enter": { en: "Enter Axis One", ja: "AXIS ONE に相談する" },
  "cta.note": {
    en: "Currently accepting 3 partners for Q4",
    ja: "今期は3社限定でパートナーを募集しています",
  },

  "foot.about": {
    en: "A creative growth company designing AI, creative and automation systems for the next generation of business.",
    ja: "AI・クリエイティブ・自動化を統合し、次の時代のビジネスの仕組みを設計するクリエイティブ・グロース・カンパニー。",
  },
  "foot.contact": { en: "Contact", ja: "お問い合わせ" },
  "foot.startProject": { en: "Start a project", ja: "プロジェクトを相談する" },
  "foot.workIndex": { en: "Work index", ja: "実績一覧" },
  "foot.elsewhere": { en: "Elsewhere", ja: "ソーシャル" },
  "foot.place": { en: "Tokyo · Remote", ja: "東京・リモート" },
} satisfies Record<string, Entry>;

export type CopyKey = keyof typeof COPY;

interface LangValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: CopyKey) => ReactNode;
}

const LangContext = createContext<LangValue | null>(null);

const STORAGE_KEY = "axis-lang";

/**
 * The chosen language is external state: it comes from storage or the
 * browser's own preference, not from React. Keeping it in a tiny store and
 * reading it through useSyncExternalStore means the server renders "en", the
 * client hydrates against the same value, and the real preference lands in the
 * very next render — no mismatch, no cascading effect.
 */
let current: Lang | null = null;
const listeners = new Set<() => void>();

function detect(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ja" || stored === "en") return stored;
  } catch {
    // Blocked storage — fall through to the browser preference.
  }
  return (navigator.language || "en").toLowerCase().startsWith("ja") ? "ja" : "en";
}

function getSnapshot(): Lang {
  current ??= detect();
  return current;
}

function getServerSnapshot(): Lang {
  return "en";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeLang(lang: Lang) {
  if (current === lang) return;
  current = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Private mode — the toggle still holds for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: CopyKey) => COPY[key][lang], [lang]);
  const value = useMemo(() => ({ lang, setLang: writeLang, t }), [lang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside <LangProvider>");
  return value;
}
