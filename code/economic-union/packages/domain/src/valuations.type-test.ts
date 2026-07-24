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
void wrongPropertyId;