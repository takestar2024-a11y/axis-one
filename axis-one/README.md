# AXIS ONE

The AXIS ONE site: one scroll-driven page in seven scenes, bilingual (JA/EN),
with **Axis Core** — an assistant that answers from a live model when the site
is connected to one, and from a local knowledge base when it is not.

Next.js 16 (App Router), React 19, TypeScript, GSAP + ScrollTrigger, Lenis.
No CSS framework: the design system is hand-written custom properties.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | Does                          |
| ------------------- | ----------------------------- |
| `npm run dev`       | Development server            |
| `npm run build`     | Production build              |
| `npm run start`     | Serve the production build    |
| `npm run lint`      | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit`                |

### Environment

```bash
# .env.local — optional. Without it, Axis Core answers from its local core.
ANTHROPIC_API_KEY=sk-ant-...
```

The key is read **only** on the server, inside `app/api/axis-core/route.ts`.
It is never sent to the browser.

## Structure

```
axis-one/
├── app/
│   ├── layout.tsx           Fonts, metadata, language provider, chrome
│   ├── page.tsx             The seven scenes, in order
│   ├── globals.css          The whole design system (tokens → scenes → motion)
│   └── api/axis-core/
│       └── route.ts         Server proxy to Claude; holds the API key
├── components/
│   ├── SiteChrome.tsx       Preloader, grain, vignette, cursor, scene rail
│   ├── Navigation.tsx       Nav, language toggle
│   ├── Hero.tsx             01 — One axis. Infinite possibilities.
│   ├── TheShift.tsx         02 — the world is changing
│   ├── TheAxis.tsx          03 — you are the center
│   ├── WhatWeBuild.tsx      04 — four disciplines
│   ├── SelectedWork.tsx     05 — horizontal work track
│   ├── Philosophy.tsx       06 — three statements
│   ├── FinalCTA.tsx         07 — the ask, marquee, footer
│   └── AxisCore.tsx         The assistant
└── lib/
    ├── i18n.tsx             JA/EN copy + language store
    ├── motion.ts            Lenis, cursor, canvases, every GSAP scene
    ├── reels.ts             Three generative film loops
    └── axis-core.ts         Assistant knowledge base + system prompt
```

## How it holds together

**Copy lives in `lib/i18n.tsx`**, keyed and typed, with values as `ReactNode`
so line breaks and accent spans stay with the sentence they belong to. The
language is external state read through `useSyncExternalStore`, so the server
renders English, hydration matches, and a stored or browser preference lands on
the next render. Switching language sets `<html lang>`, which is what the
Japanese typography rules in `globals.css` key off.

**Motion lives in `lib/motion.ts`** and is booted once from `SiteChrome`. The
scenes are scroll-driven, so they measure the real document rather than
re-render: React owns the markup, the engine owns the timeline. It never
removes a node React rendered — it hides them. Language changes re-run
`ScrollTrigger.refresh()`, because Japanese and English set type at different
lengths and every pinned distance moves.

**The reels are generated in-browser** (`lib/reels.ts`): a latent flythrough, a
rotating monolith, a growth network — deterministic, so every visit renders the
same film, and paused whenever they are off-screen. To use real footage, set
`video` on a card in `SelectedWork.tsx` and that frame swaps to a muted,
looping, in-view-only `<video>`.

**Reduced motion is a first-class path**, not an afterthought: pins unpin, the
horizontal track becomes a stack, the reels freeze on a representative frame,
and the preloader resolves immediately.

## Axis Core

`components/AxisCore.tsx` is the interface; `lib/axis-core.ts` is the brain.

Answers are tried in one order:

1. **`POST /api/axis-core`** — the server proxy. It builds the system prompt
   server-side (so a visitor cannot rewrite the brief), calls
   `claude-opus-5` at low effort with a cached system prefix, and returns text.
   Refusal fallbacks are enabled, so a declined turn is re-run on a fallback
   model inside the same call rather than returning nothing.
2. **The local knowledge core** — keyword-matched answers covering services,
   process, budget, timeline, work and contact, in both languages. No network,
   no cost, always available.

The status line tells you which one answered. Without `ANTHROPIC_API_KEY` the
route returns `503` and the panel falls back silently, so the assistant is
never broken — only quieter.

Request shape:

```bash
curl -X POST http://localhost:3000/api/axis-core \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"What do you build?"}],"lang":"en"}'
```

Bad input gets `400`, oversized bodies `413`, too many questions from one
address `429`. The rate limit is in-memory and therefore per instance — it
wants a shared store the day this runs on more than one node.

## Content

Copy, the three case studies and `hello@axisone.jp` are the brand's own. The
social links in the footer are placeholders.
