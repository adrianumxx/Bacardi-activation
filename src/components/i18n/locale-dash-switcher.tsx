"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALES, type AppLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pathnameForLocale } from "@/lib/i18n/switch-path";
import { cn } from "@/lib/utils";

type Copy = Dictionary["localeSwitcher"];

const TIP_KEYS: Record<AppLocale, keyof Copy> = {
  fr: "tipFr",
  nl: "tipNl",
  en: "tipEn",
  it: "tipIt",
};

const LABEL_KEYS: Record<AppLocale, keyof Copy> = {
  fr: "fr",
  nl: "nl",
  en: "en",
  it: "it",
};

export function LocaleDashSwitcher({
  locale,
  copy,
  variant = "compact",
}: {
  locale: AppLocale;
  copy: Copy;
  variant?: "landing" | "compact";
}) {
  const pathname = usePathname() ?? "/";

  return (
    <div
      className={cn(
        "flex flex-col items-stretch gap-1.5",
        variant === "landing" && "sm:items-end",
      )}
    >
      <div
        className={cn(
          "locale-dash-shell rounded-2xl border border-white/[0.09] bg-gradient-to-b from-zinc-900/95 to-black/90 p-[3px] shadow-[0_12px_40px_-18px_rgba(217,30,39,0.35)] backdrop-blur-md",
          variant === "landing" ? "sm:max-w-none" : "",
        )}
        role="group"
        aria-label={copy.aria}
      >
        <div className="locale-dash-rail flex rounded-[13px] bg-black/50 p-0.5 ring-1 ring-white/[0.04]">
          {LOCALES.map((code) => {
            const href = pathnameForLocale(pathname, code);
            const active = code === locale;
            const tip = copy[TIP_KEYS[code]] as string;
            const label = copy[LABEL_KEYS[code]] as string;

            return (
              <Link
                key={code}
                href={href}
                scroll={false}
                title={tip}
                lang={code}
                className={cn(
                  "locale-dash-segment relative flex min-h-[2.65rem] min-w-[2.55rem] flex-1 items-center justify-center rounded-[11px] border border-transparent font-display text-[0.7rem] font-extrabold tracking-[0.18em] text-muted-foreground no-underline motion-reduce:transform-none motion-reduce:transition-none sm:min-w-[2.75rem]",
                  "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  active &&
                    "locale-dash-segment--active border-primary/30 bg-primary text-primary-foreground hover:text-primary-foreground",
                  !active && "hover:border-white/10 hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                <span className="relative z-10 drop-shadow-sm">{label}</span>
                {active ? (
                  <span
                    className="pointer-events-none absolute inset-x-1 bottom-1 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-90 motion-safe:animate-pulse"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
      {variant === "landing" ? (
        <p className="max-w-[14rem] text-[0.65rem] font-medium leading-snug tracking-wide text-muted-foreground/90 sm:ml-auto sm:text-right">
          {copy.subtle}
        </p>
      ) : null}
    </div>
  );
}
