"use client";

import { useEffect, useState } from "react";

type RunCarouselNavProps = {
  runs: Array<{ date: string; id: string }>;
};

export function RunCarouselNav({ runs }: RunCarouselNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const carousel = document.querySelector<HTMLElement>(".run-carousel");
    if (!carousel) return;

    let frame = 0;
    const syncActiveRun = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        runs.forEach((run, index) => {
          const card = document.getElementById(`run-card-${run.id}`);
          if (!card) return;
          const bounds = card.getBoundingClientRect();
          const distance = Math.abs(bounds.left + bounds.width / 2 - carouselCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveIndex(closestIndex);
      });
    };

    syncActiveRun();
    carousel.addEventListener("scroll", syncActiveRun, { passive: true });
    window.addEventListener("resize", syncActiveRun);
    return () => {
      cancelAnimationFrame(frame);
      carousel.removeEventListener("scroll", syncActiveRun);
      window.removeEventListener("resize", syncActiveRun);
    };
  }, [runs]);

  function selectRun(id: string, index: number) {
    const card = document.getElementById(`run-card-${id}`);
    if (!card) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
    setActiveIndex(index);
  }

  return (
    <nav aria-label="Choisir une sortie" className="flex items-center gap-2">
      {runs.map((run, index) => (
        <button
          aria-current={activeIndex === index ? "true" : undefined}
          aria-label={`Afficher la sortie ${index + 1} : ${run.date}`}
          className={`grid h-11 w-11 cursor-pointer place-items-center border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000] ${
            activeIndex === index
              ? "border-[#ffb000] bg-[#ffb000] text-[#351815]"
              : "border-[#f6eadf]/50 hover:border-[#ffb000] hover:bg-[#ffb000] hover:text-[#351815]"
          }`}
          key={run.id}
          onClick={() => selectRun(run.id, index)}
          type="button"
        >
          0{index + 1}
        </button>
      ))}
    </nav>
  );
}
