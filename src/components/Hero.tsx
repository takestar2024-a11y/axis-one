import { useEffect } from "react";
import Navbar from "./Navbar";
import { copy, detectLang } from "../i18n";
import { Trust, Problem, Features, How, Numbers, Voices, Pricing, Faq, FinalCta, Footer } from "./Sections";

const lang = detectLang();
const t = copy[lang];

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4";

const titleBase = "hero-title absolute text-white font-medium text-[14vw] md:text-[13vw]";

export default function Hero() {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, []);

  return (
    <>
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={VIDEO_SRC}
      />

      <Navbar copy={t} />

      <div className="relative h-full w-full">
        <h1 className={`${titleBase} left-4 md:left-10 top-[18%]`}>{t.titles[0]}</h1>
        <h1 className={`${titleBase} right-4 md:right-10 top-[38%]`}>{t.titles[1]}</h1>
        <h1 className={`${titleBase} left-[18%] md:left-[28%] top-[58%]`}>{t.titles[2]}</h1>

        <p className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90">
          {t.description}
        </p>

        {/* top-right stat */}
        <div className="absolute right-6 md:right-24 top-[14%]">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">+65k</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">{t.stats.startups}</p>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

        {/* bottom-left stat */}
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight">+1.5b</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1">{t.stats.protectedData}</p>
        </div>

        {/* bottom-right stat */}
        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">+300k</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">{t.stats.downloads}</p>
        </div>
      </div>
    </section>
    <Trust t={t} />
    <Problem t={t} />
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
