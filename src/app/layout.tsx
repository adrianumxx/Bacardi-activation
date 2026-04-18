import type { Metadata } from "next";
import { DM_Sans, Montserrat } from "next/font/google";

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

function metadataBaseUrl(): URL {
  try {
    return new URL(siteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: "Portale attivazioni — Bacardi",
  description:
    "Prenotazione attivazioni per clienti: requisiti, idoneità e Microsoft Bookings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-dvh bg-background text-foreground", dmSans.variable, montserrat.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
