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
