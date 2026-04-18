"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from "@/i18n/config";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import it from "@/messages/it.json";
import nl from "@/messages/nl.json";
import { localePath } from "@/lib/i18n/paths";

const dicts: Record<AppLocale, typeof it> = { it, en, fr, nl };

function localeFromPathname(pathname: string | null): AppLocale {
  if (!pathname) return DEFAULT_LOCALE;
  const seg = pathname.split("/")[1];
  return isAppLocale(seg) ? seg : DEFAULT_LOCALE;
}

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = useMemo(() => localeFromPathname(pathname), [pathname]);
  const dict = dicts[locale].error;
  const loginHref = localePath(locale, "/login");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-foreground">
      <h1 className="text-xl font-semibold">{dict.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{dict.p1}</p>
      {error.digest ? (
        <p className="mt-4 rounded-md border bg-muted/50 p-3 font-mono text-xs">
          {dict.digest} {error.digest}
        </p>
      ) : null}
      <p className="mt-4 text-sm text-muted-foreground">{dict.p2}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
          onClick={() => reset()}
        >
          {dict.retry}
        </button>
        <Link
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          href={loginHref}
        >
          {dict.login}
        </Link>
      </div>
    </div>
  );
}
