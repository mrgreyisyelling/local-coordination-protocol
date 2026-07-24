import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  deterministicTestId,
  type PropertyCreationInput,
} from "./index.js";

describe("Property public API", () => {
  it("creates a Property through the domain entrypoint", () => {
    const input = {
      id: deterministicTestId("property", 1),
      address: {
        line1: "100 Test Street",
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
    } as const satisfies PropertyCreationInput;

    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.id).toBe(input.id);
    expect(result.value.status).toBe("proposed");
  });
});