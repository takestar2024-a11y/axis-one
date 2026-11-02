"use client";

import { useLang } from "@/lib/i18n";

/** Scene 02 — three statements, cross-faded against a pinned viewport. */
export default function TheShift() {
  const { t } = useLang();

  return (
    <section className="shift" id="shift">
      <div className="shift-pin">
        <div className="shift-glow" />

        <div className="shift-line" data-shift="1">
          <small>{t("shift.label")}</small>
          <p className="display display--huge">{t("shift.1")}</p>
        </div>

        <div className="shift-line" data-shift="2">
          <p className="display display--huge">{t("shift.2")}</p>
        </div>

        <div className="shift-line" data-shift="3">
          <p
            className="shift-lead"
            style={{ marginInline: "auto", textAlign: "center", maxWidth: "40ch" }}
          >
            {t("shift.3")}
          </p>
        </div>
      </div>
    </section>
  );
}
