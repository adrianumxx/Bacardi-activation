"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  BACARDI_LIMITED_BRAND_SLIDES,
  portfolioSvgSrc,
  type BrandPortfolioTile,
} from "@/data/bacardi-limited-brands";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

type Copy = Dictionary["brandShowcase"];

const SLIDE_COUNT = BACARDI_LIMITED_BRAND_SLIDES.length;

function BrandTileVisual({ tile }: { tile: BrandPortfolioTile }) {
  if (tile.visual === "bacardi-wordmark") {
    return (
      // Wordmark SVG ufficiale — next/image non adatto agli SVG vettoriali del brand.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/bacardi-wordmark.svg"
        alt=""
        className="h-7 w-auto max-w-[min(100%,11rem)] object-contain object-center opacity-[0.98] sm:h-9"
        loading="lazy"
        decoding="async"
      />
    );
  }

  const src = portfolioSvgSrc(tile.portfolioSlug ?? "");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="h-8 w-full max-w-[13.5rem] object-contain object-center sm:h-10"
      loading="lazy"
      decoding="async"
    />
  );
}

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
          "relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-gradient-to-br from-zinc-950/98 via-black to-[#030303]",
          "p-6 shadow-[0_32px_96px_-48px_rgba(217,30,39,0.5)] ring-1 ring-white/[0.05] backdrop-blur-xl sm:p-10",
          "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_85%_55%_at_50%_-20%,rgba(217,30,39,0.14),transparent_55%)]",
        )}
      >
        <div
          className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-amber-200/[0.04] blur-3xl"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]"
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

          <div className="relative mt-10 min-h-[240px] sm:min-h-[260px]">
            {BACARDI_LIMITED_BRAND_SLIDES.map((slide, i) => {
              const active = i === index;
              return (
                <div
                  key={i}
                  className={cn(
                    "grid gap-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:grid-cols-2 sm:gap-4 lg:grid-cols-3",
                    active
                      ? "relative z-10 translate-y-0 opacity-100"
                      : "pointer-events-none absolute inset-0 z-0 translate-y-5 opacity-0 motion-reduce:translate-y-0",
                  )}
                  aria-hidden={!active}
                  role="tabpanel"
                  id={`brand-slide-${i}`}
                >
                  <div className="col-span-full mb-2 flex items-center gap-3 sm:mb-3">
                    <span className="h-px flex-1 max-w-[3rem] bg-gradient-to-r from-transparent to-primary/70 sm:max-w-[4rem]" />
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-primary">
                      {labels[i] ?? ""}
                    </p>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.12]" />
                  </div>

                  {slide.tiles.map((tile, j) => (
                    <article
                      key={tile.name}
                      className={cn(
                        "group relative flex min-h-[5.75rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07]",
                        "bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_40px_-28px_rgba(0,0,0,0.85)]",
                        "motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-500",
                        active && !reduceMotion && "motion-safe:animate-brand-tile-in",
                        active && "hover:border-primary/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_48px_-24px_rgba(217,30,39,0.25)]",
                        active && "motion-safe:hover:-translate-y-0.5",
                      )}
                      style={
                        active && !reduceMotion ? { animationDelay: `${80 + j * 55}ms` } : undefined
                      }
                      aria-label={tile.name}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
                          backgroundSize: "200% 100%",
                        }}
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-[1px] transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(217,30,39,0.35), transparent 42%, rgba(255,255,255,0.08))",
                        }}
                        aria-hidden
                      />
                      <div className="relative z-[1] flex w-full flex-col items-center justify-center px-4 py-5 sm:px-5 sm:py-6">
                        <div className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]">
                          <BrandTileVisual tile={tile} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
