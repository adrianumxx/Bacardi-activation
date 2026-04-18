import { describe, expect, it } from "vitest";

import { sanitizePostLoginRedirect } from "./post-login-redirect";

describe("sanitizePostLoginRedirect", () => {
  it("allows catalogue list", () => {
    expect(sanitizePostLoginRedirect("it", "/it/activations")).toBe("/it/activations");
  });

  it("allows activation detail uuid", () => {
    const id = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    expect(sanitizePostLoginRedirect("fr", `/fr/activations/${id}`)).toBe(`/fr/activations/${id}`);
  });

  it("allows portal profile", () => {
    expect(sanitizePostLoginRedirect("en", "/en/portal/profile")).toBe("/en/portal/profile");
  });

  it("rejects open redirect and admin paths", () => {
    expect(sanitizePostLoginRedirect("it", "/it/admin")).toBe("/it/activations");
    expect(sanitizePostLoginRedirect("it", "//evil.com")).toBe("/it/activations");
    expect(sanitizePostLoginRedirect("it", "/it/../en/admin")).toBe("/it/activations");
    expect(sanitizePostLoginRedirect("it", "https://evil.com")).toBe("/it/activations");
  });

  it("rejects wrong locale prefix", () => {
    expect(sanitizePostLoginRedirect("it", "/fr/activations")).toBe("/it/activations");
  });
});
