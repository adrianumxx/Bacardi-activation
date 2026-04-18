export function embedOne<T extends Record<string, unknown>>(
  value: unknown,
): T | null {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) return (value[0] as T | undefined) ?? null;
  return value as T;
}
