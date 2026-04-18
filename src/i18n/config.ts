export const LOCALES = ["it", "en", "fr", "nl"] as const;

export type AppLocale = (typeof LOCALES)[number];

/** Mercato di default: Belgio (NL). */
export const DEFAULT_LOCALE: AppLocale = "nl";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return Boolean(value && LOCALES.includes(value as AppLocale));
}

/** Open Graph / html lang BCP 47 */
export const OG_LOCALE: Record<AppLocale, string> = {
  it: "it_IT",
  en: "en_BE",
  fr: "fr_BE",
  nl: "nl_BE",
};
