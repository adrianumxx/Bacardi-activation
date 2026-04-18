import { z } from "zod";

export const attributeFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["string", "number", "boolean"]),
});

export const attributeSchemaPayload = z.array(attributeFieldSchema);

export type AttributeField = z.infer<typeof attributeFieldSchema>;
