import {
  describe,
  expect,
  it
} from "vitest";

import {
  cents,
  describeAmount,
  seniorityPosition
} from "./index.js";

describe("cents", () => {
  it("creates a zero-cent amount", () => {
    expect(cents(0)).toBe(0);
  });

  it("creates a positive whole-cent amount", () => {
    expect(cents(12_345)).toBe(12_345);
  });

  it("rejects negative amounts", () => {
    expect(() => cents(-1)).toThrow(
      "Cents must not be negative"
    );
  });

  it("rejects fractional cents", () => {
    expect(() => cents(1.5)).toThrow(
      "Cents must be a safe integer"
    );
  });

  it("rejects non-finite amounts", () => {
    expect(() =>
      cents(Number.POSITIVE_INFINITY)
    ).toThrow("Cents must be a safe integer");
  });

  it("rejects unsafe integers", () => {
    expect(() =>
      cents(Number.MAX_SAFE_INTEGER + 1)
    ).toThrow("Cents must be a safe integer");
  });
});

describe("seniorityPosition", () => {
  it("creates a zero position", () => {
    expect(seniorityPosition(0)).toBe(0);
  });

  it("creates a positive position", () => {
    expect(seniorityPosition(100)).toBe(100);
  });

  it("rejects negative positions", () => {
    expect(() => seniorityPosition(-1)).toThrow(
      "Seniority position must not be negative"
    );
  });

  it("rejects fractional positions", () => {
    expect(() => seniorityPosition(1.5)).toThrow(
      "Seniority position must be a safe integer"
    );
  });
});

describe("describeAmount", () => {
  it("describes a validated cent amount", () => {
    expect(describeAmount(cents(125))).toBe(
      "125 cents"
    );
  });
});