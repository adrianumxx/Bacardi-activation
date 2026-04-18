/**
 * Genera SVG wordmark monocromatici in public/brand/portfolio/
 * (testo stilizzato — sostituibili con loghi ufficiali dal DAM).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "brand", "portfolio");

/** @param {string} name */
function slug(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** @param {string} name */
function fontSize(name) {
  const n = name.length;
  if (n <= 10) return 26;
  if (n <= 18) return 20;
  if (n <= 28) return 16;
  return 13;
}

/** @param {string} name */
function lines(name) {
  if (name.length <= 22 || !name.includes(" ")) return [name];
  const mid = Math.floor(name.length / 2);
  let i = name.lastIndexOf(" ", mid + 6);
  if (i < 6) i = name.indexOf(" ");
  if (i <= 0) return [name];
  return [name.slice(0, i).trim(), name.slice(i + 1).trim()];
}

/** @param {string} name */
function svgFor(name) {
  const ls = lines(name);
  const fsz = Math.min(
    fontSize(name),
    ls.length > 1 ? fontSize(ls[0] + ls[1]) - 2 : fontSize(name),
  );
  const lineHeight = Math.round(fsz * 1.22);
  const totalH = ls.length * lineHeight;
  const startY = 52 - (totalH - lineHeight) / 2;

  const tspans = ls
    .map((line, idx) => {
      const y = startY + idx * lineHeight;
      return `<tspan x="180" y="${y}">${escapeXml(line)}</tspan>`;
    })
    .join("\n        ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 104" role="img" aria-label="${escapeXml(name)}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="55%" stop-color="#f4f0e8"/>
      <stop offset="100%" stop-color="#d4cfc4"/>
    </linearGradient>
  </defs>
  <rect width="360" height="104" fill="none"/>
  <text
    fill="url(#g)"
    font-family="'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, 'Times New Roman', serif"
    font-size="${fsz}"
    font-weight="600"
    letter-spacing="0.06em"
    text-anchor="middle"
  >
        ${tspans}
  </text>
</svg>
`;
}

/** @param {string} s */
function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const slides = [
  ["BACARDÍ", "FACUNDO Rum Collection", "SANTA TERESA", "BANKS", "CASTILLO", "CAZADORES"],
  ["BOMBAY SAPPHIRE", "MARTINI", "MARTINI & ROSSI", "NOILLY PRAT", "MARTINI Asti", "MARTINI Fiero"],
  ["GREY GOOSE", "PATRÓN", "42 BELOW", "LEBLON", "CORZO", "ULTIMAT"],
  ["DEWAR'S", "ANGELS ENVY", "WILLIAM LAWSON'S", "ABERFELDY", "TEELING Whiskey", "CRAIGELLACHIE"],
  ["D'USSÉ", "BÉNÉDICTINE", "ST-GERMAIN", "ILEGAL", "HATUEY", "ERISTOFF"],
];

fs.mkdirSync(outDir, { recursive: true });

const written = new Set();
for (const slide of slides) {
  for (const name of slide) {
    if (name === "BACARDÍ") continue;
    const id = slug(name);
    if (written.has(id)) continue;
    written.add(id);
    fs.writeFileSync(path.join(outDir, `${id}.svg`), svgFor(name), "utf8");
  }
}

console.log("Wrote", written.size, "SVG wordmarks to", path.relative(root, outDir));
