/**
 * AXIS CORE — the free diagnosis.
 *
 * A five-question version of the ¥198,000 AI経営診断, run inside the assistant
 * panel. It exists to do three things at once: demonstrate the product rather
 * than describe it, qualify the visitor, and earn an email by having something
 * worth sending.
 *
 * The arithmetic is deliberately boring and inspectable. Every hour in the
 * result came from the visitor's own answer; the only thing AXIS ONE supplies
 * is `automatable` — the share of a task a system can realistically take over.
 * Nothing is invented, and the result is always a range, because a single
 * number would be a claim we cannot support.
 *
 * `automatable` values are AXIS ONE's assumptions and are meant to be argued
 * with. Change them here; nothing else needs to move.
 */

export type Lang = "en" | "ja";

export type IndustryId =
  | "sales"
  | "professional"
  | "construction"
  | "creative"
  | "retail"
  | "other";

/** Yen per hour used to translate recovered hours into money. Stated in the UI. */
export const HOURLY_RATE = 3_000;

/** The low end of every range: we quote 80–100% of the modelled saving. */
const RANGE_FLOOR = 0.8;

export interface Industry {
  id: IndustryId;
  label: Record<Lang, string>;
}

export const INDUSTRIES: readonly Industry[] = [
  { id: "sales", label: { ja: "営業・セールス", en: "Sales" } },
  { id: "professional", label: { ja: "士業・専門サービス", en: "Professional services" } },
  { id: "construction", label: { ja: "建設・工事", en: "Construction" } },
  { id: "creative", label: { ja: "制作・マーケティング", en: "Creative & marketing" } },
  { id: "retail", label: { ja: "EC・小売", en: "E-commerce & retail" } },
  { id: "other", label: { ja: "その他", en: "Other" } },
];

export interface TaskType {
  id: string;
  label: Record<Lang, string>;
  /**
   * Share of the task a system can take over, leaving a human checkpoint.
   * Higher where the work is transcription and formatting; lower where the
   * work is judgment, or where the bottleneck is systems integration.
   */
  automatable: number;
  /** Shown first for these industries; every task stays selectable. */
  industries: IndustryId[];
  /** Why the number is what it is — surfaced in the result, not hidden. */
  note: Record<Lang, string>;
}

