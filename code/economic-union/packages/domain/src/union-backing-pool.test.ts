import {
  describe,
  expect,
  it,
} from "vitest";

import {
  aggregateUnionBackingPoolCapacity,
  type UnionBackingPoolContributionInput,
} from "./union-backing-pool.js";
import {
  calculatePropertyCapacityContribution,
  type PropertyCapacityContribution,
} from "./property-capacity.js";
import {
  propertyStatus,
} from "./domain-statuses.js";
import {
  deterministicTestId,
  type PropertyId,
} from "./identifiers.js";
import type {
  EffectivePropertyValuation,
} from "./valuations.js";
import {
  basisPoints,
  cents,
  eventSequence,
} from "./value-types.js";

function contribution(
  propertyNumber: number,
  approvedValueCents: number,
  recognizedSeniorDebtCents: number,
  rateBasisPoints = 6_000,
): PropertyCapacityContribution {
  const valuation: EffectivePropertyValuation =
    Object.freeze({
      propertyId:
        deterministicTestId(
          "property",
          propertyNumber,
        ),
      proposalSequence: eventSequence(10),
      approvalSequence: eventSequence(11),
      proposedValueCents:
        cents(approvedValueCents),
      approvedValueCents:
        cents(approvedValueCents),
      proposedByReference: "test-proposer",
      approvedByReference: "test-approver",
      proposalEvidenceReferences:
        Object.freeze(["proposal-evidence"]),
      approvalEvidenceReferences:
        Object.freeze(["approval-evidence"]),
    });

  return calculatePropertyCapacityContribution(
    valuation,
    cents(recognizedSeniorDebtCents),
    basisPoints(rateBasisPoints),
  );
}

function input(
  status: string,
  capacity: PropertyCapacityContribution,
  propertyId: PropertyId = capacity.propertyId,
): UnionBackingPoolContributionInput {
  return Object.freeze({
    propertyId,
    propertyStatus: propertyStatus(status),
    contribution: capacity,
  });
}

