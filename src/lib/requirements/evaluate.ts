import type { RequirementRule, RequirementsPayload } from "@/lib/zod/requirements";
import { requirementsPayloadSchema } from "@/lib/zod/requirements";

export type ClientAttributes = Record<string, unknown>;

function getByPath(obj: unknown, path: string): unknown {
  if (!path.includes(".")) {
    if (obj && typeof obj === "object" && path in (obj as Record<string, unknown>)) {
      return (obj as Record<string, unknown>)[path];
    }
    return undefined;
  }
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function rulePasses(rule: RequirementRule, attrs: ClientAttributes): boolean {
  const actual = getByPath(attrs, rule.key);

  switch (rule.op) {
    case "equals": {
      if (typeof rule.value === "boolean") return actual === rule.value;
      if (typeof rule.value === "number") return toNumber(actual) === rule.value;
      if (typeof rule.value === "string") return String(actual ?? "") === rule.value;
      return false;
    }
    case "gte": {
      const a = toNumber(actual);
      const expected =
        typeof rule.value === "number" ? rule.value : toNumber(rule.value);
      if (a === undefined || expected === undefined) return false;
      return a >= expected;
    }
    case "lte": {
      const a = toNumber(actual);
      const expected =
        typeof rule.value === "number" ? rule.value : toNumber(rule.value);
      if (a === undefined || expected === undefined) return false;
      return a <= expected;
    }
    case "in": {
      if (!Array.isArray(rule.value)) return false;
      const s = String(actual ?? "");
      return rule.value.includes(s);
    }
    case "contains": {
      if (typeof rule.value !== "string") return false;
      return String(actual ?? "").includes(rule.value);
    }
    default:
      return false;
  }
}

export type RuleFailure = Pick<RequirementRule, "id" | "messageIt">;

export function evaluateRequirements(
  rawRequirements: unknown,
  attrs: ClientAttributes,
): { ok: true } | { ok: false; failures: RuleFailure[] } {
  const parsed = requirementsPayloadSchema.safeParse(rawRequirements);
  if (!parsed.success) {
    return {
      ok: false,
      failures: [
        {
          id: "invalid_requirements_payload",
          messageIt: "Configurazione requisiti non valida. Contatta il supporto.",
        },
      ],
    };
  }

  const payload: RequirementsPayload = parsed.data;
  const failures: RuleFailure[] = [];

  for (const rule of payload.rules) {
    if (!rulePasses(rule, attrs)) {
      failures.push({ id: rule.id, messageIt: rule.messageIt });
    }
  }

  if (failures.length > 0) return { ok: false, failures };
  return { ok: true };
}
