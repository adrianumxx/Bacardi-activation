import type { Json } from "@/types/database";

import { evaluateRequirements, type ClientAttributes } from "@/lib/requirements/evaluate";

export function evaluateActivationEligibility(
  requirements: Json,
  attributes: Json,
) {
  const attrs: ClientAttributes =
    attributes && typeof attributes === "object" && !Array.isArray(attributes)
      ? (attributes as ClientAttributes)
      : {};
  return evaluateRequirements(requirements, attrs);
}
