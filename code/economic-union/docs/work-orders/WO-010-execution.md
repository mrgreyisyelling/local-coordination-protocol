# WO-010 Execution Record — Define Integer Value Types

## Purpose

Complete the pure integer vocabulary for cents, basis points, seniority positions, event sequences, and nonces.

This record captures the actual commands and output of WO-010.

---

## Step 1 — Confirm WO-009 and initialize the execution record

**Input:** The committed WO-009 continuous-integration foundation.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-010-execution.md

$ git log -1 --oneline --decorate
ef909da (HEAD -> main, origin/main) pre-workorder 10

$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 6[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m11 passed[39m[22m[90m (11)[39m
[2m   Start at [22m 16:23:01
[2m   Duration [22m 193ms[2m (transform 59ms, setup 0ms, import 76ms, tests 6ms, environment 0ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 16:23:02
[2m   Duration [22m 173ms[2m (transform 22ms, setup 0ms, import 39ms, tests 4ms, environment 0ms)[22m

```

**Output:** The WO-009 repository baseline is visible and the TypeScript workspace passes before WO-010 changes begin.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the existing domain vocabulary.

---

## Step 2 — Inspect the existing domain vocabulary

**Input:** The passing domain package inherited from WO-007 and WO-009.

**Commands and output:**

```text
$ find packages/domain -maxdepth 3 -type f | sort
packages/domain/dist/index.d.ts
packages/domain/dist/index.d.ts.map
packages/domain/dist/index.js
packages/domain/dist/index.js.map
packages/domain/package.json
packages/domain/src/index.test.ts
packages/domain/src/index.ts
packages/domain/tsconfig.json
packages/domain/tsconfig.test.json

$ rg -n "Cents|SeniorityPosition|BasisPoints|EventSequence|Nonce" packages/domain/src
packages/domain/src/index.ts:4:export type Cents = number & {
packages/domain/src/index.ts:5:  readonly [centsBrand]: "Cents";
packages/domain/src/index.ts:8:export type SeniorityPosition = number & {
packages/domain/src/index.ts:9:  readonly [seniorityPositionBrand]: "SeniorityPosition";
packages/domain/src/index.ts:29:export function cents(value: number): Cents {
packages/domain/src/index.ts:30:  assertNonNegativeSafeInteger(value, "Cents");
packages/domain/src/index.ts:32:  return value as Cents;
packages/domain/src/index.ts:37:): SeniorityPosition {
packages/domain/src/index.ts:43:  return value as SeniorityPosition;
packages/domain/src/index.ts:46:export function describeAmount(amount: Cents): string {
packages/domain/src/index.test.ts:24:      "Cents must not be negative"
packages/domain/src/index.test.ts:30:      "Cents must be a safe integer"
packages/domain/src/index.test.ts:37:    ).toThrow("Cents must be a safe integer");
packages/domain/src/index.test.ts:43:    ).toThrow("Cents must be a safe integer");

$ sed -n "1,260p" packages/domain/src/index.ts
declare const centsBrand: unique symbol;
declare const seniorityPositionBrand: unique symbol;

export type Cents = number & {
  readonly [centsBrand]: "Cents";
};

export type SeniorityPosition = number & {
  readonly [seniorityPositionBrand]: "SeniorityPosition";
};

function assertNonNegativeSafeInteger(
  value: number,
  concept: string
): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(
      `${concept} must be a safe integer`
    );
  }

  if (value < 0) {
    throw new RangeError(
      `${concept} must not be negative`
    );
  }
}

export function cents(value: number): Cents {
  assertNonNegativeSafeInteger(value, "Cents");

  return value as Cents;
}

export function seniorityPosition(
  value: number
): SeniorityPosition {
  assertNonNegativeSafeInteger(
    value,
    "Seniority position"
  );

  return value as SeniorityPosition;
}

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}
$ sed -n "1,320p" packages/domain/src/index.test.ts
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
});```

**Output:** The early integer types and tests are recorded before consolidation.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the integer value-type contract.

---

## Step 3 — Record the integer value-type contract

**Input:** The inspected WO-007 domain vocabulary and the WO-010 master-plan scope.

## Contract

- All values are safe JavaScript integers.
- Cents are nonnegative.
- Basis points are between 0 and 10,000 inclusive.
- Seniority positions begin at 1.
- Event sequences and nonces begin at 0.
- Cents support checked addition and subtraction.
- Event sequences and nonces support checked increment.
- Comparison occurs only within the same branded type.
- Dollar parsing and display formatting remain outside the domain core.

**Output:** The implementation contract is explicit before source files are changed.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the integer value-type implementation.

---

## Step 4 — Create the integer value-type implementation

**Input:** The contract recorded in Step 3.

**Action:** Create `packages/domain/src/value-types.ts` with the supplied implementation.

**Editor command:** `code packages/domain/src/value-types.ts`

**Resulting implementation:**

```typescript
declare const centsBrand: unique symbol;
declare const basisPointsBrand: unique symbol;
declare const seniorityPositionBrand: unique symbol;
declare const eventSequenceBrand: unique symbol;
declare const nonceBrand: unique symbol;

export type Cents = number & { readonly [centsBrand]: "Cents" };
export type BasisPoints = number & {
  readonly [basisPointsBrand]: "BasisPoints";
};
export type SeniorityPosition = number & {
  readonly [seniorityPositionBrand]: "SeniorityPosition";
};
export type EventSequence = number & {
  readonly [eventSequenceBrand]: "EventSequence";
};
export type Nonce = number & { readonly [nonceBrand]: "Nonce" };

export type Comparison = -1 | 0 | 1;

function requireSafeInteger(
  value: number,
  name: string,
): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${name} must be a safe integer`);
  }
}

function compareIntegers(left: number, right: number): Comparison {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

export function cents(value: number): Cents {
  requireSafeInteger(value, "Cents");

  if (value < 0) {
    throw new RangeError("Cents must be nonnegative");
  }

  return value as Cents;
}

export function addCents(left: Cents, right: Cents): Cents {
  return cents(left + right);
}

export function subtractCents(left: Cents, right: Cents): Cents {
  return cents(left - right);
}

export function compareCents(
  left: Cents,
  right: Cents,
): Comparison {
  return compareIntegers(left, right);
}

export function basisPoints(value: number): BasisPoints {
  requireSafeInteger(value, "BasisPoints");

  if (value < 0 || value > 10_000) {
    throw new RangeError(
      "BasisPoints must be between 0 and 10,000",
    );
  }

  return value as BasisPoints;
}

export function compareBasisPoints(
  left: BasisPoints,
  right: BasisPoints,
): Comparison {
  return compareIntegers(left, right);
}

export function seniorityPosition(
  value: number,
): SeniorityPosition {
  requireSafeInteger(value, "SeniorityPosition");

  if (value < 1) {
    throw new RangeError(
      "SeniorityPosition must be at least 1",
    );
  }

  return value as SeniorityPosition;
}

export function compareSeniorityPositions(
  left: SeniorityPosition,
  right: SeniorityPosition,
): Comparison {
  return compareIntegers(left, right);
}

export function eventSequence(value: number): EventSequence {
  requireSafeInteger(value, "EventSequence");

  if (value < 0) {
    throw new RangeError("EventSequence must be nonnegative");
  }

  return value as EventSequence;
}

export function nextEventSequence(
  current: EventSequence,
): EventSequence {
  return eventSequence(current + 1);
}

export function compareEventSequences(
  left: EventSequence,
  right: EventSequence,
): Comparison {
  return compareIntegers(left, right);
}

export function nonce(value: number): Nonce {
  requireSafeInteger(value, "Nonce");

  if (value < 0) {
    throw new RangeError("Nonce must be nonnegative");
  }

  return value as Nonce;
}

export function nextNonce(current: Nonce): Nonce {
  return nonce(current + 1);
}

export function compareNonces(
  left: Nonce,
  right: Nonce,
): Comparison {
  return compareIntegers(left, right);
}```

**Output:** The five validated integer types and their meaningful checked operations exist in one module.

**Status:** Step 4 complete.

**Next:** Step 5 — Export the integer value types.

---

## Step 5 — Export the integer value types

**Input:** The implementation saved in Step 4 and the existing public domain entrypoint.

**Action:** Remove superseded inline value-type definitions and re-export `value-types.ts` without disturbing unrelated exports.

**Required export:** `export * from "./value-types.js";`

**Editor command:** `code packages/domain/src/index.ts`

**Resulting entrypoint:**

```typescript
declare const centsBrand: unique symbol;
declare const seniorityPositionBrand: unique symbol;

export type Cents = number & {
  readonly [centsBrand]: "Cents";
};

export type SeniorityPosition = number & {
  readonly [seniorityPositionBrand]: "SeniorityPosition";
};

function assertNonNegativeSafeInteger(
  value: number,
  concept: string
): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(
      `${concept} must be a safe integer`
    );
  }

  if (value < 0) {
    throw new RangeError(
      `${concept} must not be negative`
    );
  }
}

export function cents(value: number): Cents {
  assertNonNegativeSafeInteger(value, "Cents");

  return value as Cents;
}

export function seniorityPosition(
  value: number
): SeniorityPosition {
  assertNonNegativeSafeInteger(
    value,
    "Seniority position"
  );

  return value as SeniorityPosition;
}

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}```

**Duplicate-definition inspection:**

```text
$ rg -n "export type (Cents|BasisPoints|SeniorityPosition|EventSequence|Nonce)" packages/domain/src
packages/domain/src/value-types.ts:7:export type Cents = number & { readonly [centsBrand]: "Cents" };
packages/domain/src/value-types.ts:8:export type BasisPoints = number & {
packages/domain/src/value-types.ts:11:export type SeniorityPosition = number & {
packages/domain/src/value-types.ts:14:export type EventSequence = number & {
packages/domain/src/value-types.ts:17:export type Nonce = number & { readonly [nonceBrand]: "Nonce" };
packages/domain/src/index.ts:4:export type Cents = number & {
packages/domain/src/index.ts:8:export type SeniorityPosition = number & {
```

**Output:** The new value types are available from the public domain package without duplicate definitions.

**Status:** Step 5 complete.

**Next:** Step 6 — Create runtime boundary tests.

---

## Step 5 — Export the integer value types

**Input:** The implementation saved in Step 4 and the existing public domain entrypoint.

**Action:** Remove superseded inline value-type definitions and re-export `value-types.ts` without disturbing unrelated exports.

**Required export:** `export * from "./value-types.js";`

**Editor command:** `code packages/domain/src/index.ts`

**Resulting entrypoint:**

```typescript
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}```

**Duplicate-definition inspection:**

```text
$ rg -n "export type (Cents|BasisPoints|SeniorityPosition|EventSequence|Nonce)" packages/domain/src
packages/domain/src/value-types.ts:7:export type Cents = number & { readonly [centsBrand]: "Cents" };
packages/domain/src/value-types.ts:8:export type BasisPoints = number & {
packages/domain/src/value-types.ts:11:export type SeniorityPosition = number & {
packages/domain/src/value-types.ts:14:export type EventSequence = number & {
packages/domain/src/value-types.ts:17:export type Nonce = number & { readonly [nonceBrand]: "Nonce" };
```

**Output:** The new value types are available from the public domain package without duplicate definitions.

**Status:** Step 5 complete.

**Next:** Step 6 — Create runtime boundary tests.

**Resulting entrypoint:**

```typescript
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}```

**Duplicate-definition inspection:**

```text
$ rg -n "export type (Cents|BasisPoints|SeniorityPosition|EventSequence|Nonce)" packages/domain/src
packages/domain/src/value-types.ts:7:export type Cents = number & { readonly [centsBrand]: "Cents" };
packages/domain/src/value-types.ts:8:export type BasisPoints = number & {
packages/domain/src/value-types.ts:11:export type SeniorityPosition = number & {
packages/domain/src/value-types.ts:14:export type EventSequence = number & {
packages/domain/src/value-types.ts:17:export type Nonce = number & { readonly [nonceBrand]: "Nonce" };
```

**Output:** The new value types are available from the public domain package without duplicate definitions.

**Status:** Step 5 complete.

**Next:** Step 6 — Create runtime boundary tests.

---

## Step 6 — Create runtime boundary tests

**Input:** The completed integer value-type implementation and the early WO-007 tests.

**Action:** Create focused tests in `value-types.test.ts` and migrate any superseded value-type tests out of `index.test.ts`.

**Editor commands:**

```text
code packages/domain/src/value-types.test.ts
code packages/domain/src/index.test.ts
```

---

## Step 6 — Create runtime boundary tests

**Input:** The completed integer value-type implementation from Step 4.

**Action:** Create `packages/domain/src/value-types.test.ts` using the supplied focused test suite.

**The tests will prove:**

- Valid minimum and maximum boundaries.
- Rejection of negative values where prohibited.
- Rejection of fractional, non-finite, and unsafe values.
- Checked cents addition and subtraction.
- Cents overflow and underflow rejection.
- Event-sequence and nonce increments.
- Increment overflow rejection.
- Less-than, equal, and greater-than comparisons.

**Editor command:** `code packages/domain/src/value-types.test.ts`

---

## Step 6 — Create the runtime test suites

**Input:** The completed integer value-type implementation and the existing WO-007 tests.

**Action:** Create the complete focused runtime test suite in `packages/domain/src/value-types.test.ts`.

**The focused tests cover:**

- Valid minimum and maximum boundaries.
- Negative, fractional, non-finite, and unsafe input rejection.
- Checked cents addition and subtraction.
- Arithmetic overflow and underflow rejection.
- Event-sequence and nonce increments.
- Increment overflow rejection.
- Less-than, equal, and greater-than comparisons.

**Editor command:** `code packages/domain/src/value-types.test.ts`

**Input:** The complete focused tests saved in Step 6A and the old WO-007 entrypoint tests.

**Action:** Replace `index.test.ts` with one focused test for the retained `describeAmount()` function.

**Reason:** Cents and seniority validation now belong to `value-types.test.ts`; retaining those tests in both files would duplicate responsibility.

**Editor command:** `code packages/domain/src/index.test.ts`

**Resulting focused value-type tests:**

```typescript
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
});```

**Resulting entrypoint test:**

```typescript
import { describe, expect, it } from "vitest";

import {
  cents,
  describeAmount,
} from "./index.js";

describe("domain package entrypoint", () => {
  it("describes an amount created as cents", () => {
    expect(describeAmount(cents(125))).toBe(
      "125 cents"
    );
  });
});```

**Test-definition inspection:**

```text
$ rg -n "describe\(|it\(" packages/domain/src/*.test.ts
packages/domain/src/value-types.test.ts:20:describe("Cents", () => {
packages/domain/src/value-types.test.ts:21:  it("accepts zero and safe positive integers", () => {
packages/domain/src/value-types.test.ts:40:  it("adds cents", () => {
packages/domain/src/value-types.test.ts:44:  it("subtracts cents", () => {
packages/domain/src/value-types.test.ts:50:  it("rejects addition overflow", () => {
packages/domain/src/value-types.test.ts:56:  it("rejects subtraction underflow", () => {
packages/domain/src/value-types.test.ts:62:  it("compares cents", () => {
packages/domain/src/value-types.test.ts:69:describe("BasisPoints", () => {
packages/domain/src/value-types.test.ts:70:  it("accepts its minimum and maximum boundaries", () => {
packages/domain/src/value-types.test.ts:87:  it("compares basis points", () => {
packages/domain/src/value-types.test.ts:111:describe("SeniorityPosition", () => {
packages/domain/src/value-types.test.ts:112:  it("accepts one as its minimum boundary", () => {
packages/domain/src/value-types.test.ts:128:  it("compares seniority positions", () => {
packages/domain/src/value-types.test.ts:152:describe("EventSequence", () => {
packages/domain/src/value-types.test.ts:153:  it("accepts zero as its minimum boundary", () => {
packages/domain/src/value-types.test.ts:168:  it("increments an event sequence", () => {
packages/domain/src/value-types.test.ts:172:  it("rejects increment overflow", () => {
packages/domain/src/value-types.test.ts:180:  it("compares event sequences", () => {
packages/domain/src/value-types.test.ts:204:describe("Nonce", () => {
packages/domain/src/value-types.test.ts:205:  it("accepts zero as its minimum boundary", () => {
packages/domain/src/value-types.test.ts:220:  it("increments a nonce", () => {
packages/domain/src/value-types.test.ts:224:  it("rejects increment overflow", () => {
packages/domain/src/value-types.test.ts:230:  it("compares nonces", () => {
packages/domain/src/index.test.ts:8:describe("domain package entrypoint", () => {
packages/domain/src/index.test.ts:9:  it("describes an amount created as cents", () => {
```

**Output:** Runtime responsibilities are separated between the focused value-type suite and the retained public-entrypoint behavior.

**Status:** Step 6 complete.

**Next:** Step 7 — Run focused runtime verification.

---

## Step 7 — Run focused runtime verification

**Input:** The value-type implementation, exports, and focused tests.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- --run value-types.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run value-types.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 28[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m50 passed[39m[22m[90m (50)[39m
[2m   Start at [22m 16:53:43
[2m   Duration [22m 231ms[2m (transform 66ms, setup 0ms, import 85ms, tests 28ms, environment 0ms)[22m

```

**Output:** The integer value types pass their focused runtime boundary tests.

**Status:** Step 7 complete.

**Next:** Step 8 — Add compile-time type-separation tests.

---

## Step 8 — Add compile-time type-separation tests

**Input:** Five publicly exported branded integer types.

**Action:** Create compile-time assertions in `packages/domain/src/value-types.type-test.ts`.

**Editor command:** `code packages/domain/src/value-types.type-test.ts`

---

## Step 8 — Add compile-time type-separation tests

**Input:** The five publicly exported branded integer types and their type-specific operations.

**Action:** Create `packages/domain/src/value-types.type-test.ts` using the supplied compile-time assertions.

**The assertions must prove:**

- Plain numbers are not branded domain values.
- Different branded integer types are not interchangeable.
- Type-specific helpers reject values carrying the wrong brand.
- Every `@ts-expect-error` corresponds to a real compiler error.

**Editor command:** `code packages/domain/src/value-types.type-test.ts`

**Resulting compile-time test:**

```typescript
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
  nonce,
  seniorityPosition,
} from "./value-types.js";

import type {
  BasisPoints,
  Cents,
  EventSequence,
  Nonce,
  SeniorityPosition,
} from "./value-types.js";

const centsValue = cents(100);
const basisPointsValue = basisPoints(100);
const seniorityValue = seniorityPosition(1);
const eventSequenceValue = eventSequence(0);
const nonceValue = nonce(0);

const plainNumber = 1;

// Plain numbers must pass through runtime constructors.

// @ts-expect-error A plain number is not Cents.
const centsFromNumber: Cents = plainNumber;

// @ts-expect-error A plain number is not BasisPoints.
const basisPointsFromNumber: BasisPoints = plainNumber;

// @ts-expect-error A plain number is not a SeniorityPosition.
const seniorityFromNumber: SeniorityPosition =
  plainNumber;

// @ts-expect-error A plain number is not an EventSequence.
const eventSequenceFromNumber: EventSequence =
  plainNumber;

// @ts-expect-error A plain number is not a Nonce.
const nonceFromNumber: Nonce = plainNumber;

// Different branded integer concepts are not interchangeable.

// @ts-expect-error BasisPoints cannot be assigned to Cents.
const centsFromBasisPoints: Cents = basisPointsValue;

// @ts-expect-error Cents cannot be assigned to BasisPoints.
const basisPointsFromCents: BasisPoints = centsValue;

// @ts-expect-error BasisPoints are not seniority positions.
const seniorityFromBasisPoints: SeniorityPosition =
  basisPointsValue;

// @ts-expect-error Nonce is not an event sequence.
const eventSequenceFromNonce: EventSequence =
  nonceValue;

// @ts-expect-error EventSequence is not a nonce.
const nonceFromEventSequence: Nonce =
  eventSequenceValue;

// Operations accept only values with the correct brand.

// @ts-expect-error Cents addition cannot accept BasisPoints.
addCents(centsValue, basisPointsValue);

// @ts-expect-error Cents comparison cannot accept a Nonce.
compareCents(centsValue, nonceValue);

// @ts-expect-error BasisPoints comparison cannot accept Cents.
compareBasisPoints(basisPointsValue, centsValue);

// @ts-expect-error Seniority comparison cannot accept EventSequence.
compareSeniorityPositions(
  seniorityValue,
  eventSequenceValue
);

// @ts-expect-error EventSequence comparison cannot accept Nonce.
compareEventSequences(
  eventSequenceValue,
  nonceValue
);

// @ts-expect-error Nonce comparison cannot accept EventSequence.
compareNonces(nonceValue, eventSequenceValue);

void [
  centsFromNumber,
  basisPointsFromNumber,
  seniorityFromNumber,
  eventSequenceFromNumber,
  nonceFromNumber,
  centsFromBasisPoints,
  basisPointsFromCents,
  seniorityFromBasisPoints,
  eventSequenceFromNonce,
  nonceFromEventSequence,
];```

**Directive inspection:**

```text
$ rg -n "@ts-expect-error" packages/domain/src/value-types.type-test.ts
33:// @ts-expect-error A plain number is not Cents.
36:// @ts-expect-error A plain number is not BasisPoints.
39:// @ts-expect-error A plain number is not a SeniorityPosition.
43:// @ts-expect-error A plain number is not an EventSequence.
47:// @ts-expect-error A plain number is not a Nonce.
52:// @ts-expect-error BasisPoints cannot be assigned to Cents.
55:// @ts-expect-error Cents cannot be assigned to BasisPoints.
58:// @ts-expect-error BasisPoints are not seniority positions.
62:// @ts-expect-error Nonce is not an event sequence.
66:// @ts-expect-error EventSequence is not a nonce.
72:// @ts-expect-error Cents addition cannot accept BasisPoints.
75:// @ts-expect-error Cents comparison cannot accept a Nonce.
78:// @ts-expect-error BasisPoints comparison cannot accept Cents.
81:// @ts-expect-error Seniority comparison cannot accept EventSequence.
87:// @ts-expect-error EventSequence comparison cannot accept Nonce.
93:// @ts-expect-error Nonce comparison cannot accept EventSequence.
```

**Output:** The compile-time assertions are saved and every intentional invalid assignment or call is explicitly marked.

**Status:** Step 8B complete.

**Next:** Step 8C — Execute the domain typecheck.

**Input:** The saved `value-types.type-test.ts` compile-time assertions.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/value-types.type-test.ts(81,1): error TS2578: Unused '@ts-expect-error' directive.
src/value-types.type-test.ts(84,3): error TS2345: Argument of type 'EventSequence' is not assignable to parameter of type 'SeniorityPosition'.
  Type 'EventSequence' is not assignable to type '{ readonly [seniorityPositionBrand]: "SeniorityPosition"; }'.
    Property '[seniorityPositionBrand]' is missing in type 'Number & { readonly [eventSequenceBrand]: "EventSequence"; }' but required in type '{ readonly [seniorityPositionBrand]: "SeniorityPosition"; }'.
src/value-types.type-test.ts(87,1): error TS2578: Unused '@ts-expect-error' directive.
src/value-types.type-test.ts(90,3): error TS2345: Argument of type 'Nonce' is not assignable to parameter of type 'EventSequence'.
  Type 'Nonce' is not assignable to type '{ readonly [eventSequenceBrand]: "EventSequence"; }'.
    Property '[eventSequenceBrand]' is missing in type 'Number & { readonly [nonceBrand]: "Nonce"; }' but required in type '{ readonly [eventSequenceBrand]: "EventSequence"; }'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 8C — Correct and rerun the compile-time assertions

**Correction:** The previous run placed three `@ts-expect-error` directives above multiline function calls. The directives were moved directly above the invalid argument lines where TypeScript reports the errors.

**Previous status correction:** The earlier completion marker was printed incorrectly. Step 8 was not complete because the typecheck failed.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** TypeScript confirms that the branded integer types remain distinct and every intentional type error is detected.

**Status:** Step 8 complete.

**Next:** Step 9 — Prove fractional currency input is rejected.

---

## Step 9 — Prove fractional currency input is rejected

**Input:** The passing focused runtime test suite.

**Temporary action:** Change one focused test so it incorrectly requires `cents(10.5)` to succeed.

**Expected result:** The focused test command must return a nonzero status.

**Editor command:** `code packages/domain/src/value-types.test.ts`

---

## Step 9 — Prove fractional currency input is rejected

**Input:** The passing focused runtime suite from Step 7 and the passing compile-time assertions from Step 8.

**Temporary action:** Add one test that incorrectly expects `cents(10.5)` to return `10.5`.

**Expected result:** The focused Vitest command must return a nonzero status because `cents(10.5)` throws an error.

**Temporary test to add:**

```typescript
it("TEMPORARY: incorrectly accepts fractional cents", () => {
  expect(cents(10.5)).toBe(10.5);
});
```

**Editor command:** `code packages/domain/src/value-types.test.ts`

**Temporary-test inspection:**

```text
$ rg -n "TEMPORARY: incorrectly accepts fractional cents" packages/domain/src/value-types.test.ts
237:it("TEMPORARY: incorrectly accepts fractional cents", () => {
```

**Expected-failure command and output:**

```text
$ npm test --workspace packages/domain -- --run value-types.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run value-types.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/value-types.test.ts [2m([22m[2m51 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 16[2mms[22m[39m
     [32m✓[39m accepts zero and safe positive integers[32m 2[2mms[22m[39m
     [32m✓[39m rejects invalid value -1[32m 1[2mms[22m[39m
     [32m✓[39m rejects invalid value 0.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m adds cents[32m 0[2mms[22m[39m
     [32m✓[39m subtracts cents[32m 0[2mms[22m[39m
     [32m✓[39m rejects addition overflow[32m 0[2mms[22m[39m
     [32m✓[39m rejects subtraction underflow[32m 0[2mms[22m[39m
     [32m✓[39m compares cents[32m 0[2mms[22m[39m
     [32m✓[39m accepts its minimum and maximum boundaries[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 10001[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m compares basis points[32m 2[2mms[22m[39m
     [32m✓[39m accepts one as its minimum boundary[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 0[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m compares seniority positions[32m 0[2mms[22m[39m
     [32m✓[39m accepts zero as its minimum boundary[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 0.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m increments an event sequence[32m 0[2mms[22m[39m
     [32m✓[39m rejects increment overflow[32m 0[2mms[22m[39m
     [32m✓[39m compares event sequences[32m 0[2mms[22m[39m
     [32m✓[39m accepts zero as its minimum boundary[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 0.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value -Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid value 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m increments a nonce[32m 0[2mms[22m[39m
     [32m✓[39m rejects increment overflow[32m 0[2mms[22m[39m
     [32m✓[39m compares nonces[32m 0[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: incorrectly accepts fractional cents[39m[32m 3[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/value-types.test.ts[2m > [22mTEMPORARY: incorrectly accepts fractional cents
[31m[1mRangeError[22m: Cents must be a safe integer[39m
[36m [2m❯[22m requireSafeInteger src/value-types.ts:[2m26:11[22m[39m
    [90m 24|[39m )[33m:[39m [35mvoid[39m {
    [90m 25|[39m   [35mif[39m ([33m![39m[33mNumber[39m[33m.[39m[34misSafeInteger[39m(value)) {
    [90m 26|[39m     [35mthrow[39m [35mnew[39m [33mRangeError[39m([32m`[39m[36m${[39mname[36m}[39m[32m must be a safe integer`[39m)[33m;[39m
    [90m   |[39m           [31m^[39m
    [90m 27|[39m   }
    [90m 28|[39m }
[90m [2m❯[22m cents src/value-types.ts:[2m43:3[22m[39m
[90m [2m❯[22m src/value-types.test.ts:[2m238:10[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m50 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 17:13:30
[2m   Duration [22m 274ms[2m (transform 79ms, setup 0ms, import 99ms, tests 16ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run value-types.test.ts
```

**Observed result:** Vitest returned a nonzero status because the temporary test incorrectly required fractional cents to succeed.

**Status:** Expected failure confirmed; restoration is now required.

**Next:** Step 9C — Remove the exact temporary test.

**Input:** The confirmed expected failure from Step 9B.

**Restoration action:** Delete only the temporary test added in Step 9A.

**Delete this exact block:**

```typescript
it("TEMPORARY: incorrectly accepts fractional cents", () => {
  expect(cents(10.5)).toBe(10.5);
});
```

**Editor command:** `code packages/domain/src/value-types.test.ts`

**Restoration inspection:**

```text
$ rg -n "TEMPORARY: incorrectly accepts fractional cents" packages/domain/src/value-types.test.ts
[temporary test not found]
```

**Restored-suite command and output:**

```text
$ npm test --workspace packages/domain -- --run value-types.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run value-types.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 11[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m50 passed[39m[22m[90m (50)[39m
[2m   Start at [22m 17:14:07
[2m   Duration [22m 253ms[2m (transform 77ms, setup 0ms, import 97ms, tests 11ms, environment 0ms)[22m

```

**Output:** The temporary incorrect expectation is absent and the complete focused value-type suite passes again.

**Status:** Step 9 complete.

**Next:** Step 10 — Verify the complete domain package.

---

## Step 10 — Verify the complete domain package

**Input:** The restored implementation, exports, runtime tests, and compile-time tests.

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
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 17:14:23
[2m   Duration [22m 197ms[2m (transform 63ms, setup 0ms, import 91ms, tests 17ms, environment 0ms)[22m

```

**Output:** The complete domain package typechecks, builds, and passes all tests.

**Status:** Step 10 complete.

**Next:** Step 11 — Verify the complete workspace.

---

## Step 11 — Verify the complete workspace and Foundry scaffold

**Input:** The passing domain package with the completed integer vocabulary.

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
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 12[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 17:14:40
[2m   Duration [22m 214ms[2m (transform 78ms, setup 0ms, import 144ms, tests 15ms, environment 0ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 17:14:40
[2m   Duration [22m 214ms[2m (transform 53ms, setup 0ms, import 71ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 261.38µs (38.07µs CPU time)

Ran 1 test suite in 6.92ms (261.38µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Output:** The TypeScript workspace and independent Solidity environment remain green after WO-010.

**Status:** Step 11 complete.

**Next:** Step 12 — Retest the event logger.

---

## Step 12 — Retest the adjacent event logger

**Input:** The complete passing WO-010 domain implementation.

**Commands and output:**

```text
$ cd ../event-logger && npm test -- --run

> event-logger@0.0.0 test
> vitest --run


 RUN  v3.2.4 /home/mike/code/local-coordination-protocol/code/event-logger

Using secrets defined in .dev.vars
[vpw:debug] Adding `enable_nodejs_tty_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_fs_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_http_modules` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_perf_hooks_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:info] Starting isolated runtimes for vitest.config.js...
[mf:warn] The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2026-03-10",
but you've requested "2026-05-30". Falling back to "2026-03-10"...
 ✓ test/index.spec.js (4 tests) 158ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  17:14:56
   Duration  1.70s (transform 43ms, setup 0ms, collect 69ms, tests 158ms, environment 0ms, prepare 146ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** The adjacent event logger remains green and independent of the new Economic Union value types.

**Status:** Step 12 complete.

**Next:** Step 13 — Inspect and summarize WO-010.

---

## Step 13 — Inspect and summarize WO-010

**Input:** The verified integer value-type implementation and tests from Steps 1–12.

**Repository inspection:**

```text
$ git status --short
 M docs/work-orders/WO-010-execution.md
 M packages/domain/src/value-types.test.ts

$ git diff --check
code/economic-union/packages/domain/src/value-types.test.ts:236: new blank line at EOF.
---

## Step 14 — Stage only WO-010

**Input:** The reviewed integer value-type source, tests, exports, and execution record.

**Action:** Stage only explicit WO-010 paths.

**Staging commands and output:**

```text
$ git diff --cached --check
code/economic-union/packages/domain/src/value-types.test.ts:236: new blank line at EOF.
---

## Step 15 — Final verification and commit authorization

**Input:** The explicitly staged WO-010 implementation, tests, exports, and execution record.

**Final verification:**

```text
$ cd code/economic-union && npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ cd code/economic-union && npm run build

> @lcp/economic-union@1.0.0 build
> npm run build --workspaces --if-present


> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


> @lcp/protocol@1.0.0 build
> tsc -p tsconfig.json


$ cd code/economic-union && npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 36[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 17:15:40
[2m   Duration [22m 266ms[2m (transform 150ms, setup 0ms, import 190ms, tests 39ms, environment 0ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 17:15:40
[2m   Duration [22m 195ms[2m (transform 46ms, setup 0ms, import 61ms, tests 3ms, environment 0ms)[22m


$ cd code/economic-union/contracts && forge fmt --check

$ cd code/economic-union/contracts && forge build
No files changed, compilation skipped

$ cd code/economic-union/contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 254.53µs (30.10µs CPU time)

Ran 1 test suite in 8.80ms (254.53µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

$ git diff --cached --check
code/economic-union/packages/domain/src/value-types.test.ts:236: new blank line at EOF.
