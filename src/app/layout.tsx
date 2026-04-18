import type { Metadata } from "next";
import { DM_Sans, Montserrat, Playfair_Display } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers";
import { siteUrl } from "@/lib/env";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-brand-display",
  display: "swap",
});

/** Serif di supporto (vicina al wordmark heritage) — linee legali / citazioni. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-heritage",
  display: "swap",
});

function metadataBaseUrl(): URL {
  try {
    return new URL(siteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: "BACARDÍ — Portale attivazioni canale Italia",
  description:
    "Catalogo attivazioni, criteri di idoneità e Microsoft Bookings per il trade italiano autorizzato (Bacardi Limited).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground",
          dmSans.variable,
          montserrat.variable,
          playfair.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
