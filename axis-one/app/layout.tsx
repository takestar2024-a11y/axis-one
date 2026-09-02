import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "AXIS ONE is an AI-native product studio. We find the axis a business turns on and build the system that runs on it.";

export const metadata: Metadata = {
  metadataBase: new URL("https://axis-one.example.com"),
  title: {
    default: "AXIS ONE — Find the axis. Build the system.",
    template: "%s — AXIS ONE",
  },
  description,
  openGraph: {
    title: "AXIS ONE — Find the axis. Build the system.",
    description,
    type: "website",
    siteName: "AXIS ONE",
  },
  twitter: {
    card: "summary_large_image",
    title: "AXIS ONE",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-base text-ink">
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-base"
        >
          Skip to content
        </a>
        <Navigation />
        <div className="flex-1">{children}</div>
        <footer className="hairline">
          <div className="shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
              AXIS ONE — AI-native product studio
            </p>
            <p className="font-mono text-xs text-muted">
              © {new Date().getFullYear()} Axis One. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
