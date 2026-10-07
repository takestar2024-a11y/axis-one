"use client";

import { openAxisCore } from "@/components/AxisCore";
import { useLang } from "@/lib/i18n";

/** Scene 07 — the ask, the marquee, the footer. */

// Four pairs, so the -50% loop lands on an identical frame.
const MARQUEE = ["One axis.", "Infinite possibilities."];

export default function FinalCTA() {
  const { t } = useLang();

  return (
    <>
      <section className="cta" id="cta">
        <h2 className="display display--mega">
          <span className="mask">
            <span>{t("cta.line1")}</span>
          </span>
          <span className="mask">
            <span className="gold">{t("cta.line2")}</span>
          </span>
        </h2>

        <p className="lead">{t("cta.lead")}</p>

        <button type="button" className="enter" data-cursor="GO" onClick={openAxisCore}>
          <span className="enter-t">{t("cta.enter")}</span>
          <span className="arw" />
        </button>

        <div className="cta-note">{t("cta.note")}</div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-in">
          {Array.from({ length: 4 }).flatMap((_, pair) =>
            MARQUEE.map((word, i) => <span key={`${pair}-${i}`}>{word}</span>),
          )}
        </div>
      </div>

      <footer className="foot">
        <div className="foot-grid">
          <div className="foot-col">
            <h4>
              AXIS<i>·</i>ONE
            </h4>
            <p style={{ maxWidth: "30ch" }}>{t("foot.about")}</p>
          </div>

          <div className="foot-col">
            <div className="foot-label">{t("foot.contact")}</div>
            <a href="mailto:hello@axisone.jp">hello@axisone.jp</a>
            <a
              href="#cta"
              onClick={(event) => {
                event.preventDefault();
                openAxisCore();
              }}
            >
              {t("foot.startProject")}
            </a>
            <a href="#work">{t("foot.workIndex")}</a>
          </div>

          <div className="foot-col">
            <div className="foot-label">{t("foot.elsewhere")}</div>
            <a href="#">Instagram</a>
            <a href="#">X</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Axis One</span>
          <span>{t("foot.place")}</span>
        </div>
      </footer>
    </>
  );
}
