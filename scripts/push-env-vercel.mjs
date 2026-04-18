/**
 * Legge `.env.local` e fa upsert su Vercel **Production** via CLI.
 * (Preview richiede branch su alcune versioni CLI: imposta le stesse chiavi da dashboard → Preview.)
 * Uso: node scripts/push-env-vercel.mjs
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

function parseDotEnv(content) {
  /** @type {Record<string, string>} */
  const out = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const key = t.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    val = val.replace(/\\n/g, "\n");
    out[key] = val;
  }
  return out;
}

function sensitiveKey(key) {
  const u = key.toUpperCase();
  return (
    u.includes("SECRET") ||
    u.includes("SERVICE_ROLE") ||
    u.includes("PASSWORD") ||
    u.includes("PRIVATE_KEY")
  );
}

function runVercelEnvAdd(key, target, value) {
  const sensitive = sensitiveKey(key);
  const args = [
    "vercel",
    "env",
    "add",
    key,
    target,
    ...(sensitive ? ["--sensitive"] : []),
    "--value",
    value,
    "--yes",
    "--force",
  ];
  const r = spawnSync("npx", args, {
    cwd: root,
    encoding: "utf-8",
    shell: true,
    env: { ...process.env, FORCE_COLOR: "0" },
  });
  if (r.status !== 0) {
    console.error(`[fail] ${key} @ ${target}:`, r.stderr || r.stdout || r.error);
    return false;
  }
  console.log(`[ok] ${key} @ ${target}`);
  return true;
}

const raw = readFileSync(envPath, "utf8");
const env = parseDotEnv(raw);
const keys = Object.keys(env);
if (!keys.length) {
  console.error("Nessuna variabile in .env.local");
  process.exit(1);
}

let failed = 0;
for (const key of keys) {
  const value = env[key];
  if (!runVercelEnvAdd(key, "production", value)) failed++;
}

if (failed) process.exit(1);
