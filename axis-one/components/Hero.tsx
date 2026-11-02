"use client";

import { useLang } from "@/lib/i18n";

/** Scene 01 — the claim, over the orbital field drawn on #hero-canvas. */
export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero" id="hero">
      <canvas id="hero-canvas" />
      <div className="hero-veil" />

      <div className="hero-inner">
        <div className="hero-mark">AXIS ONE</div>

        {/* Brand-locked English: .keep-en opts out of the Japanese type rules. */}
        <h1 className="display display--mega hero-title keep-en">
          <span className="mask">
            <span className="l1">One axis.</span>
          </span>
          <span className="mask">
            <span className="l2">Infinite</span>
          </span>
          <span className="mask">
            <span className="l2">possibilities.</span>
          </span>
        </h1>

        <div className="hero-sub">
          <div className="kv">
            AI <em>×</em> Creative <em>×</em> Marketing
          </div>
          <p>{t("hero.sub")}</p>
        </div>
      </div>

      <div className="hero-foot">
        <span>{t("hero.footLeft")}</span>
        <div className="cue">
          <div className="line" />
          <span>{t("hero.scroll")}</span>
        </div>
        <span>{t("hero.footRight")}</span>
      </div>
    </section>
  );
}
