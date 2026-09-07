"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));

/** Native scrolling controls the scenes; no wheel interception or scroll locking. */
export function HomeJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 520px)");
    let dispose = () => {};

    function setup() {
      dispose();
      if (!node) return;
      const cinema = node.querySelector<HTMLElement>(".home-cinema");
      const stage = node.querySelector<HTMLElement>(".cinema-stage");
      const map = node.querySelector<HTMLElement>(".cinema-map-scene");
      const logo = node.querySelector<HTMLElement>(".cinema-logo-scene");
      const stats = node.querySelector<HTMLElement>(".cinema-stats-scene");
      const progressLabel = node.querySelector<HTMLElement>(".cinema-progress-label");
      const flow = node.querySelector<SVGSVGElement>(".home-flow");
      const paths = node.querySelectorAll<SVGPathElement>(".home-flow path");
      const reveals = node.querySelectorAll<HTMLElement>("[data-home-reveal]");
      const reduced = preference.matches;
      let frame = 0;
      let top = 0;
      let height = 1;
      let cinemaTop = 0;
      let cinemaHeight = 1;
      let scrollRange = 1;
      let lastLabel = "";

      const draw = () => {
        frame = 0;
        const y = window.scrollY;
        const progress = phase(y, cinemaTop, cinemaTop + scrollRange);
        // Show navigation when the yellow route is complete, while the map is still pinned.
        node.classList.toggle("home-past-intro", reduced ? y >= cinemaTop + cinemaHeight - 90 : progress >= .94);
        if (cinema && !reduced) {
          const values: Record<string, number | string> = {
            "--logo-opacity": 1 - phase(progress, .09, .19),
            "--logo-scale": 1 - .12 * phase(progress, .04, .2),
            "--logo-y": `${-45 * phase(progress, .07, .2)}px`,
            "--stats-opacity": phase(progress, .16, .25) * (1 - phase(progress, .39, .47)),
            "--stats-y": `${45 * (1 - phase(progress, .16, .27)) - 35 * phase(progress, .39, .48)}px`,
            "--route-opacity": phase(progress, .46, .51),
            "--route-white-offset": 1 - phase(progress, .48, .67),
            "--route-yellow-offset": 1 - phase(progress, .71, .94),
            "--map-opacity": phase(progress, .7, .91),
            "--map-details-opacity": phase(progress, .84, .95),
            "--map-scale": 1.06 - .06 * phase(progress, .7, .94),
            "--scene-progress": progress
          };
          for (const [key, value] of Object.entries(values)) cinema.style.setProperty(key, String(value));
          if (logo) logo.inert = progress > .19;
          if (stats) stats.inert = progress < .16 || progress > .47;
          if (map) map.inert = progress < .84;
          const label = progress < .16 ? "01 — NULLL.CLUB" : progress < .46 ? "02 — Ensemble" : progress < .71 ? "03 — Le tracé" : "04 — Aix-en-Provence";
          if (progressLabel && label !== lastLabel) { progressLabel.textContent = label; lastLabel = label; }
        }
        const remaining = Math.max(1, height - cinemaHeight);
        const flowProgress = reduced ? 1 : clamp((y + window.innerHeight * .8 - top - cinemaHeight) / remaining);
        paths[1]?.style.setProperty("stroke-dashoffset", String(1 - flowProgress));
      };
      const measure = () => {
        const rect = node.getBoundingClientRect();
        height = rect.height;
        top = rect.top + window.scrollY;
        if (cinema && stage) {
          cinemaTop = cinema.getBoundingClientRect().top + window.scrollY;
          cinemaHeight = cinema.offsetHeight;
          scrollRange = Math.max(1, cinemaHeight - stage.offsetHeight);
        }
        flow?.setAttribute("viewBox", `0 0 ${rect.width} ${height}`);
        const points = Array.from(node.querySelectorAll<HTMLElement>("[data-flow-point]")).map((el, i) => {
          const box = el.getBoundingClientRect();
          return i === 0 ? { x: rect.width * .92, y: cinemaHeight } : { x: box.left - rect.left, y: box.top - rect.top };
        });
        const d = points.map((p, i) => {
          if (!i) return `M ${p.x} ${p.y}`;
          const prev = points[i - 1];
          const middle = (prev.y + p.y) / 2;
          return `C ${prev.x} ${middle}, ${p.x} ${middle}, ${p.x} ${p.y}`;
        }).join(" ");
        paths.forEach((path) => path.setAttribute("d", d));
        draw();
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(draw); };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("home-in");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: "0px 0px 80px 0px" });
      reveals.forEach((el) => {
        if (reduced) el.classList.add("home-in");
        else {
          if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add("home-wait");
          observer.observe(el);
        }
      });
      node.classList.add("home-intro-done");
      const resize = new ResizeObserver(measure);
      resize.observe(node);
      if (stage) resize.observe(stage);
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", measure);
      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        resize.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", measure);
        reveals.forEach((el) => el.classList.remove("home-wait"));
        [logo, stats, map].forEach((el) => { if (el) el.inert = false; });
        cinema?.removeAttribute("style");
      };
    }
    setup();
    preference.addEventListener("change", setup);
    return () => { dispose(); preference.removeEventListener("change", setup); };
  }, []);

  return (
    <main className="home-journey" ref={root} id="home-main">
      <noscript><style>{`
        .home-journey .home-cinema { height:auto; }
        .home-journey .cinema-stage { height:auto; position:relative; }
        .home-journey .cinema-logo-scene,.home-journey .cinema-stats-scene,.home-journey .cinema-map-scene { position:relative; opacity:1; transform:none; min-height:100svh; }
        .home-journey .cinema-streets,.home-journey .cinema-map-background,.home-journey .cinema-depart-marker,.home-journey .cinema-meetup,.home-journey .cinema-map-geography { opacity:1; }
        .home-journey .cinema-route-white,.home-journey .cinema-route-yellow { stroke-dashoffset:0; }
        .home-journey .cinema-progress,.home-journey .cinema-skip { display:none; }
        body:has(.home-cinema) header { position:relative; transform:none; visibility:visible; }
      `}</style></noscript>
      <svg className="home-flow" aria-hidden="true" preserveAspectRatio="none"><path fill="none" /><path fill="none" pathLength={1} strokeDasharray="1" /></svg>
      {children}
    </main>
  );
}
