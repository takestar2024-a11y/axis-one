"use client";

import { useLang } from "@/lib/i18n";

/** Scene 03 — the instrument drawn on #axis-canvas, with two lines over it. */
export default function TheAxis() {
  const { t } = useLang();

  return (
    <section className="axis" id="axis">
      <div className="axis-pin">
        <canvas id="axis-canvas" />

        <div className="axis-copy">
          <div className="ax" data-ax="1">
            <p className="display display--huge">{t("axis.1")}</p>
          </div>
          <div className="ax" data-ax="2">
            <p className="display display--huge">{t("axis.2")}</p>
          </div>
        </div>

        <div className="axis-meta">
          <span>{t("axis.metaLeft")}</span>
          <span>{t("axis.metaRight")}</span>
        </div>
      </div>
    </section>
  );
}
