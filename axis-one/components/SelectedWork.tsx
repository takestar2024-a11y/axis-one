"use client";

import { useEffect, useRef } from "react";
import { openAxisCore } from "@/components/AxisCore";
import { useLang, type CopyKey } from "@/lib/i18n";
import { mountReels } from "@/lib/reels";

/**
 * Scene 05 — a horizontal track above 768px, a stack below it.
 *
 * These are the studio's own builds, not client engagements: no client name,
 * no delivery year, and the copy says so. Anything that would read as a
 * track record belongs here only once there is one.
 *
 * Each frame runs a generative reel on canvas. To use real footage instead,
 * put an MP4 URL in `video` below: the canvas is replaced by a muted, looping,
 * in-view-only <video>.
 */

const CARDS: Array<{
  reel: string;
  art: string;
  idx: CopyKey;
  title: CopyKey;
  tags: CopyKey;
  video: string;
}> = [
  { reel: "1", art: "art-1", idx: "work.1.idx", title: "work.1.title", tags: "work.1.tags", video: "/work/ai-video.mp4" },
  { reel: "2", art: "art-2", idx: "work.2.idx", title: "work.2.title", tags: "work.2.tags", video: "/work/brand-experience.mp4" },
  { reel: "3", art: "art-3", idx: "work.3.idx", title: "work.3.title", tags: "work.3.tags", video: "/work/growth-system.mp4" },
];

export default function SelectedWork() {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    return mountReels(root.current);
  }, []);

  return (
    <section className="work" id="work">
      <div className="work-pin" ref={root}>
        <div className="work-track">
          <div className="work-intro">
            <h2>{t("work.title")}</h2>
            <p className="lead">{t("work.lead")}</p>
          </div>

          {CARDS.map((card) => (
            <article className="card" key={card.reel} data-cursor="EXPLORE">
              <div className="frame">
                <div className={`art ${card.art}`} data-video={card.video}>
                  <canvas className="reel" data-reel={card.reel} />
                </div>
                <span className="idx">{t(card.idx)}</span>
                <span className="rec">
                  <b />
                  Reel 0{card.reel}
                </span>
                <i className="scrub" />
              </div>

              <div className="meta">
                <h3>{t(card.title)}</h3>
                <div className="tags">
                  <div>{t(card.tags)}</div>
                  <div>{t("work.origin")}</div>
                </div>
              </div>
            </article>
          ))}

          <div className="work-end">
            <a
              href="#cta"
              data-cursor="ENTER"
              onClick={(event) => {
                event.preventDefault();
                openAxisCore();
              }}
            >
              {t("work.end")}
            </a>
          </div>
        </div>

        <div className="work-bar">
          <i />
        </div>
      </div>
    </section>
  );
}
