import {
  createBacardiOgImageResponse,
  ogImageAlt,
  OG_SIZE,
} from "@/lib/og/bacardi-og-image";

export const runtime = "edge";

export const alt = ogImageAlt;

export const size = OG_SIZE;

export const contentType = "image/png";

export default async function Image() {
  return createBacardiOgImageResponse();
}