export const TASKS: readonly TaskType[] = [
  {
    id: "minutes",
    label: { ja: "議事録の作成", en: "Meeting minutes" },
    automatable: 0.85,
    industries: ["sales", "professional", "creative", "other"],
    note: {
      ja: "文字起こしと要約はほぼ解決済み。残るのは決定事項の確認だけです。",
      en: "Transcription and summary are close to solved; only confirming decisions is left.",
    },
  },
  {
    id: "data-entry",
    label: { ja: "データ入力・転記", en: "Data entry and transfer" },
    automatable: 0.8,
    industries: ["sales", "professional", "construction", "retail", "other"],
    note: {
      ja: "定型の転記は最も自動化しやすい領域です。",
      en: "Structured transfer is the easiest thing on this list to automate.",
    },
  },
  {
    id: "daily-report",
    label: { ja: "日報・報告書の作成", en: "Daily and status reports" },
    automatable: 0.75,
    industries: ["construction", "sales", "other"],
    note: {
      ja: "素材から書式に起こす作業が大半で、判断はほとんど含まれません。",
      en: "Mostly turning raw input into a format — very little judgment involved.",
    },
  },
  {
    id: "inquiry",
    label: { ja: "問い合わせの一次対応", en: "First-line enquiries" },
    automatable: 0.7,
    industries: ["professional", "retail", "sales", "other"],
    note: {
      ja: "件数が多く反復的なほど効きます。例外だけ人に回します。",
      en: "The higher the volume and the more repetitive, the better it works.",
    },
  },
  {
    id: "research",
    label: { ja: "営業リスト作成・リサーチ", en: "Prospect lists and research" },
    automatable: 0.7,
    industries: ["sales", "creative", "other"],
    note: {
      ja: "収集と整形は機械の仕事、当たりをつけるのは人の仕事です。",
      en: "Collecting and shaping is machine work; deciding who to chase is not.",
    },
  },
  {
    id: "photo-log",
    label: { ja: "現場写真・記録の整理", en: "Site photos and records" },
    automatable: 0.65,
    industries: ["construction"],
    note: {
      ja: "分類と紐付けは自動化できますが、撮影自体は残ります。",
      en: "Sorting and linking automate; taking the photos does not.",
    },
  },
  {
    id: "quote",
    label: { ja: "見積書・提案書の作成", en: "Quotes and proposals" },
    automatable: 0.6,
    industries: ["sales", "construction", "professional"],
    note: {
      ja: "過去案件を下敷きに草案まで出せます。最終確認は人が持ちます。",
      en: "Past work can carry it to a draft; the final read stays with a person.",
    },
  },
  {
    id: "content",
    label: { ja: "SNS・コンテンツ制作", en: "Social and content production" },
    automatable: 0.6,
    industries: ["creative", "retail", "other"],
    note: {
      ja: "量産は任せられます。何を言うかの判断は任せられません。",
      en: "Volume can be delegated; deciding what to say cannot.",
    },
  },
  {
    id: "recruiting",
    label: { ja: "求人原稿・採用対応", en: "Job posts and hiring" },
    automatable: 0.6,
    industries: ["construction", "retail", "other"],
    note: {
      ja: "原稿と一次スクリーニングまで。面談は人が行います。",
      en: "Copy and first screening — the interview stays human.",
    },
  },
  {
    id: "follow-up",
    label: { ja: "顧客フォロー・追客", en: "Customer follow-up" },
    automatable: 0.55,
    industries: ["sales", "retail"],
    note: {
      ja: "タイミングと文面は自動化できますが、関係構築は残ります。",
      en: "Timing and wording automate; the relationship does not.",
    },
  },
  {
    id: "deck",
    label: { ja: "資料・スライド作成", en: "Decks and documents" },
    automatable: 0.5,
    industries: ["sales", "creative", "professional", "other"],
    note: {
      ja: "構成案までは速く出ますが、筋の良し悪しは人が決めます。",
      en: "An outline comes fast; whether the argument is any good does not.",
    },
  },
  {
    id: "accounting",
    label: { ja: "請求・経理処理", en: "Invoicing and bookkeeping" },
    automatable: 0.5,
    industries: ["professional", "retail", "construction", "other"],
    note: {
      ja: "AIより先に、システム間の連携がボトルネックになりがちです。",
      en: "The bottleneck is usually integration between systems, not the AI.",
    },
  },
];

/** Hour bands, so the visitor picks instead of typing. Value is the midpoint. */
export const HOUR_BANDS: ReadonlyArray<{ value: number; label: Record<Lang, string> }> = [
  { value: 5, label: { ja: "月10時間ほど", en: "About 10 hrs / month" } },
  { value: 15, label: { ja: "月10〜20時間", en: "10–20 hrs / month" } },
  { value: 30, label: { ja: "月20〜40時間", en: "20–40 hrs / month" } },
  { value: 50, label: { ja: "月40〜60時間", en: "40–60 hrs / month" } },
  { value: 80, label: { ja: "月60時間以上", en: "60+ hrs / month" } },
];

export type HeadcountId = "solo" | "small" | "mid" | "large";

export const HEADCOUNTS: ReadonlyArray<{ id: HeadcountId; label: Record<Lang, string> }> = [
  { id: "solo", label: { ja: "1〜5名", en: "1–5 people" } },
  { id: "small", label: { ja: "6〜20名", en: "6–20 people" } },
  { id: "mid", label: { ja: "21〜50名", en: "21–50 people" } },
  { id: "large", label: { ja: "51名以上", en: "51+ people" } },
];

export type MaturityId = "none" | "individual" | "company";

