import type { Metadata } from "next";

import { BacardiLanding } from "@/components/landing/bacardi-landing";
import { getOptionalUser } from "@/lib/auth/session";
import { siteUrl } from "@/lib/env";

const title = "Attivazioni Bacardi — Portale dedicato";
const description =
  "Catalogo attivazioni, requisiti in chiaro e prenotazione Microsoft Bookings per il canale Italia.";

export function generateMetadata(): Metadata {
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(siteUrl());
  } catch {
    metadataBase = undefined;
  }

  return {
    title,
    description,
    ...(metadataBase ? { metadataBase } : {}),
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "Bacardi — Portale attivazioni",
      locale: "it_IT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function Home() {
  const user = await getOptionalUser();

  return <BacardiLanding isAuthenticated={Boolean(user)} />;
}
