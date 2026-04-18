/** Ordine prioritario: FR → NL → EN → IT (switcher, static params, hreflang). */
export const LOCALES = ["fr", "nl", "en", "it"] as const;

export type AppLocale = (typeof LOCALES)[number];

/** Lingua predefinita URL senza prefisso (redirect middleware). */
export const DEFAULT_LOCALE: AppLocale = "fr";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return Boolean(value && LOCALES.includes(value as AppLocale));
}

/** Open Graph / html lang BCP 47 */
export const OG_LOCALE: Record<AppLocale, string> = {
  fr: "fr_BE",
  nl: "nl_BE",
  en: "en_BE",
  it: "it_IT",
};
