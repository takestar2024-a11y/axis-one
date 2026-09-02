import AxisCore from "@/components/AxisCore";
import FinalCTA from "@/components/FinalCTA";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import SelectedWork from "@/components/SelectedWork";
import TheAxis from "@/components/TheAxis";
import TheShift from "@/components/TheShift";
import WhatWeBuild from "@/components/WhatWeBuild";

export default function Home() {
  return (
    <main>
      <Hero />
      <TheShift />
      <TheAxis />
      <AxisCore />
      <WhatWeBuild />
      <SelectedWork />
      <Philosophy />
      <FinalCTA />
    </main>
  );
}
