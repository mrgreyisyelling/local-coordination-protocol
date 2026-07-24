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
      throw new Error(result.error.message);
    }

    const pool: UnionBackingPool =
      result.value;

    expect(pool.totalCapacityCents).toBe(
      20_000_000,
    );
  });
});
