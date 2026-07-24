import {
  describe,
  expect,
  it,
} from "vitest";

import {
  deterministicTestId,
} from "./identifiers.js";
import {
  createProperty,
  type PropertyCreationInput,
} from "./properties.js";

function validPropertyInput(): PropertyCreationInput {
  return {
    id: deterministicTestId("property", 1),
    address: {
      line1: "100 Test Street",
      line2: "Unit A",
      locality: "Lansing",
      region: "MI",
      postalCode: "48912",
      countryCode: "US",
    },
    legalDescription:
      "Synthetic legal description for Property A",
    ownerReference: "synthetic-owner-a",
    evidenceReferences: [
      "synthetic://property-a/source-record",
    ],
  };
}

function expectInvalidPath(
  input: unknown,
  expectedPath: string,
): void {
  const result = createProperty(input);

  expect(result.ok).toBe(false);

  if (result.ok) {
    throw new Error("Expected Property creation to fail");
  }

  expect(result.error.code).toBe("invalid-input");
  expect(result.error.details?.path).toBe(expectedPath);
}

describe("createProperty", () => {
  it("creates an immutable provisional Property", () => {
    const result = createProperty(validPropertyInput());

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value).toEqual({
      id: deterministicTestId("property", 1),
      status: "proposed",
      address: {
        line1: "100 Test Street",
        line2: "Unit A",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description for Property A",
      ownerReference: "synthetic-owner-a",
      evidenceReferences: [
        "synthetic://property-a/source-record",
      ],
    });

    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.address)).toBe(true);
    expect(
      Object.isFrozen(result.value.evidenceReferences),
    ).toBe(true);
  });

  it("always begins in proposed status", () => {
    const input = {
      ...validPropertyInput(),
      status: "active",
    };
    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.status).toBe("proposed");
  });

  it("trims supported string fields", () => {
    const input = validPropertyInput();
    const result = createProperty({
      ...input,
      id: `  ${input.id}  `,
      address: {
        line1: "  100 Test Street  ",
        line2: "  Unit A  ",
        locality: "  Lansing  ",
        region: "  MI  ",
        postalCode: "  48912  ",
        countryCode: "  US  ",
      },
      legalDescription:
        "  Synthetic legal description for Property A  ",
      ownerReference: "  synthetic-owner-a  ",
      evidenceReferences: [
        "  synthetic://property-a/source-record  ",
      ],
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.address.line1).toBe(
      "100 Test Street",
    );
    expect(result.value.address.line2).toBe("Unit A");
    expect(result.value.legalDescription).toBe(
      "Synthetic legal description for Property A",
    );
    expect(result.value.ownerReference).toBe(
      "synthetic-owner-a",
    );
    expect(result.value.evidenceReferences).toEqual([
      "synthetic://property-a/source-record",
    ]);
  });

  it("does not retain the caller's mutable evidence array", () => {
    const evidenceReferences = [
      "synthetic://property-a/source-record",
    ];
    const result = createProperty({
      ...validPropertyInput(),
      evidenceReferences,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    evidenceReferences.push(
      "synthetic://property-a/later-mutation",
    );

    expect(result.value.evidenceReferences).toEqual([
      "synthetic://property-a/source-record",
    ]);
  });

  it("creates an address without optional line2", () => {
    const input = validPropertyInput();
    const result = createProperty({
      ...input,
      address: {
        line1: input.address.line1,
        locality: input.address.locality,
        region: input.address.region,
        postalCode: input.address.postalCode,
        countryCode: input.address.countryCode,
      },
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect("line2" in result.value.address).toBe(false);
  });

  it("rejects a non-object creation input", () => {
    expectInvalidPath(null, "$");
    expectInvalidPath([], "$");
    expectInvalidPath("property", "$");
  });

  it("rejects a missing Property identity", () => {
    const { id: _id, ...withoutId } = validPropertyInput();
    void _id;

    expectInvalidPath(withoutId, "$.id");
  });

  it("rejects a malformed Property identity", () => {
    expectInvalidPath(
      {
        ...validPropertyInput(),
        id: "property-a",
      },
      "$.id",
    );
  });

  it("rejects a missing address object", () => {
    const { address: _address, ...withoutAddress } =
      validPropertyInput();
    void _address;

    expectInvalidPath(withoutAddress, "$.address");
  });

  it.each([
    ["line1"],
    ["locality"],
    ["region"],
    ["postalCode"],
    ["countryCode"],
  ] as const)(
    "rejects an empty required address field: %s",
    (field) => {
      const input = validPropertyInput();

      expectInvalidPath(
        {
          ...input,
          address: {
            ...input.address,
            [field]: "   ",
          },
        },
        `$.address.${field}`,
      );
    },
  );

  it("rejects an empty optional line2 when supplied", () => {
    const input = validPropertyInput();

    expectInvalidPath(
      {
        ...input,
        address: {
          ...input.address,
          line2: "   ",
        },
      },
      "$.address.line2",
    );
  });

  it("rejects a missing legal description", () => {
    const {
      legalDescription: _legalDescription,
      ...withoutLegalDescription
    } = validPropertyInput();
    void _legalDescription;

    expectInvalidPath(
      withoutLegalDescription,
      "$.legalDescription",
    );
  });

  it("rejects a missing owner reference", () => {
    const {
      ownerReference: _ownerReference,
      ...withoutOwnerReference
    } = validPropertyInput();
    void _ownerReference;

    expectInvalidPath(
      withoutOwnerReference,
      "$.ownerReference",
    );
  });

  it("rejects a missing or empty evidence-reference list", () => {
    const {
      evidenceReferences: _evidenceReferences,
      ...withoutEvidenceReferences
    } = validPropertyInput();
    void _evidenceReferences;

    expectInvalidPath(
      withoutEvidenceReferences,
      "$.evidenceReferences",
    );
    expectInvalidPath(
      {
        ...validPropertyInput(),
        evidenceReferences: [],
      },
      "$.evidenceReferences",
    );
  });

  it("rejects an invalid evidence-reference entry", () => {
    expectInvalidPath(
      {
        ...validPropertyInput(),
        evidenceReferences: [
          "synthetic://property-a/source-record",
          "   ",
        ],
      },
      "$.evidenceReferences[1]",
    );
  });

  it("contains no valuation, debt, capacity, or ownership state", () => {
    const result = createProperty(validPropertyInput());

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value).not.toHaveProperty(
      "approvedValueCents",
    );
    expect(result.value).not.toHaveProperty(
      "estimatedValueCents",
    );
    expect(result.value).not.toHaveProperty(
      "seniorDebtCents",
    );
    expect(result.value).not.toHaveProperty(
      "capacityContributionCents",
    );
    expect(result.value).not.toHaveProperty(
      "poolCapacityCents",
    );
    expect(result.value).not.toHaveProperty(
      "unionOwnershipCents",
    );
    expect(result.value).not.toHaveProperty(
      "homeownerOwnershipCents",
    );
  });
});