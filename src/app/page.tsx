import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";

import { BacardiLanding } from "@/components/landing/bacardi-landing";
import { getOptionalUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const landingDisplay = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-landing-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attivazioni Bacardi — Portale dedicato",
  description:
    "Catalogo attivazioni, requisiti in chiaro e prenotazione Microsoft Bookings per il canale Italia.",
};

export default async function Home() {
  const user = await getOptionalUser();

  return (
    <div className={cn(landingDisplay.variable, "min-h-dvh")}>
      <BacardiLanding isAuthenticated={Boolean(user)} />
    </div>
  );
}
