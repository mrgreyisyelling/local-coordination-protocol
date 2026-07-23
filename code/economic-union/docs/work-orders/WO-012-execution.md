# WO-012 Execution Record — Define Domain States and Statuses

## Purpose

Define six finite lifecycle vocabularies and their permitted transitions.

This record captures the actual commands and output of WO-012.

---

## Step 1 — Confirm WO-011 and initialize the execution record

**Input:** The committed and verified WO-011 stable-identifier vocabulary.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-012-execution.md

$ git log -1 --oneline
2a7c0fd feat(domain): define stable identifiers

$ git diff --check

$ rg -n "TEMPORARY:" packages/domain/src docs/work-orders || true
docs/work-orders/WO-011-execution.md:844:**Temporary action:** Append the supplied test named `TEMPORARY: incorrectly accepts an empty MemberId` to `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-011-execution.md:864:it("TEMPORARY: incorrectly accepts an empty MemberId", () => {
docs/work-orders/WO-011-execution.md:973:[31m   [31m×[31m TEMPORARY: incorrectly accepts an empty MemberId[39m[32m 6[2mms[22m[39m
docs/work-orders/WO-011-execution.md:977:[41m[1m FAIL [22m[49m src/identifiers.test.ts[2m > [22mTEMPORARY: incorrectly accepts an empty MemberId
docs/work-orders/WO-011-execution.md:988:    [90m209|[39m [34mit[39m([32m"TEMPORARY: incorrectly accepts an empty MemberId"[39m[33m,[39m () [33m=>[39m {
docs/work-orders/WO-011-execution.md:1022:**Action:** Remove only the test named `TEMPORARY: incorrectly accepts an empty MemberId` from `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-011-execution.md:1029:$ rg -n "TEMPORARY:" packages/domain/src/identifiers.test.ts || true
docs/work-orders/WO-012-execution.md:29:$ rg -n "TEMPORARY:" packages/domain/src docs/work-orders || true
docs/work-orders/WO-012-execution.md:30:docs/work-orders/WO-011-execution.md:844:**Temporary action:** Append the supplied test named `TEMPORARY: incorrectly accepts an empty MemberId` to `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-012-execution.md:31:docs/work-orders/WO-011-execution.md:864:it("TEMPORARY: incorrectly accepts an empty MemberId", () => {
docs/work-orders/WO-012-execution.md:32:docs/work-orders/WO-011-execution.md:973:[31m   [31m×[31m TEMPORARY: incorrectly accepts an empty MemberId[39m[32m 6[2mms[22m[39m
docs/work-orders/WO-012-execution.md:33:docs/work-orders/WO-011-execution.md:977:[41m[1m FAIL [22m[49m src/identifiers.test.ts[2m > [22mTEMPORARY: incorrectly accepts an empty MemberId
docs/work-orders/WO-012-execution.md:34:docs/work-orders/WO-011-execution.md:988:    [90m209|[39m [34mit[39m([32m"TEMPORARY: incorrectly accepts an empty MemberId"[39m[33m,[39m () [33m=>[39m {
docs/work-orders/WO-012-execution.md:35:docs/work-orders/WO-011-execution.md:1022:**Action:** Remove only the test named `TEMPORARY: incorrectly accepts an empty MemberId` from `packages/domain/src/identifiers.test.ts`.
docs/work-orders/WO-012-execution.md:36:docs/work-orders/WO-011-execution.md:1029:$ rg -n "TEMPORARY:" packages/domain/src/identifiers.test.ts || true
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

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m144 passed[39m[22m[90m (144)[39m
[2m   Start at [22m 19:37:56
[2m   Duration [22m 235ms[2m (transform 156ms, setup 0ms, import 218ms, tests 30ms, environment 0ms)[22m

```

**Output:** The repository location, Git state, latest commit, temporary-test state, and passing WO-011 domain baseline are recorded.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the existing domain package.

---

## Step 2 — Inspect the existing domain package

**Input:** The verified WO-011 domain package.

**Commands and output:**