export const MATURITIES: ReadonlyArray<{ id: MaturityId; label: Record<Lang, string> }> = [
  { id: "none", label: { ja: "まだ使っていない", en: "Not yet" } },
  { id: "individual", label: { ja: "一部の社員が個人で", en: "A few people, on their own" } },
  { id: "company", label: { ja: "全社で導入済み", en: "Company-wide already" } },
];

export interface Answers {
  industry: IndustryId;
  headcount: HeadcountId;
  /** taskId → monthly hours currently spent (a HOUR_BANDS midpoint). */
  hours: Record<string, number>;
  maturity: MaturityId;
}

export interface ResultLine {
  taskId: string;
  label: string;
  note: string;
  inputHours: number;
  savedLow: number;
  savedHigh: number;
}

/** Which rung of the engagement ladder the reading points at. */
export type Recommendation = "not-yet" | "diagnosis" | "build" | "growth-os" | "partner";

export interface Reading {
  lines: ResultLine[];
  hoursLow: number;
  hoursHigh: number;
  yenLow: number;
  yenHigh: number;
  recommendation: Recommendation;
  headline: string;
  summary: string;
}

/** Tasks to offer for an industry: its own first, then the rest. */
export function tasksFor(industry: IndustryId): TaskType[] {
  const mine = TASKS.filter((task) => task.industries.includes(industry));
  const rest = TASKS.filter((task) => !task.industries.includes(industry));
  return [...mine, ...rest];
}

function round(hours: number): number {
  return Math.round(hours);
}

/**
 * Below this, the paid diagnosis does not pay for itself inside a year
 * (hours x HOURLY_RATE x 12 < ¥198,000), so the honest answer is to say so
 * rather than quote a price the numbers cannot carry.
 */
const TOO_SMALL_HOURS = 6;

function recommend(hoursHigh: number, maturity: MaturityId): Recommendation {
  if (hoursHigh < TOO_SMALL_HOURS) return "not-yet";
  if (maturity === "company" && hoursHigh >= 60) return "growth-os";
  if (hoursHigh >= 80) return "growth-os";
  if (hoursHigh >= 30) return "build";
  if (maturity === "company") return "partner";
  return "diagnosis";
}

const COPY: Record<Lang, {
  headline: (low: number, high: number) => string;
  summary: (args: { low: number; high: number; yenLow: number; yenHigh: number; top: string }) => string;
}> = {
  ja: {
    headline: (low, high) => `月あたり ${low}〜${high} 時間が、AI化の対象になります。`,
    summary: ({ low, high, yenLow, yenHigh, top }) =>
      `いただいた数字をそのまま使って計算しています。合計 ${low}〜${high} 時間、` +
      `時給3,000円で換算すると月 ${yenLow.toLocaleString("ja-JP")}〜${yenHigh.toLocaleString("ja-JP")} 円ぶんの工数です。` +
      `最初に着手すべきは「${top}」。ここが一番大きく、かつ最も動かしやすい領域です。`,
  },
  en: {
    headline: (low, high) => `${low}–${high} hours a month are within reach of AI.`,
    summary: ({ low, high, yenLow, yenHigh, top }) =>
      `This is arithmetic on the numbers you gave: ${low}–${high} hours a month, ` +
      `or ¥${yenLow.toLocaleString("en-US")}–${yenHigh.toLocaleString("en-US")} of capacity at ¥3,000 an hour. ` +
      `Start with "${top}" — it is both the largest and the easiest to move.`,
  },
};

/**
 * Fold the answers into a reading.
 *
 *   saved(task) = hours the visitor reported × the task's automatable share
 *   range       = 80% of that, up to 100% of it
 *
 * No other factor is applied: headcount and maturity steer the recommendation,
 * never the hours, because inflating someone's own number is how these tools
 * lose their credibility.
 */
