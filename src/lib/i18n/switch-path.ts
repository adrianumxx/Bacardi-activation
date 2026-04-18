import { LOCALES, type AppLocale } from "@/i18n/config";

/** Pathname corrente → stesso percorso con altro segmento `[locale]` (es. `/it/portal` → `/en/portal`). */
export function pathnameForLocale(pathname: string, target: AppLocale): string {
  const parts = (pathname || "/").split("/").filter(Boolean);
  if (parts.length === 0) return `/${target}`;
  const first = parts[0] as AppLocale;
  const rest = LOCALES.includes(first) ? parts.slice(1) : parts;
  if (rest.length === 0) return `/${target}`;
  return `/${target}/${rest.join("/")}`;
}
