import { describe, it, expect } from "vitest";
import {
  tipFormSchema,
  billValueSchema,
  tipValueSchema,
  peopleValueSchema,
} from "./validation";

const isValid = (name: keyof typeof tipFormSchema.shape, v: string) =>
  tipFormSchema.shape[name].safeParse(v).success;

describe("bill input schema", () => {
  it("accepts empty string", () => expect(isValid("bill", "")).toBe(true));
  it("accepts integers", () => expect(isValid("bill", "100")).toBe(true));
  it('accepts partial decimal "."', () =>
    expect(isValid("bill", ".")).toBe(true));
  it('accepts partial decimal "1."', () =>
    expect(isValid("bill", "1.")).toBe(true));
  it("accepts 1 decimal place", () =>
    expect(isValid("bill", "1.5")).toBe(true));
  it("accepts 2 decimal places", () =>
    expect(isValid("bill", "1.50")).toBe(true));
  it("accepts max value 100000", () =>
    expect(isValid("bill", "100000")).toBe(true));
  it("rejects 3 decimal places", () =>
    expect(isValid("bill", "1.555")).toBe(false));
  it("rejects above 100000", () =>
    expect(isValid("bill", "100001")).toBe(false));
  it("rejects letters", () => expect(isValid("bill", "abc")).toBe(false));
  it("rejects negative sign", () => expect(isValid("bill", "-1")).toBe(false));
  it("rejects multiple dots", () =>
    expect(isValid("bill", "1.2.3")).toBe(false));
});

describe("billValueSchema", () => {
  it("formats integer to 2 decimals", () =>
    expect(billValueSchema.parse("50")).toBe("50.00"));
  it("formats zero", () => expect(billValueSchema.parse("0")).toBe("0.00"));
  it('empty string becomes "0.00"', () =>
    expect(billValueSchema.parse("")).toBe("0.00"));
  it('non-numeric becomes "0.00"', () =>
    expect(billValueSchema.parse("abc")).toBe("0.00"));
  it("clamps to max 100000", () =>
    expect(billValueSchema.parse("200000")).toBe("100000.00"));
  it("clamps negative to 0", () =>
    expect(billValueSchema.parse("-5")).toBe("0.00"));
  it("preserves max value", () =>
    expect(billValueSchema.parse("100000")).toBe("100000.00"));
  it('"1." becomes "1.00"', () =>
    expect(billValueSchema.parse("1.")).toBe("1.00"));
});

describe("tip input schema", () => {
  it("accepts empty string", () => expect(isValid("tip", "")).toBe(true));
  it("accepts zero", () => expect(isValid("tip", "0")).toBe(true));
  it("accepts 100", () => expect(isValid("tip", "100")).toBe(true));
  it("accepts mid-range", () => expect(isValid("tip", "15")).toBe(true));
  it("rejects above 100", () => expect(isValid("tip", "101")).toBe(false));
  it("rejects decimals", () => expect(isValid("tip", "1.5")).toBe(false));
  it("rejects letters", () => expect(isValid("tip", "abc")).toBe(false));
});

describe("tipValueSchema", () => {
  it("returns value as string", () =>
    expect(tipValueSchema.parse("15")).toBe("15"));
  it('empty string becomes "0"', () =>
    expect(tipValueSchema.parse("")).toBe("0"));
  it('non-numeric becomes "0"', () =>
    expect(tipValueSchema.parse("abc")).toBe("0"));
  it("clamps to max 100", () =>
    expect(tipValueSchema.parse("150")).toBe("100"));
  it("clamps negative to 0", () =>
    expect(tipValueSchema.parse("-5")).toBe("0"));
});

describe("people input schema", () => {
  it("accepts empty string", () => expect(isValid("people", "")).toBe(true));
  it("accepts valid count", () => expect(isValid("people", "2")).toBe(true));
  it("accepts max 50", () => expect(isValid("people", "50")).toBe(true));
  it("rejects above 50", () => expect(isValid("people", "51")).toBe(false));
  it("rejects decimals", () => expect(isValid("people", "1.5")).toBe(false));
  it("rejects letters", () => expect(isValid("people", "abc")).toBe(false));
});

describe("peopleValueSchema", () => {
  it("returns value as string", () =>
    expect(peopleValueSchema.parse("5")).toBe("5"));
  it('empty string becomes "2"', () =>
    expect(peopleValueSchema.parse("")).toBe("2"));
  it('non-numeric becomes "2"', () =>
    expect(peopleValueSchema.parse("abc")).toBe("2"));
  it('"1" clamps to minimum "2"', () =>
    expect(peopleValueSchema.parse("1")).toBe("2"));
  it("clamps to max 50", () =>
    expect(peopleValueSchema.parse("51")).toBe("50"));
});
