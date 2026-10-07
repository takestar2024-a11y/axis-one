/**
 * AXIS ONE — work reels
 *
 * Three generative film loops rendered in-browser. No stock footage, no
 * external requests, no licensing: the reels are the work. Put an MP4 URL in
 * `data-video` on any `.art` and that frame switches to a real, in-view-only
 * looping <video> instead.
 */

const LOOP = 15000; // ms per reel cycle
const FPS = 30;

/** Deterministic RNG, so every visit renders the same film. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface Point {
  x: number;
  y: number;
  z: number;
  g: boolean;
}

interface Net {
  nodes: Array<{ x: number; y: number; s: number }>;
  edges: Array<{ a: number; b: number; o: number }>;
}

interface ReelState {
  pts: Point[];
  net: Net;
}

type Renderer = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  state: ReelState,
) => void;

function makeField(seed: number): Point[] {
  const r = rng(seed);
  const pts: Point[] = [];
  for (let i = 0; i < 190; i++) {
    pts.push({
      x: (r() - 0.5) * 2.4,
      y: (r() - 0.5) * 2.4,
      z: r(),
      g: r() > 0.72,
    });
  }
  return pts;
}

function makeNet(seed: number): Net {
  const r = rng(seed);
  const nodes: Net["nodes"] = [];
  const edges: Net["edges"] = [];
  for (let i = 0; i < 16; i++) {
    nodes.push({ x: 0.08 + r() * 0.84, y: 0.1 + r() * 0.62, s: r() });
  }
  for (let a = 0; a < nodes.length; a++) {
    const d: Array<{ b: number; v: number }> = [];
    for (let b = 0; b < nodes.length; b++) {
      if (a === b) continue;
      d.push({ b, v: Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y) });
    }
    d.sort((m, n) => m.v - n.v);
    edges.push({ a, b: d[0].b, o: r() });
    edges.push({ a, b: d[1].b, o: r() });
  }
  return { nodes, edges };
}

/* ---------- reel 01 — latent flythrough ---------- */
const reel1: Renderer = (ctx, w, h, p, S) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.5;
  const f = Math.min(w, h) * 0.62;

  for (const q of S.pts) {
    let z = (((q.z - p) % 1) + 1) % 1;
    z = 0.035 + z * 0.965;
    const z2 = Math.min(0.999, z + 0.035);
    const sx = cx + (q.x * f) / z;
    const sy = cy + (q.y * f) / z;
    const px = cx + (q.x * f) / z2;
    const py = cy + (q.y * f) / z2;
    if (sx < -80 || sx > w + 80 || sy < -80 || sy > h + 80) continue;
    const a = Math.pow(1 - z, 1.6);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(sx, sy);
    ctx.lineWidth = Math.max(0.6, (1 - z) * 2.6);
    ctx.strokeStyle = q.g
      ? `rgba(232,215,163,${(a * 0.85).toFixed(3)})`
      : `rgba(157,78,221,${(a * 0.62).toFixed(3)})`;
    ctx.stroke();
  }

  // scan bands drifting down the frame
  for (let b = 0; b < 3; b++) {
    const y = ((p * (0.6 + b * 0.25) + b * 0.33) % 1) * h;
    const g = ctx.createLinearGradient(0, y - 40, 0, y + 40);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.5, "rgba(255,255,255,0.045)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 40, w, 80);
  }

  // aperture bloom
  const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
  bloom.addColorStop(0, `rgba(232,215,163,${0.1 + 0.05 * Math.sin(p * 6.2832)})`);
  bloom.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, w, h);
};

