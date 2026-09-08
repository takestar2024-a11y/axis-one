/**
 * Print what the diagnosis returns for a spread of realistic answer sheets.
 *
 *   npm run diagnosis:check
 *
 * This exists so the `automatable` rates in lib/diagnosis.ts can be argued
 * with against concrete output rather than in the abstract: change a rate,
 * run this, see whether the numbers you get are ones you would defend to a
 * business owner.
 */

import { HOURLY_RATE, RECOMMENDED, TASKS, readDiagnosis, type Answers } from "../lib/diagnosis";

const CASES: Array<{ name: string; answers: Answers }> = [
  {
    name: "建設・6〜20名・報告書と見積と写真",
    answers: {
      industry: "construction",
      headcount: "small",
      hours: { "daily-report": 30, quote: 30, "photo-log": 15 },
      maturity: "none",
    },
  },
  {
    name: "士業・1〜5名・問い合わせと議事録",
    answers: {
      industry: "professional",
      headcount: "solo",
      hours: { inquiry: 15, minutes: 5 },
      maturity: "none",
    },
  },
  {
    name: "営業・21〜50名・全方位",
    answers: {
      industry: "sales",
      headcount: "mid",
      hours: { research: 80, quote: 50, "follow-up": 50, deck: 30 },
      maturity: "individual",
    },
  },
  {
    name: "制作・6〜20名・全社でAI導入済み",
    answers: {
      industry: "creative",
      headcount: "small",
      hours: { content: 50, deck: 30 },
      maturity: "company",
    },
  },
  {
    name: "EC・1〜5名・最小構成",
    answers: {
      industry: "retail",
      headcount: "solo",
      hours: { inquiry: 5 },
      maturity: "none",
    },
  },
];

const yen = (value: number) => `¥${value.toLocaleString("ja-JP")}`;

console.log(`時給換算: ${yen(HOURLY_RATE)}　自動化率: ${Math.min(
  ...TASKS.map((task) => task.automatable),
)} 〜 ${Math.max(...TASKS.map((task) => task.automatable))}\n`);

for (const { name, answers } of CASES) {
  const reading = readDiagnosis(answers, "ja");
  console.log(`■ ${name}`);
  console.log(`  ${reading.headline}`);
  for (const line of reading.lines) {
    console.log(
      `   - ${line.label}: 入力 ${line.inputHours}h → 削減 ${line.savedLow}〜${line.savedHigh}h`,
    );
  }
  console.log(
    `   合計 ${reading.hoursLow}〜${reading.hoursHigh}h / ${yen(reading.yenLow)}〜${yen(reading.yenHigh)}`,
  );
  console.log(`   → ${RECOMMENDED[reading.recommendation].ja.name}\n`);
}
