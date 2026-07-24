# WO-014 Execution Record — Encode Canonical Scenarios as Data

## Purpose

Create versioned portable test vectors and a pure validator for the deficient, exact-payment, and surplus canonical scenarios.

This record captures the actual commands and output of WO-014.

---

## Step 1 — Confirm WO-013 and initialize the execution record

**Input:** The committed WO-013 domain-result vocabulary and passing Phase 2 repository state.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-014-execution.md

$ git log -1 --oneline --decorate
a22c185 (HEAD -> main) feat(domain): define errors and results

$ test -f packages/domain/src/domain-errors.ts
[domain-errors.ts exists]

$ rg -n "WO-013|invalid-input|DomainResult" packages/domain/src docs/work-orders/WO-013-execution.md
docs/work-orders/WO-013-execution.md:1:# WO-013 Execution Record — Define Domain Errors and Results
docs/work-orders/WO-013-execution.md:7:This record captures the actual commands and output of WO-013.
docs/work-orders/WO-013-execution.md:22:?? docs/work-orders/WO-013-execution.md
docs/work-orders/WO-013-execution.md:37:docs/work-orders/WO-013-execution.md:29:$ rg -n "TEMPORARY:" packages/domain/src docs/work-orders || true
docs/work-orders/WO-013-execution.md:661:$ rg -n "throw|RangeError|DomainResult|DomainError" packages/domain/src
docs/work-orders/WO-013-execution.md:695:**Output:** Existing constructors, thrown boundaries, transition tests, type tests, and exports are recorded before WO-013 edits.
docs/work-orders/WO-013-execution.md:705:**Input:** The master-plan WO-013 boundary and the inspected WO-012 source.
docs/work-orders/WO-013-execution.md:730:**Input:** The recorded WO-013 design contract.
docs/work-orders/WO-013-execution.md:740:  "invalid-input",
docs/work-orders/WO-013-execution.md:783:export type DomainResult<
docs/work-orders/WO-013-execution.md:900:  type DomainResult,
docs/work-orders/WO-013-execution.md:904:  "invalid-input",
docs/work-orders/WO-013-execution.md:978:      domainError("invalid-input", ""),
docs/work-orders/WO-013-execution.md:981:      domainError("invalid-input", "   "),
docs/work-orders/WO-013-execution.md:1009:      result: DomainResult<number>,
docs/work-orders/WO-013-execution.md:1035:    ): DomainResult<number> {
docs/work-orders/WO-013-execution.md:1153:  type DomainResult,
docs/work-orders/WO-013-execution.md:1388:): DomainResult<
docs/work-orders/WO-013-execution.md:1412:$ rg -n "DomainResult|invalid-status-transition|domainSuccess|domainFailure" packages/domain/src/domain-statuses.ts
docs/work-orders/WO-013-execution.md:1415:6:  type DomainResult,
docs/work-orders/WO-013-execution.md:1416:241:): DomainResult<
docs/work-orders/WO-013-execution.md:1720:  type DomainResult,
docs/work-orders/WO-013-execution.md:1729:const success: DomainResult<number> = domainSuccess(10);
docs/work-orders/WO-013-execution.md:1730:const failure: DomainResult<number> =
docs/work-orders/WO-013-execution.md:1733:function consume(result: DomainResult<number>): number {
docs/work-orders/WO-013-execution.md:1760:specificError.code = "invalid-input";
docs/work-orders/WO-013-execution.md:2014:**Input:** The restored WO-013 implementation and all prior domain source and tests.
docs/work-orders/WO-013-execution.md:2245:**Next:** Step 16 — Inspect and summarize WO-013.
docs/work-orders/WO-013-execution.md:2249:## Step 16 — Inspect and summarize WO-013
docs/work-orders/WO-013-execution.md:2261:?? docs/work-orders/WO-013-execution.md
docs/work-orders/WO-013-execution.md:2324:+  type DomainResult,
docs/work-orders/WO-013-execution.md:2336:+): DomainResult<
docs/work-orders/WO-013-execution.md:2408:- `docs/work-orders/WO-013-execution.md`
docs/work-orders/WO-013-execution.md:2410:**Boundary confirmation:** WO-013 defines shared expected-rejection vocabulary and result handling only. It does not implement entity records, economic rules, persistence, APIs, exception telemetry, or Solidity behavior.
docs/work-orders/WO-013-execution.md:2414:**Next:** Step 17 — Stage only WO-013.
docs/work-orders/WO-013-execution.md:2418:## Step 17 — Stage only WO-013
docs/work-orders/WO-013-execution.md:2422:**Action:** Stage only explicit WO-013 paths.
docs/work-orders/WO-013-execution.md:2427:$ git add packages/domain/src/domain-errors.ts packages/domain/src/domain-errors.test.ts packages/domain/src/domain-errors.type-test.ts packages/domain/src/domain-statuses.ts packages/domain/src/domain-statuses.test.ts packages/domain/src/domain-statuses.type-test.ts packages/domain/src/index.ts docs/work-orders/WO-013-execution.md
docs/work-orders/WO-013-execution.md:2430:code/economic-union/docs/work-orders/WO-013-execution.md:2285: trailing whitespace.
docs/work-orders/WO-013-execution.md:2432:code/economic-union/docs/work-orders/WO-013-execution.md:2355: trailing whitespace.
docs/work-orders/WO-013-execution.md:2434:code/economic-union/docs/work-orders/WO-013-execution.md:2378: trailing whitespace.
docs/work-orders/WO-013-execution.md:2436:code/economic-union/docs/work-orders/WO-013-execution.md:2387: trailing whitespace.
docs/work-orders/WO-013-execution.md:2443:**Input:** The explicitly staged WO-013 implementation, tests, integration, export, and execution record.
docs/work-orders/WO-013-execution.md:2559:code/economic-union/docs/work-orders/WO-013-execution.md:2285: trailing whitespace.
docs/work-orders/WO-013-execution.md:2561:code/economic-union/docs/work-orders/WO-013-execution.md:2355: trailing whitespace.
docs/work-orders/WO-013-execution.md:2563:code/economic-union/docs/work-orders/WO-013-execution.md:2378: trailing whitespace.
docs/work-orders/WO-013-execution.md:2565:code/economic-union/docs/work-orders/WO-013-execution.md:2387: trailing whitespace.
docs/work-orders/WO-013-execution.md:2567:code/economic-union/docs/work-orders/WO-013-execution.md:2431: trailing whitespace.
docs/work-orders/WO-013-execution.md:2569:code/economic-union/docs/work-orders/WO-013-execution.md:2433: trailing whitespace.
docs/work-orders/WO-013-execution.md:2571:code/economic-union/docs/work-orders/WO-013-execution.md:2435: trailing whitespace.
docs/work-orders/WO-013-execution.md:2573:code/economic-union/docs/work-orders/WO-013-execution.md:2437: trailing whitespace.
docs/work-orders/WO-013-execution.md:2580:**Input:** The explicitly staged WO-013 implementation, tests, integration, export, and execution record.
docs/work-orders/WO-013-execution.md:2698: .../docs/work-orders/WO-013-execution.md           | 32 +++++++++++-----------
docs/work-orders/WO-013-execution.md:2703:MM docs/work-orders/WO-013-execution.md
docs/work-orders/WO-013-execution.md:2718:- Only intended WO-013 files are staged.
docs/work-orders/WO-013-execution.md:2720:**Status:** WO-013 is authorized for commit.
docs/work-orders/WO-013-execution.md:2722:**Next:** Commit WO-013, then begin WO-014 — Encode canonical scenarios as data.
packages/domain/src/domain-errors.type-test.ts:7:  type DomainResult,
packages/domain/src/domain-errors.type-test.ts:16:const success: DomainResult<number> = domainSuccess(10);
packages/domain/src/domain-errors.type-test.ts:17:const failure: DomainResult<number> =
packages/domain/src/domain-errors.type-test.ts:20:function consume(result: DomainResult<number>): number {
packages/domain/src/domain-errors.type-test.ts:47:specificError.code = "invalid-input";
packages/domain/src/domain-statuses.ts:6:  type DomainResult,
packages/domain/src/domain-statuses.ts:241:): DomainResult<
packages/domain/src/domain-errors.ts:2:  "invalid-input",
packages/domain/src/domain-errors.ts:45:export type DomainResult<
packages/domain/src/domain-errors.test.ts:13:  type DomainResult,
packages/domain/src/domain-errors.test.ts:17:  "invalid-input",
packages/domain/src/domain-errors.test.ts:91:      domainError("invalid-input", ""),
packages/domain/src/domain-errors.test.ts:94:      domainError("invalid-input", "   "),
packages/domain/src/domain-errors.test.ts:122:      result: DomainResult<number>,
packages/domain/src/domain-errors.test.ts:148:    ): DomainResult<number> {

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

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 15[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m168 passed[39m[22m[90m (168)[39m
[2m   Start at [22m 21:39:40
[2m   Duration [22m 222ms[2m (transform 209ms, setup 0ms, import 296ms, tests 59ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 21:39:41
[2m   Duration [22m 206ms[2m (transform 48ms, setup 0ms, import 63ms, tests 3ms, environment 0ms)[22m

```

**Output:** WO-013 is visible, its shared result boundary exists, and the workspace is green before WO-014 changes begin.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the canonical source documents.

---

## Step 2 — Inspect the canonical source documents

**Input:** The Phase 0 human-readable scenarios and invariant register.

**Commands and output:**

```text
$ find docs -maxdepth 3 -type f | sort
docs/development-requirements.md
docs/.gitkeep
docs/work-orders/WO-008-execution.md
docs/work-orders/WO-009-execution.md
docs/work-orders/WO-010-execution.md
docs/work-orders/WO-011-execution.md
docs/work-orders/WO-012-execution.md
docs/work-orders/WO-013-execution.md
docs/work-orders/WO-014-execution.md

$ rg -n "Property A|Alice|Carol|deficien|exact|surplus|INV-" docs
docs/work-orders/WO-010-execution.md:1337:**Next:** Step 9C — Remove the exact temporary test.
docs/work-orders/WO-010-execution.md:1343:**Delete this exact block:**
docs/work-orders/WO-011-execution.md:427:**Output:** The identifiers are publicly exported and each identifier type has exactly one definition.
docs/work-orders/WO-013-execution.md:411:    it("accepts exactly its declared status vocabulary", () => {
docs/work-orders/WO-013-execution.md:869:**Output:** The result vocabulary is exported exactly once without removing prior exports.
docs/work-orders/WO-013-execution.md:925:  it("contains exactly the declared stable vocabulary", () => {
docs/work-orders/WO-013-execution.md:1065:38:  it("contains exactly the declared stable vocabulary", () => {
docs/work-orders/WO-013-execution.md:1091:**Output:** Runtime tests cover the exact vocabulary, boundary rejection, error construction, both result branches, narrowing, and non-throwing expected rejection.
docs/work-orders/WO-013-execution.md:1479:    it("accepts exactly its declared status vocabulary", () => {
docs/work-orders/WO-013-execution.md:1915:     [32m✓[39m contains exactly the declared stable vocabulary[32m 2[2mms[22m[39m
docs/work-orders/WO-012-execution.md:747:    it("accepts exactly its declared status vocabulary", () => {
docs/work-orders/WO-012-execution.md:1261:     [32m✓[39m accepts exactly its declared status vocabulary[32m 2[2mms[22m[39m
docs/work-orders/WO-012-execution.md:1263:     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
docs/work-orders/WO-012-execution.md:1265:     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
docs/work-orders/WO-012-execution.md:1267:     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
docs/work-orders/WO-012-execution.md:1269:     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
docs/work-orders/WO-012-execution.md:1271:     [32m✓[39m accepts exactly its declared status vocabulary[32m 0[2mms[22m[39m
docs/work-orders/WO-014-execution.md:5:Create versioned portable test vectors and a pure validator for the deficient, exact-payment, and surplus canonical scenarios.
docs/work-orders/WO-014-execution.md:183:$ rg -n "Property A|Alice|Carol|deficien|exact|surplus|INV-" docs
docs/work-orders/WO-014-execution.md:184:docs/work-orders/WO-010-execution.md:1337:**Next:** Step 9C — Remove the exact temporary test.
docs/work-orders/WO-014-execution.md:185:docs/work-orders/WO-010-execution.md:1343:**Delete this exact block:**
docs/work-orders/WO-014-execution.md:186:docs/work-orders/WO-011-execution.md:427:**Output:** The identifiers are publicly exported and each identifier type has exactly one definition.
docs/work-orders/WO-014-execution.md:187:docs/work-orders/WO-013-execution.md:411:    it("accepts exactly its declared status vocabulary", () => {
docs/work-orders/WO-014-execution.md:188:docs/work-orders/WO-013-execution.md:869:**Output:** The result vocabulary is exported exactly once without removing prior exports.
docs/work-orders/WO-014-execution.md:189:docs/work-orders/WO-013-execution.md:925:  it("contains exactly the declared stable vocabulary", () => {
docs/work-orders/WO-014-execution.md:190:docs/work-orders/WO-013-execution.md:1065:38:  it("contains exactly the declared stable vocabulary", () => {
docs/work-orders/WO-014-execution.md:191:docs/work-orders/WO-013-execution.md:1091:**Output:** Runtime tests cover the exact vocabulary, boundary rejection, error construction, both result branches, narrowing, and non-throwing expected rejection.
docs/work-orders/WO-014-execution.md:192:docs/work-orders/WO-013-execution.md:1479:    it("accepts exactly its declared status vocabulary", () => {
docs/work-orders/WO-014-execution.md:193:docs/work-orders/WO-013-execution.md:1915:     [32m✓[39m contains exactly the declared stable vocabulary[32m 2[2mms[22m[39m
docs/work-orders/WO-014-execution.md:194:docs/work-orders/WO-012-execution.md:747:    it("accepts exactly its declared status vocabulary", () => {
docs/work-orders/WO-014-execution.md:195:docs/work-orders/WO-012-execution.md:1261:     [32m✓[39m accepts exactly its declared status vocabulary[32m 2[2mms[22m[39m
docs/work-orders/WO-009-execution.md:799:**Action:** Open the existing trivial WO-007 test and change exactly one passing expected value to an incorrect value.
docs/work-orders/WO-009-execution.md:896:Stage the one exact TypeScript test shown in Step 13A manually.

$ rg -o "INV-[A-Z]+-[0-9]{3}" docs | sort -u
---

## Step 3 — Record the portable scenario contract

**Input:** The verified Phase 0 calculations and the WO-010 through WO-013 vocabulary.

**Contract:**

- JSON is the portable source format.
- `schemaVersion` is exactly `1`.
- Every monetary amount is a nonnegative safe integer count of cents.
- Action sequences are consecutive and begin at 1.
- Seniority positions are positive safe integers.
- Every interval has `start <= end`.
- The three vectors share their pre-liquidation history.
- Deficient proceeds are 16,000 cents.
- Exact proceeds are 17,500 cents.
- Surplus proceeds are 20,000 cents.
- Token distributions never exceed 17,500 cents total face value.
- The surplus placeholder is separate from token distributions.
- Malformed data returns `invalid-input` with a precise path.
- Validation does not execute domain behavior.

**Output:** The implementation boundary is fixed before files are created.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the canonical scenario vocabulary and validator.

---

## Step 4 — Create the canonical scenario vocabulary and validator

**Input:** The recorded version-1 portable scenario contract.

**Action:** Create `packages/domain/src/canonical-scenarios.ts` with the supplied contents.

**Editor command:** `code packages/domain/src/canonical-scenarios.ts`

**Resulting file:**

```text
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";

export const CANONICAL_SCENARIO_SCHEMA_VERSION = 1 as const;

export const CANONICAL_ACTION_TYPE_VALUES = [
  "property-recorded",
  "deposit-recorded",
  "transfer-recorded",
  "liquidation-proceeds-recorded",
] as const;

export type CanonicalActionType =
  (typeof CANONICAL_ACTION_TYPE_VALUES)[number];

export interface CanonicalPropertyInputV1 {
  readonly propertyId: string;
  readonly approvedValueCents: number;
  readonly seniorDebtCents: number;
  readonly expectedCapacityContributionCents: number;
}

export interface CanonicalMemberInputV1 {
  readonly memberId: string;
  readonly displayName: string;
}

export interface CanonicalPropertyActionV1 {
  readonly sequence: number;
  readonly type: "property-recorded";
  readonly propertyId: string;
}

export interface CanonicalDepositActionV1 {
  readonly sequence: number;
  readonly type: "deposit-recorded";
  readonly memberId: string;
  readonly amountCents: number;
  readonly expectedSeniorityStart: number;
  readonly expectedSeniorityEnd: number;
}

export interface CanonicalTransferActionV1 {
  readonly sequence: number;
  readonly type: "transfer-recorded";
  readonly senderMemberId: string;
  readonly recipientMemberId: string;
  readonly amountCents: number;
  readonly expectedSeniorityStart: number;
  readonly expectedSeniorityEnd: number;
}

export interface CanonicalLiquidationProceedsActionV1 {
  readonly sequence: number;
  readonly type: "liquidation-proceeds-recorded";
  readonly amountCents: number;
}

export type CanonicalActionV1 =
  | CanonicalPropertyActionV1
  | CanonicalDepositActionV1
  | CanonicalTransferActionV1
  | CanonicalLiquidationProceedsActionV1;

export interface CanonicalBalanceV1 {
  readonly memberId: string;
  readonly amountCents: number;
}

export interface CanonicalIntervalV1 {
  readonly memberId: string;
  readonly start: number;
  readonly end: number;
  readonly status: "live" | "paid" | "terminated";
}

export interface CanonicalDistributionV1 {
  readonly destinationId: string;
  readonly destinationType: "member" | "homeowner-surplus-pool";
  readonly amountCents: number;
}

export interface CanonicalInvariantCheckV1 {
  readonly invariantId: string;
  readonly assertion: string;
  readonly expected: true;
}

export interface CanonicalScenarioV1 {
  readonly schemaVersion: 1;
  readonly scenarioId: string;
  readonly title: string;
  readonly description: string;
  readonly inputs: {
    readonly properties: readonly CanonicalPropertyInputV1[];
    readonly members: readonly CanonicalMemberInputV1[];
  };
  readonly actions: readonly CanonicalActionV1[];
  readonly expected: {
    readonly pooledCapacityCents: number;
    readonly issuedSupplyCents: number;
    readonly liveSupplyBeforeLiquidationCents: number;
    readonly preLiquidationBalances: readonly CanonicalBalanceV1[];
    readonly preLiquidationIntervals: readonly CanonicalIntervalV1[];
    readonly liquidation: {
      readonly proceedsCents: number;
      readonly tokenDistributions: readonly CanonicalDistributionV1[];
      readonly paidIntervals: readonly CanonicalIntervalV1[];
      readonly terminatedIntervals: readonly CanonicalIntervalV1[];
      readonly terminatedClaimsCents: number;
      readonly homeownerSurplus: readonly CanonicalDistributionV1[];
    };
  };
  readonly invariantChecks: readonly CanonicalInvariantCheckV1[];
}

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonemptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isCents = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isSequence = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1;

const isSeniority = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1;

const invalid = (
  path: string,
  expected: string,
): DomainResult<never, DomainError<"invalid-input">> =>
  domainFailure(
    domainError(
      "invalid-input",
      `Invalid canonical scenario value at ${path}.`,
      { path, expected },
    ),
  );

const validateProperty = (
  value: unknown,
  path: string,
): DomainResult<CanonicalPropertyInputV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "property object");
  if (!isNonemptyString(value.propertyId)) {
    return invalid(`${path}.propertyId`, "nonempty string");
  }
  if (!isCents(value.approvedValueCents)) {
    return invalid(`${path}.approvedValueCents`, "nonnegative safe integer cents");
  }
  if (!isCents(value.seniorDebtCents)) {
    return invalid(`${path}.seniorDebtCents`, "nonnegative safe integer cents");
  }
  if (!isCents(value.expectedCapacityContributionCents)) {
    return invalid(
      `${path}.expectedCapacityContributionCents`,
      "nonnegative safe integer cents",
    );
  }
  return domainSuccess(value as unknown as CanonicalPropertyInputV1);
};

const validateMember = (
  value: unknown,
  path: string,
): DomainResult<CanonicalMemberInputV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "member object");
  if (!isNonemptyString(value.memberId)) {
    return invalid(`${path}.memberId`, "nonempty string");
  }
  if (!isNonemptyString(value.displayName)) {
    return invalid(`${path}.displayName`, "nonempty string");
  }
  return domainSuccess(value as unknown as CanonicalMemberInputV1);
};

const validateAction = (
  value: unknown,
  path: string,
  expectedSequence: number,
): DomainResult<CanonicalActionV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "action object");
  if (!isSequence(value.sequence) || value.sequence !== expectedSequence) {
    return invalid(`${path}.sequence`, `consecutive sequence ${expectedSequence}`);
  }
  if (
    !isNonemptyString(value.type) ||
    !CANONICAL_ACTION_TYPE_VALUES.includes(
      value.type as CanonicalActionType,
    )
  ) {
    return invalid(`${path}.type`, "declared canonical action type");
  }

  if (value.type === "property-recorded") {
    if (!isNonemptyString(value.propertyId)) {
      return invalid(`${path}.propertyId`, "nonempty string");
    }
    return domainSuccess(value as unknown as CanonicalPropertyActionV1);
  }

  if (value.type === "deposit-recorded") {
    if (!isNonemptyString(value.memberId)) {
      return invalid(`${path}.memberId`, "nonempty string");
    }
    if (!isCents(value.amountCents) || value.amountCents === 0) {
      return invalid(`${path}.amountCents`, "positive safe integer cents");
    }
    if (!isSeniority(value.expectedSeniorityStart)) {
      return invalid(`${path}.expectedSeniorityStart`, "positive safe integer");
    }
    if (
      !isSeniority(value.expectedSeniorityEnd) ||
      value.expectedSeniorityEnd < value.expectedSeniorityStart
    ) {
      return invalid(
        `${path}.expectedSeniorityEnd`,
        "seniority at or after expectedSeniorityStart",
      );
    }
    return domainSuccess(value as unknown as CanonicalDepositActionV1);
  }

  if (value.type === "transfer-recorded") {
    if (!isNonemptyString(value.senderMemberId)) {
      return invalid(`${path}.senderMemberId`, "nonempty string");
    }
    if (!isNonemptyString(value.recipientMemberId)) {
      return invalid(`${path}.recipientMemberId`, "nonempty string");
    }
    if (!isCents(value.amountCents) || value.amountCents === 0) {
      return invalid(`${path}.amountCents`, "positive safe integer cents");
    }
    if (!isSeniority(value.expectedSeniorityStart)) {
      return invalid(`${path}.expectedSeniorityStart`, "positive safe integer");
    }
    if (
      !isSeniority(value.expectedSeniorityEnd) ||
      value.expectedSeniorityEnd < value.expectedSeniorityStart
    ) {
      return invalid(
        `${path}.expectedSeniorityEnd`,
        "seniority at or after expectedSeniorityStart",
      );
    }
    return domainSuccess(value as unknown as CanonicalTransferActionV1);
  }

  if (!isCents(value.amountCents)) {
    return invalid(`${path}.amountCents`, "nonnegative safe integer cents");
  }
  return domainSuccess(
    value as unknown as CanonicalLiquidationProceedsActionV1,
  );
};

const validateBalance = (
  value: unknown,
  path: string,
): DomainResult<CanonicalBalanceV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "balance object");
  if (!isNonemptyString(value.memberId)) {
    return invalid(`${path}.memberId`, "nonempty string");
  }
  if (!isCents(value.amountCents)) {
    return invalid(`${path}.amountCents`, "nonnegative safe integer cents");
  }
  return domainSuccess(value as unknown as CanonicalBalanceV1);
};

const validateInterval = (
  value: unknown,
  path: string,
): DomainResult<CanonicalIntervalV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "interval object");
  if (!isNonemptyString(value.memberId)) {
    return invalid(`${path}.memberId`, "nonempty string");
  }
  if (!isSeniority(value.start)) {
    return invalid(`${path}.start`, "positive safe integer");
  }
  if (!isSeniority(value.end) || value.end < value.start) {
    return invalid(`${path}.end`, "seniority at or after start");
  }
  if (
    value.status !== "live" &&
    value.status !== "paid" &&
    value.status !== "terminated"
  ) {
    return invalid(`${path}.status`, "live, paid, or terminated");
  }
  return domainSuccess(value as unknown as CanonicalIntervalV1);
};

const validateDistribution = (
  value: unknown,
  path: string,
): DomainResult<CanonicalDistributionV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "distribution object");
  if (!isNonemptyString(value.destinationId)) {
    return invalid(`${path}.destinationId`, "nonempty string");
  }
  if (
    value.destinationType !== "member" &&
    value.destinationType !== "homeowner-surplus-pool"
  ) {
    return invalid(
      `${path}.destinationType`,
      "member or homeowner-surplus-pool",
    );
  }
  if (!isCents(value.amountCents)) {
    return invalid(`${path}.amountCents`, "nonnegative safe integer cents");
  }
  return domainSuccess(value as unknown as CanonicalDistributionV1);
};

const validateInvariantCheck = (
  value: unknown,
  path: string,
): DomainResult<CanonicalInvariantCheckV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "invariant check object");
  if (
    !isNonemptyString(value.invariantId) ||
    !/^INV-[A-Z]+-[0-9]{3}$/.test(value.invariantId)
  ) {
    return invalid(`${path}.invariantId`, "stable INV-FAMILY-NNN identifier");
  }
  if (!isNonemptyString(value.assertion)) {
    return invalid(`${path}.assertion`, "nonempty string");
  }
  if (value.expected !== true) {
    return invalid(`${path}.expected`, "literal true");
  }
  return domainSuccess(value as unknown as CanonicalInvariantCheckV1);
};

const validateArray = <T>(
  value: unknown,
  path: string,
  validateItem: (
    item: unknown,
    itemPath: string,
    index: number,
  ) => DomainResult<T, DomainError<"invalid-input">>,
): DomainResult<readonly T[], DomainError<"invalid-input">> => {
  if (!Array.isArray(value)) return invalid(path, "array");
  const validated: T[] = [];
  for (const [index, item] of value.entries()) {
    const result = validateItem(item, `${path}[${index}]`, index);
    if (!result.ok) return result;
    validated.push(result.value);
  }
  return domainSuccess(validated);
};

export const validateCanonicalScenario = (
  value: unknown,
): DomainResult<CanonicalScenarioV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid("$", "scenario object");
  if (value.schemaVersion !== CANONICAL_SCENARIO_SCHEMA_VERSION) {
    return invalid("$.schemaVersion", "literal 1");
  }
  if (!isNonemptyString(value.scenarioId)) {
    return invalid("$.scenarioId", "nonempty string");
  }
  if (!isNonemptyString(value.title)) {
    return invalid("$.title", "nonempty string");
  }
  if (!isNonemptyString(value.description)) {
    return invalid("$.description", "nonempty string");
  }

  if (!isRecord(value.inputs)) return invalid("$.inputs", "inputs object");
  const properties = validateArray(
    value.inputs.properties,
    "$.inputs.properties",
    validateProperty,
  );
  if (!properties.ok) return properties;
  const members = validateArray(
    value.inputs.members,
    "$.inputs.members",
    validateMember,
  );
  if (!members.ok) return members;

  const actions = validateArray(
    value.actions,
    "$.actions",
    (item, path, index) => validateAction(item, path, index + 1),
  );
  if (!actions.ok) return actions;

  if (!isRecord(value.expected)) {
    return invalid("$.expected", "expected-results object");
  }
  if (!isCents(value.expected.pooledCapacityCents)) {
    return invalid("$.expected.pooledCapacityCents", "nonnegative safe integer cents");
  }
  if (!isCents(value.expected.issuedSupplyCents)) {
    return invalid("$.expected.issuedSupplyCents", "nonnegative safe integer cents");
  }
  if (!isCents(value.expected.liveSupplyBeforeLiquidationCents)) {
    return invalid(
      "$.expected.liveSupplyBeforeLiquidationCents",
      "nonnegative safe integer cents",
    );
  }

  const balances = validateArray(
    value.expected.preLiquidationBalances,
    "$.expected.preLiquidationBalances",
    validateBalance,
  );
  if (!balances.ok) return balances;
  const intervals = validateArray(
    value.expected.preLiquidationIntervals,
    "$.expected.preLiquidationIntervals",
    validateInterval,
  );
  if (!intervals.ok) return intervals;

  if (!isRecord(value.expected.liquidation)) {
    return invalid("$.expected.liquidation", "liquidation object");
  }
  const liquidation = value.expected.liquidation;
  if (!isCents(liquidation.proceedsCents)) {
    return invalid(
      "$.expected.liquidation.proceedsCents",
      "nonnegative safe integer cents",
    );
  }
  const tokenDistributions = validateArray(
    liquidation.tokenDistributions,
    "$.expected.liquidation.tokenDistributions",
    validateDistribution,
  );
  if (!tokenDistributions.ok) return tokenDistributions;
  const paidIntervals = validateArray(
    liquidation.paidIntervals,
    "$.expected.liquidation.paidIntervals",
    validateInterval,
  );
  if (!paidIntervals.ok) return paidIntervals;
  const terminatedIntervals = validateArray(
    liquidation.terminatedIntervals,
    "$.expected.liquidation.terminatedIntervals",
    validateInterval,
  );
  if (!terminatedIntervals.ok) return terminatedIntervals;
  if (!isCents(liquidation.terminatedClaimsCents)) {
    return invalid(
      "$.expected.liquidation.terminatedClaimsCents",
      "nonnegative safe integer cents",
    );
  }
  const homeownerSurplus = validateArray(
    liquidation.homeownerSurplus,
    "$.expected.liquidation.homeownerSurplus",
    validateDistribution,
  );
  if (!homeownerSurplus.ok) return homeownerSurplus;

  const invariantChecks = validateArray(
    value.invariantChecks,
    "$.invariantChecks",
    validateInvariantCheck,
  );
  if (!invariantChecks.ok) return invariantChecks;

  return domainSuccess(value as unknown as CanonicalScenarioV1);
};```

$ test "$(wc -l < packages/domain/src/canonical-scenarios.ts)" -le 520

$ rg -n "schemaVersion|validateCanonicalScenario|invalid-input|throw|catch" packages/domain/src/canonical-scenarios.ts
95:  readonly schemaVersion: 1;
142:): DomainResult<never, DomainError<"invalid-input">> =>
145:      "invalid-input",
154:): DomainResult<CanonicalPropertyInputV1, DomainError<"invalid-input">> => {
177:): DomainResult<CanonicalMemberInputV1, DomainError<"invalid-input">> => {
192:): DomainResult<CanonicalActionV1, DomainError<"invalid-input">> => {
271:): DomainResult<CanonicalBalanceV1, DomainError<"invalid-input">> => {
285:): DomainResult<CanonicalIntervalV1, DomainError<"invalid-input">> => {
309:): DomainResult<CanonicalDistributionV1, DomainError<"invalid-input">> => {
332:): DomainResult<CanonicalInvariantCheckV1, DomainError<"invalid-input">> => {
356:  ) => DomainResult<T, DomainError<"invalid-input">>,
357:): DomainResult<readonly T[], DomainError<"invalid-input">> => {
368:export const validateCanonicalScenario = (
370:): DomainResult<CanonicalScenarioV1, DomainError<"invalid-input">> => {
372:  if (value.schemaVersion !== CANONICAL_SCENARIO_SCHEMA_VERSION) {
373:    return invalid("$.schemaVersion", "literal 1");
```

**Output:** The version-1 readonly vocabulary and pure unknown-input validator exist without executing scenario behavior.

**Status:** Step 4 complete.

**Next:** Step 5 — Export the scenario vocabulary.

---

## Step 5 — Export the scenario vocabulary

**Input:** The saved canonical scenario implementation and existing public domain exports.

**Action:** Add `export * from "./canonical-scenarios.js";` to `packages/domain/src/index.ts` without removing existing exports.

**Editor command:** `code packages/domain/src/index.ts`

**Resulting file:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";```

$ test "$(rg -c "canonical-scenarios\.js" packages/domain/src/index.ts)" -eq 1
**Output:** Consumers can import the canonical scenario schema and validator from the domain package entrypoint.

**Status:** Step 5 complete.

**Next:** Step 6 — Create the three versioned JSON vectors.

---

## Step 6 — Create the three versioned JSON vectors

**Input:** The verified Phase 0 calculations and version-1 scenario shape.

**Action:** Create the three files under `test-vectors/v1` using Appendix A.

**Editor commands:**

```text
mkdir -p test-vectors/v1
code test-vectors/v1/deficient-liquidation.json
code test-vectors/v1/exact-liquidation.json
code test-vectors/v1/surplus-liquidation.json
```

**Commands and output:**

```text
$ node -e JSON.parse(...) test-vectors/v1/deficient-liquidation.json
node:fs:440
    return binding.readFileUtf8(path, stringToFlags(options.flag));
                   ^

Error: ENOENT: no such file or directory, open 'test-vectors/v1/deficient-liquidation.json'
    at Object.readFileSync (node:fs:440:20)
    at [eval]:1:46
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:446:12
    at [eval]-wrapper:6:24
    at runScriptInContext (node:internal/process/execution:444:60)
    at evalFunction (node:internal/process/execution:279:30)
    at evalTypeScript (node:internal/process/execution:291:3)
    at node:internal/main/eval_string:74:3 {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: 'test-vectors/v1/deficient-liquidation.json'
}

Node.js v22.22.3
---

## Step 7 — Document the test-vector directory

**Input:** The three saved version-1 vectors.

**Action:** Create `test-vectors/README.md` with the supplied contents.

**Editor command:** `code test-vectors/README.md`

---

## Step 7 — Document the test-vector directory

**Input:** The three saved version-1 vectors.

**Action:** Create `test-vectors/README.md` with the supplied contents.

**Editor command:** `code test-vectors/README.md`

**Resulting file:**

```text
# Economic Union canonical test vectors

These JSON files are portable protocol examples. They give TypeScript,
Solidity, interfaces, replay tools, and independent verifiers the same inputs
and expected results.

## Version 1

- `v1/deficient-liquidation.json` — $160 proceeds against $175 of live claims.
- `v1/exact-liquidation.json` — $175 proceeds against $175 of live claims.
- `v1/surplus-liquidation.json` — $200 proceeds against $175 of live claims.

All monetary values are integer cents. Seniority positions are one-based and
inclusive.

All three scenarios share the same history through the pre-liquidation state:

- Alice owns 7,500 cents and positions 1–7,500.
- Bob owns 7,500 cents and positions 7,501–15,000.
- Carol owns 2,500 cents and positions 15,001–17,500.

The vectors describe expected facts. They do not execute business behavior.
The reference validator is exported by `@lcp/domain` as
`validateCanonicalScenario`.

Changing required fields or their meaning requires a new versioned directory.
The surplus destination is deliberately provisional and does not establish a
final homeowner allocation policy.```

**Output:** A human can understand the purpose, units, common state, variants, and versioning rule without executing code.

**Status:** Step 7 complete.

**Next:** Step 8 — Create focused runtime tests.

---

## Step 8 — Create focused runtime tests

**Input:** The scenario validator and three versioned JSON vectors.

**Action:** Create `packages/domain/src/canonical-scenarios.test.ts` with the supplied tests.

**Editor command:** `code packages/domain/src/canonical-scenarios.test.ts`

**Resulting file:**

```text
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  CANONICAL_SCENARIO_SCHEMA_VERSION,
  validateCanonicalScenario,
  type CanonicalScenarioV1,
} from "./canonical-scenarios.js";

const loadJson = (name: string): unknown =>
  JSON.parse(
    readFileSync(
      new URL(`../../../test-vectors/v1/${name}`, import.meta.url),
      "utf8",
    ),
  ) as unknown;

const clone = (value: unknown): Record<string, unknown> =>
  JSON.parse(JSON.stringify(value)) as Record<string, unknown>;

const deficient = loadJson("deficient-liquidation.json");
const exact = loadJson("exact-liquidation.json");
const surplus = loadJson("surplus-liquidation.json");

const requireScenario = (value: unknown): CanonicalScenarioV1 => {
  const result = validateCanonicalScenario(value);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error("canonical fixture must validate");
  return result.value;
};

const requireInvalidPath = (value: unknown, path: string): void => {
  const result = validateCanonicalScenario(value);
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("mutated fixture must be rejected");
  expect(result.error.code).toBe("invalid-input");
  expect(result.error.details?.path).toBe(path);
};

describe("canonical scenario fixtures", () => {
  it.each([
    ["deficient", deficient],
    ["exact", exact],
    ["surplus", surplus],
  ])("validates the %s version-1 vector", (_name, fixture) => {
    const scenario = requireScenario(fixture);
    expect(scenario.schemaVersion).toBe(CANONICAL_SCENARIO_SCHEMA_VERSION);
    expect(scenario.actions.map((action) => action.sequence)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it("records the shared property capacity calculation", () => {
    for (const fixture of [deficient, exact, surplus]) {
      const scenario = requireScenario(fixture);
      expect(
        scenario.inputs.properties.map(
          (property) => property.expectedCapacityContributionCents,
        ),
      ).toEqual([20_000_000, 13_000_000]);
      expect(scenario.expected.pooledCapacityCents).toBe(33_000_000);
    }
  });

  it("records the same pre-liquidation balances and intervals", () => {
    for (const fixture of [deficient, exact, surplus]) {
      const scenario = requireScenario(fixture);
      expect(scenario.expected.preLiquidationBalances).toEqual([
        { memberId: "member-alice", amountCents: 7_500 },
        { memberId: "member-bob", amountCents: 7_500 },
        { memberId: "member-carol", amountCents: 2_500 },
      ]);
      expect(scenario.expected.preLiquidationIntervals).toEqual([
        { memberId: "member-alice", start: 1, end: 7_500, status: "live" },
        { memberId: "member-bob", start: 7_501, end: 15_000, status: "live" },
        { memberId: "member-carol", start: 15_001, end: 17_500, status: "live" },
      ]);
      expect(scenario.expected.issuedSupplyCents).toBe(17_500);
      expect(scenario.expected.liveSupplyBeforeLiquidationCents).toBe(17_500);
    }
  });

  it("records the deficient result exactly", () => {
    const scenario = requireScenario(deficient);
    expect(scenario.expected.liquidation.proceedsCents).toBe(16_000);
    expect(scenario.expected.liquidation.tokenDistributions).toEqual([
      {
        destinationId: "member-alice",
        destinationType: "member",
        amountCents: 7_500,
      },
      {
        destinationId: "member-bob",
        destinationType: "member",
        amountCents: 7_500,
      },
      {
        destinationId: "member-carol",
        destinationType: "member",
        amountCents: 1_000,
      },
    ]);
    expect(scenario.expected.liquidation.terminatedClaimsCents).toBe(1_500);
    expect(scenario.expected.liquidation.terminatedIntervals).toEqual([
      {
        memberId: "member-carol",
        start: 16_001,
        end: 17_500,
        status: "terminated",
      },
    ]);
  });

  it("records exact payment with no deficiency or surplus", () => {
    const scenario = requireScenario(exact);
    expect(scenario.expected.liquidation.proceedsCents).toBe(17_500);
    expect(scenario.expected.liquidation.terminatedClaimsCents).toBe(0);
    expect(scenario.expected.liquidation.terminatedIntervals).toEqual([]);
    expect(scenario.expected.liquidation.homeownerSurplus).toEqual([]);
  });

  it("caps token distributions and isolates homeowner surplus", () => {
    const scenario = requireScenario(surplus);
    const tokenTotal =
      scenario.expected.liquidation.tokenDistributions.reduce(
        (sum, distribution) => sum + distribution.amountCents,
        0,
      );
    expect(scenario.expected.liquidation.proceedsCents).toBe(20_000);
    expect(tokenTotal).toBe(17_500);
    expect(scenario.expected.liquidation.homeownerSurplus).toEqual([
      {
        destinationId: "homeowner-surplus-pool",
        destinationType: "homeowner-surplus-pool",
        amountCents: 2_500,
      },
    ]);
  });
});

describe("canonical scenario validation failures", () => {
  it("rejects an unsupported schema version with a stable code and path", () => {
    const mutated = clone(deficient);
    mutated.schemaVersion = 2;
    requireInvalidPath(mutated, "$.schemaVersion");
  });

  it("rejects fractional cents", () => {
    const mutated = clone(deficient);
    const expected = mutated.expected as Record<string, unknown>;
    expected.issuedSupplyCents = 17_500.5;
    requireInvalidPath(mutated, "$.expected.issuedSupplyCents");
  });

  it("rejects a missing required array", () => {
    const mutated = clone(deficient);
    const inputs = mutated.inputs as Record<string, unknown>;
    delete inputs.members;
    requireInvalidPath(mutated, "$.inputs.members");
  });

  it("rejects an out-of-order action sequence", () => {
    const mutated = clone(deficient);
    const actions = mutated.actions as Record<string, unknown>[];
    if (actions[2] === undefined) throw new Error("fixture action missing");
    actions[2].sequence = 9;
    requireInvalidPath(mutated, "$.actions[2].sequence");
  });

  it("rejects an inverted seniority interval", () => {
    const mutated = clone(deficient);
    const expected = mutated.expected as Record<string, unknown>;
    const intervals =
      expected.preLiquidationIntervals as Record<string, unknown>[];
    if (intervals[0] === undefined) throw new Error("fixture interval missing");
    intervals[0].end = 0;
    requireInvalidPath(mutated, "$.expected.preLiquidationIntervals[0].end");
  });

  it("rejects an unknown action type", () => {
    const mutated = clone(deficient);
    const actions = mutated.actions as Record<string, unknown>[];
    if (actions[0] === undefined) throw new Error("fixture action missing");
    actions[0].type = "invented-action";
    requireInvalidPath(mutated, "$.actions[0].type");
  });

  it("rejects a malformed invariant identifier", () => {
    const mutated = clone(deficient);
    const checks = mutated.invariantChecks as Record<string, unknown>[];
    if (checks[0] === undefined) throw new Error("fixture check missing");
    checks[0].invariantId = "capacity-is-fine";
    requireInvalidPath(mutated, "$.invariantChecks[0].invariantId");
  });
});```

$ test "$(wc -l < packages/domain/src/canonical-scenarios.test.ts)" -le 360
**Output:** Focused tests cover all canonical results plus invalid version, cents, arrays, order, intervals, action types, and invariant identifiers.

**Status:** Step 8 complete.

**Next:** Step 9 — Run focused runtime verification.

---

## Step 9 — Run focused runtime verification

**Input:** The validator, three JSON vectors, and focused runtime tests.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- --run src/canonical-scenarios.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/canonical-scenarios.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 11[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m15 passed[39m[22m[90m (15)[39m
[2m   Start at [22m 22:16:37
[2m   Duration [22m 192ms[2m (transform 52ms, setup 0ms, import 72ms, tests 11ms, environment 0ms)[22m

```

**Output:** The canonical vectors pass and malformed variants fail at their declared paths.

**Status:** Step 9 complete.

**Next:** Step 10 — Add compile-time schema safeguards.

---

## Step 10 — Add compile-time schema safeguards

**Input:** The exported readonly version-1 scenario vocabulary.

**Action:** Create `packages/domain/src/canonical-scenarios.type-test.ts` with the supplied assertions.

**Editor command:** `code packages/domain/src/canonical-scenarios.type-test.ts`

**Resulting file:**

```text
import {
  validateCanonicalScenario,
  type CanonicalActionV1,
  type CanonicalScenarioV1,
} from "./canonical-scenarios.js";

declare const scenario: CanonicalScenarioV1;

const version: 1 = scenario.schemaVersion;
const action: CanonicalActionV1 | undefined = scenario.actions[0];
const result = validateCanonicalScenario({});

if (result.ok) {
  const validated: CanonicalScenarioV1 = result.value;
  void validated;
} else {
  const code: "invalid-input" = result.error.code;
  void code;
}

// @ts-expect-error — schema version 2 requires a future scenario type.
const unsupportedVersion: 2 = scenario.schemaVersion;

// @ts-expect-error — the scenario identity is readonly.
scenario.scenarioId = "replacement";

// @ts-expect-error — action collections are readonly.
scenario.actions.push(action);

// @ts-expect-error — money must not become a display string.
const displayMoney: string = scenario.expected.issuedSupplyCents;

// @ts-expect-error — a known success has no error branch.
if (result.ok) result.error;

// @ts-expect-error — a known failure has no value branch.
if (!result.ok) result.value;

void version;
void unsupportedVersion;
void displayMoney;```

$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/canonical-scenarios.test.ts(1,30): error TS2591: Cannot find name 'node:fs'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/canonical-scenarios.test.ts(14,11): error TS2304: Cannot find name 'URL'.
src/canonical-scenarios.test.ts(14,63): error TS2339: Property 'url' does not exist on type 'ImportMeta'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 11 — Prove an invalid vector fails clearly

**Input:** The passing deficient fixture with `schemaVersion: 1`.

**Temporary action:** Copy the exact fixture to `/tmp`, then change only `schemaVersion` to `2` in the repository file.

**Commands and output:**

```text
$ cp test-vectors/v1/deficient-liquidation.json /tmp/WO-014-deficient-liquidation.json

$ node -e mutate-schema-version test-vectors/v1/deficient-liquidation.json

$ sed -n 1,12p test-vectors/v1/deficient-liquidation.json
{
  "schemaVersion": 2,
  "scenarioId": "scenario-deficient-liquidation-v1",
  "title": "Canonical deficient liquidation",
  "description": "Pooled proceeds pay the oldest 16000 of 17500 live claim cents.",
  "inputs": {
    "properties": [
      {
        "propertyId": "property-a",
        "approvedValueCents": 50000000,
        "seniorDebtCents": 10000000,
        "expectedCapacityContributionCents": 20000000
```

**Output:** One backed-up, deliberately invalid fixture is ready for the required failure.

**Status:** Temporary invalid state created; expected failure is required.

**Next:** Step 11B — Run the command that must fail.

**Expected result:** The focused canonical scenario suite must return a nonzero status because a version-2 file is stored in the version-1 directory.

```text
$ npm test --workspace packages/domain -- --run src/canonical-scenarios.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/canonical-scenarios.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m | [22m[31m10 failed[39m[2m)[22m[32m 50[2mms[22m[39m
[31m     [31m×[31m validates the deficient version-1 vector[39m[32m 18[2mms[22m[39m
     [32m✓[39m validates the exact version-1 vector[32m 3[2mms[22m[39m
     [32m✓[39m validates the surplus version-1 vector[32m 1[2mms[22m[39m
[31m     [31m×[31m records the shared property capacity calculation[39m[32m 2[2mms[22m[39m
[31m     [31m×[31m records the same pre-liquidation balances and intervals[39m[32m 2[2mms[22m[39m
[31m     [31m×[31m records the deficient result exactly[39m[32m 1[2mms[22m[39m
     [32m✓[39m records exact payment with no deficiency or surplus[32m 3[2mms[22m[39m
     [32m✓[39m caps token distributions and isolates homeowner surplus[32m 1[2mms[22m[39m
     [32m✓[39m rejects an unsupported schema version with a stable code and path[32m 1[2mms[22m[39m
[31m     [31m×[31m rejects fractional cents[39m[32m 5[2mms[22m[39m
[31m     [31m×[31m rejects a missing required array[39m[32m 2[2mms[22m[39m
[31m     [31m×[31m rejects an out-of-order action sequence[39m[32m 2[2mms[22m[39m
[31m     [31m×[31m rejects an inverted seniority interval[39m[32m 2[2mms[22m[39m
[31m     [31m×[31m rejects an unknown action type[39m[32m 2[2mms[22m[39m
[31m     [31m×[31m rejects a malformed invariant identifier[39m[32m 2[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 10 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario fixtures[2m > [22mvalidates the deficient version-1 vector
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m requireScenario src/canonical-scenarios.test.ts:[2m28:21[22m[39m
    [90m 26|[39m [35mconst[39m requireScenario [33m=[39m (value[33m:[39m unknown)[33m:[39m [33mCanonicalScenarioV1[39m [33m=>[39m {
    [90m 27|[39m   [35mconst[39m result [33m=[39m [34mvalidateCanonicalScenario[39m(value)[33m;[39m
    [90m 28|[39m   [34mexpect[39m(result[33m.[39mok)[33m.[39m[34mtoBe[39m([35mtrue[39m)[33m;[39m
    [90m   |[39m                     [31m^[39m
    [90m 29|[39m   [35mif[39m ([33m![39mresult[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"canonical fixture must validate"[39m)[33m;[39m
    [90m 30|[39m   [35mreturn[39m result[33m.[39mvalue[33m;[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m47:22[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario fixtures[2m > [22mrecords the shared property capacity calculation
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m requireScenario src/canonical-scenarios.test.ts:[2m28:21[22m[39m
    [90m 26|[39m [35mconst[39m requireScenario [33m=[39m (value[33m:[39m unknown)[33m:[39m [33mCanonicalScenarioV1[39m [33m=>[39m {
    [90m 27|[39m   [35mconst[39m result [33m=[39m [34mvalidateCanonicalScenario[39m(value)[33m;[39m
    [90m 28|[39m   [34mexpect[39m(result[33m.[39mok)[33m.[39m[34mtoBe[39m([35mtrue[39m)[33m;[39m
    [90m   |[39m                     [31m^[39m
    [90m 29|[39m   [35mif[39m ([33m![39mresult[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"canonical fixture must validate"[39m)[33m;[39m
    [90m 30|[39m   [35mreturn[39m result[33m.[39mvalue[33m;[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m56:24[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario fixtures[2m > [22mrecords the same pre-liquidation balances and intervals
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m requireScenario src/canonical-scenarios.test.ts:[2m28:21[22m[39m
    [90m 26|[39m [35mconst[39m requireScenario [33m=[39m (value[33m:[39m unknown)[33m:[39m [33mCanonicalScenarioV1[39m [33m=>[39m {
    [90m 27|[39m   [35mconst[39m result [33m=[39m [34mvalidateCanonicalScenario[39m(value)[33m;[39m
    [90m 28|[39m   [34mexpect[39m(result[33m.[39mok)[33m.[39m[34mtoBe[39m([35mtrue[39m)[33m;[39m
    [90m   |[39m                     [31m^[39m
    [90m 29|[39m   [35mif[39m ([33m![39mresult[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"canonical fixture must validate"[39m)[33m;[39m
    [90m 30|[39m   [35mreturn[39m result[33m.[39mvalue[33m;[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m68:24[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario fixtures[2m > [22mrecords the deficient result exactly
[31m[1mAssertionError[22m: expected false to be true // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- true[39m
[31m+ false[39m

[36m [2m❯[22m requireScenario src/canonical-scenarios.test.ts:[2m28:21[22m[39m
    [90m 26|[39m [35mconst[39m requireScenario [33m=[39m (value[33m:[39m unknown)[33m:[39m [33mCanonicalScenarioV1[39m [33m=>[39m {
    [90m 27|[39m   [35mconst[39m result [33m=[39m [34mvalidateCanonicalScenario[39m(value)[33m;[39m
    [90m 28|[39m   [34mexpect[39m(result[33m.[39mok)[33m.[39m[34mtoBe[39m([35mtrue[39m)[33m;[39m
    [90m   |[39m                     [31m^[39m
    [90m 29|[39m   [35mif[39m ([33m![39mresult[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"canonical fixture must validate"[39m)[33m;[39m
    [90m 30|[39m   [35mreturn[39m result[33m.[39mvalue[33m;[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m85:22[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario validation failures[2m > [22mrejects fractional cents
[31m[1mAssertionError[22m: expected '$.schemaVersion' to be '$.expected.issuedSupplyCents' // Object.is equality[39m

Expected: [32m"$.[7mexpected.issuedSupplyCents[27m"[39m
Received: [31m"$.[7mschemaVersion[27m"[39m

[36m [2m❯[22m requireInvalidPath src/canonical-scenarios.test.ts:[2m38:38[22m[39m
    [90m 36|[39m   [35mif[39m (result[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"mutated fixture must be rejected"[39m)[33m;[39m
    [90m 37|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mcode)[33m.[39m[34mtoBe[39m([32m"invalid-input"[39m)[33m;[39m
    [90m 38|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mdetails[33m?.[39mpath)[33m.[39m[34mtoBe[39m(path)[33m;[39m
    [90m   |[39m                                      [31m^[39m
    [90m 39|[39m }[33m;[39m
    [90m 40|[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m153:5[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario validation failures[2m > [22mrejects a missing required array
[31m[1mAssertionError[22m: expected '$.schemaVersion' to be '$.inputs.members' // Object.is equality[39m

Expected: [32m"$.[7minputs.members[27m"[39m
Received: [31m"$.[7mschemaVersion[27m"[39m

[36m [2m❯[22m requireInvalidPath src/canonical-scenarios.test.ts:[2m38:38[22m[39m
    [90m 36|[39m   [35mif[39m (result[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"mutated fixture must be rejected"[39m)[33m;[39m
    [90m 37|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mcode)[33m.[39m[34mtoBe[39m([32m"invalid-input"[39m)[33m;[39m
    [90m 38|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mdetails[33m?.[39mpath)[33m.[39m[34mtoBe[39m(path)[33m;[39m
    [90m   |[39m                                      [31m^[39m
    [90m 39|[39m }[33m;[39m
    [90m 40|[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m160:5[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario validation failures[2m > [22mrejects an out-of-order action sequence
[31m[1mAssertionError[22m: expected '$.schemaVersion' to be '$.actions[2].sequence' // Object.is equality[39m

Expected: [32m"$.[7mactions[2].sequence[27m"[39m
Received: [31m"$.[7mschemaVersion[27m"[39m

[36m [2m❯[22m requireInvalidPath src/canonical-scenarios.test.ts:[2m38:38[22m[39m
    [90m 36|[39m   [35mif[39m (result[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"mutated fixture must be rejected"[39m)[33m;[39m
    [90m 37|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mcode)[33m.[39m[34mtoBe[39m([32m"invalid-input"[39m)[33m;[39m
    [90m 38|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mdetails[33m?.[39mpath)[33m.[39m[34mtoBe[39m(path)[33m;[39m
    [90m   |[39m                                      [31m^[39m
    [90m 39|[39m }[33m;[39m
    [90m 40|[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m168:5[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario validation failures[2m > [22mrejects an inverted seniority interval
[31m[1mAssertionError[22m: expected '$.schemaVersion' to be '$.expected.preLiquidationIntervals[0]…' // Object.is equality[39m

Expected: [32m"$.[7mexpected.preLiquidationIntervals[0].end[27m"[39m
Received: [31m"$.[7mschemaVersion[27m"[39m

[36m [2m❯[22m requireInvalidPath src/canonical-scenarios.test.ts:[2m38:38[22m[39m
    [90m 36|[39m   [35mif[39m (result[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"mutated fixture must be rejected"[39m)[33m;[39m
    [90m 37|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mcode)[33m.[39m[34mtoBe[39m([32m"invalid-input"[39m)[33m;[39m
    [90m 38|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mdetails[33m?.[39mpath)[33m.[39m[34mtoBe[39m(path)[33m;[39m
    [90m   |[39m                                      [31m^[39m
    [90m 39|[39m }[33m;[39m
    [90m 40|[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m178:5[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario validation failures[2m > [22mrejects an unknown action type
[31m[1mAssertionError[22m: expected '$.schemaVersion' to be '$.actions[0].type' // Object.is equality[39m

Expected: [32m"$.[7mactions[0].type[27m"[39m
Received: [31m"$.[7mschemaVersion[27m"[39m

[36m [2m❯[22m requireInvalidPath src/canonical-scenarios.test.ts:[2m38:38[22m[39m
    [90m 36|[39m   [35mif[39m (result[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"mutated fixture must be rejected"[39m)[33m;[39m
    [90m 37|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mcode)[33m.[39m[34mtoBe[39m([32m"invalid-input"[39m)[33m;[39m
    [90m 38|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mdetails[33m?.[39mpath)[33m.[39m[34mtoBe[39m(path)[33m;[39m
    [90m   |[39m                                      [31m^[39m
    [90m 39|[39m }[33m;[39m
    [90m 40|[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m186:5[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯[22m[39m

[41m[1m FAIL [22m[49m src/canonical-scenarios.test.ts[2m > [22mcanonical scenario validation failures[2m > [22mrejects a malformed invariant identifier
[31m[1mAssertionError[22m: expected '$.schemaVersion' to be '$.invariantChecks[0].invariantId' // Object.is equality[39m

Expected: [32m"$.[7minvariantChecks[0].invariantId[27m"[39m
Received: [31m"$.[7mschemaVersion[27m"[39m

[36m [2m❯[22m requireInvalidPath src/canonical-scenarios.test.ts:[2m38:38[22m[39m
    [90m 36|[39m   [35mif[39m (result[33m.[39mok) [35mthrow[39m [35mnew[39m [33mError[39m([32m"mutated fixture must be rejected"[39m)[33m;[39m
    [90m 37|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mcode)[33m.[39m[34mtoBe[39m([32m"invalid-input"[39m)[33m;[39m
    [90m 38|[39m   [34mexpect[39m(result[33m.[39merror[33m.[39mdetails[33m?.[39mpath)[33m.[39m[34mtoBe[39m(path)[33m;[39m
    [90m   |[39m                                      [31m^[39m
    [90m 39|[39m }[33m;[39m
    [90m 40|[39m
[90m [2m❯[22m src/canonical-scenarios.test.ts:[2m194:5[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m10 failed[39m[22m[2m | [22m[1m[32m5 passed[39m[22m[90m (15)[39m
[2m   Start at [22m 22:35:27
[2m   Duration [22m 364ms[2m (transform 92ms, setup 0ms, import 116ms, tests 50ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/canonical-scenarios.test.ts
```

**Observed result:** The invalid vector caused the required focused-suite failure.

**Status:** Expected failure confirmed; restoration is required.

**Next:** Step 12 — Restore the canonical vector and reverify.

---

## Step 12 — Restore the canonical vector and reverify

**Input:** The temporary version-2 fixture and its exact valid backup.

**Commands and output:**

```text
$ test -f /tmp/WO-014-deficient-liquidation.json

$ cp /tmp/WO-014-deficient-liquidation.json test-vectors/v1/deficient-liquidation.json

$ node -e print-schema-version test-vectors/v1/deficient-liquidation.json
1

$ npm test --workspace packages/domain -- --run src/canonical-scenarios.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/canonical-scenarios.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 11[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m15 passed[39m[22m[90m (15)[39m
[2m   Start at [22m 22:35:46
[2m   Duration [22m 263ms[2m (transform 100ms, setup 0ms, import 121ms, tests 11ms, environment 0ms)[22m

```

**Output:** The version-1 fixture is restored and the focused suite passes again.

**Status:** Step 12 complete.

**Next:** Step 13 — Verify the complete domain package.

---

## Step 13 — Verify the complete domain package

**Input:** The restored canonical vectors, validator, exports, runtime tests, and compile-time safeguards.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/canonical-scenarios.test.ts(1,30): error TS2591: Cannot find name 'node:fs'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/canonical-scenarios.test.ts(14,11): error TS2304: Cannot find name 'URL'.
src/canonical-scenarios.test.ts(14,63): error TS2339: Property 'url' does not exist on type 'ImportMeta'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 14 — Verify the complete Economic Union workspace

**Input:** The passing domain package and unchanged protocol and Foundry boundaries.

**Commands and output:**

```text
$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/canonical-scenarios.test.ts(1,30): error TS2591: Cannot find name 'node:fs'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/canonical-scenarios.test.ts(14,11): error TS2304: Cannot find name 'URL'.
src/canonical-scenarios.test.ts(14,63): error TS2339: Property 'url' does not exist on type 'ImportMeta'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json

---

## Step 15 — Retest the adjacent event logger

**Input:** The passing Economic Union workspace after adding shared data and a pure validator.

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
 ✓ test/index.spec.js (4 tests) 155ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  22:36:48
   Duration  1.74s (transform 61ms, setup 0ms, collect 81ms, tests 155ms, environment 0ms, prepare 151ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** The adjacent Point event logger remains unaffected.

**Status:** Step 15 complete.

**Next:** Step 16 — Inspect and summarize WO-014.

---

## Step 16 — Inspect and summarize WO-014

**Input:** The complete passing WO-014 implementation and verification evidence.

**Expected changed files:**

- `test-vectors/README.md`
- `test-vectors/v1/deficient-liquidation.json`
- `test-vectors/v1/exact-liquidation.json`
- `test-vectors/v1/surplus-liquidation.json`
- `packages/domain/src/canonical-scenarios.ts`
- `packages/domain/src/canonical-scenarios.test.ts`
- `packages/domain/src/canonical-scenarios.type-test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-014-execution.md`

**Commands and output:**

```text
$ git status --short
 M packages/domain/src/index.ts
?? docs/work-orders/WO-014-execution.md
?? packages/domain/src/canonical-scenarios.test.ts
?? packages/domain/src/canonical-scenarios.ts
?? packages/domain/src/canonical-scenarios.type-test.ts
?? test-vectors/README.md
?? test-vectors/v1/

$ git diff --check

$ git diff --stat
 code/economic-union/packages/domain/src/index.ts | 3 ++-
 1 file changed, 2 insertions(+), 1 deletion(-)

$ git diff -- packages/domain/src/index.ts
diff --git a/code/economic-union/packages/domain/src/index.ts b/code/economic-union/packages/domain/src/index.ts
index 6aef371..fe4e2da 100644
--- a/code/economic-union/packages/domain/src/index.ts
+++ b/code/economic-union/packages/domain/src/index.ts
@@ -7,4 +7,5 @@ export function describeAmount(amount: Cents): string {
 }

 export * from "./identifiers.js";
-export * from "./domain-errors.js";
\ No newline at end of file
+export * from "./domain-errors.js";
+export * from "./canonical-scenarios.js";
\ No newline at end of file

$ find test-vectors -maxdepth 2 -type f | sort
test-vectors/.gitkeep
test-vectors/README.md
test-vectors/v1/deficient-liquidation.json
test-vectors/v1/exact-liquidation.json
test-vectors/v1/surplus-liquidation.json

$ rg -n "schemaVersion.: 2|TEMPORARY:|invented-action" test-vectors packages/domain/src || true
packages/domain/src/canonical-scenarios.test.ts:185:    actions[0].type = "invented-action";
```

**Total input:** The committed pure domain vocabulary plus the Phase 0 human-calculated scenarios and invariant register.

**Total output:** Three portable version-1 scenario vectors, human documentation, a readonly schema, a pure validator, runtime and compile-time safeguards, public export, and execution evidence.

**Exclusions preserved:** No executable property, pool, deposit, transfer, event, or liquidation behavior was added.

**Status:** Step 16 complete.

**Next:** Step 17 — Stage only WO-014.

---

## Step 17 — Stage only WO-014

**Input:** The inspected worktree containing only the declared WO-014 changes.

**Commands and output:**

```text
$ git add [nine explicit WO-014 paths]

$ git diff --cached --check
code/economic-union/docs/work-orders/WO-014-execution.md:1674: trailing whitespace.
+
---

## Step 18 — Final verification and commit authorization

**Input:** The explicitly staged WO-014 vectors, validator, tests, export, documentation, and execution record.

**Commands and output:**

```text
$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/canonical-scenarios.test.ts(1,30): error TS2591: Cannot find name 'node:fs'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
src/canonical-scenarios.test.ts(14,11): error TS2304: Cannot find name 'URL'.
src/canonical-scenarios.test.ts(14,63): error TS2339: Property 'url' does not exist on type 'ImportMeta'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json

---

## Step 18 correction — Repair Node test-type configuration

**Problem discovered:** The original final verification failed because
`canonical-scenarios.test.ts` uses Node filesystem and URL APIs, but the domain
test TypeScript configuration did not load Node type definitions. The original
Step 18 script incorrectly continued and created commit `20efc00` after that
failure.

**Repair:**

- Added `@types/node` to the domain package development dependencies.
- Added `"node"` to `compilerOptions.types` in
  `packages/domain/tsconfig.test.json`.
- Preserved `"vitest/globals"` in the same type list.

**Focused verification:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json