/* ---------- reel 02 — rotating monolith ---------- */
const reel2: Renderer = (ctx, w, h, p) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.52;
  const R = Math.min(w, h) * 0.4;

  const N = 54;
  for (let i = 0; i < N; i++) {
    const a = p * Math.PI * 2 + (i / N) * Math.PI * 2;
    const x = cx + Math.cos(a) * R;
    const depth = (Math.sin(a) + 1) / 2; // 0 back -> 1 front
    const hh = R * (1.05 + 0.5 * depth);
    const al = 0.05 + depth * 0.42;
    const g = ctx.createLinearGradient(0, cy - hh / 2, 0, cy + hh / 2);
    g.addColorStop(0, "rgba(232,215,163,0)");
    g.addColorStop(0.42, `rgba(232,215,163,${(al * 0.9).toFixed(3)})`);
    g.addColorStop(0.62, `rgba(157,78,221,${(al * 0.7).toFixed(3)})`);
    g.addColorStop(1, "rgba(157,78,221,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - (0.5 + depth * 0.9), cy - hh / 2, 1 + depth * 1.8, hh);
  }

  // light bar crossing the frame
  const ly = ((p * 1.0) % 1) * (h * 1.5) - h * 0.25;
  const lg = ctx.createLinearGradient(0, ly - 70, 0, ly + 70);
  lg.addColorStop(0, "rgba(255,255,255,0)");
  lg.addColorStop(0.5, "rgba(255,255,255,0.10)");
  lg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = lg;
  ctx.fillRect(0, ly - 70, w, 140);

  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.8);
  cg.addColorStop(0, "rgba(255,255,255,0.20)");
  cg.addColorStop(0.3, "rgba(232,215,163,0.10)");
  cg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, w, h);
};

