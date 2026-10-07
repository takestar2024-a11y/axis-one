"use client";

import { openAxisCore } from "@/components/AxisCore";
import { useLang, type CopyKey } from "@/lib/i18n";

/**
 * Scene 04 — the engagement ladder, each rung lighting its own backdrop plate.
 *
 * The order is the sales order: nothing below starts before the diagnosis
 * above it, so the numbering carries real sequence, not decoration.
 */

const ROWS: Array<{
  n: string;
  name: CopyKey;
  price: CopyKey;
  terms: CopyKey;
  desc: CopyKey;
}> = [
  { n: "1", name: "build.1.name", price: "build.1.price", terms: "build.1.terms", desc: "build.1.desc" },
  { n: "2", name: "build.2.name", price: "build.2.price", terms: "build.2.terms", desc: "build.2.desc" },
  { n: "3", name: "build.3.name", price: "build.3.price", terms: "build.3.terms", desc: "build.3.desc" },
  { n: "4", name: "build.4.name", price: "build.4.price", terms: "build.4.terms", desc: "build.4.desc" },
];

export default function WhatWeBuild() {
  const { t } = useLang();

  return (
    <section className="build" id="build">
      <div className="build-bg" aria-hidden="true">
        <div className="plate plate-1" data-plate="1" />
        <div className="plate plate-2" data-plate="2" />
        <div className="plate plate-3" data-plate="3" />
        <div className="plate plate-4" data-plate="4" />
      </div>

      <div className="build-list">
        <div className="build-head">
          <h2>{t("build.title")}</h2>
          <p className="lead" style={{ maxWidth: "34ch" }}>
            {t("build.lead")}
          </p>
        </div>

        {ROWS.map((row) => (
          <a
            key={row.n}
            className="row"
            href="#cta"
            data-row={row.n}
            data-cursor="VIEW"
            onClick={(event) => {
              event.preventDefault();
              openAxisCore();
            }}
          >
            <div className="row-in">
              <span className="num">{`0${row.n}`}</span>
              <span className="name">{t(row.name)}</span>
              <span className="terms">
                <b>{t(row.price)}</b>
                <i>{t(row.terms)}</i>
              </span>
              <span className="desc">{t(row.desc)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
