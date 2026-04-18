import "server-only";

import type { AppLocale } from "@/i18n/config";
import it from "@/messages/it.json";

export type Dictionary = typeof it;

const loaders: Record<AppLocale, () => Promise<Dictionary>> = {
  fr: () => import("@/messages/fr.json").then((m) => m.default as Dictionary),
  nl: () => import("@/messages/nl.json").then((m) => m.default as Dictionary),
  en: () => import("@/messages/en.json").then((m) => m.default as Dictionary),
  it: () => Promise.resolve(it),
};

export async function getDictionary(locale: AppLocale): Promise<Dictionary> {
  return loaders[locale]();
}
