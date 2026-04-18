import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const ogImageAlt =
  "Bacardi — Portale attivazioni: catalogo, requisiti e Microsoft Bookings per il canale Italia.";

function siteHostLabel(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "Portale attivazioni";
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withScheme).host;
  } catch {
    return "Portale attivazioni";
  }
}

/**
 * Immagine social 1200×630 (Open Graph / Twitter).
 * Palette Bacardi: nero, rosso #D71920, tipografia sans pesante.
 */
export async function createBacardiOgImageResponse() {
  const domainLabel = siteHostLabel();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000000",
          position: "relative",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "rgba(215, 25, 32, 0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(215, 25, 32, 0.15)",
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 72px",
            zIndex: 1,
            maxWidth: 1080,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.32em",
              textTransform: "uppercase" as const,
              color: "#a3a3a3",
              fontWeight: 650,
            }}
          >
            Portale attivazioni
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 88,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: "#fafafa",
              fontWeight: 900,
              textTransform: "uppercase" as const,
            }}
          >
            Bacardi
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              lineHeight: 1.35,
              color: "#d4d4d4",
              fontWeight: 500,
              maxWidth: 860,
            }}
          >
            Catalogo trimestre, requisiti in chiaro e Microsoft Bookings — canale Italia.
          </div>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#d71920",
              }}
            />
            <div style={{ fontSize: 17, color: "#a3a3a3", fontWeight: 550 }}>{domainLabel}</div>
          </div>
        </div>

        <div
          style={{
            height: 10,
            width: "100%",
            background: "#d71920",
            zIndex: 2,
          }}
        />
      </div>
    ),
    {
      ...OG_SIZE,
    },
  );
}
