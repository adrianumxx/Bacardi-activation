"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { BACARDI_LIMITED_BRAND_SLIDES } from "@/data/bacardi-limited-brands";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type Copy = Dictionary["brandShowcase"];

const SLIDE_COUNT = BACARDI_LIMITED_BRAND_SLIDES.length;

export function BacardiBrandsSlideshow({ copy }: { copy: Copy }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const go = useCallback((dir: -1 | 1) => {
    setIndex((i) => (i + dir + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, 4200);
    return () => window.clearInterval(t);
  }, [paused, reduceMotion]);

  const labels = copy.slideLabels;

  return (
    <section
      className="relative mt-20 scroll-mt-28 sm:mt-28"
      aria-labelledby="brand-showcase-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-card/95 via-black/90 to-[#050505]",
          "p-6 shadow-[0_28px_80px_-40px_rgba(217,30,39,0.45)] ring-1 ring-white/[0.04] backdrop-blur-md sm:p-10",
          "motion-safe:[perspective:1200px]",
        )}
      >
        <div
          className="pointer-events-none absolute -right-24 top-1/2 h-[120%] w-[55%] -translate-y-1/2 rounded-full bg-primary/[0.12] blur-3xl"
          aria-hidden
        />
        <div className="relative z-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h2
            id="brand-showcase-title"
            className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-balance text-foreground sm:text-3xl"
          >
            {copy.title}
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>

          <div className="relative mt-10 min-h-[200px] sm:min-h-[220px]">
            {BACARDI_LIMITED_BRAND_SLIDES.map((brands, i) => {
              const active = i === index;
              return (
                <div
                  key={i}
                  className={cn(
                    "grid gap-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:grid-cols-2 sm:gap-3 lg:grid-cols-3",
                    active
                      ? "relative z-10 translate-y-0 opacity-100"
                      : "pointer-events-none absolute inset-0 z-0 translate-y-6 opacity-0 motion-reduce:translate-y-0",
                  )}
                  aria-hidden={!active}
                  role="tabpanel"
                  id={`brand-slide-${i}`}
                >
                  <p className="col-span-full mb-1 text-xs font-semibold uppercase tracking-wider text-primary sm:mb-2">
                    {labels[i] ?? ""}
                  </p>
                  {brands.map((name) => (
                    <div
                      key={name}
                      className={cn(
                        "flex min-h-[3rem] items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-center",
                        "text-[0.7rem] font-bold uppercase leading-snug tracking-wide text-foreground/95 shadow-inner shadow-black/20 sm:text-xs",
                        "motion-safe:transition-transform motion-safe:duration-500",
                        active && "motion-safe:[transform:translateZ(12px)]",
                      )}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={copy.prev}
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label={copy.dotsAria}>
              {BACARDI_LIMITED_BRAND_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-controls={`brand-slide-${i}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    i === index ? "w-9 bg-primary" : "w-2.5 bg-muted-foreground/35 hover:bg-muted-foreground/55",
                  )}
                  aria-label={`${copy.slide} ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={copy.next}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
