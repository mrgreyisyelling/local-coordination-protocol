import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  createPropertyValuationHistory,
  currentPropertyCapacityContribution,
  deterministicTestId,
  recordValuationApproval,
  recordValuationProposal,
  cents,
} from "./index.js";

describe("Property capacity public API", () => {
  it("calculates canonical Property A through the package entrypoint", () => {
    const created = createProperty({
      id: deterministicTestId("property", 101),
      address: {
        line1: "101 Public API Street",
        locality: "Test City",
        region: "MI",
        postalCode: "48900",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic public API property",
      ownerReference: "synthetic-owner",
      evidenceReferences: [
        "synthetic://property/public",
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
          "synthetic://proposal/public",
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
          "synthetic://approval/public",
        ],
      },
    );

    if (!approved.ok) {
      throw new Error(approved.error.message);
    }

    const result =
      currentPropertyCapacityContribution(
        approved.value,
        cents(10_000_000),
      );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(
      result.value.contributionCents,
    ).toBe(20_000_000);
  });
});
