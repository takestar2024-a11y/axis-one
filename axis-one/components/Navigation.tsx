"use client";

import { useLang, type CopyKey } from "@/lib/i18n";
import { openAxisCore } from "@/components/AxisCore";

const LINKS: Array<{ href: string; key: CopyKey }> = [
  { href: "#shift", key: "nav.shift" },
  { href: "#axis", key: "nav.axis" },
  { href: "#build", key: "nav.build" },
  { href: "#work", key: "nav.work" },
  { href: "#philosophy", key: "nav.philosophy" },
];

export default function Navigation() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="nav">
      <a href="#hero" className="nav-mark" data-cursor="TOP">
        AXIS<i>·</i>ONE
      </a>

      <nav className="nav-links">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {t(link.key)}
          </a>
        ))}
      </nav>

      <div className="nav-right">
        <div className="lang" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === "ja" ? "on" : undefined}
            onClick={() => setLang("ja")}
          >
            JA
          </button>
          <i>/</i>
          <button
            type="button"
            className={lang === "en" ? "on" : undefined}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>

        <button type="button" className="nav-cta" data-cursor="ENTER" onClick={openAxisCore}>
          {t("nav.cta")}
        </button>
      </div>
    </header>
  );
}
