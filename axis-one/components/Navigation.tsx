"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#shift", label: "The Shift" },
  { href: "#axis", label: "The Axis" },
  { href: "#axis-core", label: "Axis Core" },
  { href: "#build", label: "What We Build" },
  { href: "#work", label: "Work" },
  { href: "#philosophy", label: "Philosophy" },
];

function AxisMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M8 1v14" />
      <path d="M3 5.5h10" opacity="0.55" />
      <path d="M3 10.5h10" opacity="0.55" />
    </svg>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-base/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between gap-8">
        <a
          href="#hero"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <AxisMark className="h-4 w-4 text-accent" />
          <span className="font-mono text-sm tracking-[0.28em] uppercase">
            Axis One
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full border border-line px-4 py-1.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            Start a conversation
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line lg:hidden"
          >
            <span className="sr-only">
              {open ? "Close menu" : "Open menu"}
            </span>
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              {open ? (
                <>
                  <path d="M3.5 3.5l9 9" />
                  <path d="M12.5 3.5l-9 9" />
                </>
              ) : (
                <>
                  <path d="M2.5 5h11" />
                  <path d="M2.5 11h11" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div id="site-menu" className="border-t border-line lg:hidden">
          <ul className="shell flex flex-col py-2">
            {[...LINKS, { href: "#contact", label: "Start a conversation" }].map(
              (link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line/60 py-3 text-sm text-muted transition-colors last:border-b-0 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
