"use client";

import { useEffect } from "react";

import type { AppLocale } from "@/i18n/config";

/** Imposta `lang` su `<html>` in base al segmento `[locale]` (il root layout non riceve i params). */
export function LocaleHtml({ locale }: { locale: AppLocale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
