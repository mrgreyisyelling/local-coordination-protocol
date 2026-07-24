import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  type Property,
  type PropertyCreationInput,
} from "./properties.js";
import {
  createPropertyValuationHistory,
  currentEffectivePropertyValuation,
  effectivePropertyValuationAt,
  recordValuationApproval,
  recordValuationProposal,
  type PropertyValuationHistory,
  type ValuationApprovalInput,
  type ValuationProposalInput,
} from "./valuations.js";
import { eventSequence } from "./value-types.js";

function property(): Property {
  const input = {
    id: "prop_00000000000000000000000001",
    address: {
      line1: "100 Synthetic Avenue",
      locality: "Lansing",
      region: "MI",
      postalCode: "48912",
      countryCode: "US",
    },
    legalDescription:
      "Synthetic legal description for valuation tests",
    ownerReference: "synthetic-owner-1",
    evidenceReferences: [
      "synthetic://property/source",
    ],
  } as const satisfies PropertyCreationInput;

  const result = createProperty(input);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function proposalInput(
  sequence: number,
  proposedValueCents = 50_000_000,
): ValuationProposalInput {
  return {
    sequence,
    proposedValueCents,
    proposedByReference: "synthetic-appraiser-1",
    evidenceReferences: [
      `synthetic://valuation/proposal/${sequence}`,
    ],
  };
}

function approvalInput(
  sequence: number,
  proposalSequence: number,
  approvedValueCents = 49_000_000,
): ValuationApprovalInput {
  return {
    sequence,
    proposalSequence,
    approvedValueCents,
    approvedByReference: "synthetic-approver-1",
    evidenceReferences: [
      `synthetic://valuation/approval/${sequence}`,
    ],
  };
}

function mustPropose(
  history: PropertyValuationHistory,
  sequence: number,
  value = 50_000_000,
): PropertyValuationHistory {
  const result = recordValuationProposal(
    history,
    proposalInput(sequence, value),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function mustApprove(
  history: PropertyValuationHistory,
  sequence: number,
  proposalSequence: number,
  value = 49_000_000,
): PropertyValuationHistory {
  const result = recordValuationApproval(
    history,
    approvalInput(
      sequence,
      proposalSequence,
      value,
    ),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe("Property valuation history", () => {
  it("creates an empty frozen history for one Property", () => {
    const subject = property();
    const history =
      createPropertyValuationHistory(subject);

    expect(history.propertyId).toBe(subject.id);
    expect(history.entries).toEqual([]);
    expect(Object.isFrozen(history)).toBe(true);
    expect(Object.isFrozen(history.entries)).toBe(true);
  });

  it("appends an immutable valuation proposal", () => {
    const original =
      createPropertyValuationHistory(property());

    const result = recordValuationProposal(
      original,
      proposalInput(10),
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(original.entries).toEqual([]);
    expect(result.value.entries).toHaveLength(1);
    expect(result.value.entries[0]).toEqual({
      kind: "valuation-proposed",
      sequence: 10,
      proposedValueCents: 50_000_000,
      proposedByReference: "synthetic-appraiser-1",
      evidenceReferences: [
        "synthetic://valuation/proposal/10",
      ],
    });
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.entries)).toBe(true);
    expect(Object.isFrozen(result.value.entries[0])).toBe(true);
    expect(
      Object.isFrozen(
        result.value.entries[0]?.evidenceReferences,
      ),
    ).toBe(true);
  });

  it("preserves a first proposal when a second is appended", () => {
    const empty =
      createPropertyValuationHistory(property());
    const first = mustPropose(
      empty,
      10,
      50_000_000,
    );
    const second = mustPropose(
      first,
      20,
      52_500_000,
    );

    expect(empty.entries).toHaveLength(0);
    expect(first.entries).toHaveLength(1);
    expect(second.entries).toHaveLength(2);
    expect(second.entries[0]).toBe(first.entries[0]);
    expect(second.entries[1]).toMatchObject({
      kind: "valuation-proposed",
      sequence: 20,
      proposedValueCents: 52_500_000,
    });
  });

  it("trims proposal references and copies evidence", () => {
    const evidence = [
      "  synthetic://valuation/proposal/10  ",
    ];
    const history =
      createPropertyValuationHistory(property());

    const result = recordValuationProposal(
      history,
      {
        sequence: 10,
        proposedValueCents: 50_000_000,
        proposedByReference:
          "  synthetic-appraiser-1  ",
        evidenceReferences: evidence,
      },
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    evidence.push("synthetic://later-mutation");

    expect(result.value.entries[0]).toMatchObject({
      proposedByReference: "synthetic-appraiser-1",
      evidenceReferences: [
        "synthetic://valuation/proposal/10",
      ],
    });
  });

  it("rejects a non-object proposal", () => {
    const result = recordValuationProposal(
      createPropertyValuationHistory(property()),
      null,
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe("invalid-input");
    expect(result.error.details?.path).toBe("$");
  });

  it.each([
    [-1],
    [1.5],
    [Number.POSITIVE_INFINITY],
    [Number.MAX_SAFE_INTEGER + 1],
  ])(
    "rejects invalid proposal sequence %s",
    (sequence) => {
      const result = recordValuationProposal(
        createPropertyValuationHistory(property()),
        proposalInput(sequence),
      );

      expect(result.ok).toBe(false);

      if (result.ok) {
        return;
      }

      expect(result.error.code).toBe("invalid-input");
      expect(result.error.details?.path).toBe(
        "$.sequence",
      );
    },
  );

  it("rejects a proposal sequence that is not later than history", () => {
    const history = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    for (const sequence of [9, 10]) {
      const result = recordValuationProposal(
        history,
        proposalInput(sequence),
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(
          "$.sequence",
        );
      }
    }
  });

  it.each([
    [-1],
    [1.5],
    [Number.NaN],
    [Number.MAX_SAFE_INTEGER + 1],
  ])(
    "rejects invalid proposed cents %s",
    (proposedValueCents) => {
      const result = recordValuationProposal(
        createPropertyValuationHistory(property()),
        proposalInput(10, proposedValueCents),
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(
          "$.proposedValueCents",
        );
      }
    },
  );

  it("allows a zero-cent proposal", () => {
    const result = recordValuationProposal(
      createPropertyValuationHistory(property()),
      proposalInput(10, 0),
    );

    expect(result.ok).toBe(true);
  });

  it("rejects empty proposal references and evidence", () => {
    const history =
      createPropertyValuationHistory(property());

    const emptyProposer = recordValuationProposal(
      history,
      {
        ...proposalInput(10),
        proposedByReference: "   ",
      },
    );
    const emptyEvidence = recordValuationProposal(
      history,
      {
        ...proposalInput(10),
        evidenceReferences: [],
      },
    );
    const emptyEvidenceEntry =
      recordValuationProposal(
        history,
        {
          ...proposalInput(10),
          evidenceReferences: ["   "],
        },
      );

    for (const [result, path] of [
      [emptyProposer, "$.proposedByReference"],
      [emptyEvidence, "$.evidenceReferences"],
      [
        emptyEvidenceEntry,
        "$.evidenceReferences[0]",
      ],
    ] as const) {
      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(path);
      }
    }
  });

  it("appends an approval without changing the proposal", () => {
    const proposalHistory = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );

    const result = recordValuationApproval(
      proposalHistory,
      approvalInput(
        12,
        10,
        49_000_000,
      ),
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(proposalHistory.entries).toHaveLength(1);
    expect(result.value.entries).toHaveLength(2);
    expect(result.value.entries[0]).toBe(
      proposalHistory.entries[0],
    );
    expect(result.value.entries[1]).toEqual({
      kind: "valuation-approved",
      sequence: 12,
      proposalSequence: 10,
      approvedValueCents: 49_000_000,
      approvedByReference: "synthetic-approver-1",
      evidenceReferences: [
        "synthetic://valuation/approval/12",
      ],
    });
  });

  it("allows the approved value to differ from the proposal", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
      48_500_000,
    );

    const effective =
      currentEffectivePropertyValuation(approved);

    expect(effective).toMatchObject({
      proposedValueCents: 50_000_000,
      approvedValueCents: 48_500_000,
    });
  });

  it("rejects approval of an unknown proposal", () => {
    const result = recordValuationApproval(
      createPropertyValuationHistory(property()),
      approvalInput(12, 10),
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe("not-found");
    expect(
      result.error.details?.proposalSequence,
    ).toBe(10);
  });

  it("rejects a second approval of the same proposal", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
    );

    const result = recordValuationApproval(
      approved,
      approvalInput(14, 10),
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe(
      "already-processed",
    );
    expect(
      result.error.details?.proposalSequence,
    ).toBe(10);
  });

  it("rejects approval sequence that is not later than history", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    for (const sequence of [9, 10]) {
      const result = recordValuationApproval(
        proposed,
        approvalInput(sequence, 10),
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(
          "$.sequence",
        );
      }
    }
  });

  it("rejects malformed approval values and references", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    const badValue = recordValuationApproval(
      proposed,
      {
        ...approvalInput(12, 10),
        approvedValueCents: -1,
      },
    );
    const badApprover = recordValuationApproval(
      proposed,
      {
        ...approvalInput(12, 10),
        approvedByReference: " ",
      },
    );
    const badEvidence = recordValuationApproval(
      proposed,
      {
        ...approvalInput(12, 10),
        evidenceReferences: [""],
      },
    );

    for (const [result, path] of [
      [badValue, "$.approvedValueCents"],
      [badApprover, "$.approvedByReference"],
      [badEvidence, "$.evidenceReferences[0]"],
    ] as const) {
      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.code).toBe(
          "invalid-input",
        );
        expect(result.error.details?.path).toBe(path);
      }
    }
  });

  it("has no effective valuation before approval", () => {
    const history = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );

    expect(
      currentEffectivePropertyValuation(history),
    ).toBeUndefined();
    expect(
      effectivePropertyValuationAt(
        history,
        eventSequence(50),
      ),
    ).toBeUndefined();
  });

  it("keeps the prior approval effective after a newer unapproved proposal", () => {
    const firstProposal = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const firstApproval = mustApprove(
      firstProposal,
      12,
      10,
      49_000_000,
    );
    const laterProposal = mustPropose(
      firstApproval,
      20,
      52_500_000,
    );

    expect(
      currentEffectivePropertyValuation(
        laterProposal,
      ),
    ).toMatchObject({
      proposalSequence: 10,
      approvalSequence: 12,
      approvedValueCents: 49_000_000,
    });
  });

  it("makes the newest approval currently effective", () => {
    const firstProposal = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const firstApproval = mustApprove(
      firstProposal,
      12,
      10,
      49_000_000,
    );
    const secondProposal = mustPropose(
      firstApproval,
      20,
      52_500_000,
    );
    const secondApproval = mustApprove(
      secondProposal,
      24,
      20,
      51_000_000,
    );

    expect(
      currentEffectivePropertyValuation(
        secondApproval,
      ),
    ).toMatchObject({
      proposalSequence: 20,
      approvalSequence: 24,
      proposedValueCents: 52_500_000,
      approvedValueCents: 51_000_000,
    });
  });

  it("reconstructs the valuation effective at an earlier sequence", () => {
    const firstProposal = mustPropose(
      createPropertyValuationHistory(property()),
      10,
      50_000_000,
    );
    const firstApproval = mustApprove(
      firstProposal,
      12,
      10,
      49_000_000,
    );
    const secondProposal = mustPropose(
      firstApproval,
      20,
      52_500_000,
    );
    const secondApproval = mustApprove(
      secondProposal,
      24,
      20,
      51_000_000,
    );

    expect(
      effectivePropertyValuationAt(
        secondApproval,
        eventSequence(11),
      ),
    ).toBeUndefined();

    expect(
      effectivePropertyValuationAt(
        secondApproval,
        eventSequence(18),
      ),
    ).toMatchObject({
      approvalSequence: 12,
      approvedValueCents: 49_000_000,
    });

    expect(
      effectivePropertyValuationAt(
        secondApproval,
        eventSequence(24),
      ),
    ).toMatchObject({
      approvalSequence: 24,
      approvedValueCents: 51_000_000,
    });
  });

  it("returns a frozen effective valuation view", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
    );

    const effective =
      currentEffectivePropertyValuation(approved);

    expect(effective).toBeDefined();
    expect(Object.isFrozen(effective)).toBe(true);
    expect(
      Object.isFrozen(
        effective?.proposalEvidenceReferences,
      ),
    ).toBe(true);
    expect(
      Object.isFrozen(
        effective?.approvalEvidenceReferences,
      ),
    ).toBe(true);
  });

  it("contains no debt, capacity, pool, supply, or balance state", () => {
    const proposed = mustPropose(
      createPropertyValuationHistory(property()),
      10,
    );
    const approved = mustApprove(
      proposed,
      12,
      10,
    );
    const serialized = JSON.stringify(approved);

    for (const forbidden of [
      "seniorDebtCents",
      "capacityContributionCents",
      "poolCapacityCents",
      "capacityBasisPoints",
      "issuedSupplyCents",
      "balanceCents",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
