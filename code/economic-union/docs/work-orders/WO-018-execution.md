# WO-018 Execution Record — Implement Union Backing Pool Aggregation

## Purpose

Aggregate eligible WO-017 Property capacity contributions into one immutable Union Backing Pool total.

---

## Step 1 — Confirm WO-017 and initialize the execution record

**Input:** The committed and verified WO-017 Property capacity contribution implementation.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-018-execution.md

$ git log -3 --oneline --decorate
83cd1d1 (HEAD -> main) feat(domain): add property capacity contribution
92b24db feat(domain): add property capacity contribution
6bff4a1 (origin/main) end of WO-16

$ git diff --check

$ test -f packages/domain/src/property-capacity.ts
[property-capacity.ts exists]

$ test -f packages/domain/src/property-capacity.test.ts
[property-capacity.test.ts exists]

$ test -f packages/domain/src/property-capacity.type-test.ts
[property-capacity.type-test.ts exists]

$ test -f packages/domain/src/property-capacity-public.test.ts
[property-capacity-public.test.ts exists]

$ rg -n "PropertyCapacityContribution|calculatePropertyCapacityContribution|contributionCents" packages/domain/src/property-capacity.ts
30:export interface PropertyCapacityContribution {
38:  readonly contributionCents: Cents;
43:  PropertyCapacityContribution,
82:export function calculatePropertyCapacityContribution(
87:): PropertyCapacityContribution {
94:  const contributionCents =
116:    contributionCents,
141:    calculatePropertyCapacityContribution(
149:export function currentPropertyCapacityContribution(
165:    calculatePropertyCapacityContribution(

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

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 20[2mms[22m[39m

[2m Test Files [22m [1m[32m12 passed[39m[22m[90m (12)[39m
[2m      Tests [22m [1m[32m251 passed[39m[22m[90m (251)[39m
[2m   Start at [22m 14:14:57
[2m   Duration [22m 366ms[2m (transform 1.22s, setup 0ms, import 1.80s, tests 172ms, environment 2ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 14:14:58
[2m   Duration [22m 221ms[2m (transform 52ms, setup 0ms, import 68ms, tests 3ms, environment 0ms)[22m

```

**Output:** The WO-017 files, public contract, repository state, and passing workspace baseline are recorded before WO-018 changes begin.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the current aggregation boundary.

---

## Step 2 — Inspect the current aggregation boundary

**Input:** The passing WO-017 domain package.

**Commands and output:**

```text
$ sed -n "1,260p" packages/domain/src/property-capacity.ts
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";
import type { PropertyId } from "./identifiers.js";
import {
  currentEffectivePropertyValuation,
  effectivePropertyValuationAt,
  type EffectivePropertyValuation,
  type PropertyValuationHistory,
} from "./valuations.js";
import {
  basisPoints,
  cents,
  compareCents,
  subtractCents,
  type BasisPoints,
  type Cents,
  type EventSequence,
} from "./value-types.js";

export const PROTOTYPE_PROPERTY_CAPACITY_RATE =
  basisPoints(6_000);

export type PropertyCapacityRoundingMode = "floor";

export interface PropertyCapacityContribution {
  readonly propertyId: PropertyId;
  readonly valuationProposalSequence: EventSequence;
  readonly valuationApprovalSequence: EventSequence;
  readonly approvedValueCents: Cents;
  readonly capacityRate: BasisPoints;
  readonly grossCapacityBoundaryCents: Cents;
  readonly recognizedSeniorDebtCents: Cents;
  readonly contributionCents: Cents;
  readonly roundingMode: PropertyCapacityRoundingMode;
}

type CapacityResult = DomainResult<
  PropertyCapacityContribution,
  DomainError<"not-found">
>;

function floorCentsAtBasisPoints(
  valueCents: Cents,
  rate: BasisPoints,
): Cents {
  const wholeTenThousands = Math.floor(
    valueCents / 10_000,
  );
  const remainder = valueCents % 10_000;

  const scaledWhole = wholeTenThousands * rate;
  const scaledRemainder = Math.floor(
    (remainder * rate) / 10_000,
  );

  return cents(scaledWhole + scaledRemainder);
}

function missingApprovedValuation(
  propertyId: PropertyId,
  sequence?: EventSequence,
): CapacityResult {
  const details =
    sequence === undefined
      ? { propertyId }
      : { propertyId, atSequence: sequence };

  return domainFailure(
    domainError(
      "not-found",
      "No approved Property valuation is effective for the requested capacity calculation.",
      details,
    ),
  );
}

export function calculatePropertyCapacityContribution(
  valuation: EffectivePropertyValuation,
  recognizedSeniorDebtCents: Cents,
  capacityRate: BasisPoints =
    PROTOTYPE_PROPERTY_CAPACITY_RATE,
): PropertyCapacityContribution {
  const grossCapacityBoundaryCents =
    floorCentsAtBasisPoints(
      valuation.approvedValueCents,
      capacityRate,
    );

  const contributionCents =
    compareCents(
      grossCapacityBoundaryCents,
      recognizedSeniorDebtCents,
    ) <= 0
      ? cents(0)
      : subtractCents(
          grossCapacityBoundaryCents,
          recognizedSeniorDebtCents,
        );

  return Object.freeze({
    propertyId: valuation.propertyId,
    valuationProposalSequence:
      valuation.proposalSequence,
    valuationApprovalSequence:
      valuation.approvalSequence,
    approvedValueCents:
      valuation.approvedValueCents,
    capacityRate,
    grossCapacityBoundaryCents,
    recognizedSeniorDebtCents,
    contributionCents,
    roundingMode: "floor",
  });
}

export function propertyCapacityContributionAt(
  history: PropertyValuationHistory,
  sequence: EventSequence,
  recognizedSeniorDebtCents: Cents,
  capacityRate: BasisPoints =
    PROTOTYPE_PROPERTY_CAPACITY_RATE,
): CapacityResult {
  const valuation = effectivePropertyValuationAt(
    history,
    sequence,
  );

  if (valuation === undefined) {
    return missingApprovedValuation(
      history.propertyId,
      sequence,
    );
  }

  return domainSuccess(
    calculatePropertyCapacityContribution(
      valuation,
      recognizedSeniorDebtCents,
      capacityRate,
    ),
  );
}

export function currentPropertyCapacityContribution(
  history: PropertyValuationHistory,
  recognizedSeniorDebtCents: Cents,
  capacityRate: BasisPoints =
    PROTOTYPE_PROPERTY_CAPACITY_RATE,
): CapacityResult {
  const valuation =
    currentEffectivePropertyValuation(history);

  if (valuation === undefined) {
    return missingApprovedValuation(
      history.propertyId,
    );
  }

  return domainSuccess(
    calculatePropertyCapacityContribution(
      valuation,
      recognizedSeniorDebtCents,
      capacityRate,
    ),
  );
}

$ rg -n "export type PropertyId|export function deterministicTestId" packages/domain/src/identifiers.ts
16:export type PropertyId = string & {
162:export function deterministicTestId<K extends IdentifierKind>(

$ rg -n "PROPERTY_STATUS_VALUES|export type PropertyStatus|export function propertyStatus" packages/domain/src/domain-statuses.ts
17:export const PROPERTY_STATUS_VALUES = [
60:type PropertyStatusValue = (typeof PROPERTY_STATUS_VALUES)[number];
68:export type PropertyStatus = PropertyStatusValue & {
121:  property: PROPERTY_STATUS_VALUES,
182:export function propertyStatus(value: string): PropertyStatus {

$ rg -n "invalid-input|already-exists|domainError|domainFailure|domainSuccess" packages/domain/src/domain-errors.ts
2:  "invalid-input",
4:  "already-exists",
50:export function domainErrorCode(value: string): DomainErrorCode {
60:export function domainError<C extends DomainErrorCode>(
85:export function domainSuccess<T>(value: T): DomainSuccess<T> {
92:export function domainFailure<E extends DomainError>(

$ rg -n "export type Cents|export function cents" packages/domain/src/value-types.ts
7:export type Cents = number & { readonly [centsBrand]: "Cents" };
42:export function cents(value: number): Cents {

$ sed -n "1,220p" packages/domain/src/index.ts
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
export * from "./properties.js";
export * from "./valuations.js";
export * from "./property-capacity.js";

$ rg -n "UnionBackingPool|Backing Pool|pool aggregation" packages/domain/src || true
```

**Output:** WO-017 contribution data, Property identity, status, result, cents, export, and existing-pool boundaries are visible before editing.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the aggregation contract.

---

## Step 3 — Record the aggregation contract

**Input:** The master-plan WO-018 requirement, canonical scenario, and inspected WO-017 API.

**Contract:**

- Consume PropertyCapacityContribution; do not recalculate WO-017 arithmetic.
- Require the input PropertyId to match the contribution PropertyId.
- Count only active Property contributions.
- Keep non-active and zero-contribution Properties visible in the result.
- Reject duplicate PropertyId values instead of counting or silently deduplicating them.
- Accept a total exactly at Number.MAX_SAFE_INTEGER.
- Reject a total that would exceed the safe-integer cents boundary.
- Sort output entries by PropertyId for deterministic inspection.
- Freeze the pool, entry array, and each entry.
- Create no deposits, issued supply, claims, seniority, utilization, or health state.

**Canonical calculation:**

```text
Property A: 20,000,000 cents
Property B: 13,000,000 cents
Pool total: 33,000,000 cents = $330,000
```

**Output:** The bounded implementation and verification contract is explicit.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the aggregation implementation.

---

## Step 4 — Create the Union Backing Pool implementation

**Input:** The aggregation contract recorded in Step 3.

**Commands and output:**

```text
$ cat > packages/domain/src/union-backing-pool.ts <<EOF

$ sed -n "1,360p" packages/domain/src/union-backing-pool.ts
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";
import type { PropertyId } from "./identifiers.js";
import type { PropertyStatus } from "./domain-statuses.js";
import type {
  PropertyCapacityContribution,
} from "./property-capacity.js";
import {
  cents,
  type Cents,
} from "./value-types.js";

export interface UnionBackingPoolContributionInput {
  readonly propertyId: PropertyId;
  readonly propertyStatus: PropertyStatus;
  readonly contribution: PropertyCapacityContribution;
}

export interface UnionBackingPoolPropertyCapacity {
  readonly propertyId: PropertyId;
  readonly propertyStatus: PropertyStatus;
  readonly sourceContributionCents: Cents;
  readonly eligibleContributionCents: Cents;
  readonly includedInTotal: boolean;
}

export interface UnionBackingPool {
  readonly propertyCapacities:
    readonly UnionBackingPoolPropertyCapacity[];
  readonly totalCapacityCents: Cents;
}

export type UnionBackingPoolAggregationError =
  | DomainError<"invalid-input">
  | DomainError<"already-exists">;

export type UnionBackingPoolAggregationResult =
  DomainResult<
    UnionBackingPool,
    UnionBackingPoolAggregationError
  >;

function invalidAggregationInput(
  message: string,
  details: Readonly<Record<string, unknown>>,
): UnionBackingPoolAggregationResult {
  return domainFailure(
    domainError(
      "invalid-input",
      message,
      details,
    ),
  );
}

function duplicateProperty(
  propertyId: PropertyId,
  firstIndex: number,
  duplicateIndex: number,
): UnionBackingPoolAggregationResult {
  return domainFailure(
    domainError(
      "already-exists",
      "A Property may appear only once in one Union Backing Pool aggregation.",
      {
        propertyId,
        firstIndex,
        duplicateIndex,
      },
    ),
  );
}

function comparePropertyIds(
  left: PropertyId,
  right: PropertyId,
): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

export function aggregateUnionBackingPoolCapacity(
  inputs: readonly UnionBackingPoolContributionInput[],
): UnionBackingPoolAggregationResult {
  const firstIndexByProperty =
    new Map<PropertyId, number>();
  const propertyCapacities:
    UnionBackingPoolPropertyCapacity[] = [];

  let totalCapacity = 0;

  for (const [index, input] of inputs.entries()) {
    if (
      input.propertyId !==
      input.contribution.propertyId
    ) {
      return invalidAggregationInput(
        "The pool input PropertyId must match the WO-017 contribution PropertyId.",
        {
          path: `inputs[${index}].propertyId`,
          propertyId: input.propertyId,
          contributionPropertyId:
            input.contribution.propertyId,
        },
      );
    }

    const firstIndex =
      firstIndexByProperty.get(input.propertyId);

    if (firstIndex !== undefined) {
      return duplicateProperty(
        input.propertyId,
        firstIndex,
        index,
      );
    }

    firstIndexByProperty.set(
      input.propertyId,
      index,
    );

    const includedInTotal =
      input.propertyStatus === "active";
    const eligibleContributionCents =
      includedInTotal
        ? input.contribution.contributionCents
        : cents(0);

    if (
      eligibleContributionCents >
      Number.MAX_SAFE_INTEGER - totalCapacity
    ) {
      return invalidAggregationInput(
        "The Union Backing Pool total exceeds the safe-integer cents boundary.",
        {
          path:
            `inputs[${index}].contribution.contributionCents`,
          propertyId: input.propertyId,
          runningTotalCents: totalCapacity,
          nextContributionCents:
            eligibleContributionCents,
          maximumSafeInteger:
            Number.MAX_SAFE_INTEGER,
        },
      );
    }

    totalCapacity += eligibleContributionCents;

    propertyCapacities.push(
      Object.freeze({
        propertyId: input.propertyId,
        propertyStatus: input.propertyStatus,
        sourceContributionCents:
          input.contribution.contributionCents,
        eligibleContributionCents,
        includedInTotal,
      }),
    );
  }

  propertyCapacities.sort((left, right) =>
    comparePropertyIds(
      left.propertyId,
      right.propertyId,
    ),
  );

  return domainSuccess(
    Object.freeze({
      propertyCapacities:
        Object.freeze(propertyCapacities),
      totalCapacityCents: cents(totalCapacity),
    }),
  );
}

$ rg -n "^export (interface|type|function)" packages/domain/src/union-backing-pool.ts
18:export interface UnionBackingPoolContributionInput {
24:export interface UnionBackingPoolPropertyCapacity {
32:export interface UnionBackingPool {
38:export type UnionBackingPoolAggregationError =
42:export type UnionBackingPoolAggregationResult =
94:export function aggregateUnionBackingPoolCapacity(
```

**Output:** A pure, immutable, duplicate-safe, overflow-safe pool aggregation function exists.

**Status:** Step 4 complete.

**Next:** Step 5 — Create runtime and boundary tests.

---

## Step 5 — Create runtime and boundary tests

**Input:** The implementation from Step 4.

**Commands and output:**

```text
$ cat > packages/domain/src/union-backing-pool.test.ts <<EOF

$ rg -n "it\(|it.each" packages/domain/src/union-backing-pool.test.ts
83:  it("returns zero for zero Properties", () => {
90:  it("returns one active Property contribution", () => {
114:  it("sums canonical Properties A and B to $330,000", () => {
142:  it("sums multiple active contributions exactly once", () => {
159:  it("keeps an active zero-contribution Property visible without changing the total", () => {
184:  it.each([
215:  it("rejects a mismatched PropertyId and contribution PropertyId", () => {
250:  it("rejects duplicate Property identity instead of double counting", () => {
286:  it("rejects duplicate identity even when the contribution is zero", () => {
309:  it("accepts a total exactly at Number.MAX_SAFE_INTEGER", () => {
333:  it("rejects a total that would exceed Number.MAX_SAFE_INTEGER", () => {
375:  it("produces the same total and canonical entry order regardless of input order", () => {
412:  it("returns a deeply frozen aggregation result", () => {
431:  it("does not mutate the input array or WO-017 contribution", () => {
454:  it("does not create issued supply, claims, or seniority", () => {

$ sed -n "1,760p" packages/domain/src/union-backing-pool.test.ts
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  aggregateUnionBackingPoolCapacity,
  type UnionBackingPoolContributionInput,
} from "./union-backing-pool.js";
import {
  calculatePropertyCapacityContribution,
  type PropertyCapacityContribution,
} from "./property-capacity.js";
import {
  propertyStatus,
} from "./domain-statuses.js";
import {
  deterministicTestId,
  type PropertyId,
} from "./identifiers.js";
import type {
  EffectivePropertyValuation,
} from "./valuations.js";
import {
  basisPoints,
  cents,
  eventSequence,
} from "./value-types.js";

function contribution(
  propertyNumber: number,
  approvedValueCents: number,
  recognizedSeniorDebtCents: number,
  rateBasisPoints = 6_000,
): PropertyCapacityContribution {
  const valuation: EffectivePropertyValuation =
    Object.freeze({
      propertyId:
        deterministicTestId(
          "property",
          propertyNumber,
        ),
      proposalSequence: eventSequence(10),
      approvalSequence: eventSequence(11),
      approvedValueCents:
        cents(approvedValueCents),
    });

  return calculatePropertyCapacityContribution(
    valuation,
    cents(recognizedSeniorDebtCents),
    basisPoints(rateBasisPoints),
  );
}

function input(
  status: string,
  capacity: PropertyCapacityContribution,
  propertyId: PropertyId = capacity.propertyId,
): UnionBackingPoolContributionInput {
  return Object.freeze({
    propertyId,
    propertyStatus: propertyStatus(status),
    contribution: capacity,
  });
}

function requirePool(
  inputs: readonly UnionBackingPoolContributionInput[],
) {
  const result =
    aggregateUnionBackingPoolCapacity(inputs);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe("Union Backing Pool aggregation", () => {
  it("returns zero for zero Properties", () => {
    const pool = requirePool([]);

    expect(pool.totalCapacityCents).toBe(0);
    expect(pool.propertyCapacities).toEqual([]);
  });

  it("returns one active Property contribution", () => {
    const propertyA = contribution(
      1,
      50_000_000,
      10_000_000,
    );

    const pool = requirePool([
      input("active", propertyA),
    ]);

    expect(pool.totalCapacityCents).toBe(
      20_000_000,
    );
    expect(
      pool.propertyCapacities[0],
    ).toMatchObject({
      propertyId: propertyA.propertyId,
      sourceContributionCents: 20_000_000,
      eligibleContributionCents: 20_000_000,
      includedInTotal: true,
    });
  });

  it("sums canonical Properties A and B to $330,000", () => {
    const propertyA = contribution(
      1,
      50_000_000,
      10_000_000,
    );
    const propertyB = contribution(
      2,
      30_000_000,
      5_000_000,
    );

    const pool = requirePool([
      input("active", propertyA),
      input("active", propertyB),
    ]);

    expect(
      propertyA.contributionCents,
    ).toBe(20_000_000);
    expect(
      propertyB.contributionCents,
    ).toBe(13_000_000);
    expect(pool.totalCapacityCents).toBe(
      33_000_000,
    );
  });

  it("sums multiple active contributions exactly once", () => {
    const capacities = [
      contribution(1, 100, 0, 10_000),
      contribution(2, 200, 0, 10_000),
      contribution(3, 300, 0, 10_000),
    ];

    const pool = requirePool(
      capacities.map((capacity) =>
        input("active", capacity),
      ),
    );

    expect(pool.totalCapacityCents).toBe(600);
    expect(pool.propertyCapacities).toHaveLength(3);
  });

  it("keeps an active zero-contribution Property visible without changing the total", () => {
    const zero = contribution(1, 0, 0);
    const positive = contribution(
      2,
      1_000,
      0,
      10_000,
    );

    const pool = requirePool([
      input("active", zero),
      input("active", positive),
    ]);

    expect(pool.totalCapacityCents).toBe(1_000);
    expect(
      pool.propertyCapacities[0],
    ).toMatchObject({
      propertyId: zero.propertyId,
      sourceContributionCents: 0,
      eligibleContributionCents: 0,
      includedInTotal: true,
    });
  });

  it.each([
    "proposed",
    "suspended",
    "rejected",
    "liquidating",
    "closed",
  ])(
    "counts a %s Property as zero eligible capacity",
    (status) => {
      const capacity = contribution(
        1,
        10_000,
        0,
        10_000,
      );

      const pool = requirePool([
        input(status, capacity),
      ]);

      expect(pool.totalCapacityCents).toBe(0);
      expect(
        pool.propertyCapacities[0],
      ).toMatchObject({
        sourceContributionCents: 10_000,
        eligibleContributionCents: 0,
        includedInTotal: false,
      });
    },
  );

  it("rejects a mismatched PropertyId and contribution PropertyId", () => {
    const capacity = contribution(
      1,
      10_000,
      0,
      10_000,
    );

    const result =
      aggregateUnionBackingPoolCapacity([
        input(
          "active",
          capacity,
          deterministicTestId("property", 2),
        ),
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected mismatched Property identity to fail",
      );
    }

    expect(result.error.code).toBe(
      "invalid-input",
    );
    expect(result.error.details).toMatchObject({
      path: "inputs[0].propertyId",
      contributionPropertyId:
        capacity.propertyId,
    });
  });

  it("rejects duplicate Property identity instead of double counting", () => {
    const capacity = contribution(
      1,
      10_000,
      0,
      10_000,
    );
    const duplicate = input(
      "active",
      capacity,
    );

    const result =
      aggregateUnionBackingPoolCapacity([
        duplicate,
        duplicate,
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected duplicate Property to fail",
      );
    }

    expect(result.error.code).toBe(
      "already-exists",
    );
    expect(result.error.details).toMatchObject({
      propertyId: capacity.propertyId,
      firstIndex: 0,
      duplicateIndex: 1,
    });
  });

  it("rejects duplicate identity even when the contribution is zero", () => {
    const zero = contribution(1, 0, 0);
    const duplicate = input("active", zero);

    const result =
      aggregateUnionBackingPoolCapacity([
        duplicate,
        duplicate,
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected duplicate zero contribution to fail",
      );
    }

    expect(result.error.code).toBe(
      "already-exists",
    );
  });

  it("accepts a total exactly at Number.MAX_SAFE_INTEGER", () => {
    const almostMaximum = contribution(
      1,
      Number.MAX_SAFE_INTEGER - 10,
      0,
      10_000,
    );
    const finalTen = contribution(
      2,
      10,
      0,
      10_000,
    );

    const pool = requirePool([
      input("active", almostMaximum),
      input("active", finalTen),
    ]);

    expect(pool.totalCapacityCents).toBe(
      Number.MAX_SAFE_INTEGER,
    );
  });

  it("rejects a total that would exceed Number.MAX_SAFE_INTEGER", () => {
    const maximum = contribution(
      1,
      Number.MAX_SAFE_INTEGER,
      0,
      10_000,
    );
    const oneMore = contribution(
      2,
      1,
      0,
      10_000,
    );

    const result =
      aggregateUnionBackingPoolCapacity([
        input("active", maximum),
        input("active", oneMore),
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected unsafe pool total to fail",
      );
    }

    expect(result.error.code).toBe(
      "invalid-input",
    );
    expect(result.error.details).toMatchObject({
      path:
        "inputs[1].contribution.contributionCents",
      runningTotalCents:
        Number.MAX_SAFE_INTEGER,
      nextContributionCents: 1,
      maximumSafeInteger:
        Number.MAX_SAFE_INTEGER,
    });
  });

  it("produces the same total and canonical entry order regardless of input order", () => {
    const propertyA = contribution(
      1,
      100,
      0,
      10_000,
    );
    const propertyB = contribution(
      2,
      200,
      0,
      10_000,
    );

    const forward = requirePool([
      input("active", propertyA),
      input("active", propertyB),
    ]);
    const reverse = requirePool([
      input("active", propertyB),
      input("active", propertyA),
    ]);

    expect(reverse.totalCapacityCents).toBe(
      forward.totalCapacityCents,
    );
    expect(
      reverse.propertyCapacities.map(
        (entry) => entry.propertyId,
      ),
    ).toEqual(
      forward.propertyCapacities.map(
        (entry) => entry.propertyId,
      ),
    );
  });

  it("returns a deeply frozen aggregation result", () => {
    const pool = requirePool([
      input(
        "active",
        contribution(1, 100, 0, 10_000),
      ),
    ]);

    expect(Object.isFrozen(pool)).toBe(true);
    expect(
      Object.isFrozen(pool.propertyCapacities),
    ).toBe(true);
    expect(
      Object.isFrozen(
        pool.propertyCapacities[0],
      ),
    ).toBe(true);
  });

  it("does not mutate the input array or WO-017 contribution", () => {
    const capacity = contribution(
      1,
      100,
      0,
      10_000,
    );
    const entry = input("active", capacity);
    const inputs = Object.freeze([entry]);
    const originalContribution =
      entry.contribution;

    requirePool(inputs);

    expect(inputs).toEqual([entry]);
    expect(entry.contribution).toBe(
      originalContribution,
    );
    expect(
      entry.contribution.contributionCents,
    ).toBe(100);
  });

  it("does not create issued supply, claims, or seniority", () => {
    const pool = requirePool([
      input(
        "active",
        contribution(1, 100, 0, 10_000),
      ),
    ]);

    expect(pool).not.toHaveProperty(
      "issuedSupplyCents",
    );
    expect(pool).not.toHaveProperty("claims");
    expect(pool).not.toHaveProperty(
      "seniorityPositions",
    );
  });
});
```

**Output:** Runtime tests cover the canonical sum, zero/one/multiple Properties, inactive statuses, zero contribution, identity mismatch, duplicate prevention, safe integer boundaries, deterministic ordering, immutability, and exclusion of issuance behavior.

**Status:** Step 5 complete.

**Next:** Step 6 — Run focused runtime verification.

---

## Step 6 — Run focused runtime verification

**Input:** The source and runtime tests from Steps 4 and 5.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- union-backing-pool.test.ts

> @lcp/domain@1.0.0 test
> vitest run union-backing-pool.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 11[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m19 passed[39m[22m[90m (19)[39m
[2m   Start at [22m 14:18:12
[2m   Duration [22m 306ms[2m (transform 133ms, setup 0ms, import 159ms, tests 11ms, environment 0ms)[22m

```

**Output:** The focused pool aggregation runtime suite passes.

**Status:** Step 6 complete.

**Next:** Step 7 — Create compile-time safeguards.

---

## Step 6 — Run focused runtime verification

**Input:** The source and runtime tests from Steps 4 and 5.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- union-backing-pool.test.ts

> @lcp/domain@1.0.0 test
> vitest run union-backing-pool.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 12[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m19 passed[39m[22m[90m (19)[39m
[2m   Start at [22m 14:18:18
[2m   Duration [22m 246ms[2m (transform 81ms, setup 0ms, import 106ms, tests 12ms, environment 0ms)[22m

```

**Output:** The focused pool aggregation runtime suite passes.

**Status:** Step 6 complete.

**Next:** Step 7 — Create compile-time safeguards.

---

## Step 6 — Run focused runtime verification

**Input:** The source and runtime tests from Steps 4 and 5.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- union-backing-pool.test.ts

> @lcp/domain@1.0.0 test
> vitest run union-backing-pool.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 10[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m19 passed[39m[22m[90m (19)[39m
[2m   Start at [22m 14:18:29
[2m   Duration [22m 302ms[2m (transform 132ms, setup 0ms, import 160ms, tests 10ms, environment 0ms)[22m

```

**Output:** The focused pool aggregation runtime suite passes.

**Status:** Step 6 complete.

**Next:** Step 7 — Create compile-time safeguards.

---

## Step 7 — Create compile-time safeguards

**Input:** The passing runtime behavior from Step 6.

**Commands and output:**

```text
$ cat > packages/domain/src/union-backing-pool.type-test.ts <<EOF

$ sed -n "1,360p" packages/domain/src/union-backing-pool.type-test.ts
import {
  aggregateUnionBackingPoolCapacity,
  type UnionBackingPool,
  type UnionBackingPoolContributionInput,
} from "./union-backing-pool.js";
import {
  calculatePropertyCapacityContribution,
} from "./property-capacity.js";
import {
  poolStatus,
  propertyStatus,
} from "./domain-statuses.js";
import {
  deterministicTestId,
} from "./identifiers.js";
import type {
  EffectivePropertyValuation,
} from "./valuations.js";
import {
  basisPoints,
  cents,
  eventSequence,
} from "./value-types.js";

const propertyId =
  deterministicTestId("property", 1);

const valuation: EffectivePropertyValuation =
  Object.freeze({
    propertyId,
    proposalSequence: eventSequence(1),
    approvalSequence: eventSequence(2),
    approvedValueCents: cents(1_000),
  });

const contribution =
  calculatePropertyCapacityContribution(
    valuation,
    cents(0),
    basisPoints(10_000),
  );

const validInput:
  UnionBackingPoolContributionInput = {
    propertyId,
    propertyStatus: propertyStatus("active"),
    contribution,
  };

const readonlyInputs:
  readonly UnionBackingPoolContributionInput[] = [
    validInput,
  ];

const result =
  aggregateUnionBackingPoolCapacity(
    readonlyInputs,
  );

if (result.ok) {
  const pool: UnionBackingPool = result.value;

  pool.totalCapacityCents;
  pool.propertyCapacities[0]?.propertyId;

  // @ts-expect-error Pool totals are immutable.
  pool.totalCapacityCents = cents(2_000);

  // @ts-expect-error Pool entry arrays are readonly.
  pool.propertyCapacities.push(
    pool.propertyCapacities[0],
  );

  // @ts-expect-error Pool entries are immutable.
  pool.propertyCapacities[0].includedInTotal =
    false;

  // @ts-expect-error Aggregation does not expose issued supply.
  pool.issuedSupplyCents;
}

const plainStringId:
  UnionBackingPoolContributionInput = {
    // @ts-expect-error Plain strings are not PropertyId values.
    propertyId:
      "prop_00000000000000000000000001",
    propertyStatus: propertyStatus("active"),
    contribution,
  };

const wrongStatus:
  UnionBackingPoolContributionInput = {
    propertyId,
    // @ts-expect-error PoolStatus is not PropertyStatus.
    propertyStatus: poolStatus("open"),
    contribution,
  };

const wrongContribution:
  UnionBackingPoolContributionInput = {
    propertyId,
    propertyStatus: propertyStatus("active"),
    // @ts-expect-error Cents is not a WO-017 contribution.
    contribution: cents(1_000),
  };

// @ts-expect-error Input fields are immutable.
validInput.propertyStatus =
  propertyStatus("rejected");

$ rg -n "@ts-expect-error" packages/domain/src/union-backing-pool.type-test.ts
66:  // @ts-expect-error Pool totals are immutable.
69:  // @ts-expect-error Pool entry arrays are readonly.
74:  // @ts-expect-error Pool entries are immutable.
78:  // @ts-expect-error Aggregation does not expose issued supply.
84:    // @ts-expect-error Plain strings are not PropertyId values.
94:    // @ts-expect-error PoolStatus is not PropertyStatus.
103:    // @ts-expect-error Cents is not a WO-017 contribution.
107:// @ts-expect-error Input fields are immutable.
```

**Output:** Compile-time safeguards reject mutation, plain-string Property IDs, PoolStatus cross-use, Cents-as-contribution misuse, and accidental issuance-field access.

**Status:** Step 7 complete.

**Next:** Step 8 — Export the capability and create the public-entrypoint test.

---

## Step 8 — Export the capability and create the public-entrypoint test

**Input:** The source, runtime tests, and compile-time safeguards.

**Commands and output:**

```text
$ printf "\nexport * from \"./union-backing-pool.js\";\n" >> packages/domain/src/index.ts

$ cat > packages/domain/src/union-backing-pool-public.test.ts <<EOF

$ tail -n 24 packages/domain/src/index.ts
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
export * from "./properties.js";
export * from "./valuations.js";
export * from "./property-capacity.js";

export * from "./union-backing-pool.js";

$ sed -n "1,300p" packages/domain/src/union-backing-pool-public.test.ts
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  aggregateUnionBackingPoolCapacity,
  calculatePropertyCapacityContribution,
  deterministicTestId,
  propertyStatus,
  basisPoints,
  cents,
  eventSequence,
  type EffectivePropertyValuation,
  type UnionBackingPool,
  type UnionBackingPoolContributionInput,
} from "./index.js";

describe("Union Backing Pool public entrypoint", () => {
  it("exports aggregation behavior and types from the domain package", () => {
    const propertyId =
      deterministicTestId("property", 1);
    const valuation:
      EffectivePropertyValuation =
      Object.freeze({
        propertyId,
        proposalSequence: eventSequence(1),
        approvalSequence: eventSequence(2),
        approvedValueCents:
          cents(50_000_000),
      });
    const contribution =
      calculatePropertyCapacityContribution(
        valuation,
        cents(10_000_000),
        basisPoints(6_000),
      );
    const input:
      UnionBackingPoolContributionInput = {
        propertyId,
        propertyStatus:
          propertyStatus("active"),
        contribution,
      };

    const result =
      aggregateUnionBackingPoolCapacity([
        input,
      ]);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    const pool: UnionBackingPool =
      result.value;

    expect(pool.totalCapacityCents).toBe(
      20_000_000,
    );
  });
});
```

**Output:** The pool aggregation API and types are available through the domain package public entrypoint.

**Status:** Step 8 complete.

**Next:** Step 9 — Run strict package verification.

---

## Step 9 — Run strict package verification

**Input:** The complete WO-018 domain source and tests.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/union-backing-pool-public.test.ts(11,3): error TS2305: Module '"./index.js"' has no exported member 'propertyStatus'.
src/union-backing-pool-public.test.ts(24,11): error TS2739: Type 'Readonly<{ propertyId: PropertyId; proposalSequence: EventSequence; approvalSequence: EventSequence; approvedValueCents: Cents; }>' is missing the following properties from type 'EffectivePropertyValuation': proposedValueCents, proposedByReference, approvedByReference, proposalEvidenceReferences, approvalEvidenceReferences
src/union-backing-pool.test.ts(37,9): error TS2739: Type 'Readonly<{ propertyId: PropertyId; proposalSequence: EventSequence; approvalSequence: EventSequence; approvedValueCents: Cents; }>' is missing the following properties from type 'EffectivePropertyValuation': proposedValueCents, proposedByReference, approvedByReference, proposalEvidenceReferences, approvalEvidenceReferences
src/union-backing-pool.type-test.ts(28,7): error TS2739: Type 'Readonly<{ propertyId: PropertyId; proposalSequence: EventSequence; approvalSequence: EventSequence; approvedValueCents: Cents; }>' is missing the following properties from type 'EffectivePropertyValuation': proposedValueCents, proposedByReference, approvedByReference, proposalEvidenceReferences, approvalEvidenceReferences
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
```

**Result:** Strict verification stopped because the WO-018 test fixtures did not satisfy the complete WO-016 `EffectivePropertyValuation` contract, and the public test imported a constructor that is not exported by `index.ts`.

**Status:** Step 9 failed; no production implementation defect was established.

**Next:** Step 9A — Repair the WO-018 test scaffolding and repeat strict verification.

---

## Step 9A — Repair valuation fixtures and rerun strict verification

**Input:** The completed WO-018 implementation and the TypeScript errors produced by Step 9.

**Commands and output:**

```text
$ python3 repair the three WO-018 test files
[repaired WO-018 runtime fixture]
[repaired WO-018 compile-time fixture]
[repaired WO-018 public-entrypoint fixture]

$ rg -n "proposedValueCents|proposedByReference|approvedByReference|EvidenceReferences" packages/domain/src/union-backing-pool*.ts
packages/domain/src/union-backing-pool.type-test.ts:33:    proposedValueCents: cents(1_000),
packages/domain/src/union-backing-pool.type-test.ts:35:    proposedByReference: "test-proposer",
packages/domain/src/union-backing-pool.type-test.ts:36:    approvedByReference: "test-approver",
packages/domain/src/union-backing-pool.type-test.ts:37:    proposalEvidenceReferences:
packages/domain/src/union-backing-pool.type-test.ts:39:    approvalEvidenceReferences:
packages/domain/src/union-backing-pool.test.ts:46:      proposedValueCents:
packages/domain/src/union-backing-pool.test.ts:50:      proposedByReference: "test-proposer",
packages/domain/src/union-backing-pool.test.ts:51:      approvedByReference: "test-approver",
packages/domain/src/union-backing-pool.test.ts:52:      proposalEvidenceReferences:
packages/domain/src/union-backing-pool.test.ts:54:      approvalEvidenceReferences:
packages/domain/src/union-backing-pool-public.test.ts:32:        proposedValueCents:
packages/domain/src/union-backing-pool-public.test.ts:36:        proposedByReference:
packages/domain/src/union-backing-pool-public.test.ts:38:        approvedByReference:
packages/domain/src/union-backing-pool-public.test.ts:40:        proposalEvidenceReferences:
packages/domain/src/union-backing-pool-public.test.ts:44:        approvalEvidenceReferences:

$ sed -n "1,70p" packages/domain/src/union-backing-pool-public.test.ts
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  aggregateUnionBackingPoolCapacity,
  calculatePropertyCapacityContribution,
  deterministicTestId,
  basisPoints,
  cents,
  eventSequence,
  type EffectivePropertyValuation,
  type UnionBackingPool,
  type UnionBackingPoolContributionInput,
} from "./index.js";
import {
  propertyStatus,
} from "./domain-statuses.js";

describe("Union Backing Pool public entrypoint", () => {
  it("exports aggregation behavior and types from the domain package", () => {
    const propertyId =
      deterministicTestId("property", 1);
    const valuation:
      EffectivePropertyValuation =
      Object.freeze({
        propertyId,
        proposalSequence: eventSequence(1),
        approvalSequence: eventSequence(2),
        proposedValueCents:
          cents(50_000_000),
        approvedValueCents:
          cents(50_000_000),
        proposedByReference:
          "test-proposer",
        approvedByReference:
          "test-approver",
        proposalEvidenceReferences:
          Object.freeze([
            "proposal-evidence",
          ]),
        approvalEvidenceReferences:
          Object.freeze([
            "approval-evidence",
          ]),
      });
    const contribution =
      calculatePropertyCapacityContribution(
        valuation,
        cents(10_000_000),
        basisPoints(6_000),
      );
    const input:
      UnionBackingPoolContributionInput = {
        propertyId,
        propertyStatus:
          propertyStatus("active"),
        contribution,
      };

    const result =
      aggregateUnionBackingPoolCapacity([
        input,
      ]);

    expect(result.ok).toBe(true);

    if (!result.ok) {

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

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/union-backing-pool-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 43[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 28[2mms[22m[39m

[2m Test Files [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m      Tests [22m [1m[32m271 passed[39m[22m[90m (271)[39m
[2m   Start at [22m 14:33:21
[2m   Duration [22m 447ms[2m (transform 1.62s, setup 0ms, import 2.60s, tests 222ms, environment 2ms)[22m


$ find packages/domain/dist -maxdepth 2 -type f | sort
packages/domain/dist/canonical-scenarios.d.ts
packages/domain/dist/canonical-scenarios.d.ts.map
packages/domain/dist/canonical-scenarios.js
packages/domain/dist/canonical-scenarios.js.map
packages/domain/dist/domain-errors.d.ts
packages/domain/dist/domain-errors.d.ts.map
packages/domain/dist/domain-errors.js
packages/domain/dist/domain-errors.js.map
packages/domain/dist/domain-statuses.d.ts
packages/domain/dist/domain-statuses.d.ts.map
packages/domain/dist/domain-statuses.js
packages/domain/dist/domain-statuses.js.map
packages/domain/dist/identifiers.d.ts
packages/domain/dist/identifiers.d.ts.map
packages/domain/dist/identifiers.js
packages/domain/dist/identifiers.js.map
packages/domain/dist/index.d.ts
packages/domain/dist/index.d.ts.map
packages/domain/dist/index.js
packages/domain/dist/index.js.map
packages/domain/dist/properties.d.ts
packages/domain/dist/properties.d.ts.map
packages/domain/dist/properties.js
packages/domain/dist/properties.js.map
packages/domain/dist/property-capacity.d.ts
packages/domain/dist/property-capacity.d.ts.map
packages/domain/dist/property-capacity.js
packages/domain/dist/property-capacity.js.map
packages/domain/dist/union-backing-pool.d.ts
packages/domain/dist/union-backing-pool.d.ts.map
packages/domain/dist/union-backing-pool.js
packages/domain/dist/union-backing-pool.js.map
packages/domain/dist/valuations.d.ts
packages/domain/dist/valuations.d.ts.map
packages/domain/dist/valuations.js
packages/domain/dist/valuations.js.map
packages/domain/dist/value-types.d.ts
packages/domain/dist/value-types.d.ts.map
packages/domain/dist/value-types.js
packages/domain/dist/value-types.js.map

$ test ! -e packages/domain/dist/union-backing-pool.test.js
[runtime test absent from dist]

$ test ! -e packages/domain/dist/union-backing-pool.type-test.js
[type test absent from dist]

$ test ! -e packages/domain/dist/union-backing-pool-public.test.js
[public test absent from dist]

$ test -e packages/domain/dist/union-backing-pool.js
[production source present in dist]
```

**Output:** The test fixtures satisfy the complete WO-016 valuation contract, the WO-018 public capability remains exported through `index.ts`, and strict package verification passes.

**Status:** Step 9A complete; Step 9 verification is repaired and complete.

**Next:** Step 10 — Demonstrate the double-counting safeguard failure.

---

## Step 10 — Demonstrate double-counting safeguard failure

**Input:** The passing focused WO-018 suite.

**Temporary action:** Append one test that incorrectly expects a duplicate Property to be accepted and counted twice.

**Commands and output:**

```text
$ cat >> packages/domain/src/union-backing-pool.test.ts <<EOF

$ rg -n "TEMPORARY: incorrectly counts one Property twice" packages/domain/src/union-backing-pool.test.ts
480:it("TEMPORARY: incorrectly counts one Property twice", () => {

$ npm test --workspace packages/domain -- union-backing-pool.test.ts

> @lcp/domain@1.0.0 test
> vitest run union-backing-pool.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/union-backing-pool.test.ts [2m([22m[2m20 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 43[2mms[22m[39m
     [32m✓[39m returns zero for zero Properties[32m 5[2mms[22m[39m
     [32m✓[39m returns one active Property contribution[32m 3[2mms[22m[39m
     [32m✓[39m sums canonical Properties A and B to $330,000[32m 1[2mms[22m[39m
     [32m✓[39m sums multiple active contributions exactly once[32m 2[2mms[22m[39m
     [32m✓[39m keeps an active zero-contribution Property visible without changing the total[32m 1[2mms[22m[39m
     [32m✓[39m counts a proposed Property as zero eligible capacity[32m 1[2mms[22m[39m
     [32m✓[39m counts a suspended Property as zero eligible capacity[32m 1[2mms[22m[39m
     [32m✓[39m counts a rejected Property as zero eligible capacity[32m 1[2mms[22m[39m
     [32m✓[39m counts a liquidating Property as zero eligible capacity[32m 1[2mms[22m[39m
     [32m✓[39m counts a closed Property as zero eligible capacity[32m 1[2mms[22m[39m
     [32m✓[39m rejects a mismatched PropertyId and contribution PropertyId[32m 1[2mms[22m[39m
     [32m✓[39m rejects duplicate Property identity instead of double counting[32m 1[2mms[22m[39m
     [32m✓[39m rejects duplicate identity even when the contribution is zero[32m 0[2mms[22m[39m
     [32m✓[39m accepts a total exactly at Number.MAX_SAFE_INTEGER[32m 0[2mms[22m[39m
     [32m✓[39m rejects a total that would exceed Number.MAX_SAFE_INTEGER[32m 1[2mms[22m[39m
     [32m✓[39m produces the same total and canonical entry order regardless of input order[32m 1[2mms[22m[39m
     [32m✓[39m returns a deeply frozen aggregation result[32m 1[2mms[22m[39m
     [32m✓[39m does not mutate the input array or WO-017 contribution[32m 1[2mms[22m[39m
     [32m✓[39m does not create issued supply, claims, or seniority[32m 2[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: incorrectly counts one Property twice[39m[32m 17[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/union-backing-pool.test.ts[2m > [22mTEMPORARY: incorrectly counts one Property twice
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m src/union-backing-pool.test.ts:[2m498:21[22m[39m
    [90m496|[39m     ])[33m;[39m
    [90m497|[39m
    [90m498|[39m   [34mexpect[39m(result[33m.[39mok)[33m.[39m[34mtoBe[39m([35mtrue[39m)[33m;[39m
    [90m   |[39m                     [31m^[39m
    [90m499|[39m
    [90m500|[39m   [35mif[39m ([33m![39mresult[33m.[39mok) {

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m19 passed[39m[22m[90m (20)[39m
[2m   Start at [22m 14:33:43
[2m   Duration [22m 364ms[2m (transform 138ms, setup 0ms, import 173ms, tests 43ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run union-backing-pool.test.ts

[focused test exit status: 1]
[expected failure observed]
```

**Expected failure evidence:** The temporary test fails because aggregation returns `already-exists` rather than a doubled total.

**Output:** The focused suite is proven capable of detecting accidental double counting.

**Status:** Step 10 complete; the repository is intentionally failing until Step 11 restores it.

**Next:** Step 11 — Remove the temporary test and reverify.

---

## Step 11 — Remove the temporary test and reverify

**Input:** The intentionally failing test file from Step 10.

**Commands and output:**

```text
$ python - <<PY

$ rg -n "TEMPORARY:" packages/domain/src/union-backing-pool.test.ts || true

$ npm test --workspace packages/domain -- union-backing-pool.test.ts

> @lcp/domain@1.0.0 test
> vitest run union-backing-pool.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 10[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m19 passed[39m[22m[90m (19)[39m
[2m   Start at [22m 14:34:09
[2m   Duration [22m 241ms[2m (transform 70ms, setup 0ms, import 94ms, tests 10ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** The temporary failure is absent and focused runtime plus compile-time verification pass again.

**Status:** Step 11 complete.

**Next:** Step 12 — Run complete workspace verification.

---

## Step 12 — Run complete workspace verification

**Input:** The restored WO-018 implementation and all prior Economic Union behavior.

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

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 24[2mms[22m[39m
 [32m✓[39m src/union-backing-pool-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 28[2mms[22m[39m
 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 21[2mms[22m[39m

[2m Test Files [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m      Tests [22m [1m[32m271 passed[39m[22m[90m (271)[39m
[2m   Start at [22m 14:35:45
[2m   Duration [22m 411ms[2m (transform 1.54s, setup 0ms, import 2.23s, tests 195ms, environment 2ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 14:35:46
[2m   Duration [22m 182ms[2m (transform 27ms, setup 0ms, import 40ms, tests 3ms, environment 0ms)[22m


$ rg -n "TEMPORARY:" packages/domain/src || true
```

**Output:** The complete TypeScript workspace passes with no temporary source test remaining.

**Status:** Step 12 complete.

**Next:** Step 13 — Perform clean verification.

---

## Step 13 — Perform clean verification

**Input:** Passing source and the lockfile-controlled workspace.

**Disposable paths:** `packages/domain/dist` and `packages/protocol/dist`; both are generated by TypeScript builds.

**Commands and output:**

```text
$ rm -rf packages/domain/dist packages/protocol/dist

$ npm ci

added 55 packages, and audited 61 packages in 933ms

18 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

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

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/union-backing-pool-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 31[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 25[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 41[2mms[22m[39m

[2m Test Files [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m      Tests [22m [1m[32m271 passed[39m[22m[90m (271)[39m
[2m   Start at [22m 14:35:56
[2m   Duration [22m 440ms[2m (transform 1.45s, setup 0ms, import 2.35s, tests 230ms, environment 2ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 14:35:56
[2m   Duration [22m 203ms[2m (transform 49ms, setup 0ms, import 65ms, tests 3ms, environment 0ms)[22m


$ test -e packages/domain/dist/union-backing-pool.js
[clean build recreated pool source]
```

**Output:** Lockfile installation and a clean TypeScript rebuild reproduce the passing workspace.

**Status:** Step 13 complete.

**Next:** Step 14 — Run Foundry and adjacent-system regressions.

---

## Step 14 — Run Foundry and adjacent-system regressions

**Input:** The clean passing Economic Union TypeScript workspace.

**Commands and output:**

```text
$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 282.74µs (39.53µs CPU time)

Ran 1 test suite in 6.32ms (282.74µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

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
 ✓ test/index.spec.js (4 tests) 179ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  14:36:05
   Duration  1.79s (transform 57ms, setup 0ms, collect 77ms, tests 179ms, environment 0ms, prepare 172ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** Solidity scaffolding and neighboring Point behavior remain unchanged and green.

**Status:** Step 14 complete.

**Next:** Step 15 — Inspect and summarize the total change.

---

## Step 15 — Inspect and summarize WO-018

**Input:** The fully verified but unstaged WO-018 change.

**Commands and output:**

```text
$ git status --short
 M node_modules/.package-lock.json
 M packages/domain/src/index.ts
?? docs/work-orders/WO-018-execution.md
?? packages/domain/src/union-backing-pool-public.test.ts
?? packages/domain/src/union-backing-pool.test.ts
?? packages/domain/src/union-backing-pool.ts
?? packages/domain/src/union-backing-pool.type-test.ts

$ git diff --check

$ git diff --stat
 .../economic-union/node_modules/.package-lock.json | 22 +++++++++++++++++++++-
 code/economic-union/packages/domain/src/index.ts   |  2 ++
 2 files changed, 23 insertions(+), 1 deletion(-)

$ git diff -- packages/domain/src/index.ts packages/domain/src/union-backing-pool.ts packages/domain/src/union-backing-pool.test.ts packages/domain/src/union-backing-pool.type-test.ts packages/domain/src/union-backing-pool-public.test.ts
diff --git a/code/economic-union/packages/domain/src/index.ts b/code/economic-union/packages/domain/src/index.ts
index 299ca7b..01d75fa 100644
--- a/code/economic-union/packages/domain/src/index.ts
+++ b/code/economic-union/packages/domain/src/index.ts
@@ -12,3 +12,5 @@ export * from "./canonical-scenarios.js";
 export * from "./properties.js";
 export * from "./valuations.js";
 export * from "./property-capacity.js";
+
+export * from "./union-backing-pool.js";
```

**Expected changed files:**

- `packages/domain/src/union-backing-pool.ts`
- `packages/domain/src/union-backing-pool.test.ts`
- `packages/domain/src/union-backing-pool.type-test.ts`
- `packages/domain/src/union-backing-pool-public.test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-018-execution.md`

**Boundary confirmation:** WO-018 aggregates eligible WO-017 contributions only. It does not recalculate Property capacity, create events, issue claims, track used capacity, determine health, persist state, expose an API, or add Solidity behavior.

**Output:** The complete bounded diff is visible before staging.

**Status:** Step 15 complete if no unrelated file appears.

**Next:** Step 16 — Stage only WO-018.

---

## Step 16 — Normalize and stage only WO-018

**Input:** The inspected bounded WO-018 worktree.

**Commands and output:**

```text
$ python - <<PY

$ git add packages/domain/src/union-backing-pool.ts packages/domain/src/union-backing-pool.test.ts packages/domain/src/union-backing-pool.type-test.ts packages/domain/src/union-backing-pool-public.test.ts packages/domain/src/index.ts docs/work-orders/WO-018-execution.md

$ git diff --cached --check

$ git diff --cached --stat
 .../docs/work-orders/WO-018-execution.md           | 2156 ++++++++++++++++++++
 code/economic-union/packages/domain/src/index.ts   |    2 +
 .../domain/src/union-backing-pool-public.test.ts   |   81 +
 .../packages/domain/src/union-backing-pool.test.ts |  478 +++++
 .../packages/domain/src/union-backing-pool.ts      |  190 ++
 .../domain/src/union-backing-pool.type-test.ts     |  116 ++
 6 files changed, 3023 insertions(+)

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-018-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/union-backing-pool-public.test.ts
code/economic-union/packages/domain/src/union-backing-pool.test.ts
code/economic-union/packages/domain/src/union-backing-pool.ts
code/economic-union/packages/domain/src/union-backing-pool.type-test.ts

$ git status --short
AM docs/work-orders/WO-018-execution.md
 M node_modules/.package-lock.json
M  packages/domain/src/index.ts
A  packages/domain/src/union-backing-pool-public.test.ts
A  packages/domain/src/union-backing-pool.test.ts
A  packages/domain/src/union-backing-pool.ts
A  packages/domain/src/union-backing-pool.type-test.ts
```

**Output:** Only the six declared WO-018 paths are staged and the staged diff has no whitespace error.

**Status:** Step 16 complete.

**Next:** Step 17 — Run final staged verification and commit.
---

## Step 16 — Normalize and stage only WO-018

**Input:** The inspected bounded WO-018 worktree.

**Commands and output:**

```text
$ python - <<PY

$ git add packages/domain/src/union-backing-pool.ts packages/domain/src/union-backing-pool.test.ts packages/domain/src/union-backing-pool.type-test.ts packages/domain/src/union-backing-pool-public.test.ts packages/domain/src/index.ts docs/work-orders/WO-018-execution.md

$ git diff --cached --check

$ git diff --cached --stat
 .../docs/work-orders/WO-018-execution.md           | 2203 ++++++++++++++++++++
 code/economic-union/packages/domain/src/index.ts   |    2 +
 .../domain/src/union-backing-pool-public.test.ts   |   81 +
 .../packages/domain/src/union-backing-pool.test.ts |  478 +++++
 .../packages/domain/src/union-backing-pool.ts      |  190 ++
 .../domain/src/union-backing-pool.type-test.ts     |  116 ++
 6 files changed, 3070 insertions(+)

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-018-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/union-backing-pool-public.test.ts
code/economic-union/packages/domain/src/union-backing-pool.test.ts
code/economic-union/packages/domain/src/union-backing-pool.ts
code/economic-union/packages/domain/src/union-backing-pool.type-test.ts

$ git status --short
AM docs/work-orders/WO-018-execution.md
 M node_modules/.package-lock.json
M  packages/domain/src/index.ts
A  packages/domain/src/union-backing-pool-public.test.ts
A  packages/domain/src/union-backing-pool.test.ts
A  packages/domain/src/union-backing-pool.ts
A  packages/domain/src/union-backing-pool.type-test.ts
```

**Output:** Only the six declared WO-018 paths are staged and the staged diff has no whitespace error.

**Status:** Step 16 complete.

**Next:** Step 17 — Run final staged verification and commit.
---

## Step 16 — Normalize and stage only WO-018

**Input:** The inspected bounded WO-018 worktree.

**Commands and output:**

```text
$ python - <<PY

$ git add packages/domain/src/union-backing-pool.ts packages/domain/src/union-backing-pool.test.ts packages/domain/src/union-backing-pool.type-test.ts packages/domain/src/union-backing-pool-public.test.ts packages/domain/src/index.ts docs/work-orders/WO-018-execution.md

$ git diff --cached --check

$ git diff --cached --stat
 .../docs/work-orders/WO-018-execution.md           | 2250 ++++++++++++++++++++
 code/economic-union/packages/domain/src/index.ts   |    2 +
 .../domain/src/union-backing-pool-public.test.ts   |   81 +
 .../packages/domain/src/union-backing-pool.test.ts |  478 +++++
 .../packages/domain/src/union-backing-pool.ts      |  190 ++
 .../domain/src/union-backing-pool.type-test.ts     |  116 +
 6 files changed, 3117 insertions(+)

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-018-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/union-backing-pool-public.test.ts
code/economic-union/packages/domain/src/union-backing-pool.test.ts
code/economic-union/packages/domain/src/union-backing-pool.ts
code/economic-union/packages/domain/src/union-backing-pool.type-test.ts

$ git status --short
AM docs/work-orders/WO-018-execution.md
 M node_modules/.package-lock.json
M  packages/domain/src/index.ts
A  packages/domain/src/union-backing-pool-public.test.ts
A  packages/domain/src/union-backing-pool.test.ts
A  packages/domain/src/union-backing-pool.ts
A  packages/domain/src/union-backing-pool.type-test.ts
```

**Output:** Only the six declared WO-018 paths are staged and the staged diff has no whitespace error.

**Status:** Step 16 complete.

**Next:** Step 17 — Run final staged verification and commit.
---

## Step 17 — Final staged verification and commit authorization

**Input:** The explicitly staged WO-018 implementation, tests, public export, and execution record.

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
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/union-backing-pool-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/union-backing-pool.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 20[2mms[22m[39m

[2m Test Files [22m [1m[32m14 passed[39m[22m[90m (14)[39m
[2m      Tests [22m [1m[32m271 passed[39m[22m[90m (271)[39m
[2m   Start at [22m 14:40:01
[2m   Duration [22m 401ms[2m (transform 1.33s, setup 0ms, import 2.22s, tests 176ms, environment 3ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 14:40:02
[2m   Duration [22m 185ms[2m (transform 47ms, setup 0ms, import 61ms, tests 4ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 265.69µs (37.09µs CPU time)

Ran 1 test suite in 6.61ms (265.69µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

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
 ✓ test/index.spec.js (4 tests) 258ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  14:40:03
   Duration  1.85s (transform 76ms, setup 0ms, collect 103ms, tests 258ms, environment 0ms, prepare 229ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --cached --check

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-018-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/union-backing-pool-public.test.ts
code/economic-union/packages/domain/src/union-backing-pool.test.ts
code/economic-union/packages/domain/src/union-backing-pool.ts
code/economic-union/packages/domain/src/union-backing-pool.type-test.ts

$ git status --short
A  docs/work-orders/WO-018-execution.md
 M node_modules/.package-lock.json
M  packages/domain/src/index.ts
A  packages/domain/src/union-backing-pool-public.test.ts
A  packages/domain/src/union-backing-pool.test.ts
A  packages/domain/src/union-backing-pool.ts
A  packages/domain/src/union-backing-pool.type-test.ts

$ date "+%Y-%m-%d %H:%M:%S %Z"
2026-07-24 14:40:05 EDT
```

**Output:** TypeScript, Vitest, Foundry, neighboring Point tests, temporary-test scan, staged whitespace, staged path list, and repository state all authorize the commit.

**Status:** WO-018 is authorized for commit at the timestamp recorded above.

**Planned commit:** `git commit -m "feat(domain): aggregate union backing pool capacity"`

**Boundary confirmation:** The commit contains aggregation only; no issuance, utilization, health, persistence, API, event, or Solidity behavior.
