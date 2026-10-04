export type Lang = "en" | "ja";

export interface Copy {
  links: string[];
  cta: string;
  titles: [string, string, string];
  description: string;
  stats: { startups: string; protectedData: string; downloads: string };
}

export const copy: Record<Lang, Copy> = {
  en: {
    links: ["platform", "solutions", "company", "support"],
    cta: "get started",
    titles: ["protect", "your", "data"],
    description:
      "we can guarding your data with utmost care, empowering you with privacy everywhere",
    stats: {
      startups: "startups use",
      protectedData: "gb data was protected",
      downloads: "downloads",
    },
  },
  ja: {
    links: ["プラットフォーム", "ソリューション", "会社情報", "サポート"],
    cta: "はじめる",
    titles: ["あなたの", "データを", "守る"],
    description:
      "大切なデータを細心の注意で守り、どこにいてもプライバシーを確保します",
    stats: {
      startups: "社のスタートアップが利用",
      protectedData: "gbのデータを保護",
      downloads: "ダウンロード",
    },
  },
};

export function detectLang(): Lang {
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "ja" || param === "en") return param;
  return navigator.language?.toLowerCase().startsWith("ja") ? "ja" : "en";
}
