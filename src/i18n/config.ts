export const LOCALES = ["it", "en", "fr", "nl"] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "it";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return Boolean(value && LOCALES.includes(value as AppLocale));
}

/** Open Graph / html lang BCP 47 */
export const OG_LOCALE: Record<AppLocale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
  nl: "nl_NL",
};
