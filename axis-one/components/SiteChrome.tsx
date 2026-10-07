"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { bootMotion, refreshMotion } from "@/lib/motion";

/**
 * Everything that sits above the page: the preloader, the film grain, the
 * vignette, the cursor and the scene rail — plus the boot call for the motion
 * engine, which needs the whole document in the DOM before it measures.
 */

const RAIL = ["hero", "shift", "axis", "build", "work", "philosophy", "cta"];

export default function SiteChrome() {
  const { lang } = useLang();

  useEffect(() => bootMotion(), []);

  // Japanese and English set type at different lengths, which moves every
  // pinned distance on the page.
  useEffect(() => {
    const id = window.setTimeout(refreshMotion, 150);
    return () => window.clearTimeout(id);
  }, [lang]);

  return (
    <>
      <div id="preloader">
        <div className="pre-mark">
          AXIS<span style={{ color: "#C9A227" }}>·</span>ONE
        </div>
        <div className="pre-bar">
          <i />
        </div>
        <div className="pre-num">000</div>
      </div>
      <div className="curtain" />

      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="cursor" aria-hidden="true">
        <div className="ring">
          <span className="label" />
        </div>
        <div className="dot" />
      </div>

      <div className="rail" aria-hidden="true">
        {RAIL.map((id, index) => (
          <b key={id} data-rail={id}>
            {String(index + 1).padStart(2, "0")}
          </b>
        ))}
      </div>
    </>
  );
}
