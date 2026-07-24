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
