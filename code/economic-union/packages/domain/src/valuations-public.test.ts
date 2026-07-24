import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  createPropertyValuationHistory,
  currentEffectivePropertyValuation,
  recordValuationApproval,
  recordValuationProposal,
} from "./index.js";

describe("public valuation API", () => {
  it("creates and approves a valuation through the domain entrypoint", () => {
    const propertyResult = createProperty({
      id: "prop_00000000000000000000000001",
      address: {
        line1: "100 Synthetic Avenue",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description",
      ownerReference: "synthetic-owner",
      evidenceReferences: [
        "synthetic://property",
      ],
    });

    expect(propertyResult.ok).toBe(true);

    if (!propertyResult.ok) {
      return;
    }

    const proposalResult =
      recordValuationProposal(
        createPropertyValuationHistory(
          propertyResult.value,
        ),
        {
          sequence: 10,
          proposedValueCents: 50_000_000,
          proposedByReference:
            "synthetic-appraiser",
          evidenceReferences: [
            "synthetic://proposal",
          ],
        },
      );

    expect(proposalResult.ok).toBe(true);

    if (!proposalResult.ok) {
      return;
    }

    const approvalResult =
      recordValuationApproval(
        proposalResult.value,
        {
          sequence: 12,
          proposalSequence: 10,
          approvedValueCents: 49_000_000,
          approvedByReference:
            "synthetic-approver",
          evidenceReferences: [
            "synthetic://approval",
          ],
        },
      );

    expect(approvalResult.ok).toBe(true);

    if (!approvalResult.ok) {
      return;
    }

    expect(
      currentEffectivePropertyValuation(
        approvalResult.value,
      )?.approvedValueCents,
    ).toBe(49_000_000);
  });
});