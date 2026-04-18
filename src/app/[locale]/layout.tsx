import { notFound } from "next/navigation";

import { LocaleHtml } from "@/components/i18n/locale-html";
import { LOCALES, type AppLocale } from "@/i18n/config";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!LOCALES.includes(params.locale as AppLocale)) notFound();
  const locale = params.locale as AppLocale;
  return (
    <>
      <LocaleHtml locale={locale} />
      {children}
    </>
  );
}
