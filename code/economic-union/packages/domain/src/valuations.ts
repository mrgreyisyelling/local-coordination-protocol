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
