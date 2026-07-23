import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BATCH_STATUS_VALUES,
  COMMAND_STATUS_VALUES,
  LIQUIDATION_STATUS_VALUES,
  MEMBER_STATUS_VALUES,
  POOL_STATUS_VALUES,
  PROPERTY_STATUS_VALUES,
  allowedNextStatuses,
  batchStatus,
  canTransitionStatus,
  commandStatus,
  liquidationStatus,
  memberStatus,
  poolStatus,
  propertyStatus,
  transitionStatus,
  type LifecycleKind,
  type StatusByLifecycle,
} from "./domain-statuses.js";

function registerLifecycleTests<K extends LifecycleKind>(
  name: string,
  kind: K,
  rawStatuses: readonly string[],
  parse: (value: string) => StatusByLifecycle[K],
  expectedTransitions: Readonly<Record<string, readonly string[]>>,
): void {
  describe(`${name} lifecycle`, () => {
    it("accepts exactly its declared status vocabulary", () => {
      for (const value of rawStatuses) {
        expect(parse(value)).toBe(value);
      }

      expect(() => parse("")).toThrow(RangeError);
      expect(() => parse("unknown")).toThrow(RangeError);
      expect(() => parse("ACTIVE")).toThrow(RangeError);
    });

    it("enforces every ordered pair in its transition table", () => {
      for (const rawFrom of rawStatuses) {
        const from = parse(rawFrom);
        const expectedTargets = expectedTransitions[rawFrom];

        if (expectedTargets === undefined) {
          throw new Error(
            `Missing expected transition targets for ${kind} status: ${rawFrom}`,
          );
        }

        expect(allowedNextStatuses(kind, from)).toEqual(expectedTargets);

        for (const rawTo of rawStatuses) {
          const to = parse(rawTo);
          const shouldAllow = expectedTargets.includes(rawTo);

          expect(canTransitionStatus(kind, from, to)).toBe(
            shouldAllow,
          );

          if (shouldAllow) {
            expect(transitionStatus(kind, from, to)).toBe(to);
          } else {
            expect(() =>
              transitionStatus(kind, from, to),
            ).toThrow(RangeError);
          }
        }
      }
    });
  });
}

registerLifecycleTests(
  "property",
  "property",
  PROPERTY_STATUS_VALUES,
  propertyStatus,
  {
    proposed: ["active", "rejected"],
    active: ["suspended", "liquidating"],
    suspended: ["active", "liquidating"],
    rejected: [],
    liquidating: ["closed"],
    closed: [],
  },
);

registerLifecycleTests(
  "pool",
  "pool",
  POOL_STATUS_VALUES,
  poolStatus,
  {
    open: ["frozen", "liquidating"],
    frozen: ["open", "liquidating"],
    liquidating: ["closed"],
    closed: [],
  },
);

registerLifecycleTests(
  "member",
  "member",
  MEMBER_STATUS_VALUES,
  memberStatus,
  {
    pending: ["active", "closed"],
    active: ["suspended", "closed"],
    suspended: ["active", "closed"],
    closed: [],
  },
);

registerLifecycleTests(
  "command",
  "command",
  COMMAND_STATUS_VALUES,
  commandStatus,
  {
    received: ["accepted", "rejected"],
    accepted: [],
    rejected: [],
  },
);

registerLifecycleTests(
  "batch",
  "batch",
  BATCH_STATUS_VALUES,
  batchStatus,
  {
    open: ["sealed"],
    sealed: ["committed"],
    committed: [],
  },
);

registerLifecycleTests(
  "liquidation",
  "liquidation",
  LIQUIDATION_STATUS_VALUES,
  liquidationStatus,
  {
    planned: ["active", "cancelled"],
    active: ["settled"],
    settled: ["closed"],
    cancelled: [],
    closed: [],
  },
);

describe("terminal-state safeguards", () => {
  it("does not allow closed states to return to active operation", () => {
    expect(
      canTransitionStatus(
        "property",
        propertyStatus("closed"),
        propertyStatus("active"),
      ),
    ).toBe(false);

    expect(
      canTransitionStatus(
        "pool",
        poolStatus("closed"),
        poolStatus("open"),
      ),
    ).toBe(false);

    expect(
      canTransitionStatus(
        "member",
        memberStatus("closed"),
        memberStatus("active"),
      ),
    ).toBe(false);

    expect(
      canTransitionStatus(
        "liquidation",
        liquidationStatus("closed"),
        liquidationStatus("active"),
      ),
    ).toBe(false);
  });

  it("does not confuse checking a transition with recording history", () => {
    const from = memberStatus("suspended");
    const to = memberStatus("active");

    expect(canTransitionStatus("member", from, to)).toBe(true);
    expect(from).toBe("suspended");
    expect(to).toBe("active");
  });
});

