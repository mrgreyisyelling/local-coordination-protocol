import { describe, expect, it } from "vitest";

import {
  accountId,
  batchId,
  commandId,
  createDeterministicTestIdentifierGenerator,
  depositId,
  deterministicTestId,
  eventId,
  liquidationId,
  memberId,
  parseIdentifier,
  propertyId,
  type IdentifierKind,
} from "./index.js";

const PAYLOAD_ONE = "00000000000000000000000001";

const constructors = {
  member: memberId,
  account: accountId,
  property: propertyId,
  deposit: depositId,
  command: commandId,
  event: eventId,
  batch: batchId,
  liquidation: liquidationId,
} as const;

const prefixes = {
  member: "mem",
  account: "acct",
  property: "prop",
  deposit: "dep",
  command: "cmd",
  event: "evt",
  batch: "batch",
  liquidation: "liq",
} as const;

const kinds = Object.keys(constructors) as IdentifierKind[];

describe("stable identifier constructors", () => {
  for (const kind of kinds) {
    const constructor = constructors[kind];
    const prefix = prefixes[kind];
    const canonical = `${prefix}_${PAYLOAD_ONE}`;

    describe(kind, () => {
      it("accepts its canonical identifier", () => {
        expect(constructor(canonical)).toBe(canonical);
      });

      it("rejects an empty identifier", () => {
        expect(() => constructor("")).toThrow(RangeError);
      });

      it("rejects an identifier without a separator", () => {
        expect(() => constructor(`${prefix}${PAYLOAD_ONE}`)).toThrow(
          RangeError,
        );
      });

      it("rejects a valid identifier with the wrong entity prefix", () => {
        const wrongPrefix =
          kind === "member" ? "prop" : "mem";

        expect(() =>
          constructor(`${wrongPrefix}_${PAYLOAD_ONE}`),
        ).toThrow(RangeError);
      });

      it("rejects a short payload", () => {
        expect(() =>
          constructor(`${prefix}_${PAYLOAD_ONE.slice(1)}`),
        ).toThrow(RangeError);
      });

      it("rejects a long payload", () => {
        expect(() =>
          constructor(`${prefix}_0${PAYLOAD_ONE}`),
        ).toThrow(RangeError);
      });

      it("rejects lowercase payload characters", () => {
        expect(() =>
          constructor(`${prefix}_${PAYLOAD_ONE.slice(0, -1)}a`),
        ).toThrow(RangeError);
      });

      it("rejects ambiguous Crockford characters", () => {
        expect(() =>
          constructor(`${prefix}_${PAYLOAD_ONE.slice(0, -1)}I`),
        ).toThrow(RangeError);
      });

      it("rejects a second separator", () => {
        expect(() =>
          constructor(`${prefix}_${PAYLOAD_ONE.slice(0, -1)}_`),
        ).toThrow(RangeError);
      });
    });
  }
});

describe("generic identifier parsing", () => {
  it("returns the type-specific canonical value", () => {
    expect(
      parseIdentifier("property", `prop_${PAYLOAD_ONE}`),
    ).toBe(`prop_${PAYLOAD_ONE}`);
  });

  it("applies the selected kind's prefix rule", () => {
    expect(() =>
      parseIdentifier("member", `prop_${PAYLOAD_ONE}`),
    ).toThrow(RangeError);
  });
});

describe("deterministic test identifiers", () => {
  it("encodes sequence one in canonical form", () => {
    expect(deterministicTestId("member", 1)).toBe(
      `mem_${PAYLOAD_ONE}`,
    );
  });

  it("encodes sequence 31 with the final Crockford digit Z", () => {
    expect(deterministicTestId("event", 31)).toBe(
      "evt_0000000000000000000000000Z",
    );
  });

  it("encodes sequence 32 as base32 10", () => {
    expect(deterministicTestId("batch", 32)).toBe(
      "batch_00000000000000000000000010",
    );
  });

  it.each([
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])("rejects invalid sequence %s", (sequence) => {
    expect(() =>
      deterministicTestId("deposit", sequence),
    ).toThrow(RangeError);
  });

  it("creates repeatable values for the same input", () => {
    expect(deterministicTestId("liquidation", 42)).toBe(
      deterministicTestId("liquidation", 42),
    );
  });
});

describe("deterministic test identifier generator", () => {
  it("advances one shared sequence across requested kinds", () => {
    const generator =
      createDeterministicTestIdentifierGenerator();

    expect(generator.next("member")).toBe(
      "mem_00000000000000000000000001",
    );
    expect(generator.next("property")).toBe(
      "prop_00000000000000000000000002",
    );
    expect(generator.next("event")).toBe(
      "evt_00000000000000000000000003",
    );
  });

  it("accepts an explicit positive starting sequence", () => {
    const generator =
      createDeterministicTestIdentifierGenerator(32);

    expect(generator.next("account")).toBe(
      "acct_00000000000000000000000010",
    );
  });

  it.each([
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
  ])("rejects invalid starting sequence %s", (sequence) => {
    expect(() =>
      createDeterministicTestIdentifierGenerator(sequence),
    ).toThrow(RangeError);
  });

  it("rejects advancement beyond the safe-integer sequence", () => {
    const generator =
      createDeterministicTestIdentifierGenerator(
        Number.MAX_SAFE_INTEGER,
      );

    expect(() => generator.next("command")).toThrow(RangeError);
  });
});