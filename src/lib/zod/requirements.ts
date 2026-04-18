import { z } from "zod";

export const requirementRuleSchema = z.object({
  id: z.string(),
  key: z.string(),
  op: z.enum(["equals", "gte", "lte", "in", "contains"]),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
  ]),
  messageIt: z.string(),
});

export const requirementsPayloadSchema = z.object({
  rules: z.array(requirementRuleSchema),
});

export type RequirementRule = z.infer<typeof requirementRuleSchema>;
export type RequirementsPayload = z.infer<typeof requirementsPayloadSchema>;
