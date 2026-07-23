import { describe, expect, it } from "vitest";

import {
  addCents,
  basisPoints,
  cents,
  compareBasisPoints,
  compareCents,
  compareEventSequences,
  compareNonces,
  compareSeniorityPositions,
  eventSequence,
  nextEventSequence,
  nextNonce,
  nonce,
  seniorityPosition,
  subtractCents,
} from "./value-types.js";

describe("Cents", () => {
  it("accepts zero and safe positive integers", () => {
    expect(cents(0)).toBe(0);
    expect(cents(1)).toBe(1);
    expect(cents(Number.MAX_SAFE_INTEGER)).toBe(
      Number.MAX_SAFE_INTEGER
    );
  });

  it.each([
    -1,
    0.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])("rejects invalid value %s", (value) => {
    expect(() => cents(value)).toThrow();
  });

  it("adds cents", () => {
    expect(addCents(cents(125), cents(75))).toBe(200);
  });

  it("subtracts cents", () => {
    expect(subtractCents(cents(200), cents(75))).toBe(
      125
    );
  });

  it("rejects addition overflow", () => {
    expect(() =>
      addCents(cents(Number.MAX_SAFE_INTEGER), cents(1))
    ).toThrow();
  });

  it("rejects subtraction underflow", () => {
    expect(() =>
      subtractCents(cents(1), cents(2))
    ).toThrow();
  });

  it("compares cents", () => {
    expect(compareCents(cents(1), cents(2))).toBe(-1);
    expect(compareCents(cents(2), cents(2))).toBe(0);
    expect(compareCents(cents(3), cents(2))).toBe(1);
  });
});

describe("BasisPoints", () => {
  it("accepts its minimum and maximum boundaries", () => {
    expect(basisPoints(0)).toBe(0);
    expect(basisPoints(10_000)).toBe(10_000);
  });

  it.each([
    -1,
    10_001,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])("rejects invalid value %s", (value) => {
    expect(() => basisPoints(value)).toThrow();
  });

  it("compares basis points", () => {
    expect(
      compareBasisPoints(
        basisPoints(100),
        basisPoints(200)
      )
    ).toBe(-1);

    expect(
      compareBasisPoints(
        basisPoints(200),
        basisPoints(200)
      )
    ).toBe(0);

    expect(
      compareBasisPoints(
        basisPoints(300),
        basisPoints(200)
      )
    ).toBe(1);
  });
});

describe("SeniorityPosition", () => {
  it("accepts one as its minimum boundary", () => {
    expect(seniorityPosition(1)).toBe(1);
  });

  it.each([
    -1,
    0,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])("rejects invalid value %s", (value) => {
    expect(() => seniorityPosition(value)).toThrow();
  });

  it("compares seniority positions", () => {
    expect(
      compareSeniorityPositions(
        seniorityPosition(1),
        seniorityPosition(2)
      )
    ).toBe(-1);

    expect(
      compareSeniorityPositions(
        seniorityPosition(2),
        seniorityPosition(2)
      )
    ).toBe(0);

    expect(
      compareSeniorityPositions(
        seniorityPosition(3),
        seniorityPosition(2)
      )
    ).toBe(1);
  });
});

describe("EventSequence", () => {
  it("accepts zero as its minimum boundary", () => {
    expect(eventSequence(0)).toBe(0);
  });

  it.each([
    -1,
    0.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])("rejects invalid value %s", (value) => {
    expect(() => eventSequence(value)).toThrow();
  });

  it("increments an event sequence", () => {
    expect(nextEventSequence(eventSequence(0))).toBe(1);
  });

  it("rejects increment overflow", () => {
    expect(() =>
      nextEventSequence(
        eventSequence(Number.MAX_SAFE_INTEGER)
      )
    ).toThrow();
  });

  it("compares event sequences", () => {
    expect(
      compareEventSequences(
        eventSequence(1),
        eventSequence(2)
      )
    ).toBe(-1);

    expect(
      compareEventSequences(
        eventSequence(2),
        eventSequence(2)
      )
    ).toBe(0);

    expect(
      compareEventSequences(
        eventSequence(3),
        eventSequence(2)
      )
    ).toBe(1);
  });
});

describe("Nonce", () => {
  it("accepts zero as its minimum boundary", () => {
    expect(nonce(0)).toBe(0);
  });

  it.each([
    -1,
    0.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])("rejects invalid value %s", (value) => {
    expect(() => nonce(value)).toThrow();
  });

  it("increments a nonce", () => {
    expect(nextNonce(nonce(0))).toBe(1);
  });

  it("rejects increment overflow", () => {
    expect(() =>
      nextNonce(nonce(Number.MAX_SAFE_INTEGER))
    ).toThrow();
  });

  it("compares nonces", () => {
    expect(compareNonces(nonce(1), nonce(2))).toBe(-1);
    expect(compareNonces(nonce(2), nonce(2))).toBe(0);
    expect(compareNonces(nonce(3), nonce(2))).toBe(1);
  });
});