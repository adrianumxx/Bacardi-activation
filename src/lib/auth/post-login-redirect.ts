import { type AppLocale } from "@/i18n/config";
import { localePath } from "@/lib/i18n/paths";

const ACTIVATION_DETAIL_RE = /^\/activations\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Percorsi interni consentiti dopo login (stesso `locale`, niente open redirect).
 */
export function sanitizePostLoginRedirect(locale: AppLocale, raw: string | null | undefined): string {
  const fallback = localePath(locale, "/activations");
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("..")) return fallback;

  const prefix = `/${locale}`;
  if (!trimmed.startsWith(`${prefix}/`) && trimmed !== prefix) return fallback;

  const qIndex = trimmed.indexOf("?");
  const pathname = qIndex === -1 ? trimmed : trimmed.slice(0, qIndex);
  const search = qIndex === -1 ? "" : trimmed.slice(qIndex + 1);

  if (!pathname.startsWith(prefix)) return fallback;
  const inner = pathname.slice(prefix.length) || "/";

  if (inner === "/activations") return search ? `${pathname}?${search}` : pathname;
  if (ACTIVATION_DETAIL_RE.test(inner)) return search ? `${pathname}?${search}` : pathname;
  if (inner === "/portal/profile") return search ? `${pathname}?${search}` : pathname;

  return fallback;
}
