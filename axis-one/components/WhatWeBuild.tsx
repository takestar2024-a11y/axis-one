"use client";

import { openAxisCore } from "@/components/AxisCore";
import { useLang, type CopyKey } from "@/lib/i18n";

/**
 * Scene 04 — 事業内容. The four businesses, each lighting its own backdrop
 * plate.
 *
 * They are numbered in the order the lead says they compound: advisory holds
 * the judgement, automation runs the execution, the funnel turns it into
 * revenue, film widens the world. One axis, four surfaces.
 */

const ROWS: Array<{
  n: string;
  name: CopyKey;
  en: CopyKey;
  desc: CopyKey;
  chips: CopyKey[];
}> = [
  {
    n: "1",
    name: "biz.1.name",
    en: "biz.1.en",
    desc: "biz.1.desc",
    chips: ["biz.1.tag1", "biz.1.tag2", "biz.1.tag3"],
  },
  {
    n: "2",
    name: "biz.2.name",
    en: "biz.2.en",
    desc: "biz.2.desc",
    chips: ["biz.2.tag1", "biz.2.tag2", "biz.2.tag3"],
  },
  {
    n: "3",
    name: "biz.3.name",
    en: "biz.3.en",
    desc: "biz.3.desc",
    chips: ["biz.3.tag1", "biz.3.tag2", "biz.3.tag3"],
  },
  {
    n: "4",
    name: "biz.4.name",
    en: "biz.4.en",
    desc: "biz.4.desc",
    chips: ["biz.4.tag1", "biz.4.tag2", "biz.4.tag3"],
  },
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
          <p className="lead" style={{ maxWidth: "40ch" }}>
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
              <span className="row-body">
                <span className="name">{t(row.name)}</span>
                <span className="en">{t(row.en)}</span>
                <span className="desc">{t(row.desc)}</span>
                <span className="chips">
                  {row.chips.map((chip) => (
                    <i key={chip}>{t(chip)}</i>
                  ))}
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
