# WO-013 Execution Record — Define Domain Errors and Results

## Purpose

Define stable expected-rejection codes and discriminated domain results.

This record captures the actual commands and output of WO-013.

---

## Step 1 — Confirm WO-012 and initialize the execution record

**Input:** The committed and verified WO-012 lifecycle vocabulary.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-013-execution.md

$ git log -1 --oneline
e3b02fe feat(domain): define lifecycle statuses

$ git diff --check

$ rg -n "TEMPORARY:" packages/domain/src docs/work-orders || true
docs/work-orders/WO-011-execution.md:844:**Temporary action:** Append the supplied test named `TEMPORARY: incorrectly accepts an empty MemberId` to `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-011-execution.md:864:it("TEMPORARY: incorrectly accepts an empty MemberId", () => {
docs/work-orders/WO-011-execution.md:973:[31m   [31m×[31m TEMPORARY: incorrectly accepts an empty MemberId[39m[32m 6[2mms[22m[39m
docs/work-orders/WO-011-execution.md:977:[41m[1m FAIL [22m[49m src/identifiers.test.ts[2m > [22mTEMPORARY: incorrectly accepts an empty MemberId
docs/work-orders/WO-011-execution.md:988:    [90m209|[39m [34mit[39m([32m"TEMPORARY: incorrectly accepts an empty MemberId"[39m[33m,[39m () [33m=>[39m {
docs/work-orders/WO-011-execution.md:1022:**Action:** Remove only the test named `TEMPORARY: incorrectly accepts an empty MemberId` from `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-011-execution.md:1029:$ rg -n "TEMPORARY:" packages/domain/src/identifiers.test.ts || true
docs/work-orders/WO-013-execution.md:29:$ rg -n "TEMPORARY:" packages/domain/src docs/work-orders || true
docs/work-orders/WO-012-execution.md:29:$ rg -n "TEMPORARY:" packages/domain/src docs/work-orders || true
docs/work-orders/WO-012-execution.md:30:docs/work-orders/WO-011-execution.md:844:**Temporary action:** Append the supplied test named `TEMPORARY: incorrectly accepts an empty MemberId` to `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-012-execution.md:31:docs/work-orders/WO-011-execution.md:864:it("TEMPORARY: incorrectly accepts an empty MemberId", () => {
docs/work-orders/WO-012-execution.md:32:docs/work-orders/WO-011-execution.md:973:[31m   [31m×[31m TEMPORARY: incorrectly accepts an empty MemberId[39m[32m 6[2mms[22m[39m
docs/work-orders/WO-012-execution.md:33:docs/work-orders/WO-011-execution.md:977:[41m[1m FAIL [22m[49m src/identifiers.test.ts[2m > [22mTEMPORARY: incorrectly accepts an empty MemberId
docs/work-orders/WO-012-execution.md:34:docs/work-orders/WO-011-execution.md:988:    [90m209|[39m [34mit[39m([32m"TEMPORARY: incorrectly accepts an empty MemberId"[39m[33m,[39m () [33m=>[39m {
docs/work-orders/WO-012-execution.md:35:docs/work-orders/WO-011-execution.md:1022:**Action:** Remove only the test named `TEMPORARY: incorrectly accepts an empty MemberId` from `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-012-execution.md:36:docs/work-orders/WO-011-execution.md:1029:$ rg -n "TEMPORARY:" packages/domain/src/identifiers.test.ts || true
docs/work-orders/WO-012-execution.md:37:docs/work-orders/WO-012-execution.md:29:$ rg -n "TEMPORARY:" packages/domain/src docs/work-orders || true
docs/work-orders/WO-012-execution.md:38:docs/work-orders/WO-012-execution.md:30:docs/work-orders/WO-011-execution.md:844:**Temporary action:** Append the supplied test named `TEMPORARY: incorrectly accepts an empty MemberId` to `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-012-execution.md:39:docs/work-orders/WO-012-execution.md:31:docs/work-orders/WO-011-execution.md:864:it("TEMPORARY: incorrectly accepts an empty MemberId", () => {
docs/work-orders/WO-012-execution.md:40:docs/work-orders/WO-012-execution.md:32:docs/work-orders/WO-011-execution.md:973:[31m   [31m×[31m TEMPORARY: incorrectly accepts an empty MemberId[39m[32m 6[2mms[22m[39m
docs/work-orders/WO-012-execution.md:41:docs/work-orders/WO-012-execution.md:33:docs/work-orders/WO-011-execution.md:977:[41m[1m FAIL [22m[49m src/identifiers.test.ts[2m > [22mTEMPORARY: incorrectly accepts an empty MemberId
docs/work-orders/WO-012-execution.md:42:docs/work-orders/WO-012-execution.md:34:docs/work-orders/WO-011-execution.md:988:    [90m209|[39m [34mit[39m([32m"TEMPORARY: incorrectly accepts an empty MemberId"[39m[33m,[39m () [33m=>[39m {
docs/work-orders/WO-012-execution.md:43:docs/work-orders/WO-012-execution.md:35:docs/work-orders/WO-011-execution.md:1022:**Action:** Remove only the test named `TEMPORARY: incorrectly accepts an empty MemberId` from `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-012-execution.md:44:docs/work-orders/WO-012-execution.md:36:docs/work-orders/WO-011-execution.md:1029:$ rg -n "TEMPORARY:" packages/domain/src/identifiers.test.ts || true
docs/work-orders/WO-012-execution.md:45:docs/work-orders/WO-010-execution.md:1224:it("TEMPORARY: incorrectly accepts fractional cents", () => {
docs/work-orders/WO-012-execution.md:46:docs/work-orders/WO-010-execution.md:1234:$ rg -n "TEMPORARY: incorrectly accepts fractional cents" packages/domain/src/value-types.test.ts
docs/work-orders/WO-012-execution.md:47:docs/work-orders/WO-010-execution.md:1235:237:it("TEMPORARY: incorrectly accepts fractional cents", () => {
docs/work-orders/WO-012-execution.md:48:docs/work-orders/WO-010-execution.md:1300:[31m   [31m×[31m TEMPORARY: incorrectly accepts fractional cents[39m[32m 3[2mms[22m[39m
docs/work-orders/WO-012-execution.md:49:docs/work-orders/WO-010-execution.md:1304:[41m[1m FAIL [22m[49m src/value-types.test.ts[2m > [22mTEMPORARY: incorrectly accepts fractional cents
docs/work-orders/WO-012-execution.md:50:docs/work-orders/WO-010-execution.md:1346:it("TEMPORARY: incorrectly accepts fractional cents", () => {
docs/work-orders/WO-012-execution.md:51:docs/work-orders/WO-010-execution.md:1356:$ rg -n "TEMPORARY: incorrectly accepts fractional cents" packages/domain/src/value-types.test.ts
docs/work-orders/WO-012-execution.md:1117:**Temporary action:** Append the supplied test named `TEMPORARY: allows a closed property to reactivate` to `packages/domain/src/domain-statuses.test.ts`.
docs/work-orders/WO-012-execution.md:1219:**Temporary action:** Append the supplied test named `TEMPORARY: allows a closed property to reactivate` to `packages/domain/src/domain-statuses.test.ts`.
docs/work-orders/WO-012-execution.md:1239:it("TEMPORARY: allows a closed property to reactivate", () => {
docs/work-orders/WO-012-execution.md:1275:[31m   [31m×[31m TEMPORARY: allows a closed property to reactivate[39m[32m 3[2mms[22m[39m
docs/work-orders/WO-012-execution.md:1279:[41m[1m FAIL [22m[49m src/domain-statuses.test.ts[2m > [22mTEMPORARY: allows a closed property to reactivate
docs/work-orders/WO-012-execution.md:1319:**Action:** Remove only the test named `TEMPORARY: allows a closed property to reactivate` from `packages/domain/src/domain-statuses.test.ts`.
docs/work-orders/WO-012-execution.md:1326:$ rg -n "TEMPORARY:" packages/domain/src/domain-statuses.test.ts || true
docs/work-orders/WO-012-execution.md:1597:$ rg -n "TEMPORARY:" packages/domain/src || true
docs/work-orders/WO-012-execution.md:1639:$ rg -n "TEMPORARY:" packages/domain/src || true
docs/work-orders/WO-012-execution.md:1681:$ rg -n "TEMPORARY:" packages/domain/src || true
docs/work-orders/WO-012-execution.md:1723:$ rg -n "TEMPORARY:" packages/domain/src || true
docs/work-orders/WO-012-execution.md:1851:$ rg -n "TEMPORARY:" packages/domain/src || true
docs/work-orders/WO-010-execution.md:1224:it("TEMPORARY: incorrectly accepts fractional cents", () => {
docs/work-orders/WO-010-execution.md:1234:$ rg -n "TEMPORARY: incorrectly accepts fractional cents" packages/domain/src/value-types.test.ts
docs/work-orders/WO-010-execution.md:1235:237:it("TEMPORARY: incorrectly accepts fractional cents", () => {
docs/work-orders/WO-010-execution.md:1300:[31m   [31m×[31m TEMPORARY: incorrectly accepts fractional cents[39m[32m 3[2mms[22m[39m
docs/work-orders/WO-010-execution.md:1304:[41m[1m FAIL [22m[49m src/value-types.test.ts[2m > [22mTEMPORARY: incorrectly accepts fractional cents
docs/work-orders/WO-010-execution.md:1346:it("TEMPORARY: incorrectly accepts fractional cents", () => {
docs/work-orders/WO-010-execution.md:1356:$ rg -n "TEMPORARY: incorrectly accepts fractional cents" packages/domain/src/value-types.test.ts

$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm test --workspace packages/domain

> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 16[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m158 passed[39m[22m[90m (158)[39m
[2m   Start at [22m 20:23:56
[2m   Duration [22m 262ms[2m (transform 283ms, setup 0ms, import 383ms, tests 46ms, environment 0ms)[22m

```

**Output:** The repository location, Git state, latest commit, temporary-test state, and passing WO-012 baseline are recorded.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the current error and transition boundaries.

---

## Step 2 — Inspect the current error and transition boundaries

**Input:** The verified WO-012 domain package.

**Commands and output:**

```text
$ find packages/domain/src -maxdepth 1 -type f | sort
packages/domain/src/domain-statuses.test.ts
packages/domain/src/domain-statuses.ts
packages/domain/src/domain-statuses.type-test.ts
packages/domain/src/identifiers.test.ts
packages/domain/src/identifiers.ts
packages/domain/src/identifiers.type-test.ts
packages/domain/src/index.test.ts
packages/domain/src/index.ts
packages/domain/src/value-types.test.ts
packages/domain/src/value-types.ts
packages/domain/src/value-types.type-test.ts

$ sed -n "1,320p" packages/domain/src/domain-statuses.ts
declare const propertyStatusBrand: unique symbol;
declare const poolStatusBrand: unique symbol;
declare const memberStatusBrand: unique symbol;
declare const commandStatusBrand: unique symbol;
declare const batchStatusBrand: unique symbol;
declare const liquidationStatusBrand: unique symbol;

export const PROPERTY_STATUS_VALUES = [
  "proposed",
  "active",
  "suspended",
  "rejected",
  "liquidating",
  "closed",
] as const;

export const POOL_STATUS_VALUES = [
  "open",
  "frozen",
  "liquidating",
  "closed",
] as const;

export const MEMBER_STATUS_VALUES = [
  "pending",
  "active",
  "suspended",
  "closed",
] as const;

export const COMMAND_STATUS_VALUES = [
  "received",
  "accepted",
  "rejected",
] as const;

export const BATCH_STATUS_VALUES = [
  "open",
  "sealed",
  "committed",
] as const;

export const LIQUIDATION_STATUS_VALUES = [
  "planned",
  "active",
  "settled",
  "cancelled",
  "closed",
] as const;

type PropertyStatusValue = (typeof PROPERTY_STATUS_VALUES)[number];
type PoolStatusValue = (typeof POOL_STATUS_VALUES)[number];
type MemberStatusValue = (typeof MEMBER_STATUS_VALUES)[number];
type CommandStatusValue = (typeof COMMAND_STATUS_VALUES)[number];
type BatchStatusValue = (typeof BATCH_STATUS_VALUES)[number];
type LiquidationStatusValue =
  (typeof LIQUIDATION_STATUS_VALUES)[number];

export type PropertyStatus = PropertyStatusValue & {
  readonly [propertyStatusBrand]: "PropertyStatus";
};
export type PoolStatus = PoolStatusValue & {
  readonly [poolStatusBrand]: "PoolStatus";
};
export type MemberStatus = MemberStatusValue & {
  readonly [memberStatusBrand]: "MemberStatus";
};
export type CommandStatus = CommandStatusValue & {
  readonly [commandStatusBrand]: "CommandStatus";
};
export type BatchStatus = BatchStatusValue & {
  readonly [batchStatusBrand]: "BatchStatus";
};
export type LiquidationStatus = LiquidationStatusValue & {
  readonly [liquidationStatusBrand]: "LiquidationStatus";
};

export type LifecycleKind =
  | "property"
  | "pool"
  | "member"
  | "command"
  | "batch"
  | "liquidation";

export interface StatusValueByLifecycle {
  readonly property: PropertyStatusValue;
  readonly pool: PoolStatusValue;
  readonly member: MemberStatusValue;
  readonly command: CommandStatusValue;
  readonly batch: BatchStatusValue;
  readonly liquidation: LiquidationStatusValue;
}

export interface StatusByLifecycle {
  readonly property: PropertyStatus;
  readonly pool: PoolStatus;
  readonly member: MemberStatus;
  readonly command: CommandStatus;
  readonly batch: BatchStatus;
  readonly liquidation: LiquidationStatus;
}

type TransitionTables = {
  readonly [K in LifecycleKind]: {
    readonly [S in StatusValueByLifecycle[K]]:
      readonly StatusValueByLifecycle[K][];
  };
};

const STATUS_VALUES = {
  property: PROPERTY_STATUS_VALUES,
  pool: POOL_STATUS_VALUES,
  member: MEMBER_STATUS_VALUES,
  command: COMMAND_STATUS_VALUES,
  batch: BATCH_STATUS_VALUES,
  liquidation: LIQUIDATION_STATUS_VALUES,
} as const satisfies Record<LifecycleKind, readonly string[]>;

const ALLOWED_TRANSITIONS = {
  property: {
    proposed: ["active", "rejected"],
    active: ["suspended", "liquidating"],
    suspended: ["active", "liquidating"],
    rejected: [],
    liquidating: ["closed"],
    closed: [],
  },
  pool: {
    open: ["frozen", "liquidating"],
    frozen: ["open", "liquidating"],
    liquidating: ["closed"],
    closed: [],
  },
  member: {
    pending: ["active", "closed"],
    active: ["suspended", "closed"],
    suspended: ["active", "closed"],
    closed: [],
  },
  command: {
    received: ["accepted", "rejected"],
    accepted: [],
    rejected: [],
  },
  batch: {
    open: ["sealed"],
    sealed: ["committed"],
    committed: [],
  },
  liquidation: {
    planned: ["active", "cancelled"],
    active: ["settled"],
    settled: ["closed"],
    cancelled: [],
    closed: [],
  },
} as const satisfies TransitionTables;

function statusValue<K extends LifecycleKind>(
  kind: K,
  value: string,
): StatusByLifecycle[K] {
  const values = STATUS_VALUES[kind] as readonly string[];

  if (!values.includes(value)) {
    throw new RangeError(`Unknown ${kind} status: ${value}`);
  }

  return value as StatusByLifecycle[K];
}

export function propertyStatus(value: string): PropertyStatus {
  return statusValue("property", value);
}

export function poolStatus(value: string): PoolStatus {
  return statusValue("pool", value);
}

export function memberStatus(value: string): MemberStatus {
  return statusValue("member", value);
}

export function commandStatus(value: string): CommandStatus {
  return statusValue("command", value);
}

export function batchStatus(value: string): BatchStatus {
  return statusValue("batch", value);
}

export function liquidationStatus(
  value: string,
): LiquidationStatus {
  return statusValue("liquidation", value);
}

export function parseStatus<K extends LifecycleKind>(
  kind: K,
  value: string,
): StatusByLifecycle[K] {
  return statusValue(kind, value);
}

export function allowedNextStatuses<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
): readonly StatusByLifecycle[K][] {
  const table = ALLOWED_TRANSITIONS[kind] as Record<
    string,
    readonly string[]
  >;

  return table[from] as readonly StatusByLifecycle[K][];
}

export function canTransitionStatus<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
  to: StatusByLifecycle[K],
): boolean {
  const allowed = allowedNextStatuses(kind, from) as readonly string[];

  return allowed.includes(to);
}

export function transitionStatus<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
  to: StatusByLifecycle[K],
): StatusByLifecycle[K] {
  if (!canTransitionStatus(kind, from, to)) {
    throw new RangeError(
      `Cannot transition ${kind} status from ${from} to ${to}`,
    );
  }

  return to;
}
$ sed -n "1,360p" packages/domain/src/domain-statuses.test.ts
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


$ sed -n "1,260p" packages/domain/src/domain-statuses.type-test.ts
import {
  allowedNextStatuses,
  batchStatus,
  canTransitionStatus,
  commandStatus,
  liquidationStatus,
  memberStatus,
  poolStatus,
  propertyStatus,
  transitionStatus,
  type BatchStatus,
  type CommandStatus,
  type LiquidationStatus,
  type MemberStatus,
  type PoolStatus,
  type PropertyStatus,
} from "./domain-statuses.js";

const propertyActive: PropertyStatus = propertyStatus("active");
const propertyClosed: PropertyStatus = propertyStatus("closed");
const poolOpen: PoolStatus = poolStatus("open");
const poolFrozen: PoolStatus = poolStatus("frozen");
const memberActive: MemberStatus = memberStatus("active");
const commandReceived: CommandStatus = commandStatus("received");
const batchOpen: BatchStatus = batchStatus("open");
const liquidationPlanned: LiquidationStatus =
  liquidationStatus("planned");

canTransitionStatus(
  "property",
  propertyActive,
  propertyStatus("suspended"),
);
transitionStatus("pool", poolOpen, poolFrozen);
allowedNextStatuses("member", memberActive);

// @ts-expect-error Plain strings are not validated PropertyStatus values.
const plainPropertyStatus: PropertyStatus = "active";

// @ts-expect-error PoolStatus is not assignable to PropertyStatus.
const propertyFromPool: PropertyStatus = poolOpen;

// @ts-expect-error PropertyStatus is not assignable to MemberStatus.
const memberFromProperty: MemberStatus = propertyActive;

// @ts-expect-error MemberStatus is not assignable to CommandStatus.
const commandFromMember: CommandStatus = memberActive;

// @ts-expect-error CommandStatus is not assignable to BatchStatus.
const batchFromCommand: BatchStatus = commandReceived;

// @ts-expect-error BatchStatus is not assignable to LiquidationStatus.
const liquidationFromBatch: LiquidationStatus = batchOpen;

// @ts-expect-error Property transitions require PropertyStatus arguments.
canTransitionStatus("property", poolOpen, poolFrozen);

// @ts-expect-error The target must belong to the selected lifecycle.
transitionStatus("member", memberActive, propertyClosed);

// @ts-expect-error Status lookup requires the selected lifecycle type.
allowedNextStatuses("liquidation", commandReceived);

void plainPropertyStatus;
void propertyFromPool;
void memberFromProperty;
void commandFromMember;
void batchFromCommand;
void liquidationFromBatch;
void liquidationPlanned;
$ sed -n "1,220p" packages/domain/src/index.ts
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
$ rg -n "throw|RangeError|DomainResult|DomainError" packages/domain/src
packages/domain/src/domain-statuses.test.ts:40:      expect(() => parse("")).toThrow(RangeError);
packages/domain/src/domain-statuses.test.ts:41:      expect(() => parse("unknown")).toThrow(RangeError);
packages/domain/src/domain-statuses.test.ts:42:      expect(() => parse("ACTIVE")).toThrow(RangeError);
packages/domain/src/domain-statuses.test.ts:51:          throw new Error(
packages/domain/src/domain-statuses.test.ts:71:            ).toThrow(RangeError);
packages/domain/src/value-types.ts:26:    throw new RangeError(`${name} must be a safe integer`);
packages/domain/src/value-types.ts:46:    throw new RangeError("Cents must be nonnegative");
packages/domain/src/value-types.ts:71:    throw new RangeError(
packages/domain/src/value-types.ts:92:    throw new RangeError(
packages/domain/src/value-types.ts:111:    throw new RangeError("EventSequence must be nonnegative");
packages/domain/src/value-types.ts:134:    throw new RangeError("Nonce must be nonnegative");
packages/domain/src/identifiers.ts:83:    throw new RangeError(`${kind} identifier must contain one separator`);
packages/domain/src/identifiers.ts:90:    throw new RangeError(
packages/domain/src/identifiers.ts:96:    throw new RangeError(
packages/domain/src/identifiers.ts:145:    throw new RangeError(
packages/domain/src/identifiers.ts:176:    throw new RangeError(
packages/domain/src/identifiers.ts:190:        throw new RangeError("Test identifier sequence is exhausted");
packages/domain/src/domain-statuses.ts:167:    throw new RangeError(`Unknown ${kind} status: ${value}`);
packages/domain/src/domain-statuses.ts:234:    throw new RangeError(
packages/domain/src/identifiers.test.ts:56:        expect(() => constructor("")).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:61:          RangeError,
packages/domain/src/identifiers.test.ts:71:        ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:77:        ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:83:        ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:89:        ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:95:        ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:101:        ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:117:    ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:150:    ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:195:    ).toThrow(RangeError);
packages/domain/src/identifiers.test.ts:204:    expect(() => generator.next("command")).toThrow(RangeError);
```

**Output:** Existing constructors, thrown boundaries, transition tests, type tests, and exports are recorded before WO-013 edits.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the domain-result contract.

---

## Step 3 — Record the domain-result contract

**Input:** The master-plan WO-013 boundary and the inspected WO-012 source.

**Contract:**

- Expected rule rejections return `DomainFailure`; they do not throw.
- Successful domain operations return `DomainSuccess`.
- `ok` is the literal discriminant used for type narrowing.
- Error codes are stable; human-readable messages may change.
- Tests select the failure branch and assert `error.code`.
- Details are structured diagnostics and contain no secrets.
- Unknown codes and empty constructed messages remain programming errors.
- Infrastructure failures and violated internal assumptions may still throw.
- Impossible lifecycle transitions return `invalid-status-transition`.
- Result creation and transition checking do not mutate domain state or write events.

**Output:** The design boundary is recorded before source creation.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the domain-error and result implementation.

---

## Step 4 — Create the domain-error and result implementation

**Input:** The recorded WO-013 design contract.

**Action:** Create `packages/domain/src/domain-errors.ts` with the supplied contents.

**Editor command:** `code packages/domain/src/domain-errors.ts`

**Resulting file:**

```text
export const DOMAIN_ERROR_CODE_VALUES = [
  "invalid-input",
  "not-found",
  "already-exists",
  "invalid-status-transition",
  "ineligible-membership",
  "unauthorized",
  "duplicate-command",
  "duplicate-payment",
  "nonce-conflict",
  "expired-command",
  "pool-unavailable",
  "insufficient-capacity",
  "insufficient-balance",
  "invalid-interval",
  "ownership-conflict",
  "liquidation-frozen",
  "sale-incomplete",
  "already-processed",
] as const;

export type DomainErrorCode =
  (typeof DOMAIN_ERROR_CODE_VALUES)[number];

export interface DomainError<
  C extends DomainErrorCode = DomainErrorCode,
> {
  readonly code: C;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface DomainSuccess<T> {
  readonly ok: true;
  readonly value: T;
}

export interface DomainFailure<
  E extends DomainError = DomainError,
> {
  readonly ok: false;
  readonly error: E;
}

export type DomainResult<
  T,
  E extends DomainError = DomainError,
> = DomainSuccess<T> | DomainFailure<E>;

export function domainErrorCode(value: string): DomainErrorCode {
  const values = DOMAIN_ERROR_CODE_VALUES as readonly string[];

  if (!values.includes(value)) {
    throw new RangeError(`Unknown domain error code: ${value}`);
  }

  return value as DomainErrorCode;
}

export function domainError<C extends DomainErrorCode>(
  code: C,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): DomainError<C> {
  const normalizedMessage = message.trim();

  if (normalizedMessage.length === 0) {
    throw new TypeError("Domain error message must not be empty");
  }

  if (details === undefined) {
    return Object.freeze({
      code,
      message: normalizedMessage,
    });
  }

  return Object.freeze({
    code,
    message: normalizedMessage,
    details: Object.freeze({ ...details }),
  });
}

export function domainSuccess<T>(value: T): DomainSuccess<T> {
  return Object.freeze({
    ok: true,
    value,
  });
}

export function domainFailure<E extends DomainError>(
  error: E,
): DomainFailure<E> {
  return Object.freeze({
    ok: false,
    error,
  });
}```

**Output:** Eighteen stable codes, typed error and result shapes, runtime parsing, and immutable constructors are present.

**Status:** Step 4 complete.

**Next:** Step 5 — Export the domain-result vocabulary.

---

## Step 5 — Export the domain-result vocabulary

**Input:** The saved domain-error implementation and existing public exports.

**Action:** Add `export * from "./domain-errors.js";` to `packages/domain/src/index.ts` without removing existing content.

**Editor command:** `code packages/domain/src/index.ts`

**Resulting file:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";```

**Output:** The result vocabulary is exported exactly once without removing prior exports.

**Status:** Step 5 complete.

**Next:** Step 6 — Create focused runtime tests.

---

## Step 6 — Create focused runtime tests

**Input:** The implementation and public export from Steps 4–5.

**Action:** Create `packages/domain/src/domain-errors.test.ts` with the supplied tests.

**Editor command:** `code packages/domain/src/domain-errors.test.ts`

**Resulting file:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  DOMAIN_ERROR_CODE_VALUES,
  domainError,
  domainErrorCode,
  domainFailure,
  domainSuccess,
  type DomainResult,
} from "./domain-errors.js";

const EXPECTED_CODES = [
  "invalid-input",
  "not-found",
  "already-exists",
  "invalid-status-transition",
  "ineligible-membership",
  "unauthorized",
  "duplicate-command",
  "duplicate-payment",
  "nonce-conflict",
  "expired-command",
  "pool-unavailable",
  "insufficient-capacity",
  "insufficient-balance",
  "invalid-interval",
  "ownership-conflict",
  "liquidation-frozen",
  "sale-incomplete",
  "already-processed",
] as const;

describe("domain error codes", () => {
  it("contains exactly the declared stable vocabulary", () => {
    expect(DOMAIN_ERROR_CODE_VALUES).toEqual(EXPECTED_CODES);
    expect(new Set(DOMAIN_ERROR_CODE_VALUES).size).toBe(
      DOMAIN_ERROR_CODE_VALUES.length,
    );
  });

  it("accepts every declared code at the runtime boundary", () => {
    for (const code of EXPECTED_CODES) {
      expect(domainErrorCode(code)).toBe(code);
    }
  });

  it("rejects unknown, empty, and incorrectly cased codes", () => {
    expect(() => domainErrorCode("")).toThrow(RangeError);
    expect(() => domainErrorCode("unknown")).toThrow(RangeError);
    expect(() =>
      domainErrorCode("INSUFFICIENT-BALANCE"),
    ).toThrow(RangeError);
  });
});

describe("domain errors", () => {
  it("preserves a stable code and structured details", () => {
    const error = domainError(
      "insufficient-balance",
      "The account does not hold enough claim value.",
      {
        requestedCents: 500,
        availableCents: 300,
      },
    );

    expect(error.code).toBe("insufficient-balance");
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.details).toEqual({
      requestedCents: 500,
      availableCents: 300,
    });
  });

  it("normalizes surrounding message whitespace", () => {
    const error = domainError(
      "ineligible-membership",
      "  The member is not eligible.  ",
    );

    expect(error.code).toBe("ineligible-membership");
    expect(error.message).toBe("The member is not eligible.");
  });

  it("rejects an empty human-readable message as programmer error", () => {
    expect(() =>
      domainError("invalid-input", ""),
    ).toThrow(TypeError);
    expect(() =>
      domainError("invalid-input", "   "),
    ).toThrow(TypeError);
  });
});

describe("domain results", () => {
  it("creates a success envelope", () => {
    const result = domainSuccess({ acceptedCents: 250 });

    expect(result).toEqual({
      ok: true,
      value: { acceptedCents: 250 },
    });
  });

  it("creates a failure envelope", () => {
    const error = domainError(
      "insufficient-capacity",
      "The pool lacks enough unused capacity.",
    );
    const result = domainFailure(error);

    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("insufficient-capacity");
  });

  it("narrows success and failure by the ok discriminant", () => {
    function describe(
      result: DomainResult<number>,
    ): string {
      if (result.ok) {
        return `accepted:${result.value}`;
      }

      return `rejected:${result.error.code}`;
    }

    expect(describe(domainSuccess(25))).toBe("accepted:25");
    expect(
      describe(
        domainFailure(
          domainError(
            "insufficient-balance",
            "The account lacks enough value.",
          ),
        ),
      ),
    ).toBe("rejected:insufficient-balance");
  });

  it("represents an expected rejection without throwing", () => {
    function evaluateBalance(
      available: number,
      requested: number,
    ): DomainResult<number> {
      if (requested > available) {
        return domainFailure(
          domainError(
            "insufficient-balance",
            "The account lacks enough value.",
            { available, requested },
          ),
        );
      }

      return domainSuccess(available - requested);
    }

    expect(() => evaluateBalance(30, 40)).not.toThrow();

    const result = evaluateBalance(30, 40);
    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("insufficient-balance");
    }
  });
});```

**Structural inspection:**

```text
$ rg -n "describe\(|it\(" packages/domain/src/domain-errors.test.ts
37:describe("domain error codes", () => {
38:  it("contains exactly the declared stable vocabulary", () => {
45:  it("accepts every declared code at the runtime boundary", () => {
51:  it("rejects unknown, empty, and incorrectly cased codes", () => {
60:describe("domain errors", () => {
61:  it("preserves a stable code and structured details", () => {
79:  it("normalizes surrounding message whitespace", () => {
89:  it("rejects an empty human-readable message as programmer error", () => {
99:describe("domain results", () => {
100:  it("creates a success envelope", () => {
109:  it("creates a failure envelope", () => {
120:  it("narrows success and failure by the ok discriminant", () => {
121:    function describe(
131:    expect(describe(domainSuccess(25))).toBe("accepted:25");
133:      describe(
144:  it("represents an expected rejection without throwing", () => {

$ rg -n "error\.code|not\.toThrow|message\.length" packages/domain/src/domain-errors.test.ts
71:    expect(error.code).toBe("insufficient-balance");
72:    expect(error.message.length).toBeGreaterThan(0);
85:    expect(error.code).toBe("ineligible-membership");
117:    expect(result.error.code).toBe("insufficient-capacity");
128:      return `rejected:${result.error.code}`;
162:    expect(() => evaluateBalance(30, 40)).not.toThrow();
168:      expect(result.error.code).toBe("insufficient-balance");
```

**Output:** Runtime tests cover the exact vocabulary, boundary rejection, error construction, both result branches, narrowing, and non-throwing expected rejection.

**Status:** Step 6 complete.

**Next:** Step 7 — Run focused result verification.

---

## Step 7 — Run focused result verification

**Input:** The new implementation, export, and runtime tests.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- src/domain-errors.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-errors.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 7[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m   Start at [22m 20:27:44
[2m   Duration [22m 181ms[2m (transform 29ms, setup 0ms, import 43ms, tests 7ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** The code vocabulary, constructors, result branches, and non-throwing expected rejection pass focused verification.

**Status:** Step 7 complete.

**Next:** Step 8 — Integrate results with lifecycle transitions.

---

## Step 8 — Integrate results with lifecycle transitions

**Input:** The passing result implementation and the WO-012 transition table.

**Action:** Add the supplied import to the top of `packages/domain/src/domain-statuses.ts`, then replace only `transitionStatus()` with the supplied implementation.

**Editor command:** `code packages/domain/src/domain-statuses.ts`

**Resulting file:**

```text
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";


declare const propertyStatusBrand: unique symbol;
declare const poolStatusBrand: unique symbol;
declare const memberStatusBrand: unique symbol;
declare const commandStatusBrand: unique symbol;
declare const batchStatusBrand: unique symbol;
declare const liquidationStatusBrand: unique symbol;

export const PROPERTY_STATUS_VALUES = [
  "proposed",
  "active",
  "suspended",
  "rejected",
  "liquidating",
  "closed",
] as const;

export const POOL_STATUS_VALUES = [
  "open",
  "frozen",
  "liquidating",
  "closed",
] as const;

export const MEMBER_STATUS_VALUES = [
  "pending",
  "active",
  "suspended",
  "closed",
] as const;

export const COMMAND_STATUS_VALUES = [
  "received",
  "accepted",
  "rejected",
] as const;

export const BATCH_STATUS_VALUES = [
  "open",
  "sealed",
  "committed",
] as const;

export const LIQUIDATION_STATUS_VALUES = [
  "planned",
  "active",
  "settled",
  "cancelled",
  "closed",
] as const;

type PropertyStatusValue = (typeof PROPERTY_STATUS_VALUES)[number];
type PoolStatusValue = (typeof POOL_STATUS_VALUES)[number];
type MemberStatusValue = (typeof MEMBER_STATUS_VALUES)[number];
type CommandStatusValue = (typeof COMMAND_STATUS_VALUES)[number];
type BatchStatusValue = (typeof BATCH_STATUS_VALUES)[number];
type LiquidationStatusValue =
  (typeof LIQUIDATION_STATUS_VALUES)[number];

export type PropertyStatus = PropertyStatusValue & {
  readonly [propertyStatusBrand]: "PropertyStatus";
};
export type PoolStatus = PoolStatusValue & {
  readonly [poolStatusBrand]: "PoolStatus";
};
export type MemberStatus = MemberStatusValue & {
  readonly [memberStatusBrand]: "MemberStatus";
};
export type CommandStatus = CommandStatusValue & {
  readonly [commandStatusBrand]: "CommandStatus";
};
export type BatchStatus = BatchStatusValue & {
  readonly [batchStatusBrand]: "BatchStatus";
};
export type LiquidationStatus = LiquidationStatusValue & {
  readonly [liquidationStatusBrand]: "LiquidationStatus";
};

export type LifecycleKind =
  | "property"
  | "pool"
  | "member"
  | "command"
  | "batch"
  | "liquidation";

export interface StatusValueByLifecycle {
  readonly property: PropertyStatusValue;
  readonly pool: PoolStatusValue;
  readonly member: MemberStatusValue;
  readonly command: CommandStatusValue;
  readonly batch: BatchStatusValue;
  readonly liquidation: LiquidationStatusValue;
}

export interface StatusByLifecycle {
  readonly property: PropertyStatus;
  readonly pool: PoolStatus;
  readonly member: MemberStatus;
  readonly command: CommandStatus;
  readonly batch: BatchStatus;
  readonly liquidation: LiquidationStatus;
}

type TransitionTables = {
  readonly [K in LifecycleKind]: {
    readonly [S in StatusValueByLifecycle[K]]:
      readonly StatusValueByLifecycle[K][];
  };
};

const STATUS_VALUES = {
  property: PROPERTY_STATUS_VALUES,
  pool: POOL_STATUS_VALUES,
  member: MEMBER_STATUS_VALUES,
  command: COMMAND_STATUS_VALUES,
  batch: BATCH_STATUS_VALUES,
  liquidation: LIQUIDATION_STATUS_VALUES,
} as const satisfies Record<LifecycleKind, readonly string[]>;

const ALLOWED_TRANSITIONS = {
  property: {
    proposed: ["active", "rejected"],
    active: ["suspended", "liquidating"],
    suspended: ["active", "liquidating"],
    rejected: [],
    liquidating: ["closed"],
    closed: [],
  },
  pool: {
    open: ["frozen", "liquidating"],
    frozen: ["open", "liquidating"],
    liquidating: ["closed"],
    closed: [],
  },
  member: {
    pending: ["active", "closed"],
    active: ["suspended", "closed"],
    suspended: ["active", "closed"],
    closed: [],
  },
  command: {
    received: ["accepted", "rejected"],
    accepted: [],
    rejected: [],
  },
  batch: {
    open: ["sealed"],
    sealed: ["committed"],
    committed: [],
  },
  liquidation: {
    planned: ["active", "cancelled"],
    active: ["settled"],
    settled: ["closed"],
    cancelled: [],
    closed: [],
  },
} as const satisfies TransitionTables;

function statusValue<K extends LifecycleKind>(
  kind: K,
  value: string,
): StatusByLifecycle[K] {
  const values = STATUS_VALUES[kind] as readonly string[];

  if (!values.includes(value)) {
    throw new RangeError(`Unknown ${kind} status: ${value}`);
  }

  return value as StatusByLifecycle[K];
}

export function propertyStatus(value: string): PropertyStatus {
  return statusValue("property", value);
}

export function poolStatus(value: string): PoolStatus {
  return statusValue("pool", value);
}

export function memberStatus(value: string): MemberStatus {
  return statusValue("member", value);
}

export function commandStatus(value: string): CommandStatus {
  return statusValue("command", value);
}

export function batchStatus(value: string): BatchStatus {
  return statusValue("batch", value);
}

export function liquidationStatus(
  value: string,
): LiquidationStatus {
  return statusValue("liquidation", value);
}

export function parseStatus<K extends LifecycleKind>(
  kind: K,
  value: string,
): StatusByLifecycle[K] {
  return statusValue(kind, value);
}

export function allowedNextStatuses<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
): readonly StatusByLifecycle[K][] {
  const table = ALLOWED_TRANSITIONS[kind] as Record<
    string,
    readonly string[]
  >;

  return table[from] as readonly StatusByLifecycle[K][];
}

export function canTransitionStatus<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
  to: StatusByLifecycle[K],
): boolean {
  const allowed = allowedNextStatuses(kind, from) as readonly string[];

  return allowed.includes(to);
}

export function transitionStatus<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
  to: StatusByLifecycle[K],
): DomainResult<
  StatusByLifecycle[K],
  DomainError<"invalid-status-transition">
> {
  if (!canTransitionStatus(kind, from, to)) {
    return domainFailure(
      domainError(
        "invalid-status-transition",
        `Cannot transition ${kind} status from ${from} to ${to}`,
        {
          lifecycle: kind,
          from,
          to,
        },
      ),
    );
  }

  return domainSuccess(to);
}```

**Structural inspection:**

```text
$ rg -n "DomainResult|invalid-status-transition|domainSuccess|domainFailure" packages/domain/src/domain-statuses.ts
3:  domainFailure,
4:  domainSuccess,
6:  type DomainResult,
241:): DomainResult<
243:  DomainError<"invalid-status-transition">
246:    return domainFailure(
248:        "invalid-status-transition",
259:  return domainSuccess(to);

$ rg -n "throw new RangeError" packages/domain/src/domain-statuses.ts
176:    throw new RangeError(`Unknown ${kind} status: ${value}`);
```

**Output:** Invalid parsed status strings still throw at the runtime parsing boundary, while understood but disallowed transitions now return a coded failure.

**Status:** Step 8 complete.

**Next:** Step 9 — Update lifecycle runtime tests.

---

## Step 9 — Update lifecycle runtime tests

**Input:** The exhaustive WO-012 transition suite and new result-returning transition function.

**Action:** In `packages/domain/src/domain-statuses.test.ts`, replace only the allowed/disallowed assertion inside the ordered-pair loop with the supplied block.

**Editor command:** `code packages/domain/src/domain-statuses.test.ts`

**Resulting file:**

```text
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

          const result = transitionStatus(kind, from, to);

          if (shouldAllow) {
            expect(result.ok).toBe(true);

            if (result.ok) {
              expect(result.value).toBe(to);
            }
          } else {
            expect(result.ok).toBe(false);

            if (!result.ok) {
              expect(result.error.code).toBe(
                "invalid-status-transition",
              );
              expect(result.error.details).toEqual({
                lifecycle: kind,
                from,
                to,
              });
            }
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

```

**Commands and output:**

```text
$ npm test --workspace packages/domain -- src/domain-errors.test.ts src/domain-statuses.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-errors.test.ts src/domain-statuses.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 16[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m24 passed[39m[22m[90m (24)[39m
[2m   Start at [22m 20:35:57
[2m   Duration [22m 222ms[2m (transform 154ms, setup 0ms, import 189ms, tests 25ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** Every ordered lifecycle pair remains tested; allowed pairs return success and disallowed pairs return `invalid-status-transition` without throwing.

**Status:** Step 9 complete.

**Next:** Step 10 — Add compile-time result safeguards.

---

## Step 10 — Add compile-time result safeguards

**Input:** The passing runtime result and lifecycle integration.

**Action:** Create `packages/domain/src/domain-errors.type-test.ts` with the supplied assertions.

**Editor command:** `code packages/domain/src/domain-errors.type-test.ts`

**Action:** Update the one valid `transitionStatus("pool", poolOpen, poolFrozen)` call in `packages/domain/src/domain-statuses.type-test.ts` to store and narrow its result.

**Editor command:** `code packages/domain/src/domain-statuses.type-test.ts`

**Resulting domain-error type test:**

```text
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainErrorCode,
  type DomainResult,
} from "./domain-errors.js";

const code: DomainErrorCode = "insufficient-balance";
const specificError: DomainError<"insufficient-balance"> =
  domainError(
    "insufficient-balance",
    "The account lacks enough value.",
  );
const success: DomainResult<number> = domainSuccess(10);
const failure: DomainResult<number> =
  domainFailure(specificError);

function consume(result: DomainResult<number>): number {
  if (result.ok) {
    return result.value;
  }

  return result.error.code.length;
}

// @ts-expect-error Unknown strings are not stable DomainErrorCode values.
const unknownCode: DomainErrorCode = "something-broke";

// @ts-expect-error domainError accepts only declared stable codes.
domainError("something-broke", "Unknown failure.");

// @ts-expect-error A success branch does not contain an error.
success.error;

// @ts-expect-error A failure branch does not contain a value.
failure.value;

// @ts-expect-error Result discriminants are readonly.
success.ok = false;

// @ts-expect-error Success values are readonly.
success.value = 20;

// @ts-expect-error Error codes are readonly.
specificError.code = "invalid-input";

void code;
void unknownCode;
void consume(success);
void consume(failure);```

**Resulting lifecycle type test:**

```text
import {
  allowedNextStatuses,
  batchStatus,
  canTransitionStatus,
  commandStatus,
  liquidationStatus,
  memberStatus,
  poolStatus,
  propertyStatus,
  transitionStatus,
  type BatchStatus,
  type CommandStatus,
  type LiquidationStatus,
  type MemberStatus,
  type PoolStatus,
  type PropertyStatus,
} from "./domain-statuses.js";

const propertyActive: PropertyStatus = propertyStatus("active");
const propertyClosed: PropertyStatus = propertyStatus("closed");
const poolOpen: PoolStatus = poolStatus("open");
const poolFrozen: PoolStatus = poolStatus("frozen");
const memberActive: MemberStatus = memberStatus("active");
const commandReceived: CommandStatus = commandStatus("received");
const batchOpen: BatchStatus = batchStatus("open");
const liquidationPlanned: LiquidationStatus =
  liquidationStatus("planned");

canTransitionStatus(
  "property",
  propertyActive,
  propertyStatus("suspended"),
);
const poolTransition =
  transitionStatus("pool", poolOpen, poolFrozen);

if (poolTransition.ok) {
  const nextPoolStatus: PoolStatus = poolTransition.value;
  void nextPoolStatus;
}
allowedNextStatuses("member", memberActive);

// @ts-expect-error Plain strings are not validated PropertyStatus values.
const plainPropertyStatus: PropertyStatus = "active";

// @ts-expect-error PoolStatus is not assignable to PropertyStatus.
const propertyFromPool: PropertyStatus = poolOpen;

// @ts-expect-error PropertyStatus is not assignable to MemberStatus.
const memberFromProperty: MemberStatus = propertyActive;

// @ts-expect-error MemberStatus is not assignable to CommandStatus.
const commandFromMember: CommandStatus = memberActive;

// @ts-expect-error CommandStatus is not assignable to BatchStatus.
const batchFromCommand: BatchStatus = commandReceived;

// @ts-expect-error BatchStatus is not assignable to LiquidationStatus.
const liquidationFromBatch: LiquidationStatus = batchOpen;

// @ts-expect-error Property transitions require PropertyStatus arguments.
canTransitionStatus("property", poolOpen, poolFrozen);

// @ts-expect-error The target must belong to the selected lifecycle.
transitionStatus("member", memberActive, propertyClosed);

// @ts-expect-error Status lookup requires the selected lifecycle type.
allowedNextStatuses("liquidation", commandReceived);

void plainPropertyStatus;
void propertyFromPool;
void memberFromProperty;
void commandFromMember;
void batchFromCommand;
void liquidationFromBatch;
void liquidationPlanned;```

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** Seven result-specific compile-time rejection assertions and all existing lifecycle separation assertions pass strict type checking.

**Status:** Step 10 complete.

**Next:** Step 11 — Prove the wrong error code fails.

---

## Step 11 — Prove the wrong error code fails the focused suite

**Input:** The passing focused runtime suite.

**Temporary action:** Append the supplied test named `TEMPORARY: reports capacity failure as insufficient balance` to `packages/domain/src/domain-errors.test.ts`.

**Reason:** The created error has code `insufficient-capacity`, so the deliberately incorrect balance-code assertion must fail.

**Editor command:** `code packages/domain/src/domain-errors.test.ts`

**Temporary test file tail:**

```text
    }

    expect(() => evaluateBalance(30, 40)).not.toThrow();

    const result = evaluateBalance(30, 40);
    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("insufficient-balance");
    }
  });
});


it("TEMPORARY: reports capacity failure as insufficient balance", () => {
  const result = domainFailure(
    domainError(
      "insufficient-capacity",
      "The pool lacks enough unused capacity.",
    ),
  );

  expect(result.error.code).toBe("insufficient-balance");
});```

**Expected result:** The focused test command must return a nonzero status because the test expects the wrong stable code.

```text
$ npm test --workspace packages/domain -- src/domain-errors.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-errors.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/domain-errors.test.ts [2m([22m[2m11 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 12[2mms[22m[39m
     [32m✓[39m contains exactly the declared stable vocabulary[32m 2[2mms[22m[39m
     [32m✓[39m accepts every declared code at the runtime boundary[32m 1[2mms[22m[39m
     [32m✓[39m rejects unknown, empty, and incorrectly cased codes[32m 0[2mms[22m[39m
     [32m✓[39m preserves a stable code and structured details[32m 0[2mms[22m[39m
     [32m✓[39m normalizes surrounding message whitespace[32m 0[2mms[22m[39m
     [32m✓[39m rejects an empty human-readable message as programmer error[32m 0[2mms[22m[39m
     [32m✓[39m creates a success envelope[32m 0[2mms[22m[39m
     [32m✓[39m creates a failure envelope[32m 0[2mms[22m[39m
     [32m✓[39m narrows success and failure by the ok discriminant[32m 0[2mms[22m[39m
     [32m✓[39m represents an expected rejection without throwing[32m 1[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: reports capacity failure as insufficient balance[39m[32m 5[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/domain-errors.test.ts[2m > [22mTEMPORARY: reports capacity failure as insufficient balance
[31m[1mAssertionError[22m: expected 'insufficient-capacity' to be 'insufficient-balance' // Object.is equality[39m

Expected: [32m"insufficient-[7mbalance[27m"[39m
Received: [31m"insufficient-[7mcapacity[27m"[39m

[36m [2m❯[22m src/domain-errors.test.ts:[2m182:29[22m[39m
    [90m180|[39m   )[33m;[39m
    [90m181|[39m
    [90m182|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mcode)[33m.[39m[34mtoBe[39m([32m"insufficient-balance"[39m)[33m;[39m
    [90m   |[39m                             [31m^[39m
    [90m183|[39m })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m10 passed[39m[22m[90m (11)[39m
[2m   Start at [22m 20:38:11
[2m   Duration [22m 249ms[2m (transform 66ms, setup 0ms, import 82ms, tests 12ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run src/domain-errors.test.ts
```

**Observed result:** The focused suite distinguished `insufficient-capacity` from `insufficient-balance`.

**Status:** Expected failure confirmed; restoration is required.

**Next:** Step 12 — Remove the temporary test and reverify.

---

## Step 12 — Remove the temporary test and reverify

**Input:** The deliberately invalid test state from Step 11.

**Action:** Remove only the test named `TEMPORARY: reports capacity failure as insufficient balance` from `packages/domain/src/domain-errors.test.ts`.

**Editor command:** `code packages/domain/src/domain-errors.test.ts`

**Commands and output:**

```text
$ rg -n "TEMPORARY:" packages/domain/src || true

$ npm test --workspace packages/domain -- src/domain-errors.test.ts src/domain-statuses.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-errors.test.ts src/domain-statuses.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 16[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m24 passed[39m[22m[90m (24)[39m
[2m   Start at [22m 20:39:08
[2m   Duration [22m 248ms[2m (transform 150ms, setup 0ms, import 186ms, tests 23ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** The temporary failure is absent and the restored result, transition, and compile-time safeguards pass.

**Status:** Step 12 complete.

**Next:** Step 13 — Verify the complete domain package.

---

## Step 13 — Verify the complete domain package

**Input:** The restored WO-013 implementation and all prior domain source and tests.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build --workspace packages/domain

> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


$ npm test --workspace packages/domain

> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 35[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m168 passed[39m[22m[90m (168)[39m
[2m   Start at [22m 20:39:19
[2m   Duration [22m 319ms[2m (transform 486ms, setup 0ms, import 670ms, tests 79ms, environment 1ms)[22m


$ find packages/domain/dist -type f | sort
packages/domain/dist/domain-errors.d.ts
packages/domain/dist/domain-errors.d.ts.map
packages/domain/dist/domain-errors.js
packages/domain/dist/domain-errors.js.map
packages/domain/dist/domain-errors.type-test.d.ts
packages/domain/dist/domain-errors.type-test.d.ts.map
packages/domain/dist/domain-errors.type-test.js
packages/domain/dist/domain-errors.type-test.js.map
packages/domain/dist/domain-statuses.d.ts
packages/domain/dist/domain-statuses.d.ts.map
packages/domain/dist/domain-statuses.js
packages/domain/dist/domain-statuses.js.map
packages/domain/dist/domain-statuses.type-test.d.ts
packages/domain/dist/domain-statuses.type-test.d.ts.map
packages/domain/dist/domain-statuses.type-test.js
packages/domain/dist/domain-statuses.type-test.js.map
packages/domain/dist/identifiers.d.ts
packages/domain/dist/identifiers.d.ts.map
packages/domain/dist/identifiers.js
packages/domain/dist/identifiers.js.map
packages/domain/dist/identifiers.type-test.d.ts
packages/domain/dist/identifiers.type-test.d.ts.map
packages/domain/dist/identifiers.type-test.js
packages/domain/dist/identifiers.type-test.js.map
packages/domain/dist/index.d.ts
packages/domain/dist/index.d.ts.map
packages/domain/dist/index.js
packages/domain/dist/index.js.map
packages/domain/dist/value-types.d.ts
packages/domain/dist/value-types.d.ts.map
packages/domain/dist/value-types.js
packages/domain/dist/value-types.js.map
packages/domain/dist/value-types.type-test.d.ts
packages/domain/dist/value-types.type-test.d.ts.map
packages/domain/dist/value-types.type-test.js
packages/domain/dist/value-types.type-test.js.map

$ find packages/domain/dist -type f \( -name "*.test.*" -o -name "*.type-test.*" \)
packages/domain/dist/domain-errors.type-test.d.ts.map
packages/domain/dist/identifiers.type-test.js.map
packages/domain/dist/value-types.type-test.d.ts.map
packages/domain/dist/identifiers.type-test.d.ts
packages/domain/dist/domain-statuses.type-test.js.map
packages/domain/dist/domain-statuses.type-test.d.ts
packages/domain/dist/domain-errors.type-test.d.ts
packages/domain/dist/domain-errors.type-test.js.map
packages/domain/dist/value-types.type-test.js.map
packages/domain/dist/identifiers.type-test.d.ts.map
packages/domain/dist/domain-errors.type-test.js
packages/domain/dist/value-types.type-test.js
packages/domain/dist/domain-statuses.type-test.d.ts.map
packages/domain/dist/domain-statuses.type-test.js
packages/domain/dist/value-types.type-test.d.ts
packages/domain/dist/identifiers.type-test.js
Test-only files were emitted into production output.
---

## Step 14 — Verify the complete Economic Union workspace

**Input:** The verified domain package integrated into the workspace.

**Commands and output:**

```text
$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build

> @lcp/economic-union@1.0.0 build
> npm run build --workspaces --if-present


> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


> @lcp/protocol@1.0.0 build
> tsc -p tsconfig.json


$ npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 32[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m168 passed[39m[22m[90m (168)[39m
[2m   Start at [22m 20:39:35
[2m   Duration [22m 236ms[2m (transform 225ms, setup 0ms, import 368ms, tests 77ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 20:39:36
[2m   Duration [22m 173ms[2m (transform 46ms, setup 0ms, import 61ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 268.21µs (36.32µs CPU time)

Ran 1 test suite in 8.82ms (268.21µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Output:** The TypeScript workspace and Foundry scaffold remain green after introducing domain results.

**Status:** Step 14 complete.

**Next:** Step 15 — Retest the adjacent event logger.

---

## Step 15 — Retest the adjacent event logger

**Input:** The verified Economic Union workspace and unchanged adjacent event logger.

**Commands and output:**

```text
$ cd ../event-logger && npm test

> event-logger@0.0.0 test
> vitest


 DEV  v3.2.4 /home/mike/code/local-coordination-protocol/code/event-logger

Using secrets defined in .dev.vars
[vpw:debug] Adding `enable_nodejs_tty_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_fs_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_http_modules` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_perf_hooks_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:info] Starting isolated runtimes for vitest.config.js...
[mf:warn] The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2026-03-10",
but you've requested "2026-05-30". Falling back to "2026-03-10"...
 ✓ test/index.spec.js (4 tests) 169ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  20:39:48
   Duration  1.78s (transform 63ms, setup 0ms, collect 76ms, tests 169ms, environment 0ms, prepare 214ms)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** The adjacent Point event logger remains green and separate from Economic Union result-vocabulary work.

**Status:** Step 15 complete.

**Next:** Step 16 — Inspect and summarize WO-013.

---

## Step 16 — Inspect and summarize WO-013

**Input:** The verified result implementation and tests from Steps 1–15.

**Repository inspection:**

```text
$ git status --short
 M packages/domain/src/domain-statuses.test.ts
 M packages/domain/src/domain-statuses.ts
 M packages/domain/src/domain-statuses.type-test.ts
 M packages/domain/src/index.ts
?? docs/work-orders/WO-013-execution.md
?? packages/domain/src/domain-errors.test.ts
?? packages/domain/src/domain-errors.ts
?? packages/domain/src/domain-errors.type-test.ts

$ git diff --check

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --stat
 .../packages/domain/src/domain-statuses.test.ts    | 23 ++++++++++++++---
 .../packages/domain/src/domain-statuses.ts         | 30 ++++++++++++++++++----
 .../domain/src/domain-statuses.type-test.ts        |  8 +++++-
 code/economic-union/packages/domain/src/index.ts   |  3 ++-
 4 files changed, 53 insertions(+), 11 deletions(-)

$ git diff -- packages/domain/src/domain-errors.ts packages/domain/src/domain-errors.test.ts packages/domain/src/domain-errors.type-test.ts packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts
diff --git a/code/economic-union/packages/domain/src/domain-statuses.test.ts b/code/economic-union/packages/domain/src/domain-statuses.test.ts
index 7c552af..76806c4 100644
--- a/code/economic-union/packages/domain/src/domain-statuses.test.ts
+++ b/code/economic-union/packages/domain/src/domain-statuses.test.ts
@@ -63,12 +63,27 @@ function registerLifecycleTests<K extends LifecycleKind>(
             shouldAllow,
           );

+          const result = transitionStatus(kind, from, to);
+
           if (shouldAllow) {
-            expect(transitionStatus(kind, from, to)).toBe(to);
+            expect(result.ok).toBe(true);
+
+            if (result.ok) {
+              expect(result.value).toBe(to);
+            }
           } else {
-            expect(() =>
-              transitionStatus(kind, from, to),
-            ).toThrow(RangeError);
+            expect(result.ok).toBe(false);
+
+            if (!result.ok) {
+              expect(result.error.code).toBe(
+                "invalid-status-transition",
+              );
+              expect(result.error.details).toEqual({
+                lifecycle: kind,
+                from,
+                to,
+              });
+            }
           }
         }
       }
diff --git a/code/economic-union/packages/domain/src/domain-statuses.ts b/code/economic-union/packages/domain/src/domain-statuses.ts
index c2ffca3..6b433c0 100644
--- a/code/economic-union/packages/domain/src/domain-statuses.ts
+++ b/code/economic-union/packages/domain/src/domain-statuses.ts
@@ -1,3 +1,12 @@
+import {
+  domainError,
+  domainFailure,
+  domainSuccess,
+  type DomainError,
+  type DomainResult,
+} from "./domain-errors.js";
+
+
 declare const propertyStatusBrand: unique symbol;
 declare const poolStatusBrand: unique symbol;
 declare const memberStatusBrand: unique symbol;
@@ -229,12 +238,23 @@ export function transitionStatus<K extends LifecycleKind>(
   kind: K,
   from: StatusByLifecycle[K],
   to: StatusByLifecycle[K],
-): StatusByLifecycle[K] {
+): DomainResult<
+  StatusByLifecycle[K],
+  DomainError<"invalid-status-transition">
+> {
   if (!canTransitionStatus(kind, from, to)) {
-    throw new RangeError(
-      `Cannot transition ${kind} status from ${from} to ${to}`,
+    return domainFailure(
+      domainError(
+        "invalid-status-transition",
+        `Cannot transition ${kind} status from ${from} to ${to}`,
+        {
+          lifecycle: kind,
+          from,
+          to,
+        },
+      ),
     );
   }

-  return to;
-}
\ No newline at end of file
+  return domainSuccess(to);
+}
diff --git a/code/economic-union/packages/domain/src/domain-statuses.type-test.ts b/code/economic-union/packages/domain/src/domain-statuses.type-test.ts
index f81ac26..724447c 100644
--- a/code/economic-union/packages/domain/src/domain-statuses.type-test.ts
+++ b/code/economic-union/packages/domain/src/domain-statuses.type-test.ts
@@ -31,7 +31,13 @@ canTransitionStatus(
   propertyActive,
   propertyStatus("suspended"),
 );
-transitionStatus("pool", poolOpen, poolFrozen);
+const poolTransition =
+  transitionStatus("pool", poolOpen, poolFrozen);
+
+if (poolTransition.ok) {
+  const nextPoolStatus: PoolStatus = poolTransition.value;
+  void nextPoolStatus;
+}
 allowedNextStatuses("member", memberActive);

 // @ts-expect-error Plain strings are not validated PropertyStatus values.
diff --git a/code/economic-union/packages/domain/src/index.ts b/code/economic-union/packages/domain/src/index.ts
index 44c8ce1..6aef371 100644
--- a/code/economic-union/packages/domain/src/index.ts
+++ b/code/economic-union/packages/domain/src/index.ts
@@ -6,4 +6,5 @@ export function describeAmount(amount: Cents): string {
   return `${amount} cents`;
 }

-export * from "./identifiers.js";
\ No newline at end of file
+export * from "./identifiers.js";
+export * from "./domain-errors.js";
\ No newline at end of file
```

**Total input:** The committed WO-012 value types, stable identifiers, lifecycle states, and transition tables.

**Total output:** Eighteen stable rejection codes, typed errors, discriminated result envelopes, constructors, runtime and compile-time tests, result-returning lifecycle transitions, public exports, and this execution record.

**Expected changed files:**

- `packages/domain/src/domain-errors.ts`
- `packages/domain/src/domain-errors.test.ts`
- `packages/domain/src/domain-errors.type-test.ts`
- `packages/domain/src/domain-statuses.ts`
- `packages/domain/src/domain-statuses.test.ts`
- `packages/domain/src/domain-statuses.type-test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-013-execution.md`

**Boundary confirmation:** WO-013 defines shared expected-rejection vocabulary and result handling only. It does not implement entity records, economic rules, persistence, APIs, exception telemetry, or Solidity behavior.

**Status:** Step 16 complete.

**Next:** Step 17 — Stage only WO-013.

---

## Step 17 — Stage only WO-013

**Input:** The reviewed result source, lifecycle integration, tests, export, and execution record.

**Action:** Stage only explicit WO-013 paths.

**Staging commands and output:**

```text
$ git add packages/domain/src/domain-errors.ts packages/domain/src/domain-errors.test.ts packages/domain/src/domain-errors.type-test.ts packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts docs/work-orders/WO-013-execution.md

$ git diff --cached --check
code/economic-union/docs/work-orders/WO-013-execution.md:2285: trailing whitespace.
+
code/economic-union/docs/work-orders/WO-013-execution.md:2355: trailing whitespace.
+
code/economic-union/docs/work-orders/WO-013-execution.md:2378: trailing whitespace.
+
code/economic-union/docs/work-orders/WO-013-execution.md:2387: trailing whitespace.
+
code/economic-union/packages/domain/src/domain-errors.test.ts:172: new blank line at EOF.
---

## Step 18 — Final verification and commit authorization

**Input:** The explicitly staged WO-013 implementation, tests, integration, export, and execution record.

**Final verification:**

```text
$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build

> @lcp/economic-union@1.0.0 build
> npm run build --workspaces --if-present


> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


> @lcp/protocol@1.0.0 build
> tsc -p tsconfig.json


$ npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 15[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m168 passed[39m[22m[90m (168)[39m
[2m   Start at [22m 20:40:39
[2m   Duration [22m 226ms[2m (transform 240ms, setup 0ms, import 364ms, tests 65ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 20:40:39
[2m   Duration [22m 170ms[2m (transform 45ms, setup 0ms, import 59ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 249.77µs (34.29µs CPU time)

Ran 1 test suite in 5.95ms (249.77µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

$ cd ../event-logger && npm test

> event-logger@0.0.0 test
> vitest


 DEV  v3.2.4 /home/mike/code/local-coordination-protocol/code/event-logger

Using secrets defined in .dev.vars
[vpw:debug] Adding `enable_nodejs_tty_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_fs_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_http_modules` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_perf_hooks_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:info] Starting isolated runtimes for vitest.config.js...
[mf:warn] The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2026-03-10",
but you've requested "2026-05-30". Falling back to "2026-03-10"...
 ✓ test/index.spec.js (4 tests) 242ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  20:40:40
   Duration  1.82s (transform 47ms, setup 0ms, collect 85ms, tests 242ms, environment 0ms, prepare 146ms)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --cached --check
code/economic-union/docs/work-orders/WO-013-execution.md:2285: trailing whitespace.
+
code/economic-union/docs/work-orders/WO-013-execution.md:2355: trailing whitespace.
+
code/economic-union/docs/work-orders/WO-013-execution.md:2378: trailing whitespace.
+
code/economic-union/docs/work-orders/WO-013-execution.md:2387: trailing whitespace.
+
code/economic-union/docs/work-orders/WO-013-execution.md:2431: trailing whitespace.
++
code/economic-union/docs/work-orders/WO-013-execution.md:2433: trailing whitespace.
++
code/economic-union/docs/work-orders/WO-013-execution.md:2435: trailing whitespace.
++
code/economic-union/docs/work-orders/WO-013-execution.md:2437: trailing whitespace.
++
code/economic-union/packages/domain/src/domain-errors.test.ts:172: new blank line at EOF.
---

## Step 18 — Final verification and commit authorization

**Input:** The explicitly staged WO-013 implementation, tests, integration, export, and execution record.

**Final verification:**

```text
$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build

> @lcp/economic-union@1.0.0 build
> npm run build --workspaces --if-present


> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


> @lcp/protocol@1.0.0 build
> tsc -p tsconfig.json


$ npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 16[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m168 passed[39m[22m[90m (168)[39m
[2m   Start at [22m 20:44:02
[2m   Duration [22m 321ms[2m (transform 532ms, setup 0ms, import 679ms, tests 66ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 20:44:02
[2m   Duration [22m 175ms[2m (transform 28ms, setup 0ms, import 40ms, tests 4ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 267.16µs (39.60µs CPU time)

Ran 1 test suite in 5.83ms (267.16µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

$ cd ../event-logger && npm test

> event-logger@0.0.0 test
> vitest


 DEV  v3.2.4 /home/mike/code/local-coordination-protocol/code/event-logger

Using secrets defined in .dev.vars
[vpw:debug] Adding `enable_nodejs_tty_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_fs_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_http_modules` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_perf_hooks_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:info] Starting isolated runtimes for vitest.config.js...
[mf:warn] The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2026-03-10",
but you've requested "2026-05-30". Falling back to "2026-03-10"...
 ✓ test/index.spec.js (4 tests) 191ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  20:44:03
   Duration  1.75s (transform 59ms, setup 0ms, collect 74ms, tests 191ms, environment 1ms, prepare 190ms)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --cached --check

$ git diff --cached --stat
 .../docs/work-orders/WO-013-execution.md           | 32 +++++++++++-----------
 .../packages/domain/src/domain-errors.test.ts      |  2 --
 2 files changed, 16 insertions(+), 18 deletions(-)

$ git status --short
MM docs/work-orders/WO-013-execution.md
M  packages/domain/src/domain-errors.test.ts
```

**Acceptance result:**

- Stable expected-rejection codes exist and are unique.
- Results discriminate success and failure with literal `ok` values.
- Expected rejections carry a stable code and do not throw.
- Invalid raw codes and empty constructed messages fail loudly.
- Lifecycle rejection returns `invalid-status-transition` with structured context.
- Runtime tests assert rule codes rather than fragile messages.
- Compile-time tests prevent invalid codes, branch confusion, and mutation.
- Domain package, full workspace, Foundry scaffold, and adjacent event logger pass.
- No temporary failure remains.
- Only intended WO-013 files are staged.

**Status:** WO-013 is authorized for commit.

**Next:** Commit WO-013, then begin WO-014 — Encode canonical scenarios as data.

