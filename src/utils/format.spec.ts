import { describe, it, expect } from "vitest";
import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it.each([
    [0, "0.00"],
    [1, "1.00"],
    [1.5, "1.50"],
    [1.23, "1.23"],
    [1234.56, "1,234.56"],
    [100000, "100,000.00"],
  ])("formatCurrency(%s) → %s", (input, expected) => {
    expect(formatCurrency(input)).toBe(expected);
  });
});
