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
