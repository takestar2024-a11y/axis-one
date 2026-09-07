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
  "nav.build": { en: "Engagements", ja: "商品" },
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

  "build.title": { en: "Start with the diagnosis.", ja: "まず、診断から。" },
  "build.lead": {
    en: "This is not training. Four steps in order, each one earning the next — and the last one leaves AI producing revenue inside your company, not inside a workshop.",
    ja: "研修では終わりません。4つの段階を順番に。前の段階が次を決め、最後には御社のなかでAIが売上をつくり続けている状態まで持っていきます。",
  },

  "build.1.name": { en: "AI Diagnosis", ja: "AI経営診断" },
  "build.1.price": { en: "¥198,000", ja: "¥198,000" },
  "build.1.terms": { en: "90-minute session", ja: "90分・単発" },
  "build.1.desc": {
    en: "Ninety minutes with the people who decide. You leave with the work broken down, the hours AI can take back, and the order to build in.",
    ja: "90分のヒアリングから業務・集客・営業を分解し、AI化できる箇所、取り戻せる時間、着手する順番をロードマップにして納品します。",
  },

  "build.2.name": { en: "AI Build", ja: "AI実装" },
  "build.2.price": { en: "From ¥980,000", ja: "¥980,000〜" },
  "build.2.terms": { en: "3 months", ja: "3ヶ月" },
  "build.2.desc": {
    en: "We build what the diagnosis found — sales, marketing, content or back-office — in the order that moves your number first.",
    ja: "診断で決めた仕組みを実際に作って動かします。AI営業・マーケティング・コンテンツ・業務自動化から、御社の数字に効く順に。",
  },

  "build.3.name": { en: "AI Growth OS", ja: "AI Growth OS" },
  "build.3.price": { en: "On request", ja: "応相談" },
  "build.3.terms": { en: "3–6 months", ja: "3〜6ヶ月" },
  "build.3.desc": {
    en: "Not one tool but the operating system: sales, marketing, operations and the decisions on top, all running on one axis.",
    ja: "単体のツールではなく、営業・マーケ・業務、そしてその上の経営判断までをひとつの軸につなぐ、会社のOSそのものを構築します。",
  },

  "build.4.name": { en: "AI Partner", ja: "AI経営顧問" },
  "build.4.price": { en: "¥398,000 / month", ja: "月額 ¥398,000" },
  "build.4.terms": { en: "6-month minimum", ja: "最低6ヶ月" },
  "build.4.desc": {
    en: "Two sessions a month. We keep the system improving — new agents, sharper prompts, the team actually using it, the revenue path tightening.",
    ja: "月2回の戦略ミーティングで、施策の企画からエージェントの改善、社員の活用支援、売上導線の改善までを継続で持ちます。",
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
