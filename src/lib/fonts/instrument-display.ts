import { Instrument_Serif } from "next/font/google";

/** Serif display condiviso tra landing, login e shell portale/admin. */
export const instrumentDisplay = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-landing-display",
  display: "swap",
});
