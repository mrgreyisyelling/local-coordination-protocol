# WO-011 Execution Record — Define Stable Identifiers

## Purpose

Define validated, semantically distinct identifiers for the eight Economic Union entity types.

This record captures the actual commands and output of WO-011.

---

## Step 1 — Confirm WO-010 and initialize the execution record

**Input:** The committed and verified WO-010 integer value-type vocabulary.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-011-execution.md

$ git log -1 --oneline
65a29cd Define integer value types

$ git diff --check

$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm test --workspace packages/domain

> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 15[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 17:34:39
[2m   Duration [22m 222ms[2m (transform 87ms, setup 0ms, import 158ms, tests 18ms, environment 0ms)[22m

```

**Output:** The repository location, Git state, latest commit, whitespace state, and passing WO-010 domain baseline are recorded.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the existing domain package.

---

## Step 2 — Inspect the existing domain package

**Input:** The verified WO-010 domain package.

**Commands and output:**

```text
$ find packages/domain -maxdepth 3 -type f -not -path "*/dist/*" | sort
packages/domain/package.json
packages/domain/src/index.test.ts
packages/domain/src/index.ts
packages/domain/src/value-types.test.ts
packages/domain/src/value-types.ts
packages/domain/src/value-types.type-test.ts
packages/domain/tsconfig.json
packages/domain/tsconfig.test.json

$ sed -n "1,220p" packages/domain/src/index.ts
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
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
$ rg -n "MemberId|AccountId|PropertyId|DepositId|CommandId|EventId|BatchId|LiquidationId" packages/domain/src || true
```

**Output:** Existing source, entrypoint, TypeScript configuration, and identifier definitions are recorded before WO-011 edits.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the stable-identifier contract.

---

## Step 3 — Record the stable-identifier contract

**Input:** The master-plan requirements and the inspected domain package.

**Contract:**

- Eight entity concepts receive eight distinct branded string types.
- Canonical IDs use an entity prefix, one underscore, and a 26-character uppercase Crockford Base32 payload.
- Constructors reject empty, malformed, wrongly prefixed, lowercase, ambiguous-character, short, and long inputs.
- Identifier payloads are opaque and carry no domain ordering or lifecycle meaning.
- Tests use a positive safe-integer sequence encoded and left-padded to the canonical payload length.
- Production generation depends on IdentifierGenerator and is not implemented here.
- EventId identifies an event; EventSequence orders events. They are not substitutes.

**Output:** The identifier implementation contract is explicit before source files are changed.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the stable-identifier implementation.

---

## Step 4 — Create the stable-identifier implementation

**Input:** The identifier contract recorded in Step 3.

**Action:** Create `packages/domain/src/identifiers.ts` with the supplied implementation.

**Editor command:** `code packages/domain/src/identifiers.ts`

**Resulting file:**

```text
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
}```

**Structural inspection:**

```text
$ rg -n "^export (type|interface|function)" packages/domain/src/identifiers.ts
10:export type MemberId = string & {
13:export type AccountId = string & {
16:export type PropertyId = string & {
19:export type DepositId = string & {
22:export type CommandId = string & {
25:export type EventId = string & {
28:export type BatchId = string & {
31:export type LiquidationId = string & {
35:export type IdentifierKind =
45:export interface IdentifierByKind {
56:export interface IdentifierGenerator {
104:export function memberId(value: string): MemberId {
108:export function accountId(value: string): AccountId {
112:export function propertyId(value: string): PropertyId {
116:export function depositId(value: string): DepositId {
120:export function commandId(value: string): CommandId {
124:export function eventId(value: string): EventId {
128:export function batchId(value: string): BatchId {
132:export function liquidationId(value: string): LiquidationId {
136:export function parseIdentifier<K extends IdentifierKind>(
162:export function deterministicTestId<K extends IdentifierKind>(
172:export function createDeterministicTestIdentifierGenerator(
```

**Output:** Eight branded ID types, validated constructors, a typed generation interface, and deterministic test generation exist in one module.

**Status:** Step 4 complete.

**Next:** Step 5 — Export the stable identifiers.

---

## Step 5 — Export the stable identifiers

**Input:** The saved identifier module and the existing public domain entrypoint.

**Action:** Add the required re-export without changing existing value-type or describeAmount behavior.

**Required export:** `export * from "./identifiers.js";`

**Editor command:** `code packages/domain/src/index.ts`

**Resulting entrypoint:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";```

**Duplicate-definition inspection:**

```text
$ rg -n "export type (MemberId|AccountId|PropertyId|DepositId|CommandId|EventId|BatchId|LiquidationId)" packages/domain/src
packages/domain/src/identifiers.ts:10:export type MemberId = string & {
packages/domain/src/identifiers.ts:13:export type AccountId = string & {
packages/domain/src/identifiers.ts:16:export type PropertyId = string & {
packages/domain/src/identifiers.ts:19:export type DepositId = string & {
packages/domain/src/identifiers.ts:22:export type CommandId = string & {
packages/domain/src/identifiers.ts:25:export type EventId = string & {
packages/domain/src/identifiers.ts:28:export type BatchId = string & {
packages/domain/src/identifiers.ts:31:export type LiquidationId = string & {
```

**Output:** The identifiers are publicly exported and each identifier type has exactly one definition.

**Status:** Step 5 complete.

**Next:** Step 6 — Create runtime identifier tests.

---

## Step 6 — Create runtime identifier tests

**Input:** The complete identifier implementation and public export.

**Action:** Create `packages/domain/src/identifiers.test.ts` with the supplied tests.

**Editor command:** `code packages/domain/src/identifiers.test.ts`

**Resulting runtime tests:**

```text
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
});```

**Test-definition inspection:**

```text
$ rg -n "describe\(|it\(|it\.each" packages/domain/src/identifiers.test.ts
44:describe("stable identifier constructors", () => {
50:    describe(kind, () => {
51:      it("accepts its canonical identifier", () => {
55:      it("rejects an empty identifier", () => {
59:      it("rejects an identifier without a separator", () => {
65:      it("rejects a valid identifier with the wrong entity prefix", () => {
74:      it("rejects a short payload", () => {
80:      it("rejects a long payload", () => {
86:      it("rejects lowercase payload characters", () => {
92:      it("rejects ambiguous Crockford characters", () => {
98:      it("rejects a second separator", () => {
107:describe("generic identifier parsing", () => {
108:  it("returns the type-specific canonical value", () => {
114:  it("applies the selected kind's prefix rule", () => {
121:describe("deterministic test identifiers", () => {
122:  it("encodes sequence one in canonical form", () => {
128:  it("encodes sequence 31 with the final Crockford digit Z", () => {
134:  it("encodes sequence 32 as base32 10", () => {
140:  it.each([
153:  it("creates repeatable values for the same input", () => {
160:describe("deterministic test identifier generator", () => {
161:  it("advances one shared sequence across requested kinds", () => {
176:  it("accepts an explicit positive starting sequence", () => {
185:  it.each([
198:  it("rejects advancement beyond the safe-integer sequence", () => {
```

**Output:** Runtime tests cover all eight constructors, malformed inputs, cross-prefix rejection, deterministic encoding, and generator boundaries.

**Status:** Step 6 complete.

**Next:** Step 7 — Run focused runtime verification.

---

## Step 7 — Run focused runtime verification

**Input:** The identifier implementation, export, and runtime tests from Steps 4–6.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- src/identifiers.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/identifiers.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m93 passed[39m[22m[90m (93)[39m
[2m   Start at [22m 17:37:56
[2m   Duration [22m 268ms[2m (transform 86ms, setup 0ms, import 109ms, tests 14ms, environment 0ms)[22m

```

**Output:** The focused runtime identifier suite passes.

**Status:** Step 7 complete.

**Next:** Step 8 — Add compile-time identifier-separation tests.

---

## Step 8 — Add compile-time identifier-separation tests

**Input:** Eight publicly exported branded identifier types and the typed generator interface.

**Action:** Create `packages/domain/src/identifiers.type-test.ts` with the supplied compile-time assertions.

**Editor command:** `code packages/domain/src/identifiers.type-test.ts`

**Resulting compile-time assertions:**

```text
import {
  accountId,
  batchId,
  commandId,
  createDeterministicTestIdentifierGenerator,
  depositId,
  eventId,
  liquidationId,
  memberId,
  propertyId,
  type AccountId,
  type BatchId,
  type CommandId,
  type DepositId,
  type EventId,
  type IdentifierGenerator,
  type LiquidationId,
  type MemberId,
  type PropertyId,
} from "./index.js";

const payload = "00000000000000000000000001";

const member = memberId(`mem_${payload}`);
const account = accountId(`acct_${payload}`);
const property = propertyId(`prop_${payload}`);
const deposit = depositId(`dep_${payload}`);
const command = commandId(`cmd_${payload}`);
const event = eventId(`evt_${payload}`);
const batch = batchId(`batch_${payload}`);
const liquidation = liquidationId(`liq_${payload}`);

function requiresMemberId(_value: MemberId): void {}
function requiresAccountId(_value: AccountId): void {}
function requiresPropertyId(_value: PropertyId): void {}
function requiresDepositId(_value: DepositId): void {}
function requiresCommandId(_value: CommandId): void {}
function requiresEventId(_value: EventId): void {}
function requiresBatchId(_value: BatchId): void {}
function requiresLiquidationId(_value: LiquidationId): void {}

requiresMemberId(member);
requiresAccountId(account);
requiresPropertyId(property);
requiresDepositId(deposit);
requiresCommandId(command);
requiresEventId(event);
requiresBatchId(batch);
requiresLiquidationId(liquidation);

// A raw string is not a validated identifier.
// @ts-expect-error plain strings are not MemberId values
requiresMemberId(`mem_${payload}`);

// Entity identifiers are not interchangeable.
// @ts-expect-error PropertyId is not MemberId
requiresMemberId(property);
// @ts-expect-error MemberId is not AccountId
requiresAccountId(member);
// @ts-expect-error AccountId is not PropertyId
requiresPropertyId(account);
// @ts-expect-error CommandId is not DepositId
requiresDepositId(command);
// @ts-expect-error EventId is not CommandId
requiresCommandId(event);
// @ts-expect-error BatchId is not EventId
requiresEventId(batch);
// @ts-expect-error LiquidationId is not BatchId
requiresBatchId(liquidation);
// @ts-expect-error DepositId is not LiquidationId
requiresLiquidationId(deposit);

const generator: IdentifierGenerator =
  createDeterministicTestIdentifierGenerator();

const generatedMember: MemberId = generator.next("member");
const generatedProperty: PropertyId = generator.next("property");

requiresMemberId(generatedMember);
requiresPropertyId(generatedProperty);

// The kind argument determines the generator result type.
// @ts-expect-error generated PropertyId is not MemberId
const invalidGeneratedMember: MemberId = generator.next("property");

void invalidGeneratedMember;```

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** TypeScript confirms raw strings and all intentional cross-entity substitutions are rejected, including PropertyId where MemberId is required.

**Status:** Step 8 complete.

**Next:** Step 9 — Prove malformed identifiers fail the focused suite.

---

## Step 9 — Prove malformed identifiers fail the focused suite

**Input:** The passing focused runtime suite.

**Temporary action:** Append the supplied test named `TEMPORARY: incorrectly accepts an empty MemberId` to `packages/domain/src/identifiers.test.ts`.

**Reason:** The test deliberately contradicts the identifier contract, so the focused command must fail.

**Editor command:** `code packages/domain/src/identifiers.test.ts`

**Temporary test file tail:**

```text
  it("rejects advancement beyond the safe-integer sequence", () => {
    const generator =
      createDeterministicTestIdentifierGenerator(
        Number.MAX_SAFE_INTEGER,
      );

    expect(() => generator.next("command")).toThrow(RangeError);
  });
});


it("TEMPORARY: incorrectly accepts an empty MemberId", () => {
  expect(() => memberId("")).not.toThrow();
});```

**Expected result:** The following focused test command must return a nonzero status because `memberId("")` throws.

```text
$ npm test --workspace packages/domain -- src/identifiers.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/identifiers.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/identifiers.test.ts [2m([22m[2m94 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 19[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 1[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
       [32m✓[39m accepts its canonical identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an empty identifier[32m 0[2mms[22m[39m
       [32m✓[39m rejects an identifier without a separator[32m 0[2mms[22m[39m
       [32m✓[39m rejects a valid identifier with the wrong entity prefix[32m 0[2mms[22m[39m
       [32m✓[39m rejects a short payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects a long payload[32m 0[2mms[22m[39m
       [32m✓[39m rejects lowercase payload characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects ambiguous Crockford characters[32m 0[2mms[22m[39m
       [32m✓[39m rejects a second separator[32m 0[2mms[22m[39m
     [32m✓[39m returns the type-specific canonical value[32m 0[2mms[22m[39m
     [32m✓[39m applies the selected kind's prefix rule[32m 0[2mms[22m[39m
     [32m✓[39m encodes sequence one in canonical form[32m 0[2mms[22m[39m
     [32m✓[39m encodes sequence 31 with the final Crockford digit Z[32m 0[2mms[22m[39m
     [32m✓[39m encodes sequence 32 as base32 10[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid sequence 0[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid sequence -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid sequence 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid sequence NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid sequence Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid sequence 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m creates repeatable values for the same input[32m 0[2mms[22m[39m
     [32m✓[39m advances one shared sequence across requested kinds[32m 0[2mms[22m[39m
     [32m✓[39m accepts an explicit positive starting sequence[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid starting sequence 0[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid starting sequence -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid starting sequence 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid starting sequence NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid starting sequence Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid starting sequence 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m rejects advancement beyond the safe-integer sequence[32m 0[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: incorrectly accepts an empty MemberId[39m[32m 6[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/identifiers.test.ts[2m > [22mTEMPORARY: incorrectly accepts an empty MemberId
[31m[1mAssertionError[22m: expected [Function] to not throw an error but 'RangeError: member identifier must co…' was thrown[39m

[32m- Expected:[39m
undefined

[31m+ Received:[39m
"RangeError: member identifier must contain one separator"

[36m [2m❯[22m src/identifiers.test.ts:[2m210:34[22m[39m
    [90m208|[39m
    [90m209|[39m [34mit[39m([32m"TEMPORARY: incorrectly accepts an empty MemberId"[39m[33m,[39m () [33m=>[39m {
    [90m210|[39m   [34mexpect[39m(() [33m=>[39m [34mmemberId[39m([32m""[39m))[33m.[39mnot[33m.[39m[34mtoThrow[39m()[33m;[39m
    [90m   |[39m                                  [31m^[39m
    [90m211|[39m })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m93 passed[39m[22m[90m (94)[39m
[2m   Start at [22m 17:39:17
[2m   Duration [22m 296ms[2m (transform 88ms, setup 0ms, import 110ms, tests 19ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run src/identifiers.test.ts
```

**Observed result:** The focused suite rejected the deliberately wrong empty-identifier expectation.

**Status:** Expected failure confirmed; restoration is required.

**Next:** Step 10 — Remove the temporary test and reverify.

---

## Step 10 — Remove the temporary test and reverify

**Input:** The deliberately invalid test state from Step 9.

**Action:** Remove only the test named `TEMPORARY: incorrectly accepts an empty MemberId` from `packages/domain/src/identifiers.test.ts`.

**Editor command:** `code packages/domain/src/identifiers.test.ts`

**Commands and output:**

```text
$ rg -n "TEMPORARY:" packages/domain/src/identifiers.test.ts || true

$ npm test --workspace packages/domain -- src/identifiers.test.ts

> @lcp/domain@1.0.0 test
> vitest run src/identifiers.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m93 passed[39m[22m[90m (93)[39m
[2m   Start at [22m 17:39:51
[2m   Duration [22m 210ms[2m (transform 55ms, setup 0ms, import 76ms, tests 14ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** The temporary test is absent and the restored runtime and compile-time identifier safeguards pass.

**Status:** Step 10 complete.

**Next:** Step 11 — Verify the complete domain package.

---

## Step 11 — Verify the complete domain package

**Input:** The restored identifier implementation, runtime tests, type tests, and public export.

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

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 15[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m144 passed[39m[22m[90m (144)[39m
[2m   Start at [22m 17:40:01
[2m   Duration [22m 215ms[2m (transform 78ms, setup 0ms, import 136ms, tests 30ms, environment 0ms)[22m

```

**Output:** The entire domain package typechecks, builds, and passes all tests with stable identifiers included.

**Status:** Step 11 complete.

**Next:** Step 12 — Verify the complete Economic Union workspace.

---

## Step 12 — Verify the complete Economic Union workspace

**Input:** The passing domain package from Step 11.

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

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 15[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m144 passed[39m[22m[90m (144)[39m
[2m   Start at [22m 17:40:55
[2m   Duration [22m 237ms[2m (transform 128ms, setup 0ms, import 236ms, tests 32ms, environment 0ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 17:40:56
[2m   Duration [22m 219ms[2m (transform 54ms, setup 0ms, import 72ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 285.19µs (37.72µs CPU time)

Ran 1 test suite in 6.64ms (285.19µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Output:** The TypeScript workspace and Foundry scaffold remain green after adding stable identifiers.

**Status:** Step 12 complete.

**Next:** Step 13 — Retest the adjacent event logger.

---

## Step 13 — Retest the adjacent event logger

**Input:** The passing Economic Union workspace and the adjacent event-logger project.

**Commands and output:**

```text
$ cd ../event-logger && npm run typecheck
npm error Missing script: "typecheck"
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /home/mike/.npm/_logs/2026-07-23T21_41_22_088Z-debug-0.log
---

## Step 14 — Inspect and summarize WO-011

**Input:** The verified identifier implementation and tests from Steps 1–13.

**Repository inspection:**

```text
$ git status --short
 M packages/domain/src/index.ts
?? docs/work-orders/WO-011-execution.md
?? packages/domain/src/identifiers.test.ts
?? packages/domain/src/identifiers.ts
?? packages/domain/src/identifiers.type-test.ts

$ git diff --check

$ git diff --stat
 code/economic-union/packages/domain/src/index.ts | 4 +++-
 1 file changed, 3 insertions(+), 1 deletion(-)

$ git diff -- packages/domain/src/identifiers.ts packages/domain/src/identifiers.test.ts packages/domain/src/identifiers.type-test.ts packages/domain/src/index.ts
diff --git a/code/economic-union/packages/domain/src/index.ts b/code/economic-union/packages/domain/src/index.ts
index 945bf9e..44c8ce1 100644
--- a/code/economic-union/packages/domain/src/index.ts
+++ b/code/economic-union/packages/domain/src/index.ts
@@ -4,4 +4,6 @@ export * from "./value-types.js";
 
 export function describeAmount(amount: Cents): string {
   return `${amount} cents`;
-}
\ No newline at end of file
+}
+
+export * from "./identifiers.js";
\ No newline at end of file
```

**Total input:** The committed WO-010 integer vocabulary and clean workspace foundation.

**Total output:** Eight stable identifier types, canonical runtime validation, deterministic test IDs, a production-generation interface, focused runtime tests, compile-time separation tests, public exports, and this execution record.

**Expected changed files:**

- `packages/domain/src/identifiers.ts`
- `packages/domain/src/identifiers.test.ts`
- `packages/domain/src/identifiers.type-test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-011-execution.md`

**Boundary confirmation:** WO-011 defines identity primitives only. It does not create entity records, persistence, lifecycle states, domain errors, or production ID infrastructure.

**Status:** Step 14 complete.

**Next:** Step 15 — Stage only WO-011.

---

## Step 15 — Stage only WO-011

**Input:** The reviewed identifier source, tests, export, and execution record.

**Action:** Stage only explicit WO-011 paths.

**Staging commands and output:**

```text
$ git add packages/domain/src/identifiers.ts packages/domain/src/identifiers.test.ts packages/domain/src/identifiers.type-test.ts packages/domain/src/index.ts docs/work-orders/WO-011-execution.md

$ git diff --cached --check
code/economic-union/docs/work-orders/WO-011-execution.md:1243: trailing whitespace.
+ 
---

## Step 16 — Final verification and commit authorization

**Input:** The explicitly staged WO-011 implementation, tests, export, and execution record.

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

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m144 passed[39m[22m[90m (144)[39m
[2m   Start at [22m 17:42:01
[2m   Duration [22m 241ms[2m (transform 200ms, setup 0ms, import 271ms, tests 32ms, environment 0ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 7[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 17:42:01
[2m   Duration [22m 168ms[2m (transform 21ms, setup 0ms, import 32ms, tests 7ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 259.34µs (38.00µs CPU time)

Ran 1 test suite in 6.21ms (259.34µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

$ git diff --cached --check
code/economic-union/docs/work-orders/WO-011-execution.md:1243: trailing whitespace.
+ 
code/economic-union/docs/work-orders/WO-011-execution.md:1287: trailing whitespace.
++ 
