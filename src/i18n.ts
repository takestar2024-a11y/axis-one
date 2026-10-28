export type Lang = "en" | "ja";

export interface Copy {
  links: string[];
  cta: string;
  titles: [string, string, string];
  description: string;
  stats: { value: string; label: string }[];
  hud: string[];
  breach: {
    eyebrow: string;
    title: string;
    body: string;
    commands: string[];
    panes: { label: string; status: string; lines: string[]; verdict: string }[];
    note: string;
  };
  trust: { label: string; names: string[] };
  problem: { eyebrow: string; title: string; body: string; points: { k: string; v: string }[] };
  features: { eyebrow: string; title: string; items: { title: string; body: string }[] };
  confidential: {
    eyebrow: string;
    badge: string;
    title: string;
    body: string;
    headers: [string, string, string];
    rows: [string, string, string][];
    layersTitle: string;
    layers: { title: string; body: string }[];
    note: string;
  };
  how: { eyebrow: string; title: string; steps: { title: string; body: string }[] };
  numbers: { value: string; label: string }[];
  voices: { eyebrow: string; title: string; items: { quote: string; name: string; role: string }[] };
  pricing: {
    eyebrow: string;
    title: string;
    note: string;
    popular: string;
    plans: {
      name: string;
      price: string;
      unit: string;
      body: string;
      items: string[];
      cta: string;
    }[];
  };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  finalCta: { title: string; body: string; primary: string; secondary: string };
  footer: { tagline: string; groups: { title: string; links: string[] }[]; rights: string };
}