```text
$ find packages/domain -maxdepth 3 -type f -not -path "*/dist/*" | sort
packages/domain/package.json
packages/domain/src/identifiers.test.ts
packages/domain/src/identifiers.ts
packages/domain/src/identifiers.type-test.ts
packages/domain/src/index.test.ts
packages/domain/src/index.ts
packages/domain/src/value-types.test.ts
packages/domain/src/value-types.ts
packages/domain/src/value-types.type-test.ts
packages/domain/tsconfig.json
packages/domain/tsconfig.test.json

$ sed -n "1,260p" packages/domain/src/index.ts
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
$ sed -n "1,320p" packages/domain/src/identifiers.ts
declare const memberIdBrand: unique symbol;
declare const accountIdBrand: unique symbol;
declare const propertyIdBrand: unique symbol;
declare const depositIdBrand: unique symbol;
declare const commandIdBrand: unique symbol;
declare const eventIdBrand: unique symbol;
declare const batchIdBrand: unique symbol;
declare const liquidationIdBrand: unique symbol;

export type MemberId = string & {
  readonly [memberIdBrand]: "MemberId";
};
export type AccountId = string & {
  readonly [accountIdBrand]: "AccountId";
};
export type PropertyId = string & {
  readonly [propertyIdBrand]: "PropertyId";
};
export type DepositId = string & {
  readonly [depositIdBrand]: "DepositId";
};
export type CommandId = string & {
  readonly [commandIdBrand]: "CommandId";
};
export type EventId = string & {
  readonly [eventIdBrand]: "EventId";
};
export type BatchId = string & {
  readonly [batchIdBrand]: "BatchId";
};
export type LiquidationId = string & {
  readonly [liquidationIdBrand]: "LiquidationId";
};

export type IdentifierKind =
  | "member"
  | "account"
  | "property"
  | "deposit"
  | "command"
  | "event"
  | "batch"
  | "liquidation";

export interface IdentifierByKind {
  readonly member: MemberId;
  readonly account: AccountId;
  readonly property: PropertyId;
  readonly deposit: DepositId;
  readonly command: CommandId;
  readonly event: EventId;
  readonly batch: BatchId;
  readonly liquidation: LiquidationId;
}

export interface IdentifierGenerator {
  next<K extends IdentifierKind>(kind: K): IdentifierByKind[K];
}

const IDENTIFIER_PREFIXES = {
  member: "mem",
  account: "acct",
  property: "prop",
  deposit: "dep",
  command: "cmd",
  event: "evt",
  batch: "batch",
  liquidation: "liq",
} as const satisfies Record<IdentifierKind, string>;

const CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const PAYLOAD_LENGTH = 26;
const PAYLOAD_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

function identifierValue<K extends IdentifierKind>(
  kind: K,
  value: string,
): IdentifierByKind[K] {
  const prefix = IDENTIFIER_PREFIXES[kind];
  const separatorIndex = value.indexOf("_");

  if (separatorIndex === -1) {
    throw new RangeError(`${kind} identifier must contain one separator`);
  }

  const actualPrefix = value.slice(0, separatorIndex);
  const payload = value.slice(separatorIndex + 1);

  if (actualPrefix !== prefix) {
    throw new RangeError(
      `${kind} identifier must use the ${prefix} prefix`,
    );
  }

  if (!PAYLOAD_PATTERN.test(payload)) {
    throw new RangeError(
      `${kind} identifier must contain a ${PAYLOAD_LENGTH}-character Crockford Base32 payload`,
    );
  }

  return value as IdentifierByKind[K];
}

export function memberId(value: string): MemberId {
  return identifierValue("member", value);
}

export function accountId(value: string): AccountId {
  return identifierValue("account", value);
}

export function propertyId(value: string): PropertyId {
  return identifierValue("property", value);
}

export function depositId(value: string): DepositId {
  return identifierValue("deposit", value);
}

export function commandId(value: string): CommandId {
  return identifierValue("command", value);
}

export function eventId(value: string): EventId {
  return identifierValue("event", value);
}

export function batchId(value: string): BatchId {
  return identifierValue("batch", value);
}

export function liquidationId(value: string): LiquidationId {
  return identifierValue("liquidation", value);
}

export function parseIdentifier<K extends IdentifierKind>(
  kind: K,
  value: string,
): IdentifierByKind[K] {
  return identifierValue(kind, value);
}

function encodeTestSequence(sequence: number): string {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new RangeError(
      "Test identifier sequence must be a positive safe integer",
    );
  }

  let remainder = sequence;
  let encoded = "";

  while (remainder > 0) {
    const digit = remainder % 32;
    encoded = CROCKFORD_BASE32[digit] + encoded;
    remainder = Math.floor(remainder / 32);
  }

  return encoded.padStart(PAYLOAD_LENGTH, "0");
}

export function deterministicTestId<K extends IdentifierKind>(
  kind: K,
  sequence: number,
): IdentifierByKind[K] {
  const value =
    `${IDENTIFIER_PREFIXES[kind]}_${encodeTestSequence(sequence)}`;

  return identifierValue(kind, value);
}

export function createDeterministicTestIdentifierGenerator(
  startingSequence = 1,
): IdentifierGenerator {
  if (!Number.isSafeInteger(startingSequence) || startingSequence < 1) {
    throw new RangeError(
      "Starting test identifier sequence must be a positive safe integer",
    );
  }

  let nextSequence = startingSequence;

  return {
    next<K extends IdentifierKind>(
      kind: K,
    ): IdentifierByKind[K] {
      const identifier = deterministicTestId(kind, nextSequence);

      if (nextSequence === Number.MAX_SAFE_INTEGER) {
        throw new RangeError("Test identifier sequence is exhausted");
      }

      nextSequence += 1;

      return identifier;
    },
  };
}
$ sed -n "1,220p" packages/domain/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "tsBuildInfoFile": "dist/.tsbuildinfo"
  },
  "include": ["src/**/*.ts"],
  "exclude": [
    "src/**/*.test.ts"
  ]
}
$ sed -n "1,220p" packages/domain/tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "types": ["vitest/globals"]
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": []
}
$ rg -n "PropertyStatus|PoolStatus|MemberStatus|CommandStatus|BatchStatus|LiquidationStatus" packages/domain/src || true
```