/* ---------- reel 03 — growth network ---------- */
const reel3: Renderer = (ctx, w, h, p, S) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  // perspective floor
  for (let i = 0; i < 12; i++) {
    const t = (i / 12 + p * 0.5) % 1;
    const y = h * (0.7 + Math.pow(t, 2.2) * 0.34);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.strokeStyle = `rgba(255,255,255,${(0.03 + t * 0.07).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const N = S.net.nodes;
  const E = S.net.edges;
  const X = (n: number) => N[n].x * w;
  const Y = (n: number) => N[n].y * h * 0.92;

  ctx.lineWidth = 1;
  for (const e of E) {
    ctx.beginPath();
    ctx.moveTo(X(e.a), Y(e.a));
    ctx.lineTo(X(e.b), Y(e.b));
    ctx.strokeStyle = "rgba(255,255,255,0.075)";
    ctx.stroke();

    // travelling pulse
    const k = (p * 1.6 + e.o) % 1;
    const px = X(e.a) + (X(e.b) - X(e.a)) * k;
    const py = Y(e.a) + (Y(e.b) - Y(e.a)) * k;
    const fade = Math.sin(k * Math.PI);
    ctx.beginPath();
    ctx.arc(px, py, 1.6, 0, 6.2832);
    ctx.fillStyle = `rgba(157,78,221,${(fade * 0.85).toFixed(3)})`;
    ctx.fill();
  }

  for (let n = 0; n < N.length; n++) {
    const pulse = 0.55 + 0.45 * Math.sin(p * 6.2832 * 2 + N[n].s * 6.2832);
    ctx.beginPath();
    ctx.arc(X(n), Y(n), 1.6 + N[n].s * 1.6, 0, 6.2832);
    ctx.fillStyle = `rgba(232,215,163,${(0.35 + pulse * 0.5).toFixed(3)})`;
    ctx.fill();
  }

  // the curve that keeps going up
  const prog = Math.min(1, (p % 1) * 1.35);
  ctx.beginPath();
  for (let s = 0; s <= 60; s++) {
    const u = (s / 60) * prog;
    const cxp = u * w;
    const cyp = h * (0.94 - Math.pow(u, 1.7) * 0.62 - Math.sin(u * 9) * 0.014);
    if (s === 0) ctx.moveTo(cxp, cyp);
    else ctx.lineTo(cxp, cyp);
  }
  ctx.strokeStyle = "rgba(232,215,163,0.85)";
  ctx.lineWidth = 1.4;
  ctx.shadowColor = "rgba(201,162,39,0.8)";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;
};

const RENDERERS: Record<string, Renderer> = { "1": reel1, "2": reel2, "3": reel3 };

interface Mounted {
  ctx: CanvasRenderingContext2D;
  render: Renderer;
  state: ReelState;
  scrub: HTMLElement | null;
  w: number;
  h: number;
  visible: boolean;
}

/**
 * Wire every `.card .frame > .art` under `root`. Returns a teardown that stops
 * the loop and releases observers.
 */
export function mountReels(root: HTMLElement): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = Boolean(connection?.saveData);

  const arts = Array.from(root.querySelectorAll<HTMLElement>(".card .frame > .art"));
  const cleanups: Array<() => void> = [];
  const reels: Mounted[] = [];

  for (const art of arts) {
    const src = (art.getAttribute("data-video") ?? "").trim();
    const canvas = art.querySelector<HTMLCanvasElement>("canvas.reel");
    const scrub = art.parentElement?.querySelector<HTMLElement>(".scrub") ?? null;

    /* real footage path */
    if (src && !saveData) {
      if (canvas) canvas.style.display = "none";
      // Generated reels are framed at 1.14 and ease to 1 on hover; real footage
      // is composed, so it sits at 1:1 and keeps its whole frame.
      art.classList.add("has-video");
      const video = document.createElement("video");
      video.className = "reel";
      video.src = src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "none";
      art.appendChild(video);

      // `preload="none"` keeps the file off the wire until the card is near
      // the viewport. Flipping the attribute alone does not restart resource
      // selection — load() has to be called explicitly, once.
      let requested = false;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (!requested) {
              requested = true;
              video.preload = "auto";
              video.load();
            }
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(art);

      const onTime = () => {
        if (scrub && video.duration) {
          scrub.style.width = `${(video.currentTime / video.duration) * 100}%`;
        }
      };
      video.addEventListener("timeupdate", onTime);

      cleanups.push(() => {
        observer.disconnect();
        video.removeEventListener("timeupdate", onTime);
        video.pause();
        video.remove();
        art.classList.remove("has-video");
        if (canvas) canvas.style.display = "";
      });
      continue;
    }

    if (!canvas) continue;
    const id = canvas.getAttribute("data-reel") ?? "1";
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    const mounted: Mounted = {
      ctx,
      render: RENDERERS[id] ?? reel1,
      state: {
        pts: makeField(1337 + Number(id) * 97),
        net: makeNet(4242 + Number(id) * 31),
      },
      scrub,
      w: 0,
      h: 0,
      visible: true,
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mounted.w = canvas.clientWidth;
      mounted.h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(mounted.w * dpr));
      canvas.height = Math.max(1, Math.floor(mounted.h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const resizeObserver = new ResizeObserver(size);
    resizeObserver.observe(canvas);

    const observer = new IntersectionObserver(
      (entries) => {
        mounted.visible = entries[0].isIntersecting;
      },
      { rootMargin: "180px" },
    );
    observer.observe(canvas);

    cleanups.push(() => {
      resizeObserver.disconnect();
      observer.disconnect();
    });

    reels.push(mounted);
  }

  function paint(reel: Mounted, p: number) {
    if (reel.w < 2) return;
    reel.render(reel.ctx, reel.w, reel.h, p, reel.state);
    if (reel.scrub) reel.scrub.style.width = `${(p * 100).toFixed(1)}%`;
  }

  if (reels.length && reduced) {
    reels.forEach((reel) => paint(reel, 0.42));
  } else if (reels.length) {
    let last = 0;
    let frame = 0;
    const step = 1000 / FPS;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < step) return;
      last = now;
      const p = (now % LOOP) / LOOP;
      reels.forEach((reel, i) => {
        if (reel.visible) paint(reel, (p + i * 0.21) % 1);
      });
    };
    frame = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(frame));
  }

  return () => cleanups.forEach((fn) => fn());
}
