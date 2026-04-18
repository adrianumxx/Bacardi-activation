import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
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
    <html lang="it" suppressHydrationWarning>
      <body className={cn("min-h-dvh bg-background text-foreground", inter.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