**Output:** Existing source, entrypoint, TypeScript configuration, and lifecycle-status definitions are recorded before WO-012 edits.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the lifecycle contract.

---

## Step 3 — Record the lifecycle contract

**Input:** The WO-012 master-plan requirement and the inspected domain package.

**Contract:**

- Six lifecycles have separate branded status types.
- Runtime constructors accept only declared status strings.
- One table per lifecycle defines every permitted next status.
- Same-status and absent-table transitions are rejected.
- Terminal statuses have no outgoing transitions.
- Frozen and suspended operational states may return only through explicit table entries.
- Status checks do not mutate entities or record historical events.
- Exhaustive tests cover every ordered status pair.
- Stable rejection codes and result objects remain deferred to WO-013.

**Output:** The status-machine contract is explicit before source files change.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the domain-status implementation.

---

## Step 4 — Create the domain-status implementation

**Input:** The lifecycle contract recorded in Step 3.

**Action:** Create `packages/domain/src/domain-statuses.ts` with the supplied implementation.

**Editor command:** `code packages/domain/src/domain-statuses.ts`

**Resulting file:**

```text
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
}```

**Structural inspection:**

```text
$ rg -n "^export (const|type|interface|function)" packages/domain/src/domain-statuses.ts
8:export const PROPERTY_STATUS_VALUES = [
17:export const POOL_STATUS_VALUES = [
24:export const MEMBER_STATUS_VALUES = [
31:export const COMMAND_STATUS_VALUES = [
37:export const BATCH_STATUS_VALUES = [
43:export const LIQUIDATION_STATUS_VALUES = [
59:export type PropertyStatus = PropertyStatusValue & {
62:export type PoolStatus = PoolStatusValue & {
65:export type MemberStatus = MemberStatusValue & {
68:export type CommandStatus = CommandStatusValue & {
71:export type BatchStatus = BatchStatusValue & {
74:export type LiquidationStatus = LiquidationStatusValue & {
78:export type LifecycleKind =
86:export interface StatusValueByLifecycle {
95:export interface StatusByLifecycle {
173:export function propertyStatus(value: string): PropertyStatus {
177:export function poolStatus(value: string): PoolStatus {
181:export function memberStatus(value: string): MemberStatus {
185:export function commandStatus(value: string): CommandStatus {
189:export function batchStatus(value: string): BatchStatus {
193:export function liquidationStatus(
199:export function parseStatus<K extends LifecycleKind>(
206:export function allowedNextStatuses<K extends LifecycleKind>(
218:export function canTransitionStatus<K extends LifecycleKind>(
228:export function transitionStatus<K extends LifecycleKind>(

$ rg -n "closed: \[\]|rejected: \[\]|accepted: \[\]|committed: \[\]|cancelled: \[\]" packages/domain/src/domain-statuses.ts
125:    rejected: [],
127:    closed: [],
133:    closed: [],
139:    closed: [],
143:    accepted: [],
144:    rejected: [],
149:    committed: [],
155:    cancelled: [],
156:    closed: [],
```

