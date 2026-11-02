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
  "nav.build": { en: "Business", ja: "事業" },
  "nav.work": { en: "Builds", ja: "制作例" },
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

  "build.title": { en: "Four businesses, one axis.", ja: "4つの事業、ひとつの軸。" },
  "build.lead": {
    en: "Advisory holds the judgement, automation runs the execution, the funnel turns it into revenue, film widens the world. The four are not separate services — they are one system, reused on a shared foundation.",
    ja: "顧問として判断を支え、自動化で実行を回し、導線で売上につなげ、動画で世界観を広げる。4事業は別々ではなく、共通の基盤の上で再利用される一つの仕組みです。",
  },

  "biz.1.name": { en: "AI Advisory", ja: "AI顧問" },
  "biz.1.en": { en: "AI Advisory", ja: "AI ADVISORY" },
  "biz.1.desc": {
    en: "An axis for the decisions. From “what do we use it for” to “does it survive the floor” — strategy, workflow design and adoption, held over time. We set the axis of the business before anyone picks a tool.",
    ja: "経営に、AIの判断軸を。「何に使うか」から「現場で回るか」まで、導入戦略・業務設計・定着を伴走する継続支援です。ツール選定の前に、事業の軸を一緒に定めます。",
  },
  "biz.1.tag1": { en: "Strategy", ja: "導入戦略" },
  "biz.1.tag2": { en: "Workflow design", ja: "業務設計" },
  "biz.1.tag3": { en: "Adoption", ja: "定着支援" },

  "biz.2.name": { en: "SNS Automation", ja: "SNS自動化" },
  "biz.2.en": { en: "SNS Automation", ja: "SNS AUTOMATION" },
  "biz.2.desc": {
    en: "Posting that does not depend on anyone's willpower. Planning, production, publishing and analysis joined on one foundation, with the shape of what worked kept as an asset rather than a memory.",
    ja: "運用を、人の頑張りではなく仕組みに。企画から制作・投稿・分析までを一つの基盤に統合し、伸びた投稿の「型」を資産として積み上げる体制をつくります。",
  },
  "biz.2.tag1": { en: "Post design", ja: "投稿設計" },
  "biz.2.tag2": { en: "Production", ja: "制作自動化" },
  "biz.2.tag3": { en: "Analysis", ja: "分析改善" },

  "biz.3.name": { en: "LP / LINE", ja: "LP・LINE構築" },
  "biz.3.en": { en: "LP / LINE Development", ja: "LP / LINE DEVELOPMENT" },
  "biz.3.desc": {
    en: "From attention to application, on one line. A landing page that holds up for high-value work and a LINE sequence nobody drops out of, designed and built into a path that ends in a conversation.",
    ja: "集客から申込までを、一本の導線に。高単価の導入案件に耐えるLPと、離脱させないLINEステップを設計・構築し、相談につながる流れを作ります。",
  },
  "biz.3.tag1": { en: "Landing pages", ja: "LP制作" },
  "biz.3.tag2": { en: "LINE steps", ja: "LINEステップ" },
  "biz.3.tag3": { en: "Funnel design", ja: "導線設計" },

  "biz.4.name": { en: "AI Video", ja: "AI動画制作" },
  "biz.4.en": { en: "AI Video Production", ja: "AI VIDEO PRODUCTION" },
  "biz.4.desc": {
    en: "A world, produced at volume. An AI production flow at the centre — reels, ads, product films — widening what you sell and what you say without breaking the brand's tone.",
    ja: "世界観を、動画で量産する。AI制作フローを軸に、リール・広告・商品紹介まで、ブランドのトーンを崩さずに追加販売と発信を広げる制作受託です。",
  },
  "biz.4.tag1": { en: "Reels", ja: "リール制作" },
  "biz.4.tag2": { en: "Ad film", ja: "広告動画" },
  "biz.4.tag3": { en: "World-building", ja: "世界観設計" },

  "work.title": {
    en: (
      <>
        Built in
        <br />
        the studio.
      </>
    ),
    // The work column is 620px wide: at this size Japanese fits about six
    // full-width characters a line, so the heading is cut to five and three.
    ja: (
      <>
        自社制作の
        <br />
        実物。
      </>
    ),
  },
  "work.lead": {
    en: "Not client work. Three systems we built ourselves, so you can see what this approach produces before anyone signs anything.",
    ja: "クライアント案件ではありません。私たちが自社でつくった3つの仕組みです。契約の前に、このつくり方が何を生むのかを見てもらうために置いています。",
  },
  "work.origin": { en: "In-house build", ja: "自社制作" },
  "work.1.idx": { en: "Build 01", ja: "制作 01" },
  "work.1.title": { en: "AI Video", ja: "AI映像" },
  "work.1.tags": { en: "Film system", ja: "映像制作の仕組み化" },
  "work.2.idx": { en: "Build 02", ja: "制作 02" },
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
  "work.3.idx": { en: "Build 03", ja: "制作 03" },
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
  "work.end": { en: "Talk about building yours", ja: "御社の場合を相談する" },

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

  // 事業内容 — the four domains, in the same order as the engagement ladder
  // above, so the footer states the business and the ladder prices it.
  "foot.business": { en: "What we do", ja: "事業内容" },
  "foot.biz1": { en: "AI Advisory", ja: "AI顧問" },
  "foot.biz2": { en: "SNS Automation", ja: "SNS自動化" },
  "foot.biz3": { en: "LP / LINE Development", ja: "LP・LINE構築" },
  "foot.biz4": { en: "AI Video Production", ja: "AI動画制作" },
  "foot.contact": { en: "Contact", ja: "お問い合わせ" },
  "foot.startProject": { en: "Start a project", ja: "プロジェクトを相談する" },
  "foot.workIndex": { en: "Studio builds", ja: "制作例を見る" },
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