function requirePool(
  inputs: readonly UnionBackingPoolContributionInput[],
) {
  const result =
    aggregateUnionBackingPoolCapacity(inputs);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe("Union Backing Pool aggregation", () => {
  it("returns zero for zero Properties", () => {
    const pool = requirePool([]);

    expect(pool.totalCapacityCents).toBe(0);
    expect(pool.propertyCapacities).toEqual([]);
  });

  it("returns one active Property contribution", () => {
    const propertyA = contribution(
      1,
      50_000_000,
      10_000_000,
    );

    const pool = requirePool([
      input("active", propertyA),
    ]);

    expect(pool.totalCapacityCents).toBe(
      20_000_000,
    );
    expect(
      pool.propertyCapacities[0],
    ).toMatchObject({
      propertyId: propertyA.propertyId,
      sourceContributionCents: 20_000_000,
      eligibleContributionCents: 20_000_000,
      includedInTotal: true,
    });
  });

  it("sums canonical Properties A and B to $330,000", () => {
    const propertyA = contribution(
      1,
      50_000_000,
      10_000_000,
    );
    const propertyB = contribution(
      2,
      30_000_000,
      5_000_000,
    );

    const pool = requirePool([
      input("active", propertyA),
      input("active", propertyB),
    ]);

    expect(
      propertyA.contributionCents,
    ).toBe(20_000_000);
    expect(
      propertyB.contributionCents,
    ).toBe(13_000_000);
    expect(pool.totalCapacityCents).toBe(
      33_000_000,
    );
  });

  it("sums multiple active contributions exactly once", () => {
    const capacities = [
      contribution(1, 100, 0, 10_000),
      contribution(2, 200, 0, 10_000),
      contribution(3, 300, 0, 10_000),
    ];

    const pool = requirePool(
      capacities.map((capacity) =>
        input("active", capacity),
      ),
    );

    expect(pool.totalCapacityCents).toBe(600);
    expect(pool.propertyCapacities).toHaveLength(3);
  });

  it("keeps an active zero-contribution Property visible without changing the total", () => {
    const zero = contribution(1, 0, 0);
    const positive = contribution(
      2,
      1_000,
      0,
      10_000,
    );

    const pool = requirePool([
      input("active", zero),
      input("active", positive),
    ]);

    expect(pool.totalCapacityCents).toBe(1_000);
    expect(
      pool.propertyCapacities[0],
    ).toMatchObject({
      propertyId: zero.propertyId,
      sourceContributionCents: 0,
      eligibleContributionCents: 0,
      includedInTotal: true,
    });
  });

  it.each([
    "proposed",
    "suspended",
    "rejected",
    "liquidating",
    "closed",
  ])(
    "counts a %s Property as zero eligible capacity",
    (status) => {
      const capacity = contribution(
        1,
        10_000,
        0,
        10_000,
      );

      const pool = requirePool([
        input(status, capacity),
      ]);

      expect(pool.totalCapacityCents).toBe(0);
      expect(
        pool.propertyCapacities[0],
      ).toMatchObject({
        sourceContributionCents: 10_000,
        eligibleContributionCents: 0,
        includedInTotal: false,
      });
    },
  );

  it("rejects a mismatched PropertyId and contribution PropertyId", () => {
    const capacity = contribution(
      1,
      10_000,
      0,
      10_000,
    );

    const result =
      aggregateUnionBackingPoolCapacity([
        input(
          "active",
          capacity,
          deterministicTestId("property", 2),
        ),
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected mismatched Property identity to fail",
      );
    }

    expect(result.error.code).toBe(
      "invalid-input",
    );
    expect(result.error.details).toMatchObject({
      path: "inputs[0].propertyId",
      contributionPropertyId:
        capacity.propertyId,
    });
  });

  it("rejects duplicate Property identity instead of double counting", () => {
    const capacity = contribution(
      1,
      10_000,
      0,
      10_000,
    );
    const duplicate = input(
      "active",
      capacity,
    );

    const result =
      aggregateUnionBackingPoolCapacity([
        duplicate,
        duplicate,
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected duplicate Property to fail",
      );
    }

    expect(result.error.code).toBe(
      "already-exists",
    );
    expect(result.error.details).toMatchObject({
      propertyId: capacity.propertyId,
      firstIndex: 0,
      duplicateIndex: 1,
    });
  });

  it("rejects duplicate identity even when the contribution is zero", () => {
    const zero = contribution(1, 0, 0);
    const duplicate = input("active", zero);

    const result =
      aggregateUnionBackingPoolCapacity([
        duplicate,
        duplicate,
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected duplicate zero contribution to fail",
      );
    }

    expect(result.error.code).toBe(
      "already-exists",
    );
  });

  it("accepts a total exactly at Number.MAX_SAFE_INTEGER", () => {
    const almostMaximum = contribution(
      1,
      Number.MAX_SAFE_INTEGER - 10,
      0,
      10_000,
    );
    const finalTen = contribution(
      2,
      10,
      0,
      10_000,
    );

    const pool = requirePool([
      input("active", almostMaximum),
      input("active", finalTen),
    ]);

    expect(pool.totalCapacityCents).toBe(
      Number.MAX_SAFE_INTEGER,
    );
  });

  it("rejects a total that would exceed Number.MAX_SAFE_INTEGER", () => {
    const maximum = contribution(
      1,
      Number.MAX_SAFE_INTEGER,
      0,
      10_000,
    );
    const oneMore = contribution(
      2,
      1,
      0,
      10_000,
    );

    const result =
      aggregateUnionBackingPoolCapacity([
        input("active", maximum),
        input("active", oneMore),
      ]);

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error(
        "Expected unsafe pool total to fail",
      );
    }

    expect(result.error.code).toBe(
      "invalid-input",
    );
    expect(result.error.details).toMatchObject({
      path:
        "inputs[1].contribution.contributionCents",
      runningTotalCents:
        Number.MAX_SAFE_INTEGER,
      nextContributionCents: 1,
      maximumSafeInteger:
        Number.MAX_SAFE_INTEGER,
    });
  });

  it("produces the same total and canonical entry order regardless of input order", () => {
    const propertyA = contribution(
      1,
      100,
      0,
      10_000,
    );
    const propertyB = contribution(
      2,
      200,
      0,
      10_000,
    );

    const forward = requirePool([
      input("active", propertyA),
      input("active", propertyB),
    ]);
    const reverse = requirePool([
      input("active", propertyB),
      input("active", propertyA),
    ]);

    expect(reverse.totalCapacityCents).toBe(
      forward.totalCapacityCents,
    );
    expect(
      reverse.propertyCapacities.map(
        (entry) => entry.propertyId,
      ),
    ).toEqual(
      forward.propertyCapacities.map(
        (entry) => entry.propertyId,
      ),
    );
  });

  it("returns a deeply frozen aggregation result", () => {
    const pool = requirePool([
      input(
        "active",
        contribution(1, 100, 0, 10_000),
      ),
    ]);

    expect(Object.isFrozen(pool)).toBe(true);
    expect(
      Object.isFrozen(pool.propertyCapacities),
    ).toBe(true);
    expect(
      Object.isFrozen(
        pool.propertyCapacities[0],
      ),
    ).toBe(true);
  });

  it("does not mutate the input array or WO-017 contribution", () => {
    const capacity = contribution(
      1,
      100,
      0,
      10_000,
    );
    const entry = input("active", capacity);
    const inputs = Object.freeze([entry]);
    const originalContribution =
      entry.contribution;

    requirePool(inputs);

    expect(inputs).toEqual([entry]);
    expect(entry.contribution).toBe(
      originalContribution,
    );
    expect(
      entry.contribution.contributionCents,
    ).toBe(100);
  });

  it("does not create issued supply, claims, or seniority", () => {
    const pool = requirePool([
      input(
        "active",
        contribution(1, 100, 0, 10_000),
      ),
    ]);

    expect(pool).not.toHaveProperty(
      "issuedSupplyCents",
    );
    expect(pool).not.toHaveProperty("claims");
    expect(pool).not.toHaveProperty(
      "seniorityPositions",
    );
  });
});