**Output:** Six branded status types, runtime constructors, explicit transition tables, transition queries, and transition enforcement exist in one module.

**Status:** Step 4 complete.

**Next:** Step 5 — Export the domain statuses.

---

## Step 5 — Export the domain statuses

**Input:** The implementation created in Step 4 and the existing public entrypoint.

**Action:** Add one export line to `packages/domain/src/index.ts` without replacing the existing exports.

**Line to add:** `export * from "./domain-statuses.js";`

**Editor command:** `code packages/domain/src/index.ts`

**Resulting file:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";```

---

## Step 6 — Create exhaustive runtime lifecycle tests

**Input:** The status vocabulary, transition tables, and public export from Steps 4–5.

**Action:** Create `packages/domain/src/domain-statuses.test.ts` with the supplied tests.

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

        expect(expectedTargets).toBeDefined();
        expect(allowedNextStatuses(kind, from)).toEqual(
          expectedTargets,
        );

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
});```

**Structural inspection:**

```text
$ rg -n "registerLifecycleTests\(" packages/domain/src/domain-statuses.test.ts
76:registerLifecycleTests(
91:registerLifecycleTests(
104:registerLifecycleTests(
117:registerLifecycleTests(
129:registerLifecycleTests(
141:registerLifecycleTests(

$ rg -n "every ordered pair|closed states|recording history" packages/domain/src/domain-statuses.test.ts
45:    it("enforces every ordered pair in its transition table", () => {
156:  it("does not allow closed states to return to active operation", () => {
190:  it("does not confuse checking a transition with recording history", () => {
```

**Output:** Six vocabulary tests, six exhaustive transition-matrix tests, and two cross-lifecycle safeguards are present.

**Status:** Step 6 complete.

**Next:** Step 7 — Run focused runtime verification.

---

## Step 7 — Run focused runtime verification

**Input:** The implementation, public export, and exhaustive runtime tests.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- src/domain-statuses.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-statuses.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m   Start at [22m 19:40:13
[2m   Duration [22m 239ms[2m (transform 72ms, setup 0ms, import 88ms, tests 14ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/domain-statuses.test.ts(57,31): error TS18048: 'expectedTargets' is possibly 'undefined'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 7 — Run focused runtime verification

**Input:** The implementation, public export, and exhaustive runtime tests.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- src/domain-statuses.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-statuses.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 13[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m   Start at [22m 19:45:37
[2m   Duration [22m 238ms[2m (transform 73ms, setup 0ms, import 89ms, tests 13ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** Runtime validation and every ordered transition pair pass, and the domain test compilation remains strict.

**Status:** Step 7 complete.

**Next:** Step 8 — Add compile-time lifecycle-separation tests.

---

## Step 8 — Add compile-time lifecycle-separation tests

**Input:** The passing runtime status implementation.

**Action:** Create `packages/domain/src/domain-statuses.type-test.ts` with the supplied compile-time assertions.

**Editor command:** `code packages/domain/src/domain-statuses.type-test.ts`

**Resulting file:**

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
void liquidationPlanned;```

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** Nine intentional compile-time rejection assertions are present and the strict domain type check succeeds.

**Status:** Step 8 complete.

**Next:** Step 9 — Prove an impossible transition fails the focused suite.

---

## Step 9 — Prove an impossible transition fails the focused suite

**Input:** The passing focused runtime suite.

**Temporary action:** Append the supplied test named `TEMPORARY: allows a closed property to reactivate` to `packages/domain/src/domain-statuses.test.ts`.

**Reason:** The test deliberately contradicts the terminal-state contract, so the focused command must fail.

**Editor command:** `code packages/domain/src/domain-statuses.test.ts`

**Resulting file:**

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
void liquidationPlanned;```

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** Nine intentional compile-time rejection assertions are present and the strict domain type check succeeds.

**Status:** Step 8 complete.

**Next:** Step 9 — Prove an impossible transition fails the focused suite.

---

## Step 9 — Prove an impossible transition fails the focused suite

**Input:** The passing focused runtime suite.

**Temporary action:** Append the supplied test named `TEMPORARY: allows a closed property to reactivate` to `packages/domain/src/domain-statuses.test.ts`.

**Reason:** The test deliberately contradicts the terminal-state contract, so the focused command must fail.

**Editor command:** `code packages/domain/src/domain-statuses.test.ts`

**Temporary test file tail:**

```text
  it("does not confuse checking a transition with recording history", () => {
    const from = memberStatus("suspended");
    const to = memberStatus("active");

    expect(canTransitionStatus("member", from, to)).toBe(true);
    expect(from).toBe("suspended");
    expect(to).toBe("active");
  });
});


it("TEMPORARY: allows a closed property to reactivate", () => {
  expect(
    transitionStatus(
      "property",
      propertyStatus("closed"),
      propertyStatus("active"),
    ),
  ).toBe(propertyStatus("active"));
});```

**Expected result:** The focused test command must return a nonzero status because `closed -> active` is impossible.

```text
$ npm test --workspace packages/domain -- src/domain-statuses.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-statuses.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/domain-statuses.test.ts [2m([22m[2m15 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 17[2mms[22m[39m
     [32m✓[39m accepts exactly its declared status vocabulary[32m 2[2mms[22m[39m
     [32m✓[39m enforces every ordered pair in its transition table[32m 2[2mms[22m[39m
     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
     [32m✓[39m enforces every ordered pair in its transition table[32m 3[2mms[22m[39m
     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
     [32m✓[39m enforces every ordered pair in its transition table[32m 1[2mms[22m[39m
     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
     [32m✓[39m enforces every ordered pair in its transition table[32m 1[2mms[22m[39m
     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
     [32m✓[39m enforces every ordered pair in its transition table[32m 0[2mms[22m[39m
     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
     [32m✓[39m enforces every ordered pair in its transition table[32m 1[2mms[22m[39m
     [32m✓[39m does not allow closed states to return to active operation[32m 0[2mms[22m[39m
     [32m✓[39m does not confuse checking a transition with recording history[32m 0[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: allows a closed property to reactivate[39m[32m 3[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/domain-statuses.test.ts[2m > [22mTEMPORARY: allows a closed property to reactivate
[31m[1mRangeError[22m: Cannot transition property status from closed to active[39m
[36m [2m❯[22m transitionStatus src/domain-statuses.ts:[2m234:11[22m[39m
    [90m232|[39m )[33m:[39m [33mStatusByLifecycle[39m[[33mK[39m] {
    [90m233|[39m   [35mif[39m ([33m![39m[34mcanTransitionStatus[39m(kind[33m,[39m [35mfrom[39m[33m,[39m to)) {
    [90m234|[39m     [35mthrow[39m [35mnew[39m [33mRangeError[39m(
    [90m   |[39m           [31m^[39m
    [90m235|[39m       [32m`Cannot transition [39m[36m${[39mkind[36m}[39m[32m status from [39m[36m${[39m[35mfrom[39m[36m}[39m[32m to [39m[36m${[39mto[36m}[39m[32m`[39m[33m,[39m
    [90m236|[39m     )[33m;[39m
[90m [2m❯[22m src/domain-statuses.test.ts:[2m206:5[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m14 passed[39m[22m[90m (15)[39m
[2m   Start at [22m 19:48:09
[2m   Duration [22m 272ms[2m (transform 77ms, setup 0ms, import 95ms, tests 17ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run src/domain-statuses.test.ts
```

**Observed result:** The focused suite rejected the deliberately impossible closed-to-active transition.

**Status:** Expected failure confirmed; restoration is required.

**Next:** Step 10 — Remove the temporary test and reverify.

---

## Step 10 — Remove the temporary test and reverify

**Input:** The deliberately invalid test state from Step 9.

**Action:** Remove only the test named `TEMPORARY: allows a closed property to reactivate` from `packages/domain/src/domain-statuses.test.ts`.

**Editor command:** `code packages/domain/src/domain-statuses.test.ts`

**Commands and output:**

```text
$ rg -n "TEMPORARY:" packages/domain/src/domain-statuses.test.ts || true

$ npm test --workspace packages/domain -- src/domain-statuses.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/domain-statuses.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 13[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m   Start at [22m 19:48:42
[2m   Duration [22m 249ms[2m (transform 76ms, setup 0ms, import 93ms, tests 13ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** The temporary test is absent and the restored runtime and compile-time lifecycle safeguards pass.

**Status:** Step 10 complete.

**Next:** Step 11 — Verify the complete domain package.

---

## Step 11 — Verify the complete domain package

**Input:** The restored WO-012 implementation and all prior domain source and tests.

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

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 15[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m158 passed[39m[22m[90m (158)[39m
[2m   Start at [22m 19:48:51
[2m   Duration [22m 244ms[2m (transform 269ms, setup 0ms, import 360ms, tests 44ms, environment 0ms)[22m


$ find packages/domain/dist -type f | sort
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
packages/domain/dist/identifiers.type-test.js.map
packages/domain/dist/value-types.type-test.d.ts.map
packages/domain/dist/identifiers.type-test.d.ts
packages/domain/dist/domain-statuses.type-test.js.map
packages/domain/dist/domain-statuses.type-test.d.ts
packages/domain/dist/value-types.type-test.js.map
packages/domain/dist/identifiers.type-test.d.ts.map
packages/domain/dist/value-types.type-test.js
packages/domain/dist/domain-statuses.type-test.d.ts.map
packages/domain/dist/domain-statuses.type-test.js
packages/domain/dist/value-types.type-test.d.ts
packages/domain/dist/identifiers.type-test.js
Test-only files were emitted into production output.
---

## Step 12 — Verify the complete Economic Union workspace

**Input:** The verified domain package integrated into the existing workspace.

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

 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 15[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m158 passed[39m[22m[90m (158)[39m
[2m   Start at [22m 19:49:02
[2m   Duration [22m 218ms[2m (transform 124ms, setup 0ms, import 224ms, tests 49ms, environment 0ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 19:49:03
[2m   Duration [22m 192ms[2m (transform 46ms, setup 0ms, import 60ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 466.23µs (37.72µs CPU time)

Ran 1 test suite in 16.12ms (466.23µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Output:** The TypeScript workspace and Foundry scaffold remain green after introducing lifecycle statuses.

**Status:** Step 12 complete.

**Next:** Step 13 — Retest the adjacent event logger.

---

## Step 13 — Retest the adjacent event logger

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
 ✓ test/index.spec.js (4 tests) 176ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  19:49:19
   Duration  1.78s (transform 47ms, setup 0ms, collect 82ms, tests 176ms, environment 1ms, prepare 133ms)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** The adjacent Point event logger remains green and separate from Economic Union lifecycle work.

**Status:** Step 13 complete.

**Next:** Step 14 — Inspect and summarize WO-012.

---

## Step 14 — Inspect and summarize WO-012

**Input:** The verified lifecycle implementation and tests from Steps 1–13.

**Repository inspection:**

```text
$ git status --short
?? docs/work-orders/WO-012-execution.md
?? packages/domain/src/domain-statuses.test.ts
?? packages/domain/src/domain-statuses.ts
?? packages/domain/src/domain-statuses.type-test.ts

$ git diff --check

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --stat

$ git diff -- packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts
```

**Total input:** The committed WO-011 integer and identifier vocabulary plus the clean workspace foundation.

**Total output:** Six branded lifecycle statuses, runtime constructors, explicit transition tables, exhaustive pairwise runtime tests, compile-time separation tests, public exports, and this execution record.

**Expected changed files:**

- `packages/domain/src/domain-statuses.ts`
- `packages/domain/src/domain-statuses.test.ts`
- `packages/domain/src/domain-statuses.type-test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-012-execution.md`

**Boundary confirmation:** WO-012 defines finite status vocabularies and permitted transitions only. It does not create entity records, event history, authorization, stable domain errors, persistence, or economic calculations.

**Status:** Step 14 complete.

**Next:** Step 15 — Stage only WO-012.

---

## Step 14 — Inspect and summarize WO-012

**Input:** The verified lifecycle implementation and tests from Steps 1–13.

**Repository inspection:**

```text
$ git status --short
?? docs/work-orders/WO-012-execution.md
?? packages/domain/src/domain-statuses.test.ts
?? packages/domain/src/domain-statuses.ts
?? packages/domain/src/domain-statuses.type-test.ts

$ git diff --check

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --stat

$ git diff -- packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts
```

**Total input:** The committed WO-011 integer and identifier vocabulary plus the clean workspace foundation.

**Total output:** Six branded lifecycle statuses, runtime constructors, explicit transition tables, exhaustive pairwise runtime tests, compile-time separation tests, public exports, and this execution record.

**Expected changed files:**

- `packages/domain/src/domain-statuses.ts`
- `packages/domain/src/domain-statuses.test.ts`
- `packages/domain/src/domain-statuses.type-test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-012-execution.md`

**Boundary confirmation:** WO-012 defines finite status vocabularies and permitted transitions only. It does not create entity records, event history, authorization, stable domain errors, persistence, or economic calculations.

**Status:** Step 14 complete.

**Next:** Step 15 — Stage only WO-012.

---

## Step 14 — Inspect and summarize WO-012

**Input:** The verified lifecycle implementation and tests from Steps 1–13.

**Repository inspection:**

```text
$ git status --short
?? docs/work-orders/WO-012-execution.md
?? packages/domain/src/domain-statuses.test.ts
?? packages/domain/src/domain-statuses.ts
?? packages/domain/src/domain-statuses.type-test.ts

$ git diff --check

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --stat

$ git diff -- packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts
```

**Total input:** The committed WO-011 integer and identifier vocabulary plus the clean workspace foundation.

**Total output:** Six branded lifecycle statuses, runtime constructors, explicit transition tables, exhaustive pairwise runtime tests, compile-time separation tests, public exports, and this execution record.

**Expected changed files:**

- `packages/domain/src/domain-statuses.ts`
- `packages/domain/src/domain-statuses.test.ts`
- `packages/domain/src/domain-statuses.type-test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-012-execution.md`

**Boundary confirmation:** WO-012 defines finite status vocabularies and permitted transitions only. It does not create entity records, event history, authorization, stable domain errors, persistence, or economic calculations.

**Status:** Step 14 complete.

**Next:** Step 15 — Stage only WO-012.

---

## Step 14 — Inspect and summarize WO-012

**Input:** The verified lifecycle implementation and tests from Steps 1–13.

**Repository inspection:**

```text
$ git status --short
?? docs/work-orders/WO-012-execution.md
?? packages/domain/src/domain-statuses.test.ts
?? packages/domain/src/domain-statuses.ts
?? packages/domain/src/domain-statuses.type-test.ts

$ git diff --check

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --stat

$ git diff -- packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts
```

**Total input:** The committed WO-011 integer and identifier vocabulary plus the clean workspace foundation.

**Total output:** Six branded lifecycle statuses, runtime constructors, explicit transition tables, exhaustive pairwise runtime tests, compile-time separation tests, public exports, and this execution record.

**Expected changed files:**

- `packages/domain/src/domain-statuses.ts`
- `packages/domain/src/domain-statuses.test.ts`
- `packages/domain/src/domain-statuses.type-test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-012-execution.md`

**Boundary confirmation:** WO-012 defines finite status vocabularies and permitted transitions only. It does not create entity records, event history, authorization, stable domain errors, persistence, or economic calculations.

**Status:** Step 14 complete.

**Next:** Step 15 — Stage only WO-012.

---

## Step 15 — Stage only WO-012

**Input:** The reviewed status source, tests, export, and execution record.

**Action:** Stage only explicit WO-012 paths.

**Staging commands and output:**

```text
$ git add packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts docs/work-orders/WO-012-execution.md

$ git diff --cached --check
code/economic-union/packages/domain/src/domain-statuses.test.ts:202: new blank line at EOF.
---

## Step 16 — Final verification and commit authorization

**Input:** The explicitly staged WO-012 implementation, tests, export, and execution record.

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

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m158 passed[39m[22m[90m (158)[39m
[2m   Start at [22m 19:50:55
[2m   Duration [22m 265ms[2m (transform 305ms, setup 0ms, import 399ms, tests 49ms, environment 0ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 19:50:55
[2m   Duration [22m 176ms[2m (transform 45ms, setup 0ms, import 62ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 274.43µs (43.44µs CPU time)

Ran 1 test suite in 6.84ms (274.43µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --cached --check
code/economic-union/packages/domain/src/domain-statuses.test.ts:202: new blank line at EOF.
