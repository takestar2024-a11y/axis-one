/**
 * AXIS ONE — motion engine
 *
 *   bootMotion()     preload -> curtain -> hero intro, then every scene
 *   refreshMotion()  recompute pinned distances (fonts, language change)
 *
 * Everything here is imperative and DOM-level on purpose: the scenes are
 * scroll-driven, so they are measured against the real document rather than
 * re-rendered. React owns the markup; this owns the timeline. Nothing here
 * ever removes a node React rendered — it hides them instead.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

let booted = false;

export function refreshMotion() {
  ScrollTrigger.refresh();
}

export function bootMotion(): () => void {
  if (booted) return () => {};
  booted = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const cleanups: Array<() => void> = [];

  /* ==========================================================
     Smooth scroll — Lenis drives native scroll, ScrollTrigger reads it
     ========================================================== */
  let lenis: Lenis | null = null;
  if (!reduced) {
    lenis = new Lenis({
      duration: touch ? 0.8 : 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // mobile keeps native momentum — performance first
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    cleanups.push(() => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      delete window.__lenis;
      lenis = null;
    });
  }

  /* anchor links route through Lenis when it is running */
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    const onClick = (event: MouseEvent) => {
      const id = a.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    };
    a.addEventListener("click", onClick);
    cleanups.push(() => a.removeEventListener("click", onClick));
  });

  /* ==========================================================
     Custom cursor — desktop only
     ========================================================== */
  const cursor = $(".cursor");
  if (cursor && !touch && !reduced) {
    const ring = $(".ring", cursor)!;
    const dot = $(".dot", cursor)!;
    const label = $(".label", cursor)!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let shown = false;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
      if (!shown) {
        shown = true;
        cursor.style.opacity = "1";
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${scale})`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    ring.style.transition = "border-color .4s ease";
    label.style.transition = "opacity .35s ease";

    const setState = (next: number, text: string) => {
      scale = next;
      ring.style.borderColor = text ? "rgba(232,215,163,.9)" : "rgba(255,255,255,.6)";
      label.textContent = text;
      label.style.opacity = text ? "1" : "0";
    };

    $$("a, button, [data-cursor], .card, .row").forEach((target) => {
      const enter = () => {
        const text = target.getAttribute("data-cursor") ?? "";
        setState(text ? 1.9 : 1.5, text);
      };
      const leave = () => setState(1, "");
      target.addEventListener("mouseenter", enter);
      target.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        target.removeEventListener("mouseenter", enter);
        target.removeEventListener("mouseleave", leave);
      });
    });

    cleanups.push(() => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      cursor.style.opacity = "0";
    });
  }

  /* ==========================================================
     Generative canvases — one rAF driver, paused offscreen, DPR capped at 2
     ========================================================== */
  interface Scene {
    draw: (t: number) => void;
    still: () => void;
  }

  function makeCanvas(
    el: HTMLCanvasElement | null,
    render: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
  ): Scene | null {
    if (!el) return null;
    const ctx = el.getContext("2d");
    if (!ctx) return null;

    let w = 0;
    let h = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = Math.floor(w * dpr);
      el.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { rootMargin: "160px" },
    );
    observer.observe(el);

    cleanups.push(() => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    });

    return {
      draw: (t) => {
        if (visible && w > 0) render(ctx, w, h, t);
      },
      still: () => {
        resize();
        render(ctx, w, h, 0);
      },
    };
  }

  /* Scene 01 — slow orbital field */
  function heroRender(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.5;
    const cy = h * 0.54;
    const R = Math.min(w, h);

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
    g.addColorStop(0.0, "rgba(38,24,66,0.92)");
    g.addColorStop(0.38, "rgba(16,12,26,0.60)");
    g.addColorStop(1.0, "rgba(5,5,5,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 8; i++) {
      const r = R * (0.16 + i * 0.082);
      const dir = i % 2 ? -1 : 1;
      ctx.save();
      ctx.rotate(t * 0.000035 * dir * (1 + i * 0.12) + i * 0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * (0.24 + i * 0.032), 0, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = i % 3 === 0 ? "rgba(201,162,39,0.16)" : "rgba(157,78,221,0.11)";
      ctx.stroke();

      const a = t * 0.00016 * dir * (1 + i * 0.2);
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r * (0.24 + i * 0.032);
      ctx.beginPath();
      ctx.arc(px, py, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "rgba(232,215,163,0.55)" : "rgba(255,255,255,0.30)";
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "rgba(255,255,255,0)");
    bg.addColorStop(0.5, `rgba(232,215,163,${0.1 + 0.04 * Math.sin(t * 0.0004)})`);
    bg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(cx - 0.5, 0, 1, h);
  }

  /* Scene 03 — the axis instrument */
  function axisRender(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.5;
    const cy = h * 0.5;
    const R = Math.min(w, h) * 0.42;

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.1);
    g.addColorStop(0, "rgba(109,40,217,0.30)");
    g.addColorStop(0.45, "rgba(10,10,15,0.55)");
    g.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);

    ctx.save();
    ctx.rotate(t * 0.00004);
    for (let k = 0; k < 96; k++) {
      const ang = (k / 96) * Math.PI * 2;
      const len = k % 8 === 0 ? R * 0.1 : R * 0.045;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * R, Math.sin(ang) * R);
      ctx.lineTo(Math.cos(ang) * (R + len), Math.sin(ang) * (R + len));
      ctx.strokeStyle = k % 8 === 0 ? "rgba(201,162,39,0.42)" : "rgba(255,255,255,0.13)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, R * (i / 5) * 0.92, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${0.05 + i * 0.012})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let j = 0; j < 3; j++) {
      ctx.save();
      ctx.rotate(t * 0.00022 * (j % 2 ? -1 : 1) * (1 + j * 0.5));
      ctx.beginPath();
      ctx.arc(0, 0, R * (0.52 + j * 0.19), -0.5 - j * 0.3, 0.9 + j * 0.2);
      ctx.strokeStyle = j === 1 ? "rgba(232,215,163,0.75)" : "rgba(157,78,221,0.62)";
      ctx.lineWidth = j === 1 ? 1.4 : 1;
      ctx.stroke();
      ctx.restore();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-R * 1.35, 0);
    ctx.lineTo(R * 1.35, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -R * 1.35);
    ctx.lineTo(0, R * 1.35);
    ctx.stroke();

    const pulse = 0.5 + 0.5 * Math.sin(t * 0.0011);
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.3);
    cg.addColorStop(0, `rgba(255,255,255,${0.85 - pulse * 0.15})`);
    cg.addColorStop(0.18, "rgba(232,215,163,0.42)");
    cg.addColorStop(1, "rgba(157,78,221,0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  const heroScene = makeCanvas($<HTMLCanvasElement>("#hero-canvas"), heroRender);
  const axisScene = makeCanvas($<HTMLCanvasElement>("#axis-canvas"), axisRender);

  if (reduced) {
    heroScene?.still();
    axisScene?.still();
  } else {
    let frame = 0;
    const tick = (t: number) => {
      heroScene?.draw(t);
      axisScene?.draw(t);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(frame));
  }

  /* ==========================================================
     Preloader -> hero intro
     ========================================================== */
  function heroIn() {
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from("#hero-canvas", { opacity: 0, scale: 1.14, duration: 2.4, ease: "power2.out" }, 0)
      .to(".hero-mark", { opacity: 1, duration: 1.4 }, 0.25)
      .from(".hero-title .mask > span", { yPercent: 112, duration: 1.6, stagger: 0.11 }, 0.45)
      .to(".hero-sub", { opacity: 1, duration: 1.4 }, 1.15)
      .from(".hero-sub > *", { y: 18, opacity: 0, duration: 1.2, stagger: 0.12 }, 1.15)
      .to(".hero-foot", { opacity: 1, duration: 1.2 }, 1.5);
  }

  /* Reduced motion: no timeline, everything simply visible. */
  function settleWithoutMotion() {
    $$(".hero-mark, .hero-sub, .hero-foot").forEach((el) => {
      el.style.opacity = "1";
    });
    const pre = $("#preloader");
    const curtain = $(".curtain");
    if (pre) pre.style.display = "none";
    if (curtain) curtain.style.display = "none";
    $$(".row").forEach((row) => row.classList.add("on"));
    $('[data-plate="1"]')?.classList.add("on");
  }

  function intro() {
    const pre = $("#preloader");
    const bar = $(".pre-bar i");
    const num = $(".pre-num");
    const mark = $(".pre-mark");
    const curtain = $(".curtain");

    document.body.classList.remove("is-loading");

    if (reduced || !pre || !bar || !num || !mark || !curtain) {
      settleWithoutMotion();
      return;
    }

    const counter = { v: 0 };
    gsap
      .timeline()
      .to(mark, { opacity: 1, duration: 1.1, ease: "power2.out" })
      .to(bar, { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0.2)
      .to(
        counter,
        {
          v: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            num.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0.2,
      )
      .to([mark, bar, num], { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.15")
      .set(pre, { display: "none" })
      .to(curtain, { scaleY: 0, transformOrigin: "top", duration: 1.25, ease: "expo.inOut" }, "-=0.1")
      .add(heroIn, "-=0.75");
  }

  /* ==========================================================
     Scenes
     ========================================================== */
  const mm = gsap.matchMedia();

  function scenes() {
    if (reduced) return;

    /* nav state */
    ScrollTrigger.create({
      start: 60,
      end: 99999,
      onToggle: (self) => $(".nav")?.classList.toggle("is-stuck", self.isActive),
    });

    /* scene rail */
    $$(".rail b").forEach((b) => {
      const section = document.getElementById(b.getAttribute("data-rail") ?? "");
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => b.classList.toggle("on", self.isActive),
      });
    });

    /* SCENE 01 exit — fade / blur / scale */
    gsap
      .timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
      })
      .to(".hero-inner", { scale: 0.94, opacity: 0, filter: "blur(14px)", ease: "none" }, 0)
      .to("#hero-canvas", { scale: 1.16, opacity: 0.25, ease: "none" }, 0)
      .to(".hero-foot", { opacity: 0, duration: 0.2, ease: "none" }, 0);

    /* SCENE 02 — the shift */
    const shiftLines = $$(".shift-line");
    gsap.set(shiftLines, { opacity: 0, filter: "blur(22px)", scale: 1.08, y: 30 });
    const shiftTl = gsap.timeline({
      scrollTrigger: { trigger: ".shift", start: "top top", end: "bottom bottom", scrub: 0.9 },
    });
    shiftLines.forEach((line, i) => {
      shiftTl
        .to(line, { opacity: 1, filter: "blur(0px)", scale: 1, y: 0, duration: 1, ease: "power2.out" }, i * 1.35)
        .to(line, { opacity: 0, filter: "blur(16px)", scale: 0.97, y: -30, duration: 0.85, ease: "power2.in" }, i * 1.35 + 1.05);
    });
    gsap.to(".shift-glow", {
      scale: 1.5,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: { trigger: ".shift", start: "top top", end: "bottom bottom", scrub: 1.2 },
    });

    /* SCENE 03 — the axis */
    const axLines = $$(".ax");
    gsap.set(axLines, { opacity: 0, filter: "blur(18px)", y: 26 });
    gsap
      .timeline({
        scrollTrigger: { trigger: ".axis", start: "top top", end: "bottom bottom", scrub: 0.9 },
      })
      .to("#axis-canvas", { scale: 1.18, ease: "none" }, 0)
      .to(axLines[0], { opacity: 1, filter: "blur(0px)", y: 0, duration: 1 }, 0.35)
      .to(axLines[0], { opacity: 0, filter: "blur(14px)", y: -26, duration: 0.8 }, 1.6)
      .to(axLines[1], { opacity: 1, filter: "blur(0px)", y: 0, duration: 1 }, 2.3)
      .to(".axis-meta", { opacity: 0.2, ease: "none" }, 0);

    /* SCENE 04 — what we build */
    const rows = $$(".row");
    const plates = $$(".plate");
    const activate = (n: string) => {
      rows.forEach((row) => row.classList.toggle("on", row.getAttribute("data-row") === n));
      plates.forEach((plate) => plate.classList.toggle("on", plate.getAttribute("data-plate") === n));
    };
    activate("1");

    rows.forEach((row) => {
      const n = row.getAttribute("data-row") ?? "1";
      ScrollTrigger.create({
        trigger: row,
        start: "top 68%",
        end: "bottom 42%",
        onEnter: () => activate(n),
        onEnterBack: () => activate(n),
      });
      if (!touch) {
        const enter = () => activate(n);
        row.addEventListener("mouseenter", enter);
        cleanups.push(() => row.removeEventListener("mouseenter", enter));
      }
      gsap.from(row, {
        y: 46,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: row, start: "top 88%" },
      });
    });

    gsap.from(".build-head > *", {
      y: 34,
      opacity: 0,
      duration: 1.3,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: ".build-head", start: "top 82%" },
    });

    /* SCENE 05 — selected work (horizontal above 768px) */
    mm.add("(min-width: 769px)", () => {
      const track = $(".work-track");
      const pin = $(".work-pin");
      const bar = $(".work-bar i");
      if (!track || !pin) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".work",
          start: "top top",
          end: () => `+=${distance()}`,
          pin,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar) bar.style.width = `${(self.progress * 100).toFixed(2)}%`;
          },
        },
      });

      gsap.from(".card", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work", start: "top 60%" },
      });

      return () => gsap.set(track, { x: 0 });
    });

    mm.add("(max-width: 768px)", () => {
      gsap.from(".card, .work-intro, .work-end", {
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work", start: "top 78%" },
      });
    });

    /* SCENE 06 — philosophy */
    const philoLines = $$(".philo-line");
    gsap.set(philoLines, { opacity: 0, filter: "blur(26px)", scale: 1.06 });
    const philoTl = gsap.timeline({
      scrollTrigger: { trigger: ".philo", start: "top top", end: "bottom bottom", scrub: 1 },
    });
    philoLines.forEach((line, i) => {
      philoTl
        .to(line, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 1, ease: "power2.out" }, i * 1.3)
        .to(line, { opacity: 0, filter: "blur(18px)", scale: 0.98, duration: 0.8, ease: "power2.in" }, i * 1.3 + 1.0);
    });
    // the last statement rests on screen instead of blurring out
    if (philoLines.length) {
      philoTl.to(
        philoLines[philoLines.length - 1],
        { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.6 },
        (philoLines.length - 1) * 1.3 + 1.0,
      );
    }

    /* SCENE 07 — cta */
    gsap.from(".cta h2 .mask > span", {
      yPercent: 112,
      duration: 1.5,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: ".cta", start: "top 62%" },
    });
    gsap.from(".cta .lead, .enter, .cta-note", {
      opacity: 0,
      y: 26,
      duration: 1.2,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: ".cta", start: "top 52%" },
    });

    gsap.to(".marquee-in", { xPercent: -50, ease: "none", repeat: -1, duration: 26 });

    gsap.from(".foot-col, .foot-bottom", {
      opacity: 0,
      y: 24,
      duration: 1.1,
      stagger: 0.09,
      ease: "expo.out",
      scrollTrigger: { trigger: ".foot", start: "top 85%" },
    });
  }

  /* magnetic CTA (desktop) */
  function magnetic() {
    const btn = $(".enter");
    if (!btn || touch || reduced) return;
    const label = $(".enter-t", btn);

    const onMove = (event: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const x = (event.clientX - r.left - r.width / 2) / r.width;
      const y = (event.clientY - r.top - r.height / 2) / r.height;
      gsap.to(btn, { x: x * 26, y: y * 16, duration: 0.7, ease: "power3.out" });
      if (label) gsap.to(label, { x: x * 10, duration: 0.8, ease: "power3.out" });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,.5)" });
      if (label) gsap.to(label, { x: 0, duration: 0.9, ease: "power3.out" });
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    });
  }

  scenes();
  magnetic();

  // Fonts change metrics — recalculate pinned distances once they land.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);
  cleanups.push(() => window.removeEventListener("load", onLoad));

  intro();

  // Safety: never leave a visitor stuck behind the preloader.
  const failsafe = window.setTimeout(() => {
    document.body.classList.remove("is-loading");
  }, 6000);

  return () => {
    window.clearTimeout(failsafe);
    cleanups.forEach((fn) => fn());
    mm.revert();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.globalTimeline.clear();
    const pre = $("#preloader");
    const curtain = $(".curtain");
    if (pre) gsap.set(pre, { clearProps: "all" });
    if (curtain) gsap.set(curtain, { clearProps: "all" });
    booted = false;
  };
}
