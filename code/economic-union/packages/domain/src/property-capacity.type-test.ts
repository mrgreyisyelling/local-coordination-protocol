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
