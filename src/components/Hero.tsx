import { useEffect } from "react";
import Navbar from "./Navbar";
import BreachDemo from "./BreachDemo";
import { copy, detectLang } from "../i18n";
import { Trust, Problem, Features, Confidential, How, Numbers, Voices, Pricing, Faq, FinalCta, Footer } from "./Sections";

const lang = detectLang();
const t = copy[lang];

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4";

export const VIDEO = VIDEO_SRC;

const titleBase = "hero-title absolute text-white font-medium text-[14vw] md:text-[13vw]";

export default function Hero() {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, []);

  return (
    <>
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.16),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(255,255,255,0.08),transparent_50%)]"
      />
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={VIDEO_SRC}
      />
      <div aria-hidden="true" className="hud-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hud-scan absolute left-0 right-0 top-0" />
      </div>

      <Navbar copy={t} />

      <div className="relative h-full w-full">
        <h1 className={`${titleBase} left-4 md:left-10 top-[24%] md:top-[18%]`}>{t.titles[0]}</h1>
        <h1 className={`${titleBase} right-4 md:right-10 top-[38%]`}>{t.titles[1]}</h1>
        <h1 className={`${titleBase} left-[18%] md:left-[28%] top-[58%]`}>{t.titles[2]}</h1>

        <p className="absolute left-6 md:left-10 top-[46%] max-w-[280px] text-[15px] leading-snug text-white/90">
          {t.description}
        </p>

        {/* top-right stat */}
        <div className="absolute right-6 md:right-24 top-[14%]">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">{t.stats[0].value}</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">{t.stats[0].label}</p>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

        {/* bottom-left stat */}
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight">{t.stats[1].value}</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1">{t.stats[1].label}</p>
        </div>

        {/* bottom-right stat */}
        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">{t.stats[2].value}</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">{t.stats[2].label}</p>
        </div>

        {/* status readout */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-8 flex items-center gap-2 md:gap-3 whitespace-nowrap rounded-full border border-sky-400/30 bg-black/60 backdrop-blur px-4 py-2 font-mono text-[10px] md:text-xs text-sky-300">
          <span className="hud-dot h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden="true" />
          {t.hud.map((h, i) => (
            <span key={h} className={i === 0 ? "" : "before:content-['/'] before:mr-2 md:before:mr-3 before:text-white/30"}>
              {h}
            </span>
          ))}
        </div>
      </div>
    </section>
    <Trust t={t} />
    <Problem t={t} />
    <BreachDemo t={t} />
    <Confidential t={t} />
    <Features t={t} />
    <How t={t} />
    <Numbers t={t} />
    <Voices t={t} />
    <Pricing t={t} />
    <Faq t={t} />
    <FinalCta t={t} />
    <Footer t={t} />
    </>
  );
}
