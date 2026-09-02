# AXIS ONE

Marketing site and interactive diagnostic for AXIS ONE, an AI-native product
studio. One page, seven sections, and a scored self-assessment (**Axis Core**)
backed by a route handler.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | Does                                     |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Development server                       |
| `npm run build`     | Production build                         |
| `npm run start`     | Serve the production build               |
| `npm run lint`      | ESLint (`eslint-config-next`)            |
| `npm run typecheck` | `tsc --noEmit`                           |

## Structure

```
axis-one/
├── app/
│   ├── layout.tsx           Root layout: fonts, metadata, nav, footer
│   ├── page.tsx             Composes the seven sections in narrative order
│   ├── globals.css          Design tokens, shared classes, motion
│   ├── icon.svg             Favicon
│   └── api/axis-core/
│       └── route.ts         GET the instrument, POST a sheet to score it
├── components/
│   ├── Navigation.tsx       Sticky nav, mobile menu           (client)
│   ├── Hero.tsx             The claim
│   ├── TheShift.tsx         01 — why the ground moved
│   ├── TheAxis.tsx          02 — the three planes
│   ├── AxisCore.tsx         03 — the interactive reading      (client)
│   ├── WhatWeBuild.tsx      04 — engagements
│   ├── SelectedWork.tsx     05 — case studies
│   ├── Philosophy.tsx       06 — principles
│   └── FinalCTA.tsx         07 — contact
├── lib/
│   └── axis-core.ts         The scoring engine — pure, no dependencies
└── public/
```

## Axis Core

`lib/axis-core.ts` is the single source of truth for the diagnostic: the three
planes, the nine signals, validation, and scoring. It is imported by both the
client component (question set, types) and the route handler (scoring), so the
instrument can never drift between the two.

A reading is deliberately not an average. Alignment is capped by the weakest
plane, so the weakest plane is weighted:

```
plane score = mean(signals in plane) / 4 × 100
index       = 0.6 × mean(plane scores) + 0.4 × min(plane scores)
```

Bands: `aligned` ≥ 80, `holding` ≥ 60, `drifting` ≥ 35, `off-axis` below that.

### API

**`GET /api/axis-core`** returns the instrument — scale, planes, and signals.

**`POST /api/axis-core`** scores a completed sheet. Every signal must be present
as an integer in `0–4`:

```bash
curl -X POST http://localhost:3000/api/axis-core \
  -H 'content-type: application/json' \
  -d '{"responses":{"intent-1":4,"intent-2":4,"intent-3":3,
                    "system-1":1,"system-2":0,"system-3":1,
                    "surface-1":3,"surface-2":2,"surface-3":3}}'
```

```json
{
  "reading": {
    "index": 42,
    "band": "drifting",
    "headline": "Three efforts, three directions.",
    "summary": "Intent is doing the work at 92, while System sits at 17…",
    "planes": [{ "plane": "intent", "score": 92, "band": "aligned", "…": "…" }],
    "anchor": { "…": "…" },
    "drift": { "…": "…" },
    "spread": 75,
    "moves": ["Close one loop end to end: …"]
  }
}
```

Bad input is rejected with `400` and a message naming the offending signal;
bodies over 4 KB get `413`.

## Design

Tokens live in `app/globals.css` under `@theme`, so they are available as
Tailwind utilities (`bg-base`, `text-muted`, `border-line`, `text-accent`).

| Token      | Value     | Used for                        |
| ---------- | --------- | ------------------------------- |
| `base`     | `#08090a` | Page ground                     |
| `raised`   | `#0e1113` | Panel headers                   |
| `ink`      | `#f2f2ef` | Primary text                    |
| `muted`    | `#8b8f92` | Secondary text                  |
| `line`     | `#1e2225` | Hairlines and borders           |
| `accent`   | `#ff4d1c` | The axis: one accent, used thin |

Section entrances use scroll-linked `animation-timeline: view()` behind an
`@supports` guard, so content is fully visible in browsers without it, and all
motion is disabled under `prefers-reduced-motion`.

## Content

Copy, metrics, case studies and the `hello@axis-one.example.com` address are
placeholders written to size the layout. Replace them before the site goes
anywhere near production. The scoring engine is real.
