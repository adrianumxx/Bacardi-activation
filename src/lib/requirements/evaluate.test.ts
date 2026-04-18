import { describe, expect, it } from "vitest";

import { evaluateRequirements } from "@/lib/requirements/evaluate";

describe("evaluateRequirements", () => {
  it("passes when all rules pass", () => {
    const res = evaluateRequirements(
      {
        rules: [
          {
            id: "cases",
            key: "monthly_cases",
            op: "gte",
            value: 10,
            messageIt: "Servono almeno 10 casse mensili.",
          },
        ],
      },
      { monthly_cases: 12 },
    );
    expect(res).toEqual({ ok: true });
  });

  it("fails gte", () => {
    const res = evaluateRequirements(
      {
        rules: [
          {
            id: "cases",
            key: "monthly_cases",
            op: "gte",
            value: 10,
            messageIt: "Servono almeno 10 casse mensili.",
          },
        ],
      },
      { monthly_cases: 2 },
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.failures[0]?.id).toBe("cases");
    }
  });

  it("supports dot paths", () => {
    const res = evaluateRequirements(
      {
        rules: [
          {
            id: "nested",
            key: "a.b",
            op: "equals",
            value: "x",
            messageIt: "Manca a.b",
          },
        ],
      },
      { a: { b: "x" } },
    );
    expect(res).toEqual({ ok: true });
  });

  it("supports in operator", () => {
    const ok = evaluateRequirements(
      {
        rules: [
          {
            id: "region",
            key: "region",
            op: "in",
            value: ["lombardia", "lazio"],
            messageIt: "Regione non ammessa.",
          },
        ],
      },
      { region: "lazio" },
    );
    expect(ok).toEqual({ ok: true });

    const bad = evaluateRequirements(
      {
        rules: [
          {
            id: "region",
            key: "region",
            op: "in",
            value: ["lombardia", "lazio"],
            messageIt: "Regione non ammessa.",
          },
        ],
      },
      { region: "sicilia" },
    );
    expect(bad.ok).toBe(false);
  });

  it("fails invalid payload", () => {
    const res = evaluateRequirements({ rules: "nope" }, {});
    expect(res.ok).toBe(false);
  });
});
