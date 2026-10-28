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

export default function Hero() {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, []);

  return (
    <>
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
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
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

      <Navbar copy={t} />

      {/* Flow layout: every block takes its own space, so nothing can overlap
          at any viewport shape. The title is capped by viewport height too. */}
      <div className="relative flex min-h-screen w-full flex-col px-4 md:px-10 pt-28 pb-6 md:pb-8">
        {/* top-right stat */}
        <div className="self-end md:mr-14">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">{t.stats[0].value}</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">{t.stats[0].label}</p>
        </div>

        <h1 className="hero-title mt-4 md:mt-2 font-medium text-white text-[length:min(14vw,12vh)] md:text-[length:min(13vw,14vh)]">
          <span className="block">{t.titles[0]}</span>
          <span className="flex items-end justify-between gap-6">
            <span className="hidden md:block max-w-[240px] lg:max-w-[300px] pb-[0.4em] text-[15px] leading-snug tracking-normal text-white/90">
              {t.description}
            </span>
            <span className="ml-auto">{t.titles[1]}</span>
          </span>
          <span className="block pl-[14%] md:pl-[24%]">{t.titles[2]}</span>
        </h1>

        <p className="md:hidden mt-6 max-w-[320px] text-[15px] leading-snug text-white/90">{t.description}</p>

        <div className="mt-auto pt-10 flex items-end justify-between gap-6 md:px-10">
          {/* bottom-left stat */}
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-5xl font-medium tracking-tight">{t.stats[1].value}</span>
              <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            </div>
            <p className="text-xs md:text-sm text-white/70 mt-1">{t.stats[1].label}</p>
          </div>

          {/* bottom-right stat */}
          <div className="md:mb-4">
            <div className="flex items-center gap-3 justify-end">
              <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
              <span className="text-4xl md:text-5xl font-medium tracking-tight">{t.stats[2].value}</span>
            </div>
            <p className="text-xs md:text-sm text-white/70 mt-1 text-right">{t.stats[2].label}</p>
          </div>
        </div>

        {/* status readout */}
        <div className="mt-6 self-center flex items-center gap-2 md:gap-3 whitespace-nowrap rounded-full border border-sky-400/30 bg-black/60 backdrop-blur px-4 py-2 font-mono text-[10px] md:text-xs text-sky-300">
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