export function readDiagnosis(answers: Answers, lang: Lang): Reading {
  const lines: ResultLine[] = Object.entries(answers.hours)
    .map(([taskId, inputHours]) => {
      const task = TASKS.find((candidate) => candidate.id === taskId);
      if (!task) return null;
      const saved = inputHours * task.automatable;
      return {
        taskId,
        label: task.label[lang],
        note: task.note[lang],
        inputHours,
        savedLow: round(saved * RANGE_FLOOR),
        savedHigh: round(saved),
      } satisfies ResultLine;
    })
    .filter((line): line is ResultLine => line !== null)
    .sort((a, b) => b.savedHigh - a.savedHigh);

  const hoursLow = lines.reduce((total, line) => total + line.savedLow, 0);
  const hoursHigh = lines.reduce((total, line) => total + line.savedHigh, 0);
  const yenLow = hoursLow * HOURLY_RATE;
  const yenHigh = hoursHigh * HOURLY_RATE;
  const copy = COPY[lang];

  return {
    lines,
    hoursLow,
    hoursHigh,
    yenLow,
    yenHigh,
    recommendation: recommend(hoursHigh, answers.maturity),
    headline: copy.headline(hoursLow, hoursHigh),
    summary: copy.summary({
      low: hoursLow,
      high: hoursHigh,
      yenLow,
      yenHigh,
      top: lines[0]?.label ?? "",
    }),
  };
}

/** Validate an untrusted answer sheet (the API stores and scores these). */
export function parseAnswers(input: unknown): Answers {
  if (typeof input !== "object" || input === null) {
    throw new Error("Expected an answer object.");
  }
  const raw = input as Record<string, unknown>;

  const industry = INDUSTRIES.find((item) => item.id === raw.industry)?.id;
  if (!industry) throw new Error("Unknown industry.");

  const headcount = HEADCOUNTS.find((item) => item.id === raw.headcount)?.id;
  if (!headcount) throw new Error("Unknown headcount.");

  const maturity = MATURITIES.find((item) => item.id === raw.maturity)?.id;
  if (!maturity) throw new Error("Unknown maturity.");

  if (typeof raw.hours !== "object" || raw.hours === null) {
    throw new Error("Expected `hours` to be an object.");
  }
  const allowed = new Set(HOUR_BANDS.map((band) => band.value));
  const hours: Record<string, number> = {};
  for (const [taskId, value] of Object.entries(raw.hours as Record<string, unknown>)) {
    if (!TASKS.some((task) => task.id === taskId)) throw new Error(`Unknown task "${taskId}".`);
    if (typeof value !== "number" || !allowed.has(value)) {
      throw new Error(`Unsupported hour band for "${taskId}".`);
    }
    hours[taskId] = value;
  }
  const count = Object.keys(hours).length;
  if (count === 0) throw new Error("Pick at least one task.");
  if (count > 4) throw new Error("Pick at most four tasks.");

  return { industry, headcount, hours, maturity };
}

/* ------------------------------------------------------------------ *
 * Copy for the guided flow. Kept beside the logic so a change to the
 * question set and a change to its wording are one edit, not two files.
 * ------------------------------------------------------------------ */

export const PROMPTS: Record<
  Lang,
  {
    intro: string;
    industry: string;
    headcount: string;
    tasks: string;
    tasksHint: string;
    tasksConfirm: string;
    hours: (task: string) => string;
    maturity: string;
    emailAsk: string;
    privacy: string;
    emailPlaceholder: string;
    emailThanks: string;
    emailInvalid: string;
    skip: string;
    start: string;
    exit: string;
    disclaimer: string;
  }
