# WO-016 Execution Record — Implement Append-Only Valuations

## Purpose

Create immutable Property valuation proposals, approvals, chronological history, and effective-value lookup.

This record captures the actual commands and output of WO-016.

---

## Step 1 — Confirm WO-015 and initialize the execution record

**Input:** The committed and verified WO-015 Property model.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-016-execution.md

$ git log -3 --oneline --decorate
e74b0b0 (HEAD -> main, origin/main) feat(domain): implement property model
6b16e27 fix(domain): configure Node types for scenario tests
20efc00 feat(domain): add canonical scenario vectors

$ git diff --check

$ test -f packages/domain/src/properties.ts
[properties.ts exists]

$ test -f packages/domain/src/properties.test.ts
[properties.test.ts exists]

$ rg -n "export interface Property|export function createProperty" packages/domain/src/properties.ts
17:export interface PropertyAddressInput {
26:export interface PropertyCreationInput {
34:export interface PropertyAddress {
43:export interface Property {
233:export function createProperty(

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
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 18[2mms[22m[39m

[2m Test Files [22m [1m[32m8 passed[39m[22m[90m (8)[39m
[2m      Tests [22m [1m[32m204 passed[39m[22m[90m (204)[39m
[2m   Start at [22m 01:47:03
[2m   Duration [22m 271ms[2m (transform 433ms, setup 0ms, import 727ms, tests 105ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 01:47:04
[2m   Duration [22m 172ms[2m (transform 45ms, setup 0ms, import 59ms, tests 3ms, environment 0ms)[22m

```

**Output:** The repository location, Git state, WO-015 Property boundary, and complete passing TypeScript baseline are recorded before valuation changes begin.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the current domain boundary.

---

## Step 2 — Inspect the current domain boundary

**Input:** The verified WO-015 domain package.

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
packages/domain/src/value-types.test.ts
packages/domain/src/value-types.ts
packages/domain/src/value-types.type-test.ts
packages/domain/tsconfig.json
packages/domain/tsconfig.test.json

$ sed -n "1,320p" packages/domain/src/properties.ts
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";
import {
  propertyId,
  type PropertyId,
} from "./identifiers.js";
import {
  propertyStatus,
  type PropertyStatus,
} from "./domain-statuses.js";

export interface PropertyAddressInput {
  readonly line1: string;
  readonly line2?: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly countryCode: string;
}

export interface PropertyCreationInput {
  readonly id: string;
  readonly address: PropertyAddressInput;
  readonly legalDescription: string;
  readonly ownerReference: string;
  readonly evidenceReferences: readonly string[];
}

export interface PropertyAddress {
  readonly line1: string;
  readonly line2?: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly countryCode: string;
}

export interface Property {
  readonly id: PropertyId;
  readonly status: PropertyStatus;
  readonly address: Readonly<PropertyAddress>;
  readonly legalDescription: string;
  readonly ownerReference: string;
  readonly evidenceReferences: readonly string[];
}

type InputRecord = Readonly<Record<string, unknown>>;
type InvalidPropertyResult<T = never> = DomainResult<
  T,
  DomainError<"invalid-input">
>;

function isInputRecord(value: unknown): value is InputRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function invalidPropertyInput<T = never>(
  path: string,
  expected: string,
): InvalidPropertyResult<T> {
  return domainFailure(
    domainError(
      "invalid-input",
      `Invalid Property creation input at ${path}.`,
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
): InvalidPropertyResult<string> {
  const value = record[key];

  if (typeof value !== "string") {
    return invalidPropertyInput(path, "a nonempty string");
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    return invalidPropertyInput(path, "a nonempty string");
  }

  return domainSuccess(normalized);
}

function parseAddress(
  value: unknown,
): InvalidPropertyResult<Readonly<PropertyAddress>> {
  if (!isInputRecord(value)) {
    return invalidPropertyInput(
      "$.address",
      "an address object",
    );
  }

  const line1 = readRequiredString(
    value,
    "line1",
    "$.address.line1",
  );
  if (!line1.ok) {
    return line1;
  }

  const locality = readRequiredString(
    value,
    "locality",
    "$.address.locality",
  );
  if (!locality.ok) {
    return locality;
  }

  const region = readRequiredString(
    value,
    "region",
    "$.address.region",
  );
  if (!region.ok) {
    return region;
  }

  const postalCode = readRequiredString(
    value,
    "postalCode",
    "$.address.postalCode",
  );
  if (!postalCode.ok) {
    return postalCode;
  }

  const countryCode = readRequiredString(
    value,
    "countryCode",
    "$.address.countryCode",
  );
  if (!countryCode.ok) {
    return countryCode;
  }

  const rawLine2 = value.line2;
  let line2: string | undefined;

  if (rawLine2 !== undefined) {
    if (typeof rawLine2 !== "string") {
      return invalidPropertyInput(
        "$.address.line2",
        "a nonempty string when supplied",
      );
    }

    line2 = rawLine2.trim();

    if (line2.length === 0) {
      return invalidPropertyInput(
        "$.address.line2",
        "a nonempty string when supplied",
      );
    }
  }

  if (line2 === undefined) {
    return domainSuccess(
      Object.freeze({
        line1: line1.value,
        locality: locality.value,
        region: region.value,
        postalCode: postalCode.value,
        countryCode: countryCode.value,
      }),
    );
  }

  return domainSuccess(
    Object.freeze({
      line1: line1.value,
      line2,
      locality: locality.value,
      region: region.value,
      postalCode: postalCode.value,
      countryCode: countryCode.value,
    }),
  );
}

function parseEvidenceReferences(
  value: unknown,
): InvalidPropertyResult<readonly string[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return invalidPropertyInput(
      "$.evidenceReferences",
      "a nonempty array of nonempty strings",
    );
  }

  const references: string[] = [];

  for (const [index, reference] of value.entries()) {
    const path = `$.evidenceReferences[${index}]`;

    if (typeof reference !== "string") {
      return invalidPropertyInput(path, "a nonempty string");
    }

    const normalized = reference.trim();

    if (normalized.length === 0) {
      return invalidPropertyInput(path, "a nonempty string");
    }

    references.push(normalized);
  }

  return domainSuccess(Object.freeze(references));
}

export function createProperty(
  input: unknown,
): DomainResult<Property, DomainError<"invalid-input">> {
  if (!isInputRecord(input)) {
    return invalidPropertyInput("$", "a Property creation object");
  }

  const rawId = readRequiredString(input, "id", "$.id");
  if (!rawId.ok) {
    return rawId;
  }

  let id: PropertyId;

  try {
    id = propertyId(rawId.value);
  } catch {
    return invalidPropertyInput(
      "$.id",
      "a canonical PropertyId",
    );
  }

  const address = parseAddress(input.address);
  if (!address.ok) {
    return address;
  }

  const legalDescription = readRequiredString(
    input,
    "legalDescription",
    "$.legalDescription",
  );
  if (!legalDescription.ok) {
    return legalDescription;
  }

  const ownerReference = readRequiredString(
    input,
    "ownerReference",
    "$.ownerReference",
  );
  if (!ownerReference.ok) {
    return ownerReference;
  }

  const evidenceReferences = parseEvidenceReferences(
    input.evidenceReferences,
  );
  if (!evidenceReferences.ok) {
    return evidenceReferences;
  }

  const property: Property = Object.freeze({
    id,
    status: propertyStatus("proposed"),
    address: address.value,
    legalDescription: legalDescription.value,
    ownerReference: ownerReference.value,
    evidenceReferences: evidenceReferences.value,
  });

  return domainSuccess(property);
}
$ rg -n "Cents|EventSequence|cents\(|eventSequence\(|compareEventSequences" packages/domain/src/value-types.ts
7:export type Cents = number & { readonly [centsBrand]: "Cents" };
14:export type EventSequence = number & {
15:  readonly [eventSequenceBrand]: "EventSequence";
42:export function cents(value: number): Cents {
43:  requireSafeInteger(value, "Cents");
46:    throw new RangeError("Cents must be nonnegative");
49:  return value as Cents;
52:export function addCents(left: Cents, right: Cents): Cents {
53:  return cents(left + right);
56:export function subtractCents(left: Cents, right: Cents): Cents {
57:  return cents(left - right);
60:export function compareCents(
61:  left: Cents,
62:  right: Cents,
107:export function eventSequence(value: number): EventSequence {
108:  requireSafeInteger(value, "EventSequence");
111:    throw new RangeError("EventSequence must be nonnegative");
114:  return value as EventSequence;
117:export function nextEventSequence(
118:  current: EventSequence,
119:): EventSequence {
120:  return eventSequence(current + 1);
123:export function compareEventSequences(
124:  left: EventSequence,
125:  right: EventSequence,

$ rg -n "DomainResult|domainError|domainFailure|domainSuccess|not-found|already-processed|invalid-input" packages/domain/src/domain-errors.ts
2:  "invalid-input",
3:  "not-found",
19:  "already-processed",
45:export type DomainResult<
50:export function domainErrorCode(value: string): DomainErrorCode {
60:export function domainError<C extends DomainErrorCode>(
85:export function domainSuccess<T>(value: T): DomainSuccess<T> {
92:export function domainFailure<E extends DomainError>(

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

$ rg -n "Valuation|valuation|approvedValue|proposedValue" packages/domain/src || true
packages/domain/src/canonical-scenarios.ts:23:  readonly approvedValueCents: number;
packages/domain/src/canonical-scenarios.ts:159:  if (!isCents(value.approvedValueCents)) {
packages/domain/src/canonical-scenarios.ts:160:    return invalid(`${path}.approvedValueCents`, "nonnegative safe integer cents");
packages/domain/src/properties.type-test.ts:49:  // @ts-expect-error Property is not a valuation record.
packages/domain/src/properties.type-test.ts:50:  property.approvedValueCents;
packages/domain/src/properties.test.ts:320:  it("contains no valuation, debt, capacity, or ownership state", () => {
packages/domain/src/properties.test.ts:330:      "approvedValueCents",
```

**Output:** Existing Property, numeric, result, export, and valuation definitions are visible before WO-016 edits.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the append-only valuation contract.

---

## Step 3 — Record the append-only valuation contract

**Input:** The master-plan WO-016 boundary and inspected WO-015 domain vocabulary.

**Contract:**

- Valuation history is separate from Property.
- History is bound to one PropertyId.
- Proposals and approvals are distinct immutable entry kinds.
- Every append sequence is strictly greater than the prior final sequence.
- Approval sequence is the effective sequence.
- Approved value may differ from proposed value.
- A proposal may be approved once.
- Unknown proposals return not-found.
- Duplicate approvals return already-processed.
- Current and historical effective values are derived from approvals.
- Unapproved proposals never change the effective value.
- No debt, capacity, pool, supply, balance, command, event-envelope, persistence, interface, or Solidity behavior is added.

**Output:** The WO-016 implementation contract is preserved before source files change.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the valuation implementation.

---

## Step 4 — Create the valuation implementation

**Input:** The append-only valuation contract recorded in Step 3.

**Action:** Create `packages/domain/src/valuations.ts` with the supplied source.

**Editor command:** `code packages/domain/src/valuations.ts`

**Resulting file:**

```text
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
```

**Structural checks:**

```text
$ rg -n "^export (interface|type|function)" packages/domain/src/valuations.ts
18:export interface ValuationProposalInput {
25:export interface ValuationApprovalInput {
33:export interface ValuationProposalEntry {
41:export interface ValuationApprovalEntry {
50:export type PropertyValuationEntry =
54:export interface PropertyValuationHistory {
59:export interface EffectivePropertyValuation {
316:export function createPropertyValuationHistory(
322:export function recordValuationProposal(
387:export function recordValuationApproval(
496:export function effectivePropertyValuationAt(
520:export function currentEffectivePropertyValuation(

$ rg -n "seniorDebt|capacityContribution|poolCapacity|BasisPoints|issuedSupply|balanceCents" packages/domain/src/valuations.ts || true
```

**Output:** Proposal, approval, append-only history, and effective-value lookup exist without capacity behavior.

**Status:** Step 4 complete.

**Next:** Step 5 — Create the valuation runtime tests.

---

## Step 5 — Create the valuation runtime tests

**Input:** The saved valuation implementation from Step 4.

**Action:** Create `packages/domain/src/valuations.test.ts` with the supplied tests.

**Editor command:** `code packages/domain/src/valuations.test.ts`

**Resulting file:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  type Property,
  type PropertyCreationInput,
} from "./properties.js";
import {
  createPropertyValuationHistory,
  currentEffectivePropertyValuation,
  effectivePropertyValuationAt,
  recordValuationApproval,
  recordValuationProposal,
  type PropertyValuationHistory,
  type ValuationApprovalInput,
  type ValuationProposalInput,
} from "./valuations.js";
import { eventSequence } from "./value-types.js";

function property(): Property {
  const input = {
    id: "prop_00000000000000000000000001",
    address: {
      line1: "100 Synthetic Avenue",
      locality: "Lansing",
      region: "MI",
      postalCode: "48912",
      countryCode: "US",
    },
    legalDescription:
      "Synthetic legal description for valuation tests",
    ownerReference: "synthetic-owner-1",
    evidenceReferences: [
      "synthetic://property/source",
    ],
  } as const satisfies PropertyCreationInput;

  const result = createProperty(input);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function proposalInput(
  sequence: number,
  proposedValueCents = 50_000_000,
): ValuationProposalInput {
  return {
    sequence,
    proposedValueCents,
    proposedByReference: "synthetic-appraiser-1",
    evidenceReferences: [
      `synthetic://valuation/proposal/${sequence}`,
    ],
  };
}

function approvalInput(
  sequence: number,
  proposalSequence: number,
  approvedValueCents = 49_000_000,
): ValuationApprovalInput {
  return {
    sequence,
    proposalSequence,
    approvedValueCents,
    approvedByReference: "synthetic-approver-1",
    evidenceReferences: [
      `synthetic://valuation/approval/${sequence}`,
    ],
  };
}

function mustPropose(
  history: PropertyValuationHistory,
  sequence: number,
  value = 50_000_000,
): PropertyValuationHistory {
  const result = recordValuationProposal(
    history,
    proposalInput(sequence, value),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function mustApprove(
  history: PropertyValuationHistory,
  sequence: number,
  proposalSequence: number,
  value = 49_000_000,
): PropertyValuationHistory {
  const result = recordValuationApproval(
    history,
    approvalInput(
      sequence,
      proposalSequence,
      value,
    ),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe("Property valuation history", () => {
  it("creates an empty frozen history for one Property", () => {
    const subject = property();
    const history =
      createPropertyValuationHistory(subject);

    expect(history.propertyId).toBe(subject.id);
    expect(history.entries).toEqual([]);
    expect(Object.isFrozen(history)).toBe(true);
    expect(Object.isFrozen(history.entries)).toBe(true);
  });

  it("appends an immutable valuation proposal", () => {
    const original =
      createPropertyValuationHistory(property());

    const result = recordValuationProposal(
      original,
      proposalInput(10),
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(original.entries).toEqual([]);
    expect(result.value.entries).toHaveLength(1);
    expect(result.value.entries[0]).toEqual({
      kind: "valuation-proposed",
      sequence: 10,
      proposedValueCents: 50_000_000,
      proposedByReference: "synthetic-appraiser-1",
      evidenceReferences: [
        "synthetic://valuation/proposal/10",
      ],
    });
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.entries)).toBe(true);
    expect(Object.isFrozen(result.value.entries[0])).toBe(true);
    expect(
      Object.isFrozen(
        result.value.entries[0]?.evidenceReferences,
      ),
    ).toBe(true);
  });

  it("preserves a first proposal when a second is appended", () => {
    const empty =
      createPropertyValuationHistory(property());
    const first = mustPropose(
      empty,
      10,
      50_000_000,
    );
    const second = mustPropose(
      first,
      20,
      52_500_000,
    );

    expect(empty.entries).toHaveLength(0);
    expect(first.entries).toHaveLength(1);
    expect(second.entries).toHaveLength(2);
    expect(second.entries[0]).toBe(first.entries[0]);
    expect(second.entries[1]).toMatchObject({
      kind: "valuation-proposed",
      sequence: 20,
      proposedValueCents: 52_500_000,
    });
  });

  it("trims proposal references and copies evidence", () => {
    const evidence = [
      "  synthetic://valuation/proposal/10  ",
    ];
    const history =
      createPropertyValuationHistory(property());

    const result = recordValuationProposal(
      history,
      {
        sequence: 10,
        proposedValueCents: 50_000_000,
        proposedByReference:
          "  synthetic-appraiser-1  ",
        evidenceReferences: evidence,
      },
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    evidence.push("synthetic://later-mutation");

    expect(result.value.entries[0]).toMatchObject({
      proposedByReference: "synthetic-appraiser-1",
      evidenceReferences: [
        "synthetic://valuation/proposal/10",
      ],
    });
  });

  it("rejects a non-object proposal", () => {
    const result = recordValuationProposal(
      createPropertyValuationHistory(property()),
      null,
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe("invalid-input");
    expect(result.error.details?.path).toBe("$");
  });

  it.each([
    [-1],
    [1.5],
    [Number.POSITIVE_INFINITY],
    [Number.MAX_SAFE_INTEGER + 1],
  ])(
    "rejects invalid proposal sequence %s",
    (sequence) => {
      const result = recordValuationProposal(
        createPropertyValuationHistory(property()),
        proposalInput(sequence),
      );

      expect(result.ok).toBe(false);

      if (result.ok) {
        return;
      }

      expect(result.error.code).toBe("invalid-input");
      expect(result.error.details?.path).toBe(
        "$.sequence",
      );
    },
  );

  it("rejects a proposal sequence that is not later than history", () => {
    const history = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    for (const sequence of [9, 10]) {
      const result = recordValuationProposal(
        history,
        proposalInput(sequence),
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(
          "$.sequence",
        );
      }
    }
  });

  it.each([
    [-1],
    [1.5],
    [Number.NaN],
    [Number.MAX_SAFE_INTEGER + 1],
  ])(
    "rejects invalid proposed cents %s",
    (proposedValueCents) => {
      const result = recordValuationProposal(
        createPropertyValuationHistory(property()),
        proposalInput(10, proposedValueCents),
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(
          "$.proposedValueCents",
        );
      }
    },
  );

  it("allows a zero-cent proposal", () => {
    const result = recordValuationProposal(
      createPropertyValuationHistory(property()),
      proposalInput(10, 0),
    );

    expect(result.ok).toBe(true);
  });

  it("rejects empty proposal references and evidence", () => {
    const history =
      createPropertyValuationHistory(property());

    const emptyProposer = recordValuationProposal(
      history,
      {
        ...proposalInput(10),
        proposedByReference: "   ",
      },
    );
    const emptyEvidence = recordValuationProposal(
      history,
      {
        ...proposalInput(10),
        evidenceReferences: [],
      },
    );
    const emptyEvidenceEntry =
      recordValuationProposal(
        history,
        {
          ...proposalInput(10),
          evidenceReferences: ["   "],
        },
      );

    for (const [result, path] of [
      [emptyProposer, "$.proposedByReference"],
      [emptyEvidence, "$.evidenceReferences"],
      [
        emptyEvidenceEntry,
        "$.evidenceReferences[0]",
      ],
    ] as const) {
      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(path);
      }
    }
  });

  it("appends an approval without changing the proposal", () => {
    const proposalHistory = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );

    const result = recordValuationApproval(
      proposalHistory,
      approvalInput(
        12,
        10,
        49_000_000,
      ),
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(proposalHistory.entries).toHaveLength(1);
    expect(result.value.entries).toHaveLength(2);
    expect(result.value.entries[0]).toBe(
      proposalHistory.entries[0],
    );
    expect(result.value.entries[1]).toEqual({
      kind: "valuation-approved",
      sequence: 12,
      proposalSequence: 10,
      approvedValueCents: 49_000_000,
      approvedByReference: "synthetic-approver-1",
      evidenceReferences: [
        "synthetic://valuation/approval/12",
      ],
    });
  });

  it("allows the approved value to differ from the proposal", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
      48_500_000,
    );

    const effective =
      currentEffectivePropertyValuation(approved);

    expect(effective).toMatchObject({
      proposedValueCents: 50_000_000,
      approvedValueCents: 48_500_000,
    });
  });

  it("rejects approval of an unknown proposal", () => {
    const result = recordValuationApproval(
      createPropertyValuationHistory(property()),
      approvalInput(12, 10),
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe("not-found");
    expect(
      result.error.details?.proposalSequence,
    ).toBe(10);
  });

  it("rejects a second approval of the same proposal", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
    );

    const result = recordValuationApproval(
      approved,
      approvalInput(14, 10),
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe(
      "already-processed",
    );
    expect(
      result.error.details?.proposalSequence,
    ).toBe(10);
  });

  it("rejects approval sequence that is not later than history", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    for (const sequence of [9, 10]) {
      const result = recordValuationApproval(
        proposed,
        approvalInput(sequence, 10),
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(
          "$.sequence",
        );
      }
    }
  });

  it("rejects malformed approval values and references", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    const badValue = recordValuationApproval(
      proposed,
      {
        ...approvalInput(12, 10),
        approvedValueCents: -1,
      },
    );
    const badApprover = recordValuationApproval(
      proposed,
      {
        ...approvalInput(12, 10),
        approvedByReference: " ",
      },
    );
    const badEvidence = recordValuationApproval(
      proposed,
      {
        ...approvalInput(12, 10),
        evidenceReferences: [""],
      },
    );

    for (const [result, path] of [
      [badValue, "$.approvedValueCents"],
      [badApprover, "$.approvedByReference"],
      [badEvidence, "$.evidenceReferences[0]"],
    ] as const) {
      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(path);
      }
    }
  });

  it("has no effective valuation before approval", () => {
    const history = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    expect(
      currentEffectivePropertyValuation(history),
    ).toBeUndefined();
    expect(
      effectivePropertyValuationAt(
        history,
        eventSequence(50),
      ),
    ).toBeUndefined();
  });

  it("keeps the prior approval effective after a newer unapproved proposal", () => {
    const firstProposal = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const firstApproval = mustApprove(
      firstProposal,
      12,
      10,
      49_000_000,
    );
    const laterProposal = mustPropose(
      firstApproval,
      20,
      52_500_000,
    );

    expect(
      currentEffectivePropertyValuation(
        laterProposal,
      ),
    ).toMatchObject({
      proposalSequence: 10,
      approvalSequence: 12,
      approvedValueCents: 49_000_000,
    });
  });

  it("makes the newest approval currently effective", () => {
    const firstProposal = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const firstApproval = mustApprove(
      firstProposal,
      12,
      10,
      49_000_000,
    );
    const secondProposal = mustPropose(
      firstApproval,
      20,
      52_500_000,
    );
    const secondApproval = mustApprove(
      secondProposal,
      24,
      20,
      51_000_000,
    );

    expect(
      currentEffectivePropertyValuation(
        secondApproval,
      ),
    ).toMatchObject({
      proposalSequence: 20,
      approvalSequence: 24,
      proposedValueCents: 52_500_000,
      approvedValueCents: 51_000_000,
    });
  });

  it("reconstructs the valuation effective at an earlier sequence", () => {
    const firstProposal = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const firstApproval = mustApprove(
      firstProposal,
      12,
      10,
      49_000_000,
    );
    const secondProposal = mustPropose(
      firstApproval,
      20,
      52_500_000,
    );
    const secondApproval = mustApprove(
      secondProposal,
      24,
      20,
      51_000_000,
    );

    expect(
      effectivePropertyValuationAt(
        secondApproval,
        eventSequence(11),
      ),
    ).toBeUndefined();

    expect(
      effectivePropertyValuationAt(
        secondApproval,
        eventSequence(18),
      ),
    ).toMatchObject({
      approvalSequence: 12,
      approvedValueCents: 49_000_000,
    });

    expect(
      effectivePropertyValuationAt(
        secondApproval,
        eventSequence(24),
      ),
    ).toMatchObject({
      approvalSequence: 24,
      approvedValueCents: 51_000_000,
    });
  });

  it("returns a frozen effective valuation view", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
    );

    const effective =
      currentEffectivePropertyValuation(approved);

    expect(effective).toBeDefined();
    expect(Object.isFrozen(effective)).toBe(true);
    expect(
      Object.isFrozen(
        effective?.proposalEvidenceReferences,
      ),
    ).toBe(true);
    expect(
      Object.isFrozen(
        effective?.approvalEvidenceReferences,
      ),
    ).toBe(true);
  });

  it("contains no debt, capacity, pool, supply, or balance state", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
    );
    const serialized = JSON.stringify(approved);

    for (const forbidden of [
      "seniorDebtCents",
      "capacityContributionCents",
      "poolCapacityCents",
      "capacityBasisPoints",
      "issuedSupplyCents",
      "balanceCents",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});```

**Test inventory:**

```text
$ rg -n "^[[:space:]]*it(\.each)?\(" packages/domain/src/valuations.test.ts
121:  it("creates an empty frozen history for one Property", () => {
132:  it("appends an immutable valuation proposal", () => {
168:  it("preserves a first proposal when a second is appended", () => {
193:  it("trims proposal references and copies evidence", () => {
227:  it("rejects a non-object proposal", () => {
243:  it.each([
269:  it("rejects a proposal sequence that is not later than history", () => {
294:  it.each([
320:  it("allows a zero-cent proposal", () => {
329:  it("rejects empty proposal references and evidence", () => {
375:  it("appends an approval without changing the proposal", () => {
414:  it("allows the approved value to differ from the proposal", () => {
436:  it("rejects approval of an unknown proposal", () => {
454:  it("rejects a second approval of the same proposal", () => {
484:  it("rejects approval sequence that is not later than history", () => {
509:  it("rejects malformed approval values and references", () => {
553:  it("has no effective valuation before approval", () => {
570:  it("keeps the prior approval effective after a newer unapproved proposal", () => {
599:  it("makes the newest approval currently effective", () => {
635:  it("reconstructs the valuation effective at an earlier sequence", () => {
687:  it("returns a frozen effective valuation view", () => {
715:  it("contains no debt, capacity, pool, supply, or balance state", () => {
```

**Output:** Runtime tests cover creation, append-only behavior, proposals, approvals, chronology, error paths, effective lookup, and exclusions.

**Status:** Step 5 complete.

**Next:** Step 6 — Create compile-time valuation safeguards.

---

## Step 6 — Create compile-time valuation safeguards

**Input:** The valuation implementation and runtime tests.

**Action:** Create `packages/domain/src/valuations.type-test.ts` with the supplied compile-time assertions.

**Editor command:** `code packages/domain/src/valuations.type-test.ts`

**Resulting file:**

```text
import {
  createProperty,
  type PropertyCreationInput,
} from "./properties.js";
import {
  createPropertyValuationHistory,
  currentEffectivePropertyValuation,
  recordValuationApproval,
  recordValuationProposal,
  type EffectivePropertyValuation,
  type PropertyValuationHistory,
  type ValuationApprovalEntry,
  type ValuationProposalEntry,
} from "./valuations.js";
import {
  cents,
  eventSequence,
  type Cents,
  type EventSequence,
} from "./value-types.js";
import type { PropertyId } from "./identifiers.js";

const propertyResult = createProperty({
  id: "prop_00000000000000000000000001",
  address: {
    line1: "100 Synthetic Avenue",
    locality: "Lansing",
    region: "MI",
    postalCode: "48912",
    countryCode: "US",
  },
  legalDescription: "Synthetic legal description",
  ownerReference: "synthetic-owner",
  evidenceReferences: ["synthetic://property"],
} satisfies PropertyCreationInput);

if (!propertyResult.ok) {
  throw new Error(propertyResult.error.message);
}

const empty =
  createPropertyValuationHistory(
    propertyResult.value,
  );

const proposed = recordValuationProposal(
  empty,
  {
    sequence: 10,
    proposedValueCents: 50_000_000,
    proposedByReference: "synthetic-appraiser",
    evidenceReferences: ["synthetic://proposal"],
  },
);

if (!proposed.ok) {
  throw new Error(proposed.error.message);
}

const approved = recordValuationApproval(
  proposed.value,
  {
    sequence: 12,
    proposalSequence: 10,
    approvedValueCents: 49_000_000,
    approvedByReference: "synthetic-approver",
    evidenceReferences: ["synthetic://approval"],
  },
);

if (!approved.ok) {
  throw new Error(approved.error.message);
}

const effective:
  | EffectivePropertyValuation
  | undefined =
  currentEffectivePropertyValuation(
    approved.value,
  );

const history: PropertyValuationHistory =
  approved.value;
const propertyId: PropertyId =
  history.propertyId;
const amount: Cents = cents(1);
const sequence: EventSequence =
  eventSequence(1);

void effective;
void propertyId;
void amount;
void sequence;

// @ts-expect-error History property identity is readonly.
history.propertyId =
  "prop_00000000000000000000000002";

// @ts-expect-error History entries are readonly.
history.entries = [];

// @ts-expect-error History entries cannot be pushed.
history.entries.push(
  {} as ValuationProposalEntry,
);

const proposalEntry = history.entries[0];

if (
  proposalEntry?.kind ===
  "valuation-proposed"
) {
  // @ts-expect-error Proposal fields are readonly.
  proposalEntry.proposedValueCents =
    cents(2);

  // @ts-expect-error Proposal evidence is readonly.
  proposalEntry.evidenceReferences.push(
    "synthetic://mutation",
  );
}

const approvalEntry:
  | ValuationApprovalEntry
  | undefined =
  history.entries.find(
    (
      entry,
    ): entry is ValuationApprovalEntry =>
      entry.kind === "valuation-approved",
  );

if (approvalEntry !== undefined) {
  // @ts-expect-error Approval fields are readonly.
  approvalEntry.approvedValueCents =
    cents(2);
}

if (effective !== undefined) {
  // @ts-expect-error Effective valuation is readonly.
  effective.approvedValueCents =
    cents(2);

  // @ts-expect-error Effective evidence is readonly.
  effective.approvalEvidenceReferences.push(
    "synthetic://mutation",
  );
}

// @ts-expect-error Cents are not EventSequence values.
const wrongSequence: EventSequence =
  cents(10);

// @ts-expect-error EventSequence values are not Cents.
const wrongAmount: Cents =
  eventSequence(10);

// @ts-expect-error PropertyId is not a plain arbitrary string.
const wrongPropertyId: PropertyId =
  "prop_not-canonical";

void wrongSequence;
void wrongAmount;
void wrongPropertyId;```

**Compile-time assertion count:**

```text
$ rg -n "@ts-expect-error" packages/domain/src/valuations.type-test.ts
95:// @ts-expect-error History property identity is readonly.
99:// @ts-expect-error History entries are readonly.
102:// @ts-expect-error History entries cannot be pushed.
113:  // @ts-expect-error Proposal fields are readonly.
117:  // @ts-expect-error Proposal evidence is readonly.
134:  // @ts-expect-error Approval fields are readonly.
140:  // @ts-expect-error Effective valuation is readonly.
144:  // @ts-expect-error Effective evidence is readonly.
150:// @ts-expect-error Cents are not EventSequence values.
154:// @ts-expect-error EventSequence values are not Cents.
158:// @ts-expect-error PropertyId is not a plain arbitrary string.
```

**Output:** Readonly history, entry, effective-view, branded money, sequence, and Property identity boundaries are protected at compile time.

**Status:** Step 6 complete.

**Next:** Step 7 — Export and test the public valuation API.

---

## Step 7 — Export and test the public valuation API

**Input:** The saved valuation source and tests.

**Action:** Add `export * from "./valuations.js";` to `packages/domain/src/index.ts` and create `packages/domain/src/valuations-public.test.ts` with the supplied test.

**Editor commands:**

```text
code packages/domain/src/index.ts
code packages/domain/src/valuations-public.test.ts
```

**Updated entrypoint:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
export * from "./properties.js";
export * from "./valuations.js";```

**Public API test:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  createPropertyValuationHistory,
  currentEffectivePropertyValuation,
  recordValuationApproval,
  recordValuationProposal,
} from "./index.js";

describe("public valuation API", () => {
  it("creates and approves a valuation through the domain entrypoint", () => {
    const propertyResult = createProperty({
      id: "prop_00000000000000000000000001",
      address: {
        line1: "100 Synthetic Avenue",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description",
      ownerReference: "synthetic-owner",
      evidenceReferences: [
        "synthetic://property",
      ],
    });

    expect(propertyResult.ok).toBe(true);

    if (!propertyResult.ok) {
      return;
    }

    const proposalResult =
      recordValuationProposal(
        createPropertyValuationHistory(
          propertyResult.value,
        ),
        {
          sequence: 10,
          proposedValueCents: 50_000_000,
          proposedByReference:
            "synthetic-appraiser",
          evidenceReferences: [
            "synthetic://proposal",
          ],
        },
      );

    expect(proposalResult.ok).toBe(true);

    if (!proposalResult.ok) {
      return;
    }

    const approvalResult =
      recordValuationApproval(
        proposalResult.value,
        {
          sequence: 12,
          proposalSequence: 10,
          approvedValueCents: 49_000_000,
          approvedByReference:
            "synthetic-approver",
          evidenceReferences: [
            "synthetic://approval",
          ],
        },
      );

    expect(approvalResult.ok).toBe(true);

    if (!approvalResult.ok) {
      return;
    }

    expect(
      currentEffectivePropertyValuation(
        approvalResult.value,
      )?.approvedValueCents,
    ).toBe(49_000_000);
  });
});```

**Export check:**

```text
$ rg -n "valuations\.js" packages/domain/src/index.ts
13:export * from "./valuations.js";
```

**Output:** The append-only valuation API is reachable through the domain package entrypoint and has a direct integration test.

**Status:** Step 7 complete.

**Next:** Step 8 — Run focused valuation verification.

---

## Step 8 — Run focused valuation verification

**Input:** The valuation source, runtime tests, type tests, public export, and public test.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm test --workspace packages/domain -- --run src/valuations.test.ts src/valuations-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/valuations.test.ts src/valuations-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 13[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m29 passed[39m[22m[90m (29)[39m
[2m   Start at [22m 01:50:49
[2m   Duration [22m 284ms[2m (transform 216ms, setup 0ms, import 274ms, tests 22ms, environment 0ms)[22m

```

**Output:** The focused valuation compile-time and runtime boundaries pass.

**Status:** Step 8 complete.

**Next:** Step 9 — Prove the focused suite detects a wrong effective-value expectation.

---

## Step 9 — Prove the focused suite detects a wrong effective-value expectation

**Input:** The passing focused valuation tests from Step 8.

**Temporary action:** Append the supplied test named `TEMPORARY: treats an unapproved proposal as effective` to `packages/domain/src/valuations.test.ts`.

**Expected result:** The focused test command must fail because currentEffectivePropertyValuation() returns undefined before approval.

**Editor command:** `code packages/domain/src/valuations.test.ts`

**Commands and output:**

```text
$ npm test --workspace packages/domain -- --run src/valuations.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/valuations.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/valuations.test.ts [2m([22m[2m29 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 17[2mms[22m[39m
     [32m✓[39m creates an empty frozen history for one Property[32m 2[2mms[22m[39m
     [32m✓[39m appends an immutable valuation proposal[32m 1[2mms[22m[39m
     [32m✓[39m preserves a first proposal when a second is appended[32m 1[2mms[22m[39m
     [32m✓[39m trims proposal references and copies evidence[32m 0[2mms[22m[39m
     [32m✓[39m rejects a non-object proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m rejects a proposal sequence that is not later than history[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m allows a zero-cent proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects empty proposal references and evidence[32m 0[2mms[22m[39m
     [32m✓[39m appends an approval without changing the proposal[32m 1[2mms[22m[39m
     [32m✓[39m allows the approved value to differ from the proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects approval of an unknown proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects a second approval of the same proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects approval sequence that is not later than history[32m 0[2mms[22m[39m
     [32m✓[39m rejects malformed approval values and references[32m 0[2mms[22m[39m
     [32m✓[39m has no effective valuation before approval[32m 0[2mms[22m[39m
     [32m✓[39m keeps the prior approval effective after a newer unapproved proposal[32m 0[2mms[22m[39m
     [32m✓[39m makes the newest approval currently effective[32m 0[2mms[22m[39m
     [32m✓[39m reconstructs the valuation effective at an earlier sequence[32m 0[2mms[22m[39m
     [32m✓[39m returns a frozen effective valuation view[32m 0[2mms[22m[39m
     [32m✓[39m contains no debt, capacity, pool, supply, or balance state[32m 0[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: treats an unapproved proposal as effective[39m[32m 4[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/valuations.test.ts[2m > [22mTEMPORARY: treats an unapproved proposal as effective
[31m[1mAssertionError[22m: expected undefined to be defined[39m
[36m [2m❯[22m src/valuations.test.ts:[2m780:5[22m[39m
    [90m778|[39m       proposalResult[33m.[39mvalue[33m,[39m
    [90m779|[39m     )[33m,[39m
    [90m780|[39m   )[33m.[39m[34mtoBeDefined[39m()[33m;[39m
    [90m   |[39m     [31m^[39m
    [90m781|[39m })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m28 passed[39m[22m[90m (29)[39m
[2m   Start at [22m 01:51:23
[2m   Duration [22m 269ms[2m (transform 112ms, setup 0ms, import 138ms, tests 17ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/valuations.test.ts

[exit status: 1]
```

**Observed result:** The focused valuation suite rejected the incorrect claim that an unapproved proposal is effective.

**Status:** Step 9 complete; intentional failure observed.

**Next:** Step 10 — Remove the temporary test and restore the passing suite.

---

## Step 10 — Restore the valid runtime test file

**Input:** The valuation test file containing the one intentional temporary failure.

**Action:** Remove only the test named `TEMPORARY: treats an unapproved proposal as effective`.

**Editor command:** `code packages/domain/src/valuations.test.ts`

**Commands and output:**

```text
$ rg -n "TEMPORARY:" packages/domain/src/valuations.test.ts || true
740:it("TEMPORARY: treats an unapproved proposal as effective", () => {

$ npm test --workspace packages/domain -- --run src/valuations.test.ts src/valuations-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/valuations.test.ts src/valuations-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/valuations.test.ts [2m([22m[2m29 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 29[2mms[22m[39m
     [32m✓[39m creates an empty frozen history for one Property[32m 6[2mms[22m[39m
     [32m✓[39m appends an immutable valuation proposal[32m 2[2mms[22m[39m
     [32m✓[39m preserves a first proposal when a second is appended[32m 1[2mms[22m[39m
     [32m✓[39m trims proposal references and copies evidence[32m 0[2mms[22m[39m
     [32m✓[39m rejects a non-object proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence Infinity[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m rejects a proposal sequence that is not later than history[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents -1[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m allows a zero-cent proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects empty proposal references and evidence[32m 0[2mms[22m[39m
     [32m✓[39m appends an approval without changing the proposal[32m 1[2mms[22m[39m
     [32m✓[39m allows the approved value to differ from the proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects approval of an unknown proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects a second approval of the same proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects approval sequence that is not later than history[32m 1[2mms[22m[39m
     [32m✓[39m rejects malformed approval values and references[32m 1[2mms[22m[39m
     [32m✓[39m has no effective valuation before approval[32m 1[2mms[22m[39m
     [32m✓[39m keeps the prior approval effective after a newer unapproved proposal[32m 0[2mms[22m[39m
     [32m✓[39m makes the newest approval currently effective[32m 1[2mms[22m[39m
     [32m✓[39m reconstructs the valuation effective at an earlier sequence[32m 1[2mms[22m[39m
     [32m✓[39m returns a frozen effective valuation view[32m 0[2mms[22m[39m
     [32m✓[39m contains no debt, capacity, pool, supply, or balance state[32m 1[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: treats an unapproved proposal as effective[39m[32m 7[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 10[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/valuations.test.ts[2m > [22mTEMPORARY: treats an unapproved proposal as effective
[31m[1mAssertionError[22m: expected undefined to be defined[39m
[36m [2m❯[22m src/valuations.test.ts:[2m780:5[22m[39m
    [90m778|[39m       proposalResult[33m.[39mvalue[33m,[39m
    [90m779|[39m     )[33m,[39m
    [90m780|[39m   )[33m.[39m[34mtoBeDefined[39m()[33m;[39m
    [90m   |[39m     [31m^[39m
    [90m781|[39m })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m1 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m29 passed[39m[22m[90m (30)[39m
[2m   Start at [22m 01:51:52
[2m   Duration [22m 287ms[2m (transform 141ms, setup 0ms, import 267ms, tests 38ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/valuations.test.ts src/valuations-public.test.ts
---

## Step 10 — Restore the valid runtime test file

**Input:** The valuation test file containing the one intentional temporary failure.

**Action:** Remove only the test named `TEMPORARY: treats an unapproved proposal as effective`.

**Editor command:** `code packages/domain/src/valuations.test.ts`

**Commands and output:**

```text
$ rg -n "TEMPORARY:" packages/domain/src/valuations.test.ts || true
740:it("TEMPORARY: treats an unapproved proposal as effective", () => {

$ npm test --workspace packages/domain -- --run src/valuations.test.ts src/valuations-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/valuations.test.ts src/valuations-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 8[2mms[22m[39m
 [31m❯[39m src/valuations.test.ts [2m([22m[2m29 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 36[2mms[22m[39m
     [32m✓[39m creates an empty frozen history for one Property[32m 7[2mms[22m[39m
     [32m✓[39m appends an immutable valuation proposal[32m 4[2mms[22m[39m
     [32m✓[39m preserves a first proposal when a second is appended[32m 3[2mms[22m[39m
     [32m✓[39m trims proposal references and copies evidence[32m 1[2mms[22m[39m
     [32m✓[39m rejects a non-object proposal[32m 1[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence -1[32m 1[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence 1.5[32m 1[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence Infinity[32m 1[2mms[22m[39m
     [32m✓[39m rejects invalid proposal sequence 9007199254740992[32m 2[2mms[22m[39m
     [32m✓[39m rejects a proposal sequence that is not later than history[32m 2[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents -1[32m 1[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents 1.5[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents NaN[32m 0[2mms[22m[39m
     [32m✓[39m rejects invalid proposed cents 9007199254740992[32m 0[2mms[22m[39m
     [32m✓[39m allows a zero-cent proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects empty proposal references and evidence[32m 0[2mms[22m[39m
     [32m✓[39m appends an approval without changing the proposal[32m 1[2mms[22m[39m
     [32m✓[39m allows the approved value to differ from the proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects approval of an unknown proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects a second approval of the same proposal[32m 0[2mms[22m[39m
     [32m✓[39m rejects approval sequence that is not later than history[32m 0[2mms[22m[39m
     [32m✓[39m rejects malformed approval values and references[32m 0[2mms[22m[39m
     [32m✓[39m has no effective valuation before approval[32m 0[2mms[22m[39m
     [32m✓[39m keeps the prior approval effective after a newer unapproved proposal[32m 0[2mms[22m[39m
     [32m✓[39m makes the newest approval currently effective[32m 0[2mms[22m[39m
     [32m✓[39m reconstructs the valuation effective at an earlier sequence[32m 0[2mms[22m[39m
     [32m✓[39m returns a frozen effective valuation view[32m 0[2mms[22m[39m
     [32m✓[39m contains no debt, capacity, pool, supply, or balance state[32m 0[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: treats an unapproved proposal as effective[39m[32m 5[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/valuations.test.ts[2m > [22mTEMPORARY: treats an unapproved proposal as effective
[31m[1mAssertionError[22m: expected undefined to be defined[39m
[36m [2m❯[22m src/valuations.test.ts:[2m780:5[22m[39m
    [90m778|[39m       proposalResult[33m.[39mvalue[33m,[39m
    [90m779|[39m     )[33m,[39m
    [90m780|[39m   )[33m.[39m[34mtoBeDefined[39m()[33m;[39m
    [90m   |[39m     [31m^[39m
    [90m781|[39m })[33m;[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m1 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m29 passed[39m[22m[90m (30)[39m
[2m   Start at [22m 01:55:39
[2m   Duration [22m 291ms[2m (transform 139ms, setup 0ms, import 257ms, tests 44ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/valuations.test.ts src/valuations-public.test.ts
**Commands and output:**

```text
$ rg -n "TEMPORARY:" packages/domain/src/valuations.test.ts || true

$ npm test --workspace packages/domain -- --run src/valuations.test.ts src/valuations-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/valuations.test.ts src/valuations-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 39[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m29 passed[39m[22m[90m (29)[39m
[2m   Start at [22m 01:56:15
[2m   Duration [22m 315ms[2m (transform 174ms, setup 0ms, import 285ms, tests 49ms, environment 0ms)[22m

```

**Output:** The intentional failure is removed and the valid focused valuation suite passes again.

**Status:** Step 10 complete.

**Next:** Step 11 — Verify the complete domain package.

---

## Step 11 — Verify the complete domain package

**Input:** The restored WO-016 source and all prior domain behavior.

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

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 28[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 25[2mms[22m[39m

[2m Test Files [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m      Tests [22m [1m[32m233 passed[39m[22m[90m (233)[39m
[2m   Start at [22m 01:56:24
[2m   Duration [22m 336ms[2m (transform 634ms, setup 0ms, import 1.13s, tests 156ms, environment 1ms)[22m


$ rg -n "TEMPORARY:" packages/domain/src || true
```

**Output:** WO-010 through WO-016 domain types and runtime behavior pass together with no temporary source test.

**Status:** Step 11 complete.

**Next:** Step 12 — Verify the build artifact boundary.

---

## Step 12 — Verify the build artifact boundary

**Input:** Passing domain source and the disposable generated directory `packages/domain/dist`.

**Destructive command:** Remove only `packages/domain/dist`. It contains generated TypeScript build output and is recreated immediately by the build command.

**Commands and output:**

```text
$ rm -rf packages/domain/dist

$ npm run build --workspace packages/domain

> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


$ test -f packages/domain/dist/valuations.js
[valuations.js exists]

$ test -f packages/domain/dist/valuations.d.ts
[valuations.d.ts exists]

$ find packages/domain/dist -maxdepth 1 -type f | sort
packages/domain/dist/canonical-scenarios.d.ts
packages/domain/dist/canonical-scenarios.d.ts.map
packages/domain/dist/canonical-scenarios.js
packages/domain/dist/canonical-scenarios.js.map
packages/domain/dist/canonical-scenarios.type-test.d.ts
packages/domain/dist/canonical-scenarios.type-test.d.ts.map
packages/domain/dist/canonical-scenarios.type-test.js
packages/domain/dist/canonical-scenarios.type-test.js.map
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
packages/domain/dist/properties.d.ts
packages/domain/dist/properties.d.ts.map
packages/domain/dist/properties.js
packages/domain/dist/properties.js.map
packages/domain/dist/properties.type-test.d.ts
packages/domain/dist/properties.type-test.d.ts.map
packages/domain/dist/properties.type-test.js
packages/domain/dist/properties.type-test.js.map
packages/domain/dist/valuations.d.ts
packages/domain/dist/valuations.d.ts.map
packages/domain/dist/valuations.js
packages/domain/dist/valuations.js.map
packages/domain/dist/valuations.type-test.d.ts
packages/domain/dist/valuations.type-test.d.ts.map
packages/domain/dist/valuations.type-test.js
packages/domain/dist/valuations.type-test.js.map
packages/domain/dist/value-types.d.ts
packages/domain/dist/value-types.d.ts.map
packages/domain/dist/value-types.js
packages/domain/dist/value-types.js.map
packages/domain/dist/value-types.type-test.d.ts
packages/domain/dist/value-types.type-test.d.ts.map
packages/domain/dist/value-types.type-test.js
packages/domain/dist/value-types.type-test.js.map

$ find packages/domain/dist -type f \( -name "*.test.*" -o -name "*.type-test.*" \)
packages/domain/dist/valuations.type-test.d.ts.map
packages/domain/dist/valuations.type-test.js
packages/domain/dist/domain-errors.type-test.d.ts.map
packages/domain/dist/canonical-scenarios.type-test.js.map
packages/domain/dist/identifiers.type-test.js.map
packages/domain/dist/value-types.type-test.d.ts.map
packages/domain/dist/properties.type-test.d.ts.map
packages/domain/dist/identifiers.type-test.d.ts
packages/domain/dist/canonical-scenarios.type-test.d.ts.map
packages/domain/dist/domain-statuses.type-test.js.map
packages/domain/dist/domain-statuses.type-test.d.ts
packages/domain/dist/valuations.type-test.d.ts
packages/domain/dist/domain-errors.type-test.d.ts
packages/domain/dist/canonical-scenarios.type-test.js
packages/domain/dist/valuations.type-test.js.map
packages/domain/dist/domain-errors.type-test.js.map
packages/domain/dist/properties.type-test.js.map
packages/domain/dist/value-types.type-test.js.map
packages/domain/dist/identifiers.type-test.d.ts.map
packages/domain/dist/domain-errors.type-test.js
packages/domain/dist/value-types.type-test.js
packages/domain/dist/domain-statuses.type-test.d.ts.map
packages/domain/dist/canonical-scenarios.type-test.d.ts
packages/domain/dist/properties.type-test.js
packages/domain/dist/domain-statuses.type-test.js
packages/domain/dist/properties.type-test.d.ts
packages/domain/dist/value-types.type-test.d.ts
packages/domain/dist/identifiers.type-test.js
[test artifacts unexpectedly emitted]
---

## Step 12 repair — Correct the build artifact boundary

**Input:** Step 12 proved that compile-time `*.type-test.ts` files were being emitted into the production `dist` directory.

**Action:** Exclude both runtime tests and compile-time type tests from the production TypeScript build.

**Commands and output:**

```text
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
$ rg -n "type-test" packages/domain/tsconfig.json
11:  "src/**/*.type-test.ts"

$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ rm -rf packages/domain/dist

$ npm run build --workspace packages/domain

> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


$ test -f packages/domain/dist/valuations.js
[valuations.js exists]

$ test -f packages/domain/dist/valuations.d.ts
[valuations.d.ts exists]

$ find packages/domain/dist -type f \( -name "*.test.*" -o -name "*.type-test.*" \)
[no test artifacts emitted]

$ npm test --workspace packages/domain

> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 25[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 20[2mms[22m[39m

[2m Test Files [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m      Tests [22m [1m[32m233 passed[39m[22m[90m (233)[39m
[2m   Start at [22m 01:58:57
[2m   Duration [22m 332ms[2m (transform 755ms, setup 0ms, import 1.26s, tests 138ms, environment 1ms)[22m

```

**Output:** Production build output contains the valuation API while excluding runtime and compile-time test artifacts. Domain type checking and tests remain green.

**Status:** Step 12 complete after build-boundary repair.

**Next:** Step 13 — Verify the complete Economic Union workspace.

---

## Step 13 — Verify the complete Economic Union workspace

**Input:** The passing domain package with append-only valuation history.

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
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 26[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 19[2mms[22m[39m

[2m Test Files [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m      Tests [22m [1m[32m233 passed[39m[22m[90m (233)[39m
[2m   Start at [22m 01:59:46
[2m   Duration [22m 318ms[2m (transform 742ms, setup 0ms, import 1.13s, tests 147ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 01:59:46
[2m   Duration [22m 175ms[2m (transform 46ms, setup 0ms, import 63ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 1.34ms (695.31µs CPU time)

Ran 1 test suite in 9.06ms (1.34ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Output:** All TypeScript workspaces and the unchanged Foundry project pass after WO-016.

**Status:** Step 13 complete.

**Next:** Step 14 — Retest the adjacent Point event logger.

---

## Step 14 — Retest the adjacent Point event logger

**Input:** The complete Economic Union changes and the neighboring `code/event-logger` application.

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
 ✓ test/index.spec.js (4 tests) 154ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  01:59:56
   Duration  1.78s (transform 66ms, setup 0ms, collect 92ms, tests 154ms, environment 0ms, prepare 205ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** The existing Point event logger still passes after the isolated Economic Union valuation change.

**Status:** Step 14 complete.

**Next:** Step 15 — Inspect and summarize WO-016.

---

## Step 15 — Inspect and summarize WO-016

**Input:** The fully verified append-only valuation implementation and tests.

**Commands and output:**

```text
$ git status --short
 M packages/domain/src/index.ts
 M packages/domain/tsconfig.json
?? docs/work-orders/WO-016-execution.md
?? packages/domain/src/valuations-public.test.ts
?? packages/domain/src/valuations.test.ts
?? packages/domain/src/valuations.ts
?? packages/domain/src/valuations.type-test.ts

$ git diff --check

$ git diff --stat
 code/economic-union/packages/domain/src/index.ts  | 1 +
 code/economic-union/packages/domain/tsconfig.json | 7 ++++---
 2 files changed, 5 insertions(+), 3 deletions(-)

$ git diff -- packages/domain/src/valuations.ts packages/domain/src/valuations.test.ts packages/domain/src/valuations.type-test.ts packages/domain/src/valuations-public.test.ts packages/domain/src/index.ts
diff --git a/code/economic-union/packages/domain/src/index.ts b/code/economic-union/packages/domain/src/index.ts
index 5e3f305..b3914ab 100644
--- a/code/economic-union/packages/domain/src/index.ts
+++ b/code/economic-union/packages/domain/src/index.ts
@@ -10,3 +10,4 @@ export * from "./identifiers.js";
 export * from "./domain-errors.js";
 export * from "./canonical-scenarios.js";
 export * from "./properties.js";
+export * from "./valuations.js";
\ No newline at end of file

$ rg -n "TEMPORARY:" packages/domain/src || true

$ rg -n "seniorDebt|capacityContribution|poolCapacity|capacityBasisPoints|issuedSupply|balanceCents" packages/domain/src/valuations.ts || true
```

**Total input:** The committed immutable Property model and existing integer, identifier, result, status, and scenario vocabulary.

**Total output:** One Property-bound immutable history of valuation proposals and approvals, effective-value lookup by event sequence, runtime and compile-time safeguards, public export, and execution evidence.

**Exclusions preserved:** No debt, capacity, pooling, health, command, event-envelope, persistence, interface, or Solidity behavior was added.

**Status:** Step 15 complete.

**Next:** Step 16 — Stage only WO-016.

---

## Step 16 — Stage only WO-016

**Input:** The inspected worktree containing only the declared WO-016 changes.

**Action:** Stage only explicit valuation source, tests, public export, and execution-record paths.

**Commands and output:**

```text
$ git add packages/domain/src/valuations.ts packages/domain/src/valuations.test.ts packages/domain/src/valuations.type-test.ts packages/domain/src/valuations-public.test.ts packages/domain/src/index.ts docs/work-orders/WO-016-execution.md

$ git diff --cached --check

$ git status --short
AM docs/work-orders/WO-016-execution.md
M  packages/domain/src/index.ts
A  packages/domain/src/valuations-public.test.ts
A  packages/domain/src/valuations.test.ts
A  packages/domain/src/valuations.ts
A  packages/domain/src/valuations.type-test.ts
 M packages/domain/tsconfig.json

$ git diff --cached --stat
 .../docs/work-orders/WO-016-execution.md           | 3015 ++++++++++++++++++++
 code/economic-union/packages/domain/src/index.ts   |    1 +
 .../packages/domain/src/valuations-public.test.ts  |   89 +
 .../packages/domain/src/valuations.test.ts         |  738 +++++
 .../packages/domain/src/valuations.ts              |  533 ++++
 .../packages/domain/src/valuations.type-test.ts    |  164 ++
 6 files changed, 4540 insertions(+)

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-016-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/valuations-public.test.ts
code/economic-union/packages/domain/src/valuations.test.ts
code/economic-union/packages/domain/src/valuations.ts
code/economic-union/packages/domain/src/valuations.type-test.ts
```

**Output:** Only declared WO-016 files are staged and the staged diff passes whitespace validation.

**Status:** Step 16 complete.

**Next:** Step 17 — Perform final pre-commit verification.

---

## Step 16 — Stage only WO-016

**Input:** The inspected worktree containing only the declared WO-016 changes.

**Action:** Stage only explicit valuation source, tests, public export, and execution-record paths.

**Commands and output:**

```text
$ git add packages/domain/src/valuations.ts packages/domain/src/valuations.test.ts packages/domain/src/valuations.type-test.ts packages/domain/src/valuations-public.test.ts packages/domain/src/index.ts docs/work-orders/WO-016-execution.md

$ git diff --cached --check

$ git status --short
AM docs/work-orders/WO-016-execution.md
M  packages/domain/src/index.ts
A  packages/domain/src/valuations-public.test.ts
A  packages/domain/src/valuations.test.ts
A  packages/domain/src/valuations.ts
A  packages/domain/src/valuations.type-test.ts
 M packages/domain/tsconfig.json

$ git diff --cached --stat
 .../docs/work-orders/WO-016-execution.md           | 3063 ++++++++++++++++++++
 code/economic-union/packages/domain/src/index.ts   |    1 +
 .../packages/domain/src/valuations-public.test.ts  |   89 +
 .../packages/domain/src/valuations.test.ts         |  738 +++++
 .../packages/domain/src/valuations.ts              |  533 ++++
 .../packages/domain/src/valuations.type-test.ts    |  164 ++
 6 files changed, 4588 insertions(+)

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-016-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/valuations-public.test.ts
code/economic-union/packages/domain/src/valuations.test.ts
code/economic-union/packages/domain/src/valuations.ts
code/economic-union/packages/domain/src/valuations.type-test.ts
```

**Output:** Only declared WO-016 files are staged and the staged diff passes whitespace validation.

**Status:** Step 16 complete.

**Next:** Step 17 — Perform final pre-commit verification.

---

## Step 17 — Perform final pre-commit verification

**Input:** The explicitly staged WO-016 valuation source, tests, export, and execution record.

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

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 25[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 19[2mms[22m[39m

[2m Test Files [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m      Tests [22m [1m[32m233 passed[39m[22m[90m (233)[39m
[2m   Start at [22m 02:02:51
[2m   Duration [22m 304ms[2m (transform 647ms, setup 0ms, import 1.01s, tests 142ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 02:02:52
[2m   Duration [22m 144ms[2m (transform 21ms, setup 0ms, import 34ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 294.68µs (31.01µs CPU time)

Ran 1 test suite in 6.82ms (294.68µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

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
 ✓ test/index.spec.js (4 tests) 231ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:02:53
   Duration  1.75s (transform 46ms, setup 0ms, collect 84ms, tests 231ms, environment 0ms, prepare 155ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --cached --check

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-016-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/valuations-public.test.ts
code/economic-union/packages/domain/src/valuations.test.ts
code/economic-union/packages/domain/src/valuations.ts
code/economic-union/packages/domain/src/valuations.type-test.ts

$ git status --short
AM docs/work-orders/WO-016-execution.md
M  packages/domain/src/index.ts
A  packages/domain/src/valuations-public.test.ts
A  packages/domain/src/valuations.test.ts
A  packages/domain/src/valuations.ts
A  packages/domain/src/valuations.type-test.ts
 M packages/domain/tsconfig.json
```

**Acceptance evidence:**

- A second valuation preserves the first.
- Proposals and approvals are separate immutable facts.
- Every append sequence is strictly chronological.
- An unapproved proposal does not become effective.
- A later approval becomes current without erasing prior approvals.
- Effective valuation can be reconstructed at an earlier event sequence.
- Unknown proposals return not-found.
- Duplicate approvals return already-processed.
- Focused and complete TypeScript verification passes.
- Foundry passes unchanged.
- The adjacent Point event logger passes unchanged.
- The deliberate failing test was observed and restored.

**Status:** WO-016 is authorized for commit.

**Next:** Step 18 — Restage the final execution record and commit WO-016.

---

## Step 18 — Restage and commit WO-016

**Input:** The verified WO-016 implementation, build-boundary repair, tests, exports, and completed execution record.

**Commands and output:**

```text
$ git add packages/domain/src/valuations.ts packages/domain/src/valuations.test.ts packages/domain/src/valuations.type-test.ts packages/domain/src/valuations-public.test.ts packages/domain/src/index.ts packages/domain/tsconfig.json docs/work-orders/WO-016-execution.md

$ git diff --cached --check

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-016-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/valuations-public.test.ts
code/economic-union/packages/domain/src/valuations.test.ts
code/economic-union/packages/domain/src/valuations.ts
code/economic-union/packages/domain/src/valuations.type-test.ts
code/economic-union/packages/domain/tsconfig.json

$ git status --short
AM docs/work-orders/WO-016-execution.md
M  packages/domain/src/index.ts
A  packages/domain/src/valuations-public.test.ts
A  packages/domain/src/valuations.test.ts
A  packages/domain/src/valuations.ts
A  packages/domain/src/valuations.type-test.ts
M  packages/domain/tsconfig.json

$ git diff --cached --stat
 .../docs/work-orders/WO-016-execution.md           | 3270 ++++++++++++++++++++
 code/economic-union/packages/domain/src/index.ts   |    1 +
 .../packages/domain/src/valuations-public.test.ts  |   89 +
 .../packages/domain/src/valuations.test.ts         |  738 +++++
 .../packages/domain/src/valuations.ts              |  533 ++++
 .../packages/domain/src/valuations.type-test.ts    |  164 +
 code/economic-union/packages/domain/tsconfig.json  |    7 +-
 7 files changed, 4799 insertions(+), 3 deletions(-)
```

**Output:** The complete WO-016 source, tests, export, TypeScript build-boundary repair, and final execution record are staged together.

**Status:** WO-016 is authorized for commit if no unstaged WO-016 changes remain.

---

## Step 17 — Perform final pre-commit verification

**Input:** The explicitly staged WO-016 valuation source, tests, export, and execution record.

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

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/valuations-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 21[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 28[2mms[22m[39m
 [32m✓[39m src/valuations.test.ts [2m([22m[2m28 tests[22m[2m)[22m[32m 20[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 39[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 18[2mms[22m[39m

[2m Test Files [22m [1m[32m10 passed[39m[22m[90m (10)[39m
[2m      Tests [22m [1m[32m233 passed[39m[22m[90m (233)[39m
[2m   Start at [22m 02:05:09
[2m   Duration [22m 326ms[2m (transform 726ms, setup 0ms, import 1.19s, tests 167ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 02:05:10
[2m   Duration [22m 200ms[2m (transform 50ms, setup 0ms, import 66ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 256.19µs (32.20µs CPU time)

Ran 1 test suite in 6.11ms (256.19µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

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
 ✓ test/index.spec.js (4 tests) 280ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:05:11
   Duration  1.91s (transform 57ms, setup 0ms, collect 86ms, tests 280ms, environment 0ms, prepare 225ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...

$ rg -n "TEMPORARY:" packages/domain/src || true

$ git diff --cached --check
code/economic-union/docs/work-orders/WO-016-execution.md:3306: new blank line at EOF.
---

## Step 18 — Restage and commit WO-016

**Input:** The verified WO-016 implementation, build-boundary repair, tests, exports, and completed execution record.

**Commands and output:**

```text
$ git add packages/domain/src/valuations.ts packages/domain/src/valuations.test.ts packages/domain/src/valuations.type-test.ts packages/domain/src/valuations-public.test.ts packages/domain/src/index.ts packages/domain/tsconfig.json docs/work-orders/WO-016-execution.md

$ git diff --cached --check

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-016-execution.md
code/economic-union/packages/domain/src/index.ts
code/economic-union/packages/domain/src/valuations-public.test.ts
code/economic-union/packages/domain/src/valuations.test.ts
code/economic-union/packages/domain/src/valuations.ts
code/economic-union/packages/domain/src/valuations.type-test.ts
code/economic-union/packages/domain/tsconfig.json

$ git status --short
AM docs/work-orders/WO-016-execution.md
M  packages/domain/src/index.ts
A  packages/domain/src/valuations-public.test.ts
A  packages/domain/src/valuations.test.ts
A  packages/domain/src/valuations.ts
A  packages/domain/src/valuations.type-test.ts
M  packages/domain/tsconfig.json

$ git diff --cached --stat
 .../docs/work-orders/WO-016-execution.md           | 3440 ++++++++++++++++++++
 code/economic-union/packages/domain/src/index.ts   |    1 +
 .../packages/domain/src/valuations-public.test.ts  |   89 +
 .../packages/domain/src/valuations.test.ts         |  738 +++++
 .../packages/domain/src/valuations.ts              |  533 +++
 .../packages/domain/src/valuations.type-test.ts    |  164 +
 code/economic-union/packages/domain/tsconfig.json  |    7 +-
 7 files changed, 4969 insertions(+), 3 deletions(-)
```

**Output:** The complete WO-016 source, tests, export, TypeScript build-boundary repair, and final execution record are staged together.

**Status:** WO-016 is authorized for commit if no unstaged WO-016 changes remain.
---

## Step 18 — Restage the final execution record and commit WO-016

**Input:** The authorized WO-016 staged change plus the final Step 17 evidence appended to the execution record.

**Commands and output:**

```text
$ git add docs/work-orders/WO-016-execution.md

$ git diff --cached --check

$ git diff --cached --name-only
code/economic-union/docs/work-orders/WO-016-execution.md

$ git commit -m "feat(domain): add append-only property valuations"
[main 135e723] feat(domain): add append-only property valuations
 1 file changed, 10 insertions(+)

$ git status --short
 M docs/work-orders/WO-016-execution.md

$ git log -1 --oneline --decorate
135e723 (HEAD -> main) feat(domain): add append-only property valuations
```

**Output:** WO-016 is committed as one bounded append-only valuation change and the repository status is visible after commit.

**Status:** WO-016 complete.

**Next:** Update the progress tracker, then begin WO-017 — Implement property capacity contribution.