export const copy: Record<Lang, Copy> = {
  en: {
    links: ["technology", "breach demo", "pricing", "faq"],
    cta: "get started",
    titles: ["breached?", "still", "sealed"],
    description:
      "even data in use stays encrypted inside a hardware vault (tee). security built for the day you get breached.",
    stats: [
      { value: "tee", label: "hardware-isolated processing" },
      { value: "aes-256", label: "encrypted even in use" },
      { value: "<30s", label: "to block a threat automatically" },
    ],
    hud: ["tee attested", "aes-256-gcm", "zero plaintext"],
    breach: {
      eyebrow: "breach simulation",
      title: "they got in. all they saw was ciphertext.",
      body: "same attacker, same server, same memory dump. on a typical cloud your data spills out in plain text. on securify it never leaves the enclave readable.",
      commands: ["$ ssh root@prod-app-01", "$ dump-memory --pid 4127 | grep -a customer"],
      panes: [
        {
          label: "typical cloud",
          status: "plaintext exposed",
          lines: ['name="taro yamada"', "card=4111-1111-1111-1111", "my_number=1234-5678-9018", "email=taro@example.co.jp"],
          verdict: "! 4 sensitive records leaked",
        },
        {
          label: "securify (processed inside tee)",
          status: "ciphertext only",
          lines: ["9f3c a17e 0bd4 52e1 c8f0 3a6b", "e27d 5c19 b3aa 0f84 71de 26c5", "4b80 d9e3 1f6a ac27 58b1 e04c", "c3f2 08ad 7e95 b641 2d0f 9a73"],
          verdict: "✓ memory is sev-encrypted. nothing readable",
        },
      ],
      note: "illustrative simulation for explanation purposes.",
    },
    trust: {
      label: "trusted by security-minded teams",
      names: ["northwind", "lumio", "atlas&co", "keystone", "orbital", "fernhill"],
    },
    problem: {
      eyebrow: "the threat",
      title: "ai attacks in seconds.",
      body: "finding a hole, getting in, escalating and taking the data used to take attackers days or weeks. ai now does it in minutes or seconds. stopping 100% at the perimeter is no longer a plan.",
      points: [
        { k: "weeks", v: "how long a classic attack used to take" },
        { k: "seconds", v: "how long an ai-driven attack takes" },
        { k: "assume breach", v: "where modern security has to start" },
      ],
    },
    features: {
      eyebrow: "platform",
      title: "everything you need to keep data yours",
      items: [
        { title: "end-to-end encryption", body: "aes-256 at rest and tls 1.3 in transit. keys stay with you, always." },
        { title: "access control", body: "least-privilege roles, sso and mfa in a few clicks. no more shared passwords." },
        { title: "real-time threat detection", body: "anomalies are flagged and blocked in seconds, before they spread." },
        { title: "audit logs", body: "every read, edit and share is recorded and exportable for your auditors." },
        { title: "automated compliance", body: "soc 2, iso 27001 and gdpr checks run continuously, so reports are always ready." },
        { title: "one-click recovery", body: "immutable backups let you roll back to a clean state after any incident." },
      ],
    },
    confidential: {
      eyebrow: "confidential computing",
      badge: "early access",
      title: "encrypted even while it's being processed",
      body: "most security stops at storage and transit. securify runs analysis inside hardware-isolated enclaves, so your data stays encrypted in memory and is never visible to cloud operators, the host os, or us.",
      headers: ["state", "typical encryption", "securify"],
      rows: [
        ["in transit", "tls", "tls + payload encrypted end to end"],
        ["at rest", "disk / database encryption", "keys wrapped in kms, never stored in the clear"],
        ["in use", "decrypted in memory", "decrypted only inside a hardware tee"],
      ],
      layersTitle: "three layers, because nothing is absolute",
      layers: [
        { title: "identity", body: "mfa and least-privilege access stop impersonation at the edge." },
        { title: "trust layer", body: "keys are released only to attested enclaves running verified code." },
        { title: "defensive ai", body: "behavior is monitored in real time and anomalies are blocked automatically." },
      ],
      note: "hardware enclaves are not invulnerable. we combine them with the layers above and keep firmware and images up to date.",
    },
    how: {
      eyebrow: "how it works",
      title: "protected in three steps",
      steps: [
        { title: "connect", body: "link your cloud, apps and devices with read-only access. setup takes about ten minutes." },
        { title: "scan", body: "securify maps where your sensitive data lives and who can reach it." },
        { title: "protect", body: "policies apply automatically. you get alerts only when something truly needs you." },
      ],
    },
    numbers: [
      { value: "99.99%", label: "uptime over the last 12 months" },
      { value: "<30s", label: "median time to block a threat" },
      { value: "0", label: "customer data exposed in transit" },
      { value: "24/7", label: "human security team on call" },
    ],
    voices: {
      eyebrow: "customers",
      title: "teams sleep better with securify",
      items: [
        { quote: "we passed our soc 2 audit in six weeks instead of six months. securify did most of the paperwork for us.", name: "maya chen", role: "cto, lumio" },
        { quote: "the alerts are quiet and precise. when one fires, we know it matters.", name: "daniel okafor", role: "head of security, northwind" },
        { quote: "onboarding took an afternoon. our whole team was on sso by the end of the day.", name: "sara lindqvist", role: "coo, orbital" },
      ],
    },
    pricing: {
      eyebrow: "pricing",
      title: "simple plans that scale with you",
      note: "prices exclude tax. annual billing gets 2 months free. starter and business include a 14-day free trial.",
      popular: "most popular",
      plans: [
        {
          name: "starter",
          price: "$390",
          unit: "/ month",
          body: "for small teams getting security right from day one.",
          items: ["up to 30 users", "encryption & access control", "basic audit logs", "email support"],
          cta: "start free trial",
        },
        {
          name: "business",
          price: "$1,490",
          unit: "/ month",
          body: "for growing companies that need to prove compliance.",
          items: ["up to 300 users", "real-time threat detection", "automated compliance reports", "sso & mfa", "priority support"],
          cta: "start free trial",
        },
        {
          name: "enterprise",
          price: "custom",
          unit: "",
          body: "for organizations with advanced security needs.",
          items: ["unlimited users", "dedicated security engineer", "custom data residency", "99.99% uptime sla", "24/7 phone support"],
          cta: "talk to sales",
        },
      ],
    },
    faq: {
      eyebrow: "faq",
      title: "questions, answered",
      items: [
        { q: "do you store or read my data?", a: "no. securify works on metadata and policies. your content stays encrypted with keys that only you control." },
        { q: "how long does setup take?", a: "most teams are connected and scanned within ten minutes. no agents or downtime required." },
        { q: "which standards do you help with?", a: "soc 2, iso 27001, gdpr and hipaa. reports are generated continuously and export in one click." },
        { q: "can i cancel any time?", a: "yes. there are no contracts on starter and business. cancel from your dashboard whenever you like." },
        { q: "is there a free trial?", a: "starter and business come with a 14-day free trial. for enterprise, we run a proof of concept with your team." },
      ],
    },
    finalCta: {
      title: "assume breach. stay sealed.",
      body: "perimeters can't keep up with ai-speed attacks. encrypt data even while it's processed, so a breach never becomes a leak.",
      primary: "book a demo",
      secondary: "talk to sales",
    },
    footer: {
      tagline: "guarding your data with utmost care.",
      groups: [
        { title: "product", links: ["platform", "pricing", "security", "changelog"] },
        { title: "company", links: ["about", "careers", "blog", "contact"] },
        { title: "legal", links: ["privacy", "terms", "dpa"] },
      ],
      rights: "© 2026 securify. all rights reserved.",
    },
  },
  ja: {
    links: ["テクノロジー", "侵入デモ", "料金", "よくある質問"],
    cta: "はじめる",
    titles: ["侵入されても", "データは", "見せない"],
    description:
      "処理中のデータも、ハードウェアの金庫（TEE）で暗号化したまま。侵入前提で守り抜く。",
    stats: [
      { value: "TEE", label: "ハードウェアで隔離して処理" },
      { value: "AES-256", label: "処理中も暗号化したまま" },
      { value: "<30s", label: "脅威を自動で遮断" },
    ],
    hud: ["TEE ATTESTED", "AES-256-GCM", "ZERO PLAINTEXT"],
    breach: {
      eyebrow: "侵入シミュレーション",
      title: "侵入されても、見えるのは暗号だけ。",
      body: "同じ攻撃者が、同じサーバーに入り、同じようにメモリを盗み見る。一般的なクラウドでは機密データが平文で流れ出し、securify では読める情報が何ひとつ出てきません。",
      commands: ["$ ssh root@prod-app-01", "$ dump-memory --pid 4127 | grep -a customer"],
      panes: [
        {
          label: "一般的なクラウド",
          status: "平文が露出",
          lines: ['name="山田 太郎"', "card=4111-1111-1111-1111", "my_number=1234-5678-9018", "email=taro@example.co.jp"],
          verdict: "! 機密データ 4件 流出",
        },
        {
          label: "securify（TEE 内で処理）",
          status: "暗号文のみ",
          lines: ["9f3c a17e 0bd4 52e1 c8f0 3a6b", "e27d 5c19 b3aa 0f84 71de 26c5", "4b80 d9e3 1f6a ac27 58b1 e04c", "c3f2 08ad 7e95 b641 2d0f 9a73"],
          verdict: "✓ メモリは暗号化済み。読める情報なし",
        },
      ],
      note: "説明用のシミュレーションです。",
    },
    trust: {
      label: "セキュリティ意識の高いチームが導入しています",
      names: ["northwind", "lumio", "atlas&co", "keystone", "orbital", "fernhill"],
    },
    problem: {
      eyebrow: "脅威の変化",
      title: "AI は、数秒で攻めてくる。",
      body: "脆弱性の発見、侵入、権限の奪取、データの持ち出し。かつて数日から数週間かかった攻撃を、AI は数分から数秒でやり遂げます。境界で100%防ぐという前提は、もう成り立ちません。",
      points: [
        { k: "数週間", v: "従来の攻撃にかかっていた時間" },
        { k: "数秒", v: "AI 主導の攻撃にかかる時間" },
        { k: "侵入前提", v: "これからのセキュリティの出発点" },
      ],
    },
    features: {
      eyebrow: "プラットフォーム",
      title: "データを自分のものにするための、すべてがここに",
      items: [
        { title: "エンドツーエンド暗号化", body: "保管時は aes-256、通信時は tls 1.3。鍵は常にお客様の手元にあります。" },
        { title: "アクセス制御", body: "最小権限のロール、sso、mfa を数クリックで設定。パスワードの使い回しをなくします。" },
        { title: "リアルタイム脅威検知", body: "異常を数秒で検知してブロックし、被害の拡大を防ぎます。" },
        { title: "監査ログ", body: "閲覧・編集・共有のすべてを記録し、監査用にそのままエクスポートできます。" },
        { title: "コンプライアンス自動化", body: "soc 2、iso 27001、gdpr への対応を常時チェック。レポートはいつでも出せます。" },
        { title: "ワンクリック復旧", body: "改ざんできないバックアップで、インシデント後もすぐに正常な状態へ戻せます。" },
      ],
    },
    confidential: {
      eyebrow: "コンフィデンシャルコンピューティング",
      badge: "先行提供予定",
      title: "処理中のデータも、暗号化したまま。",
      body: "多くのセキュリティが守るのは「保存時」と「通信時」まで。securify はハードウェアで隔離された領域（TEE）の中だけでデータを処理するため、クラウド事業者やサーバー管理者、私たち securify からも中身は見えない設計です。",
      headers: ["データの状態", "一般的な暗号化", "securify"],
      rows: [
        ["通信時", "tls による通信の暗号化", "tls に加え、中身もエンドツーエンドで暗号化"],
        ["保存時", "ディスク・データベースの暗号化", "鍵は kms で保護し、平文では保存しない"],
        ["処理中", "メモリ上で平文に戻る", "ハードウェアの TEE の中でだけ復号"],
      ],
      layersTitle: "「絶対」はないから、3層で守る",
      layers: [
        { title: "認証", body: "多要素認証と最小権限で、なりすましを入口で止めます。" },
        { title: "信頼基盤", body: "正しいプログラムが TEE で動いていると証明できたときだけ、鍵を渡します。" },
        { title: "防御側 ai", body: "挙動をリアルタイムで監視し、異常を自動で遮断します。" },
      ],
      note: "TEE も万能ではありません。上記の多層防御と、ファームウェアの継続的な更新を組み合わせて運用します。",
    },
    how: {
      eyebrow: "導入の流れ",
      title: "3ステップで、保護を開始",
      steps: [
        { title: "接続", body: "クラウド、アプリ、デバイスを読み取り専用で接続。設定は約10分で完了します。" },
        { title: "スキャン", body: "機密データの所在と、誰がアクセスできるかを自動で可視化します。" },
        { title: "保護", body: "ポリシーは自動で適用。本当に対応が必要なときだけ通知します。" },
      ],
    },
    numbers: [
      { value: "99.99%", label: "過去12か月の稼働率" },
      { value: "30秒未満", label: "脅威をブロックするまでの中央値" },
      { value: "0件", label: "通信中に漏えいしたお客様データ" },
      { value: "24/7", label: "専任チームによる常時対応" },
    ],
    voices: {
      eyebrow: "お客様の声",
      title: "securify で、チームが安心して眠れるように",
      items: [
        { quote: "soc 2 の監査を、半年ではなく6週間で通過できました。書類作業のほとんどを securify が担ってくれました。", name: "maya chen", role: "cto, lumio" },
        { quote: "アラートは静かで正確です。通知が来たときは、本当に重要だと分かります。", name: "daniel okafor", role: "セキュリティ責任者, northwind" },
        { quote: "導入は午後だけで完了。その日のうちに全員が sso に移行できました。", name: "sara lindqvist", role: "coo, orbital" },
      ],
    },
    pricing: {
      eyebrow: "料金",
      title: "成長に合わせて選べる、シンプルな料金",
      note: "価格は税抜です。年間契約なら2か月分無料。スターターとビジネスは14日間の無料トライアル付き。",
      popular: "人気no.1",
      plans: [
        {
          name: "スターター",
          price: "¥49,800",
          unit: "/ 月",
          body: "初日から正しくセキュリティを整えたい小規模チーム向け。",
          items: ["最大30ユーザー", "暗号化・アクセス制御", "基本の監査ログ", "メールサポート"],
          cta: "無料で試す",
        },
        {
          name: "ビジネス",
          price: "¥198,000",
          unit: "/ 月",
          body: "成長中で、コンプライアンスの証明が必要な企業向け。",
          items: ["最大300ユーザー", "リアルタイム脅威検知", "コンプライアンスレポート自動生成", "sso・mfa", "優先サポート"],
          cta: "無料で試す",
        },
        {
          name: "エンタープライズ",
          price: "お問い合わせ",
          unit: "",
          body: "高度なセキュリティ要件をお持ちの組織向け。",
          items: ["ユーザー数無制限", "専任セキュリティエンジニア", "データ所在地のカスタマイズ", "稼働率99.99%のsla", "24時間電話サポート"],
          cta: "営業に相談する",
        },
      ],
    },
    faq: {
      eyebrow: "よくある質問",
      title: "よくあるご質問",
      items: [
        { q: "データを保存したり、中身を見たりしますか？", a: "いいえ。securify はメタデータとポリシーのみを扱います。コンテンツはお客様だけが管理する鍵で暗号化されたままです。" },
        { q: "導入にどのくらいかかりますか？", a: "ほとんどのチームが10分以内に接続とスキャンまで完了します。エージェントのインストールやダウンタイムは不要です。" },
        { q: "どの基準に対応していますか？", a: "soc 2、iso 27001、gdpr、hipaa に対応。レポートは常時生成され、ワンクリックで出力できます。" },
        { q: "いつでも解約できますか？", a: "はい。スターターとビジネスに契約期間の縛りはありません。ダッシュボードからいつでも解約できます。" },
        { q: "無料トライアルはありますか？", a: "スターターとビジネスは14日間の無料トライアルをご利用いただけます。エンタープライズは、貴社環境での実証（PoC）からご相談ください。" },
      ],
    },
    finalCta: {
      title: "侵入前提で、守り抜く。",
      body: "AI の速度で来る攻撃に、境界の防御だけでは間に合いません。処理中のデータまで暗号化して、侵入を「漏えい」にさせない備えを。",
      primary: "デモを予約する",
      secondary: "営業に相談する",
    },
    footer: {
      tagline: "大切なデータを、細心の注意で守ります。",
      groups: [
        { title: "製品", links: ["プラットフォーム", "料金", "セキュリティ", "更新履歴"] },
        { title: "会社", links: ["会社概要", "採用情報", "ブログ", "お問い合わせ"] },
        { title: "法務", links: ["プライバシー", "利用規約", "dpa"] },
      ],
      rights: "© 2026 securify. all rights reserved.",
    },
  },
};

export function detectLang(): Lang {
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "ja" || param === "en") return param;
  return "ja";
}
