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
    proposedValueCents: cents(1_000),
    approvedValueCents: cents(1_000),
    proposedByReference: "test-proposer",
    approvedByReference: "test-approver",
    proposalEvidenceReferences:
      Object.freeze(["proposal-evidence"]),
    approvalEvidenceReferences:
      Object.freeze(["approval-evidence"]),
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
