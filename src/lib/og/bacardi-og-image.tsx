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
 * Stili inline compatibili con Satori (niente Tailwind).
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
          background: "linear-gradient(152deg, #fff7f6 0%, #fdecea 42%, #fff7f6 88%)",
          position: "relative",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -100,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(188, 36, 50, 0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -60,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(139, 21, 48, 0.1)",
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
            maxWidth: 1040,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.32em",
              textTransform: "uppercase" as const,
              color: "#78716c",
              fontWeight: 650,
            }}
          >
            Portale attivazioni
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 92,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "#0c0a09",
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontWeight: 400,
            }}
          >
            Bacardi
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              lineHeight: 1.35,
              color: "#57534e",
              fontWeight: 450,
              maxWidth: 820,
            }}
          >
            Catalogo trimestre, requisiti in chiaro e prenotazione Microsoft Bookings — dedicato al
            canale Italia.
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
                background: "#bc2432",
              }}
            />
            <div style={{ fontSize: 17, color: "#44403c", fontWeight: 550 }}>{domainLabel}</div>
          </div>
        </div>

        <div
          style={{
            height: 10,
            width: "100%",
            background: "#bc2432",
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
