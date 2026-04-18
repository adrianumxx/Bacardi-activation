/** Pagina Microsoft Bookings di riferimento (referente). Sovrascrivibile via env. */
export const DEFAULT_BOOKINGS_PAGE_URL =
  process.env.NEXT_PUBLIC_DEFAULT_BOOKINGS_URL?.trim() ||
  "https://book.ms/b/RDVwithAdrianoMelilloBacardiMartini@bacardi.onmicrosoft.com";

export function resolveBookingsUrl(stored: string | null | undefined): string {
  const t = stored?.trim();
  if (t) return t;
  return DEFAULT_BOOKINGS_PAGE_URL;
}
