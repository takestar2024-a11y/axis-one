import type { Metadata, Viewport } from "next";
import AxisCore from "@/components/AxisCore";
import Navigation from "@/components/Navigation";
import SiteChrome from "@/components/SiteChrome";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const description =
  "AXIS ONE is a creative growth company. We design AI systems, creative and automation for the next generation of business.";

export const metadata: Metadata = {
  title: "AXIS ONE — One Axis. Infinite Possibilities.",
  description,
  openGraph: {
    title: "AXIS ONE — One Axis. Infinite Possibilities.",
    description:
      "AI × CREATIVE × MARKETING. Building systems for the next generation of business.",
    type: "website",
    siteName: "AXIS ONE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `lang` is swapped to "ja" client-side by LangProvider, which also drives
    // the Japanese typography rules in globals.css.
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* The rule below guards against per-page font links in the Pages
            Router. In the App Router a link in the root layout is global,
            which is exactly what a five-family type system needs — and the
            Japanese faces are far too heavy to self-host. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Zen+Old+Mincho:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="is-loading">
        <LangProvider>
          <SiteChrome />
          <Navigation />
          <main>{children}</main>
          <AxisCore />
        </LangProvider>
      </body>
    </html>
  );
}
