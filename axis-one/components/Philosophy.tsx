"use client";

import { useLang } from "@/lib/i18n";

/** Scene 06 — three lines, the last one left standing. */
export default function Philosophy() {
  const { t } = useLang();

  return (
    <section className="philo" id="philosophy">
      <div className="philo-pin">
        <div className="philo-line" data-philo="1">
          <p className="display">{t("philo.1")}</p>
        </div>
        <div className="philo-line" data-philo="2">
          <p className="display">{t("philo.2")}</p>
        </div>
        <div className="philo-line" data-philo="3">
          <p className="display">{t("philo.3")}</p>
        </div>
        <div className="philo-rule" />
      </div>
    </section>
  );
}
