/**
 * Portfolio marchi Bacardi Limited (landing).
 * — BACARDÍ: wordmark ufficiale in /public/brand.
 * — Altri marchi: SVG wordmark in /public/brand/portfolio/ (generati da scripts/gen-portfolio-wordmarks.mjs;
 *   sostituire con loghi ufficiali dal DAM mantenendo lo stesso filename slug).
 */

export type BrandPortfolioVisual = "bacardi-wordmark" | "portfolio-svg";

export type BrandPortfolioTile = {
  readonly name: string;
  readonly visual: BrandPortfolioVisual;
  /** Slug file in public/brand/portfolio/{slug}.svg — assente se visual === bacardi-wordmark */
  readonly portfolioSlug?: string;
};

export type BrandPortfolioSlide = {
  readonly tiles: readonly BrandPortfolioTile[];
};

function slug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function tile(name: string): BrandPortfolioTile {
  if (name === "BACARDÍ") {
    return { name, visual: "bacardi-wordmark" };
  }
  return { name, visual: "portfolio-svg", portfolioSlug: slug(name) };
}

export const BACARDI_LIMITED_BRAND_SLIDES: readonly BrandPortfolioSlide[] = [
  {
    tiles: [
      tile("BACARDÍ"),
      tile("FACUNDO Rum Collection"),
      tile("SANTA TERESA"),
      tile("BANKS"),
      tile("CASTILLO"),
      tile("CAZADORES"),
    ],
  },
  {
    tiles: [
      tile("BOMBAY SAPPHIRE"),
      tile("MARTINI"),
      tile("MARTINI & ROSSI"),
      tile("NOILLY PRAT"),
      tile("MARTINI Asti"),
      tile("MARTINI Fiero"),
    ],
  },
  {
    tiles: [
      tile("GREY GOOSE"),
      tile("PATRÓN"),
      tile("42 BELOW"),
      tile("LEBLON"),
      tile("CORZO"),
      tile("ULTIMAT"),
    ],
  },
  {
    tiles: [
      tile("DEWAR'S"),
      tile("ANGELS ENVY"),
      tile("WILLIAM LAWSON'S"),
      tile("ABERFELDY"),
      tile("TEELING Whiskey"),
      tile("CRAIGELLACHIE"),
    ],
  },
  {
    tiles: [
      tile("D'USSÉ"),
      tile("BÉNÉDICTINE"),
      tile("ST-GERMAIN"),
      tile("ILEGAL"),
      tile("HATUEY"),
      tile("ERISTOFF"),
    ],
  },
] as const;

export function portfolioSvgSrc(slug: string): string {
  return `/brand/portfolio/${slug}.svg`;
}
