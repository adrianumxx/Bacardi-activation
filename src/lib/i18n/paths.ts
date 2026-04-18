import type { AppLocale } from "@/i18n/config";

/** Path interno `/portal` → `/it/portal` (senza `headers()`; usabile anche lato client). */
export function localePath(locale: AppLocale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${p}`;
}
