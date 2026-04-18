import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BacardiLanding } from "@/components/landing/bacardi-landing";
import { LOCALES, OG_LOCALE, type AppLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getOptionalUser } from "@/lib/auth/session";
import { siteUrl } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as AppLocale;
  if (!LOCALES.includes(locale)) return {};

  const dict = await getDictionary(locale);
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(siteUrl());
  } catch {
    metadataBase = undefined;
  }

  const languages = Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])) as Record<string, string>;

  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    ...(metadataBase ? { metadataBase } : {}),
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
      url: `/${locale}`,
      siteName: dict.meta.ogSiteName,
      locale: OG_LOCALE[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale as AppLocale;
  if (!LOCALES.includes(locale)) notFound();

  const dict = await getDictionary(locale);
  const user = await getOptionalUser();

  return <BacardiLanding isAuthenticated={Boolean(user)} locale={locale} dict={dict} />;
}
