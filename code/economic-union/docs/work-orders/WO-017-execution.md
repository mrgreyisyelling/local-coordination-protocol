# WO-017 Execution Record — Implement Property Capacity Contribution

## Purpose

Calculate one Property capacity contribution from an approved valuation and recognized senior debt.

---

## Step 1 — Confirm WO-016 and initialize the execution record

**Input:** The committed and verified WO-016 valuation history.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-017-execution.md

$ git log -3 --oneline --decorate
6bff4a1 (HEAD -> main, origin/main) end of WO-16
135e723 feat(domain): add append-only property valuations
ac8483f feat(domain): implement append-only valuations

$ git diff --check

$ test -f packages/domain/src/valuations.ts
[valuations.ts exists]

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
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 16[2mms[22m[39m

[2m Test Files [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m      Tests [22m [1m[32m233 passed[39m[22m[90m (233)[39m
[2m   Start at [22m 06:56:54
[2m   Duration [22m 327ms[2m (transform 827ms, setup 0ms, import 1.19s, tests 134ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 06:56:55
[2m   Duration [22m 172ms[2m (transform 44ms, setup 0ms, import 59ms, tests 3ms, environment 0ms)[22m

```

**Output:** The WO-016 boundary and complete passing baseline are recorded.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the current domain boundary.

---

## Step 2 — Inspect the current domain boundary

**Input:** The verified WO-016 domain package.

**Commands and output:**

```text
$ find packages/domain -maxdepth 3 -type f -not -path "*/dist/*" | sort
packages/domain/package.json
packages/domain/src/canonical-scenarios.test.ts
packages/domain/src/canonical-scenarios.ts
packages/domain/src/canonical-scenarios.type-test.ts
packages/domain/src/domain-errors.test.ts
packages/domain/src/domain-errors.ts
packages/domain/src/domain-errors.type-test.ts
packages/domain/src/domain-statuses.test.ts
packages/domain/src/domain-statuses.ts
packages/domain/src/domain-statuses.type-test.ts
packages/domain/src/identifiers.test.ts
packages/domain/src/identifiers.ts
packages/domain/src/identifiers.type-test.ts
packages/domain/src/index.test.ts
packages/domain/src/index.ts
packages/domain/src/properties-public.test.ts
packages/domain/src/properties.test.ts
packages/domain/src/properties.ts
packages/domain/src/properties.type-test.ts
packages/domain/src/valuations-public.test.ts
packages/domain/src/valuations.test.ts
packages/domain/src/valuations.ts
packages/domain/src/valuations.type-test.ts
packages/domain/src/value-types.test.ts
packages/domain/src/value-types.ts
packages/domain/src/value-types.type-test.ts
packages/domain/tsconfig.json
packages/domain/tsconfig.test.json

$ sed -n "1,240p" packages/domain/src/value-types.ts
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
}
$ sed -n "1,620p" packages/domain/src/valuations.ts
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";
import type { PropertyId } from "./identifiers.js";
import type { Property } from "./properties.js";
import {
  cents,
  compareEventSequences,
  eventSequence,
  type Cents,
  type EventSequence,
} from "./value-types.js";

export interface ValuationProposalInput {
  readonly sequence: number;
  readonly proposedValueCents: number;
  readonly proposedByReference: string;
  readonly evidenceReferences: readonly string[];
}

export interface ValuationApprovalInput {
  readonly sequence: number;
  readonly proposalSequence: number;
  readonly approvedValueCents: number;
  readonly approvedByReference: string;
  readonly evidenceReferences: readonly string[];
}

export interface ValuationProposalEntry {
  readonly kind: "valuation-proposed";
  readonly sequence: EventSequence;
  readonly proposedValueCents: Cents;
  readonly proposedByReference: string;
  readonly evidenceReferences: readonly string[];
}

export interface ValuationApprovalEntry {
  readonly kind: "valuation-approved";
  readonly sequence: EventSequence;
  readonly proposalSequence: EventSequence;
  readonly approvedValueCents: Cents;
  readonly approvedByReference: string;
  readonly evidenceReferences: readonly string[];
}

export type PropertyValuationEntry =
  | ValuationProposalEntry
  | ValuationApprovalEntry;

export interface PropertyValuationHistory {
  readonly propertyId: PropertyId;
  readonly entries: readonly PropertyValuationEntry[];
}

export interface EffectivePropertyValuation {
  readonly propertyId: PropertyId;
  readonly proposalSequence: EventSequence;
  readonly approvalSequence: EventSequence;
  readonly proposedValueCents: Cents;
  readonly approvedValueCents: Cents;
  readonly proposedByReference: string;
  readonly approvedByReference: string;
  readonly proposalEvidenceReferences: readonly string[];
  readonly approvalEvidenceReferences: readonly string[];
}

type InputRecord = Readonly<Record<string, unknown>>;

type InvalidValuationResult<T = never> = DomainResult<
  T,
  DomainError<"invalid-input">
>;

type ApprovalHistoryResult = DomainResult<
  PropertyValuationHistory,
  DomainError<
    "invalid-input" | "not-found" | "already-processed"
  >
>;

function isInputRecord(value: unknown): value is InputRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function invalidValuationInput<T = never>(
  path: string,
  expected: string,
): InvalidValuationResult<T> {
  return domainFailure(
    domainError(
      "invalid-input",
      `Invalid Property valuation input at ${path}.`,
      {
        path,
        expected,
      },
    ),
  );
}

function readRequiredString(
  record: InputRecord,
  key: string,
  path: string,
): InvalidValuationResult<string> {
  const value = record[key];

  if (typeof value !== "string") {
    return invalidValuationInput(path, "a nonempty string");
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    return invalidValuationInput(path, "a nonempty string");
  }

  return domainSuccess(normalized);
}

function readEventSequence(
  record: InputRecord,
  key: string,
  path: string,
): InvalidValuationResult<EventSequence> {
  const value = record[key];

  if (typeof value !== "number") {
    return invalidValuationInput(
      path,
      "a nonnegative safe integer EventSequence",
    );
  }

  try {
    return domainSuccess(eventSequence(value));
  } catch {
    return invalidValuationInput(
      path,
      "a nonnegative safe integer EventSequence",
    );
  }
}

function readCents(
  record: InputRecord,
  key: string,
  path: string,
): InvalidValuationResult<Cents> {
  const value = record[key];

  if (typeof value !== "number") {
    return invalidValuationInput(
      path,
      "a nonnegative safe integer number of cents",
    );
  }

  try {
    return domainSuccess(cents(value));
  } catch {
    return invalidValuationInput(
      path,
      "a nonnegative safe integer number of cents",
    );
  }
}

function readEvidenceReferences(
  value: unknown,
  path: string,
): InvalidValuationResult<readonly string[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return invalidValuationInput(
      path,
      "a nonempty array of nonempty strings",
    );
  }

  const references: string[] = [];

  for (const [index, reference] of value.entries()) {
    const entryPath = `${path}[${index}]`;

    if (typeof reference !== "string") {
      return invalidValuationInput(
        entryPath,
        "a nonempty string",
      );
    }

    const normalized = reference.trim();

    if (normalized.length === 0) {
      return invalidValuationInput(
        entryPath,
        "a nonempty string",
      );
    }

    references.push(normalized);
  }

  return domainSuccess(Object.freeze(references));
}

function finalSequence(
  history: PropertyValuationHistory,
): EventSequence | undefined {
  return history.entries.at(-1)?.sequence;
}

function readAppendSequence(
  history: PropertyValuationHistory,
  record: InputRecord,
): InvalidValuationResult<EventSequence> {
  const sequenceResult = readEventSequence(
    record,
    "sequence",
    "$.sequence",
  );

  if (!sequenceResult.ok) {
    return sequenceResult;
  }

  const latest = finalSequence(history);

  if (
    latest !== undefined &&
    compareEventSequences(sequenceResult.value, latest) <= 0
  ) {
    return invalidValuationInput(
      "$.sequence",
      `an EventSequence greater than ${latest}`,
    );
  }

  return sequenceResult;
}

function freezeHistory(
  propertyId: PropertyId,
  entries: readonly PropertyValuationEntry[],
): PropertyValuationHistory {
  return Object.freeze({
    propertyId,
    entries: Object.freeze([...entries]),
  });
}

function findProposal(
  history: PropertyValuationHistory,
  sequence: EventSequence,
): ValuationProposalEntry | undefined {
  return history.entries.find(
    (
      entry,
    ): entry is ValuationProposalEntry =>
      entry.kind === "valuation-proposed" &&
      entry.sequence === sequence,
  );
}

function findApproval(
  history: PropertyValuationHistory,
  proposalSequence: EventSequence,
): ValuationApprovalEntry | undefined {
  return history.entries.find(
    (
      entry,
    ): entry is ValuationApprovalEntry =>
      entry.kind === "valuation-approved" &&
      entry.proposalSequence === proposalSequence,
  );
}

function effectiveFromApproval(
  history: PropertyValuationHistory,
  approval: ValuationApprovalEntry,
): EffectivePropertyValuation {
  const proposal = findProposal(
    history,
    approval.proposalSequence,
  );

  if (proposal === undefined) {
    throw new Error(
      "Valuation history contains an approval without its proposal",
    );
  }

  return Object.freeze({
    propertyId: history.propertyId,
    proposalSequence: proposal.sequence,
    approvalSequence: approval.sequence,
    proposedValueCents: proposal.proposedValueCents,
    approvedValueCents: approval.approvedValueCents,
    proposedByReference: proposal.proposedByReference,
    approvedByReference: approval.approvedByReference,
    proposalEvidenceReferences:
      proposal.evidenceReferences,
    approvalEvidenceReferences:
      approval.evidenceReferences,
  });
}

export function createPropertyValuationHistory(
  property: Property,
): PropertyValuationHistory {
  return freezeHistory(property.id, []);
}

export function recordValuationProposal(
  history: PropertyValuationHistory,
  input: unknown,
): DomainResult<
  PropertyValuationHistory,
  DomainError<"invalid-input">
> {
  if (!isInputRecord(input)) {
    return invalidValuationInput(
      "$",
      "a valuation proposal object",
    );
  }

  const sequenceResult = readAppendSequence(
    history,
    input,
  );
  if (!sequenceResult.ok) {
    return sequenceResult;
  }

  const valueResult = readCents(
    input,
    "proposedValueCents",
    "$.proposedValueCents",
  );
  if (!valueResult.ok) {
    return valueResult;
  }

  const proposerResult = readRequiredString(
    input,
    "proposedByReference",
    "$.proposedByReference",
  );
  if (!proposerResult.ok) {
    return proposerResult;
  }

  const evidenceResult = readEvidenceReferences(
    input.evidenceReferences,
    "$.evidenceReferences",
  );
  if (!evidenceResult.ok) {
    return evidenceResult;
  }

  const proposal: ValuationProposalEntry =
    Object.freeze({
      kind: "valuation-proposed",
      sequence: sequenceResult.value,
      proposedValueCents: valueResult.value,
      proposedByReference: proposerResult.value,
      evidenceReferences: evidenceResult.value,
    });

  return domainSuccess(
    freezeHistory(
      history.propertyId,
      [...history.entries, proposal],
    ),
  );
}

export function recordValuationApproval(
  history: PropertyValuationHistory,
  input: unknown,
): ApprovalHistoryResult {
  if (!isInputRecord(input)) {
    return invalidValuationInput(
      "$",
      "a valuation approval object",
    );
  }

  const sequenceResult = readAppendSequence(
    history,
    input,
  );
  if (!sequenceResult.ok) {
    return sequenceResult;
  }

  const proposalSequenceResult = readEventSequence(
    input,
    "proposalSequence",
    "$.proposalSequence",
  );
  if (!proposalSequenceResult.ok) {
    return proposalSequenceResult;
  }

  const proposal = findProposal(
    history,
    proposalSequenceResult.value,
  );

  if (proposal === undefined) {
    return domainFailure(
      domainError(
        "not-found",
        "The referenced valuation proposal does not exist.",
        {
          proposalSequence:
            proposalSequenceResult.value,
        },
      ),
    );
  }

  if (
    findApproval(
      history,
      proposalSequenceResult.value,
    ) !== undefined
  ) {
    return domainFailure(
      domainError(
        "already-processed",
        "The referenced valuation proposal is already approved.",
        {
          proposalSequence:
            proposalSequenceResult.value,
        },
      ),
    );
  }

  const valueResult = readCents(
    input,
    "approvedValueCents",
    "$.approvedValueCents",
  );
  if (!valueResult.ok) {
    return valueResult;
  }

  const approverResult = readRequiredString(
    input,
    "approvedByReference",
    "$.approvedByReference",
  );
  if (!approverResult.ok) {
    return approverResult;
  }

  const evidenceResult = readEvidenceReferences(
    input.evidenceReferences,
    "$.evidenceReferences",
  );
  if (!evidenceResult.ok) {
    return evidenceResult;
  }

  const approval: ValuationApprovalEntry =
    Object.freeze({
      kind: "valuation-approved",
      sequence: sequenceResult.value,
      proposalSequence:
        proposalSequenceResult.value,
      approvedValueCents: valueResult.value,
      approvedByReference: approverResult.value,
      evidenceReferences: evidenceResult.value,
    });

  return domainSuccess(
    freezeHistory(
      history.propertyId,
      [...history.entries, approval],
    ),
  );
}

export function effectivePropertyValuationAt(
  history: PropertyValuationHistory,
  sequence: EventSequence,
): EffectivePropertyValuation | undefined {
  let effective:
    | ValuationApprovalEntry
    | undefined;

  for (const entry of history.entries) {
    if (
      entry.kind === "valuation-approved" &&
      compareEventSequences(entry.sequence, sequence) <= 0
    ) {
      effective = entry;
    }
  }

  if (effective === undefined) {
    return undefined;
  }

  return effectiveFromApproval(history, effective);
}

export function currentEffectivePropertyValuation(
  history: PropertyValuationHistory,
): EffectivePropertyValuation | undefined {
  const latest = finalSequence(history);

  if (latest === undefined) {
    return undefined;
  }

  return effectivePropertyValuationAt(
    history,
    latest,
  );
}

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
  "src/**/*.test.ts",
  "src/**/*.type-test.ts"
]
}
$ rg -n "capacity|seniorDebt|mortgage" packages/domain/src || true
packages/domain/src/canonical-scenarios.ts:24:  readonly seniorDebtCents: number;
packages/domain/src/canonical-scenarios.ts:162:  if (!isCents(value.seniorDebtCents)) {
packages/domain/src/canonical-scenarios.ts:163:    return invalid(`${path}.seniorDebtCents`, "nonnegative safe integer cents");
packages/domain/src/canonical-scenarios.test.ts:54:  it("records the shared property capacity calculation", () => {
packages/domain/src/canonical-scenarios.test.ts:193:    checks[0].invariantId = "capacity-is-fine";
packages/domain/src/domain-errors.ts:13:  "insufficient-capacity",
packages/domain/src/valuations.test.ts:715:  it("contains no debt, capacity, pool, supply, or balance state", () => {
packages/domain/src/valuations.test.ts:728:      "seniorDebtCents",
packages/domain/src/valuations.test.ts:729:      "capacityContributionCents",
packages/domain/src/valuations.test.ts:731:      "capacityBasisPoints",
packages/domain/src/properties.type-test.ts:53:  property.seniorDebtCents;
packages/domain/src/properties.type-test.ts:55:  // @ts-expect-error Property creation contributes no capacity.
packages/domain/src/properties.type-test.ts:56:  property.capacityContributionCents;
packages/domain/src/properties.test.ts:320:  it("contains no valuation, debt, capacity, or ownership state", () => {
packages/domain/src/properties.test.ts:336:      "seniorDebtCents",
packages/domain/src/properties.test.ts:339:      "capacityContributionCents",
packages/domain/src/domain-errors.test.ts:28:  "insufficient-capacity",
packages/domain/src/domain-errors.test.ts:111:      "insufficient-capacity",
packages/domain/src/domain-errors.test.ts:112:      "The pool lacks enough unused capacity.",
packages/domain/src/domain-errors.test.ts:117:    expect(result.error.code).toBe("insufficient-capacity");
```

**Output:** The exact boundaries WO-017 will extend are recorded before editing.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the capacity contract.

---

## Step 3 — Record the Property capacity contract

**Input:** The master-plan WO-017 rule and inspected approved-valuation API.

## Contract

- Default rate is 6,000 basis points.
- Only an effective approved valuation drives capacity.
- Gross boundary rounds down.
- Senior debt is subtracted after the boundary.
- Contribution stops at zero.
- Multiplication avoids unsafe intermediates.
- Missing approval returns not-found.
- Results are frozen and history remains unchanged.

**Canonical A:** 50,000,000 × 6,000 ÷ 10,000 − 10,000,000 = 20,000,000 cents.

**Canonical B:** 30,000,000 × 6,000 ÷ 10,000 − 5,000,000 = 13,000,000 cents.

**Output:** The implementation contract is explicit.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the implementation.

---

## Step 4 — Create the Property capacity implementation

**Input:** The contract recorded in Step 3.

**Commands and output:**

```text
$ cat > packages/domain/src/property-capacity.ts <<'EOF'

$ sed -n "1,360p" packages/domain/src/property-capacity.ts
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

$ rg -n "^export (const|type|interface|function)" packages/domain/src/property-capacity.ts
25:export const PROTOTYPE_PROPERTY_CAPACITY_RATE =
28:export type PropertyCapacityRoundingMode = "floor";
30:export interface PropertyCapacityContribution {
82:export function calculatePropertyCapacityContribution(
121:export function propertyCapacityContributionAt(
149:export function currentPropertyCapacityContribution(
```

**Output:** Safe, floor-rounded one-Property contribution behavior exists.

**Status:** Step 4 complete.

**Next:** Step 5 — Create runtime tests.

---

## Step 5 — Create the Property capacity runtime tests

**Input:** The implementation from Step 4.

**Commands and output:**

```text
$ cat > packages/domain/src/property-capacity.test.ts <<'EOF'

$ rg -n "^  it\(" packages/domain/src/property-capacity.test.ts
148:  it("defines the prototype rate as 60 percent", () => {
154:  it("calculates canonical Property A as $200,000", () => {
168:  it("calculates canonical Property B as $130,000", () => {
182:  it("returns zero for a zero approved value", () => {
196:  it("returns zero when debt exactly equals the boundary", () => {
207:  it("returns zero when debt exceeds the boundary", () => {
218:  it("subtracts debt after calculating the percentage boundary", () => {
232:  it("rounds the gross boundary down before subtracting debt", () => {
260:  it("supports a validated custom capacity rate", () => {
285:  it("returns zero when the rate is zero", () => {
307:  it("handles the maximum safe approved value without unsafe multiplication", () => {
334:  it("returns not-found when no valuation is approved", () => {
359:  it("keeps an earlier approval effective after a newer unapproved proposal", () => {
380:  it("uses the valuation effective at the requested sequence", () => {
424:  it("returns not-found before the first approval sequence", () => {
451:  it("returns a frozen record with the valuation identity", () => {
475:  it("does not mutate valuation history", () => {

$ sed -n "1,760p" packages/domain/src/property-capacity.test.ts
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculatePropertyCapacityContribution,
  currentPropertyCapacityContribution,
  propertyCapacityContributionAt,
  PROTOTYPE_PROPERTY_CAPACITY_RATE,
} from "./property-capacity.js";
import {
  createPropertyValuationHistory,
  currentEffectivePropertyValuation,
  recordValuationApproval,
  recordValuationProposal,
  type PropertyValuationHistory,
} from "./valuations.js";
import {
  createProperty,
  type Property,
} from "./properties.js";
import {
  deterministicTestId,
} from "./identifiers.js";
import {
  basisPoints,
  cents,
  eventSequence,
} from "./value-types.js";

function property(): Property {
  const result = createProperty({
    id: deterministicTestId("property", 1),
    address: {
      line1: "100 Synthetic Avenue",
      locality: "Test City",
      region: "MI",
      postalCode: "48900",
      countryCode: "US",
    },
    legalDescription:
      "Synthetic legal description for capacity tests",
    ownerReference: "synthetic-owner-a",
    evidenceReferences: [
      "synthetic://property-a/source-record",
    ],
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function propose(
  history: PropertyValuationHistory,
  sequence: number,
  valueCents: number,
): PropertyValuationHistory {
  const result = recordValuationProposal(
    history,
    {
      sequence,
      proposedValueCents: valueCents,
      proposedByReference: "synthetic-appraiser",
      evidenceReferences: [
        `synthetic://valuation/${sequence}`,
      ],
    },
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function approve(
  history: PropertyValuationHistory,
  sequence: number,
  proposalSequence: number,
  valueCents: number,
): PropertyValuationHistory {
  const result = recordValuationApproval(
    history,
    {
      sequence,
      proposalSequence,
      approvedValueCents: valueCents,
      approvedByReference: "synthetic-reviewer",
      evidenceReferences: [
        `synthetic://approval/${sequence}`,
      ],
    },
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function approvedHistory(
  valueCents: number,
  proposalSequence = 10,
  approvalSequence = 12,
): PropertyValuationHistory {
  let history = createPropertyValuationHistory(
    property(),
  );

  history = propose(
    history,
    proposalSequence,
    valueCents,
  );

  return approve(
    history,
    approvalSequence,
    proposalSequence,
    valueCents,
  );
}

function currentCapacity(
  history: PropertyValuationHistory,
  debtCents: number,
) {
  const result = currentPropertyCapacityContribution(
    history,
    cents(debtCents),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe("Property capacity contribution", () => {
  it("defines the prototype rate as 60 percent", () => {
    expect(
      PROTOTYPE_PROPERTY_CAPACITY_RATE,
    ).toBe(6_000);
  });

  it("calculates canonical Property A as $200,000", () => {
    const contribution = currentCapacity(
      approvedHistory(50_000_000),
      10_000_000,
    );

    expect(
      contribution.grossCapacityBoundaryCents,
    ).toBe(30_000_000);
    expect(
      contribution.contributionCents,
    ).toBe(20_000_000);
  });

  it("calculates canonical Property B as $130,000", () => {
    const contribution = currentCapacity(
      approvedHistory(30_000_000),
      5_000_000,
    );

    expect(
      contribution.grossCapacityBoundaryCents,
    ).toBe(18_000_000);
    expect(
      contribution.contributionCents,
    ).toBe(13_000_000);
  });

  it("returns zero for a zero approved value", () => {
    const contribution = currentCapacity(
      approvedHistory(0),
      0,
    );

    expect(
      contribution.grossCapacityBoundaryCents,
    ).toBe(0);
    expect(
      contribution.contributionCents,
    ).toBe(0);
  });

  it("returns zero when debt exactly equals the boundary", () => {
    const contribution = currentCapacity(
      approvedHistory(1_000_000),
      600_000,
    );

    expect(
      contribution.contributionCents,
    ).toBe(0);
  });

  it("returns zero when debt exceeds the boundary", () => {
    const contribution = currentCapacity(
      approvedHistory(1_000_000),
      700_000,
    );

    expect(
      contribution.contributionCents,
    ).toBe(0);
  });

  it("subtracts debt after calculating the percentage boundary", () => {
    const contribution = currentCapacity(
      approvedHistory(50_000_000),
      10_000_000,
    );

    expect(
      contribution.contributionCents,
    ).not.toBe(24_000_000);
    expect(
      contribution.contributionCents,
    ).toBe(20_000_000);
  });

  it("rounds the gross boundary down before subtracting debt", () => {
    const valuation =
      currentEffectivePropertyValuation(
        approvedHistory(101),
      );

    if (valuation === undefined) {
      throw new Error("Expected an approved valuation");
    }

    const contribution =
      calculatePropertyCapacityContribution(
        valuation,
        cents(3),
        basisPoints(3_333),
      );

    expect(
      contribution.grossCapacityBoundaryCents,
    ).toBe(33);
    expect(
      contribution.contributionCents,
    ).toBe(30);
    expect(
      contribution.roundingMode,
    ).toBe("floor");
  });

  it("supports a validated custom capacity rate", () => {
    const valuation =
      currentEffectivePropertyValuation(
        approvedHistory(1_000_000),
      );

    if (valuation === undefined) {
      throw new Error("Expected an approved valuation");
    }

    const contribution =
      calculatePropertyCapacityContribution(
        valuation,
        cents(100_000),
        basisPoints(5_000),
      );

    expect(
      contribution.grossCapacityBoundaryCents,
    ).toBe(500_000);
    expect(
      contribution.contributionCents,
    ).toBe(400_000);
  });

  it("returns zero when the rate is zero", () => {
    const valuation =
      currentEffectivePropertyValuation(
        approvedHistory(1_000_000),
      );

    if (valuation === undefined) {
      throw new Error("Expected an approved valuation");
    }

    const contribution =
      calculatePropertyCapacityContribution(
        valuation,
        cents(0),
        basisPoints(0),
      );

    expect(
      contribution.contributionCents,
    ).toBe(0);
  });

  it("handles the maximum safe approved value without unsafe multiplication", () => {
    const valuation =
      currentEffectivePropertyValuation(
        approvedHistory(
          Number.MAX_SAFE_INTEGER,
        ),
      );

    if (valuation === undefined) {
      throw new Error("Expected an approved valuation");
    }

    const contribution =
      calculatePropertyCapacityContribution(
        valuation,
        cents(0),
        basisPoints(10_000),
      );

    expect(
      contribution.grossCapacityBoundaryCents,
    ).toBe(Number.MAX_SAFE_INTEGER);
    expect(
      contribution.contributionCents,
    ).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("returns not-found when no valuation is approved", () => {
    const history = propose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );

    const result =
      currentPropertyCapacityContribution(
        history,
        cents(10_000_000),
      );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("Expected a missing-valuation failure");
    }

    expect(result.error.code).toBe("not-found");
    expect(result.error.details).toMatchObject({
      propertyId: history.propertyId,
    });
  });

  it("keeps an earlier approval effective after a newer unapproved proposal", () => {
    let history = approvedHistory(50_000_000);
    history = propose(
      history,
      20,
      60_000_000,
    );

    const contribution = currentCapacity(
      history,
      10_000_000,
    );

    expect(
      contribution.approvedValueCents,
    ).toBe(50_000_000);
    expect(
      contribution.contributionCents,
    ).toBe(20_000_000);
  });

  it("uses the valuation effective at the requested sequence", () => {
    let history = approvedHistory(50_000_000);
    history = propose(
      history,
      20,
      60_000_000,
    );
    history = approve(
      history,
      24,
      20,
      55_000_000,
    );

    const earlier =
      propertyCapacityContributionAt(
        history,
        eventSequence(18),
        cents(10_000_000),
      );
    const later =
      propertyCapacityContributionAt(
        history,
        eventSequence(24),
        cents(10_000_000),
      );

    expect(earlier.ok).toBe(true);
    expect(later.ok).toBe(true);

    if (!earlier.ok || !later.ok) {
      throw new Error(
        "Expected both historical capacity calculations",
      );
    }

    expect(
      earlier.value.contributionCents,
    ).toBe(20_000_000);
    expect(
      later.value.contributionCents,
    ).toBe(23_000_000);
  });

  it("returns not-found before the first approval sequence", () => {
    const history = approvedHistory(
      50_000_000,
      10,
      12,
    );

    const result =
      propertyCapacityContributionAt(
        history,
        eventSequence(11),
        cents(10_000_000),
      );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("Expected a missing-valuation failure");
    }

    expect(result.error.code).toBe("not-found");
    expect(result.error.details).toMatchObject({
      propertyId: history.propertyId,
      atSequence: 11,
    });
  });

  it("returns a frozen record with the valuation identity", () => {
    const history = approvedHistory(50_000_000);
    const contribution = currentCapacity(
      history,
      10_000_000,
    );

    expect(
      Object.isFrozen(contribution),
    ).toBe(true);
    expect(contribution.propertyId).toBe(
      history.propertyId,
    );
    expect(
      contribution.valuationProposalSequence,
    ).toBe(10);
    expect(
      contribution.valuationApprovalSequence,
    ).toBe(12);
    expect(
      contribution.recognizedSeniorDebtCents,
    ).toBe(10_000_000);
  });

  it("does not mutate valuation history", () => {
    const history = approvedHistory(50_000_000);
    const entriesBefore = history.entries;

    currentCapacity(
      history,
      10_000_000,
    );

    expect(history.entries).toBe(entriesBefore);
    expect(history.entries).toHaveLength(2);
  });
});
```

**Output:** Runtime tests cover canonical values, boundaries, rounding, chronology, errors, safe integers, and immutability.

**Status:** Step 5 complete.

**Next:** Step 6 — Run focused checks.

---

## Step 6 — Run focused implementation checks

**Input:** Capacity source and runtime tests.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- --run src/property-capacity.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/property-capacity.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 23[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m17 passed[39m[22m[90m (17)[39m
[2m   Start at [22m 07:00:20
[2m   Duration [22m 275ms[2m (transform 81ms, setup 0ms, import 109ms, tests 23ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** Focused runtime and compile checks pass.

**Status:** Step 6 complete.

**Next:** Step 7 — Create compile-time tests.

---

## Step 7 — Create the Property capacity type tests

**Input:** The passing runtime implementation.

**Commands and output:**

```text
$ cat > packages/domain/src/property-capacity.type-test.ts <<'EOF'

$ rg -n "@ts-expect-error" packages/domain/src/property-capacity.type-test.ts
149:// @ts-expect-error Cents cannot be used as BasisPoints.
152:// @ts-expect-error BasisPoints cannot be used as recognized debt.
155:// @ts-expect-error Cents cannot be used as EventSequence.
158:// @ts-expect-error Capacity result fields are readonly.
161:// @ts-expect-error Capacity result fields are readonly.
164:// @ts-expect-error The rounding mode is the floor literal.
168:// @ts-expect-error A plain number is not a branded Cents value.
172:// @ts-expect-error A plain number is not a branded BasisPoints value.

$ sed -n "1,420p" packages/domain/src/property-capacity.type-test.ts
import {
  calculatePropertyCapacityContribution,
  currentPropertyCapacityContribution,
  propertyCapacityContributionAt,
  PROTOTYPE_PROPERTY_CAPACITY_RATE,
  type PropertyCapacityContribution,
  type PropertyCapacityRoundingMode,
} from "./property-capacity.js";
import {
  createPropertyValuationHistory,
  currentEffectivePropertyValuation,
  recordValuationApproval,
  recordValuationProposal,
} from "./valuations.js";
import {
  createProperty,
} from "./properties.js";
import {
  deterministicTestId,
  type PropertyId,
} from "./identifiers.js";
import {
  basisPoints,
  cents,
  eventSequence,
  type BasisPoints,
  type Cents,
  type EventSequence,
} from "./value-types.js";

const created = createProperty({
  id: deterministicTestId("property", 17),
  address: {
    line1: "17 Capacity Way",
    locality: "Test City",
    region: "MI",
    postalCode: "48900",
    countryCode: "US",
  },
  legalDescription:
    "Synthetic legal description",
  ownerReference: "synthetic-owner",
  evidenceReferences: [
    "synthetic://property/17",
  ],
});

if (!created.ok) {
  throw new Error(created.error.message);
}

let history =
  createPropertyValuationHistory(
    created.value,
  );

const proposed = recordValuationProposal(
  history,
  {
    sequence: 10,
    proposedValueCents: 50_000_000,
    proposedByReference: "appraiser",
    evidenceReferences: [
      "synthetic://proposal/10",
    ],
  },
);

if (!proposed.ok) {
  throw new Error(proposed.error.message);
}

history = proposed.value;

const approved = recordValuationApproval(
  history,
  {
    sequence: 12,
    proposalSequence: 10,
    approvedValueCents: 50_000_000,
    approvedByReference: "reviewer",
    evidenceReferences: [
      "synthetic://approval/12",
    ],
  },
);

if (!approved.ok) {
  throw new Error(approved.error.message);
}

history = approved.value;

const debt: Cents = cents(10_000_000);
const rate: BasisPoints =
  PROTOTYPE_PROPERTY_CAPACITY_RATE;
const sequence: EventSequence =
  eventSequence(12);

const current =
  currentPropertyCapacityContribution(
    history,
    debt,
    rate,
  );

const historical =
  propertyCapacityContributionAt(
    history,
    sequence,
    debt,
    rate,
  );

const effective =
  currentEffectivePropertyValuation(history);

if (effective === undefined) {
  throw new Error("Expected effective valuation");
}

const direct: PropertyCapacityContribution =
  calculatePropertyCapacityContribution(
    effective,
    debt,
    rate,
  );

const propertyId: PropertyId =
  direct.propertyId;
const value: Cents =
  direct.approvedValueCents;
const gross: Cents =
  direct.grossCapacityBoundaryCents;
const contribution: Cents =
  direct.contributionCents;
const rounding:
  PropertyCapacityRoundingMode =
    direct.roundingMode;

void current;
void historical;
void propertyId;
void value;
void gross;
void contribution;
void rounding;

// @ts-expect-error Cents cannot be used as BasisPoints.
calculatePropertyCapacityContribution(effective, debt, cents(6_000));

// @ts-expect-error BasisPoints cannot be used as recognized debt.
calculatePropertyCapacityContribution(effective, basisPoints(6_000), rate);

// @ts-expect-error Cents cannot be used as EventSequence.
propertyCapacityContributionAt(history, cents(12), debt);

// @ts-expect-error Capacity result fields are readonly.
direct.contributionCents = cents(1);

// @ts-expect-error Capacity result fields are readonly.
direct.capacityRate = basisPoints(5_000);

// @ts-expect-error The rounding mode is the floor literal.
const wrongRounding: PropertyCapacityRoundingMode = "nearest";
void wrongRounding;

// @ts-expect-error A plain number is not a branded Cents value.
const plainDebt: Cents = 10_000_000;
void plainDebt;

// @ts-expect-error A plain number is not a branded BasisPoints value.
const plainRate: BasisPoints = 6_000;
void plainRate;
```

**Output:** Branded value and readonly result boundaries have compile-time evidence.

**Status:** Step 7 complete.

**Next:** Step 8 — Export the API and add its public test.

---

## Step 8 — Export the API and add the public-entrypoint test

**Input:** Complete private capacity behavior.

**Commands and output:**

```text
$ grep -q 'export \* from "./property-capacity.js";' packages/domain/src/index.ts || printf '\nexport * from "./property-capacity.js";\n' >> packages/domain/src/index.ts

$ cat > packages/domain/src/property-capacity-public.test.ts <<'EOF'

$ tail -n 40 packages/domain/src/index.ts
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

$ sed -n "1,320p" packages/domain/src/property-capacity-public.test.ts
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  createPropertyValuationHistory,
  currentPropertyCapacityContribution,
  deterministicTestId,
  recordValuationApproval,
  recordValuationProposal,
  cents,
} from "./index.js";

describe("Property capacity public API", () => {
  it("calculates canonical Property A through the package entrypoint", () => {
    const created = createProperty({
      id: deterministicTestId("property", 101),
      address: {
        line1: "101 Public API Street",
        locality: "Test City",
        region: "MI",
        postalCode: "48900",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic public API property",
      ownerReference: "synthetic-owner",
      evidenceReferences: [
        "synthetic://property/public",
      ],
    });

    if (!created.ok) {
      throw new Error(created.error.message);
    }

    let history =
      createPropertyValuationHistory(
        created.value,
      );

    const proposed = recordValuationProposal(
      history,
      {
        sequence: 10,
        proposedValueCents: 50_000_000,
        proposedByReference: "appraiser",
        evidenceReferences: [
          "synthetic://proposal/public",
        ],
      },
    );

    if (!proposed.ok) {
      throw new Error(proposed.error.message);
    }

    history = proposed.value;

    const approved = recordValuationApproval(
      history,
      {
        sequence: 12,
        proposalSequence: 10,
        approvedValueCents: 50_000_000,
        approvedByReference: "reviewer",
        evidenceReferences: [
          "synthetic://approval/public",
        ],
      },
    );

    if (!approved.ok) {
      throw new Error(approved.error.message);
    }

    const result =
      currentPropertyCapacityContribution(
        approved.value,
        cents(10_000_000),
      );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(
      result.value.contributionCents,
    ).toBe(20_000_000);
  });
});
```

**Output:** The API is exported and tested through the public domain entrypoint.

**Status:** Step 8 complete.

**Next:** Step 9 — Run all focused verification.

---

## Step 9 — Run all focused WO-017 verification

**Input:** The complete WO-017 source and focused tests.

**Commands and output:**

```text
$ npm test --workspace packages/domain -- --run src/property-capacity.test.ts src/property-capacity-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/property-capacity.test.ts src/property-capacity-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 10[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m18 passed[39m[22m[90m (18)[39m
[2m   Start at [22m 07:04:25
[2m   Duration [22m 233ms[2m (transform 100ms, setup 0ms, import 156ms, tests 21ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build --workspace packages/domain

> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


$ test -f packages/domain/dist/property-capacity.js
[dist/property-capacity.js exists]

$ test -f packages/domain/dist/property-capacity.d.ts
[dist/property-capacity.d.ts exists]

$ find packages/domain/dist -type f \( -name "*.test.*" -o -name "*.type-test.*" \) -print
[no test-only files emitted]
```

**Output:** Focused runtime, public, compile-time, and build checks pass.

**Status:** Step 9 complete.

**Next:** Step 10 — Observe an expected failure.

---

## Step 10 — Prove the suite rejects the wrong debt formula

**Input:** The passing focused capacity suite.

**Temporary action:** Expect canonical Property A to contribute 24,000,000 cents using the wrong `(value − debt) × rate` formula.

**Expected result:** Vitest fails because the correct result is 20,000,000 cents.

**Commands and output:**

```text
$ cat >> packages/domain/src/property-capacity.test.ts <<'EOF'

$ npm test --workspace packages/domain -- --run src/property-capacity.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/property-capacity.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/property-capacity.test.ts [2m([22m[2m18 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 39[2mms[22m[39m
     [32m✓[39m defines the prototype rate as 60 percent[32m 3[2mms[22m[39m
     [32m✓[39m calculates canonical Property A as $200,000[32m 4[2mms[22m[39m
     [32m✓[39m calculates canonical Property B as $130,000[32m 1[2mms[22m[39m
     [32m✓[39m returns zero for a zero approved value[32m 1[2mms[22m[39m
     [32m✓[39m returns zero when debt exactly equals the boundary[32m 1[2mms[22m[39m
     [32m✓[39m returns zero when debt exceeds the boundary[32m 1[2mms[22m[39m
     [32m✓[39m subtracts debt after calculating the percentage boundary[32m 2[2mms[22m[39m
     [32m✓[39m rounds the gross boundary down before subtracting debt[32m 1[2mms[22m[39m
     [32m✓[39m supports a validated custom capacity rate[32m 1[2mms[22m[39m
     [32m✓[39m returns zero when the rate is zero[32m 1[2mms[22m[39m
     [32m✓[39m handles the maximum safe approved value without unsafe multiplication[32m 1[2mms[22m[39m
     [32m✓[39m returns not-found when no valuation is approved[32m 2[2mms[22m[39m
     [32m✓[39m keeps an earlier approval effective after a newer unapproved proposal[32m 0[2mms[22m[39m
     [32m✓[39m uses the valuation effective at the requested sequence[32m 1[2mms[22m[39m
     [32m✓[39m returns not-found before the first approval sequence[32m 1[2mms[22m[39m
     [32m✓[39m returns a frozen record with the valuation identity[32m 1[2mms[22m[39m
     [32m✓[39m does not mutate valuation history[32m 2[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: discounts senior debt inside the percentage calculation[39m[32m 13[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/property-capacity.test.ts[2m > [22mTEMPORARY: discounts senior debt inside the percentage calculation
[31m[1mAssertionError[22m: expected 20000000 to be 24000000 // Object.is equality[39m

[32m- Expected[39m
[31m+ Received[39m

[32m- 24000000[39m
[31m+ 20000000[39m

[36m [2m❯[22m src/property-capacity.test.ts:[2m498:5[22m[39m
    [90m496|[39m   [34mexpect[39m(
    [90m497|[39m     contribution[33m.[39mcontributionCents[33m,[39m
    [90m498|[39m   )[33m.[39m[34mtoBe[39m([34m24_000_000[39m)[33m;[39m
    [90m   |[39m     [31m^[39m
    [90m499|[39m })[33m;[39m
    [90m500|[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m17 passed[39m[22m[90m (18)[39m
[2m   Start at [22m 07:04:33
[2m   Duration [22m 254ms[2m (transform 76ms, setup 0ms, import 104ms, tests 39ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/property-capacity.test.ts

[focused test exit status: 1]
```

**Observed result:** The focused suite rejected the formula that discounts senior debt.

**Status:** Expected failure observed; temporary source must be removed.

**Next:** Step 11 — Remove the temporary test.

---

## Step 11 — Remove the temporary test and restore green

**Input:** One deliberate temporary test in the capacity test file.

**Commands and output:**

```text
$ python - <<'PY'

$ rg -n "TEMPORARY:" packages/domain/src/property-capacity.test.ts || true

$ npm test --workspace packages/domain -- --run src/property-capacity.test.ts src/property-capacity-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/property-capacity.test.ts src/property-capacity-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 23[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m18 passed[39m[22m[90m (18)[39m
[2m   Start at [22m 07:04:46
[2m   Duration [22m 241ms[2m (transform 133ms, setup 0ms, import 198ms, tests 28ms, environment 0ms)[22m


$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** Temporary source is absent and the focused suite is green.

**Status:** Step 11 complete.

**Next:** Step 12 — Run complete domain verification.

---

## Step 12 — Run complete domain verification

**Input:** Restored WO-017 and all prior domain behavior.

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

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 26[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 14[2mms[22m[39m

[2m Test Files [22m [1m[32m12 passed[39m[22m[90m (12)[39m
[2m      Tests [22m [1m[32m251 passed[39m[22m[90m (251)[39m
[2m   Start at [22m 07:04:54
[2m   Duration [22m 356ms[2m (transform 953ms, setup 0ms, import 1.54s, tests 163ms, environment 2ms)[22m


$ rg -n "TEMPORARY:" packages/domain/src || true

$ rg -n "capacity|seniorDebt|mortgage" packages/domain/src/properties.ts packages/domain/src/valuations.ts || true
```

**Output:** The domain is green and prior entity/history files remain free of capacity fields.

**Status:** Step 12 complete.

**Next:** Step 13 — Run repository regression checks.

---

## Step 13 — Run workspace and adjacent-system regression checks

**Input:** The fully passing domain package.

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

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 31[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 24[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 35[2mms[22m[39m

[2m Test Files [22m [1m[32m12 passed[39m[22m[90m (12)[39m
[2m      Tests [22m [1m[32m251 passed[39m[22m[90m (251)[39m
[2m   Start at [22m 07:07:18
[2m   Duration [22m 365ms[2m (transform 988ms, setup 0ms, import 1.61s, tests 201ms, environment 2ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 07:07:18
[2m   Duration [22m 176ms[2m (transform 48ms, setup 0ms, import 63ms, tests 4ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 267.86µs (33.39µs CPU time)

Ran 1 test suite in 9.12ms (267.86µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

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
 ✓ test/index.spec.js (4 tests) 252ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  07:07:19
   Duration  1.91s (transform 63ms, setup 0ms, collect 87ms, tests 252ms, environment 0ms, prepare 232ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** Workspace, Foundry, and neighboring Point behavior remain green.

**Status:** Step 13 complete.

**Next:** Step 14 — Inspect the total change.

---

## Step 14 — Inspect and summarize WO-017

**Input:** Fully verified but unstaged WO-017 changes.

**Commands and output:**

```text
$ git status --short
 M packages/domain/src/index.ts
?? docs/work-orders/WO-017-execution.md
?? packages/domain/src/property-capacity-public.test.ts
?? packages/domain/src/property-capacity.test.ts
?? packages/domain/src/property-capacity.ts
?? packages/domain/src/property-capacity.type-test.ts

$ git diff --check

$ git diff --stat
 code/economic-union/packages/domain/src/index.ts | 3 ++-
 1 file changed, 2 insertions(+), 1 deletion(-)

$ git diff -- packages/domain/src/index.ts packages/domain/src/property-capacity.ts packages/domain/src/property-capacity.test.ts packages/domain/src/property-capacity.type-test.ts packages/domain/src/property-capacity-public.test.ts
diff --git a/code/economic-union/packages/domain/src/index.ts b/code/economic-union/packages/domain/src/index.ts
index b3914ab..299ca7b 100644
--- a/code/economic-union/packages/domain/src/index.ts
+++ b/code/economic-union/packages/domain/src/index.ts
@@ -10,4 +10,5 @@ export * from "./identifiers.js";
 export * from "./domain-errors.js";
 export * from "./canonical-scenarios.js";
 export * from "./properties.js";
-export * from "./valuations.js";
\ No newline at end of file
+export * from "./valuations.js";
+export * from "./property-capacity.js";
```

**Expected files:** capacity source, runtime test, type test, public test, index export, and execution record only.

**Boundary:** No debt history, pool aggregation, supply, capacity health, persistence, API, or Solidity behavior.

**Output:** The exact bounded diff is visible before staging.

**Status:** Step 14 complete if no unrelated file appears.

**Next:** Step 15 — Stage only WO-017.

---

## Step 15 — Stage only WO-017

**Input:** The inspected bounded worktree.

**Commands and output:**

```text
$ git add packages/domain/src/property-capacity.ts packages/domain/src/property-capacity.test.ts packages/domain/src/property-capacity.type-test.ts packages/domain/src/property-capacity-public.test.ts packages/domain/src/index.ts docs/work-orders/WO-017-execution.md

$ git diff --cached --check
code/economic-union/packages/domain/src/property-capacity.test.ts:488: new blank line at EOF.
---

## Step 16 — Run final staged verification

**Input:** The explicitly staged WO-017 change.

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

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/property-capacity-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 26[2mms[22m[39m
 [32m✓[39m src/property-capacity.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 25[2mms[22m[39m

[2m Test Files [22m [1m[32m12 passed[39m[22m[90m (12)[39m
[2m      Tests [22m [1m[32m251 passed[39m[22m[90m (251)[39m
[2m   Start at [22m 07:08:12
[2m   Duration [22m 373ms[2m (transform 1.20s, setup 0ms, import 1.71s, tests 178ms, environment 2ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 07:08:12
[2m   Duration [22m 159ms[2m (transform 21ms, setup 0ms, import 33ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 385.55µs (37.16µs CPU time)

Ran 1 test suite in 7.21ms (385.55µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

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
 ✓ test/index.spec.js (4 tests) 234ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  07:08:13
   Duration  1.78s (transform 46ms, setup 0ms, collect 86ms, tests 234ms, environment 0ms, prepare 145ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --cached --check
code/economic-union/packages/domain/src/property-capacity.test.ts:488: new blank line at EOF.
---
Observed result: Final staging verification stopped because
property-capacity.test.ts contained one extra blank line at end of file.

Status: Step 17 interrupted before commit authorization.

Correction: Remove the extra blank line, restage the corrected test and
execution record, and repeat the staged-diff check.