> = {
  ja: {
    intro:
      "5つの質問で、御社のどの業務がAI化できて、月に何時間戻せるかを概算します。1分ほどです。",
    industry: "まず、御社の業種に一番近いものを選んでください。",
    headcount: "従業員はおよそ何名ですか。",
    tasks: "いま時間を取られている業務を選んでください。",
    tasksHint: "最大4つまで。多いものから選ぶと精度が上がります。",
    tasksConfirm: "この内容で進める",
    hours: (task) => `「${task}」には、月にどのくらい時間がかかっていますか。`,
    maturity: "最後に。社内でAIはどの程度使われていますか。",
    emailAsk:
      "内訳と、着手する順番をまとめたロードマップをお送りします。メールアドレスをどうぞ。",
    privacy:
      "ご連絡以外の目的では使用せず、第三者には提供しません。",
    emailPlaceholder: "you@company.co.jp",
    emailThanks:
      "ありがとうございます。1営業日以内に、診断結果とロードマップをお送りします。",
    emailInvalid: "メールアドレスの形式をご確認ください。",
    skip: "今はやめておく",
    start: "無料AI診断を受ける",
    exit: "自由に質問する",
    disclaimer:
      "※ いただいた時間をもとにした概算です。実際の削減幅は業務の中身によって変わります。",
  },
  en: {
    intro:
      "Five questions to estimate which of your work AI can take on, and how many hours a month that returns. About a minute.",
    industry: "First — which of these is closest to your business?",
    headcount: "Roughly how many people work there?",
    tasks: "Which work is taking the most time right now?",
    tasksHint: "Up to four. Start with the heaviest.",
    tasksConfirm: "Continue with these",
    hours: (task) => `How much time does "${task}" take each month?`,
    maturity: "Last one. How much AI is already in use internally?",
    emailAsk:
      "I can send the breakdown and the order to build in. What is your email?",
    privacy: "Used only to contact you, and never shared.",
    emailPlaceholder: "you@company.com",
    emailThanks:
      "Thank you. The reading and the roadmap will be with you within one business day.",
    emailInvalid: "That email address does not look right.",
    skip: "Not now",
    start: "Run the free diagnosis",
    exit: "Ask something else",
    disclaimer:
      "An estimate built from the hours you gave. The real figure moves with what the work actually involves.",
  },
};

/** Where a reading points on the engagement ladder. */
export const RECOMMENDED: Record<Recommendation, Record<Lang, { name: string; why: string }>> = {
  "not-yet": {
    ja: {
      name: "いまは、まだ早いです",
      why:
        "この規模だと、診断費用を回収するのに1年以上かかります。まずは無料のツールで議事録と定型文の作成だけ自動化してみてください。" +
        "手応えが出て、対象の業務が増えてから、あらためてご相談いただくのが得です。",
    },
    en: {
      name: "Not yet, honestly",
      why:
        "At this size the diagnosis would take over a year to pay for itself. Start with free tools on your minutes and boilerplate. " +
        "Come back when the list of repeatable work has grown — it will cost you less that way.",
    },
  },
  diagnosis: {
    ja: {
      name: "AI経営診断（¥198,000）",
      why: "対象が絞られているので、まず90分で全体を棚卸しし、着手順を決めるのが最短です。",
    },
    en: {
      name: "AI Diagnosis (¥198,000)",
      why: "The scope is contained — ninety minutes to map it properly and decide the order is the fastest route.",
    },
  },
  build: {
    ja: {
      name: "AI実装（¥980,000〜・3ヶ月）",
      why: "この規模なら、診断だけで終わらせず実際に仕組みを作るところまで一気に進める価値があります。",
    },
    en: {
      name: "AI Build (from ¥980,000, 3 months)",
      why: "At this size it is worth going past the diagnosis and building the system itself.",
    },
  },
  "growth-os": {
    ja: {
      name: "AI Growth OS（応相談・3〜6ヶ月）",
      why: "単体の業務改善では収まりません。営業・業務・判断をまとめて設計する規模です。",
    },
    en: {
      name: "AI Growth OS (on request, 3–6 months)",
      why: "This is past single-task improvement — sales, operations and the decisions on top want designing together.",
    },
  },
  partner: {
    ja: {
      name: "AI経営顧問（月額 ¥398,000）",
      why: "すでに社内でAIが動いているので、新規構築より継続的な改善のほうが効きます。",
    },
    en: {
      name: "AI Partner (¥398,000 / month)",
      why: "AI is already running inside the company, so continuous improvement beats another build.",
    },
  },
};
