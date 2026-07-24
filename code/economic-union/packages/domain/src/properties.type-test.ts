import {
  deterministicTestId,
  propertyId,
} from "./identifiers.js";
import {
  createProperty,
  type Property,
  type PropertyCreationInput,
} from "./properties.js";

const creationInput = {
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

const result = createProperty(creationInput);

if (result.ok) {
  const property: Property = result.value;

  propertyId(property.id);

  // @ts-expect-error Property identity is readonly.
  property.id = deterministicTestId("property", 2);

  // @ts-expect-error Property lifecycle status is readonly.
  property.status = "active";

  // @ts-expect-error Nested address fields are readonly.
  property.address.line1 = "Changed address";

  // @ts-expect-error Evidence references are readonly.
  property.evidenceReferences.push(
    "synthetic://property-a/other-record",
  );

  // @ts-expect-error Property is not a valuation record.
  property.approvedValueCents;

  // @ts-expect-error Property is not a debt record.
  property.seniorDebtCents;

  // @ts-expect-error Property creation contributes no capacity.
  property.capacityContributionCents;

  // @ts-expect-error Property is not an ownership balance record.
  property.unionOwnershipCents;

  void property;
}

// @ts-expect-error Creation input requires a durable identity.
const missingIdentity: PropertyCreationInput = {
  address: creationInput.address,
  legalDescription: creationInput.legalDescription,
  ownerReference: creationInput.ownerReference,
  evidenceReferences: creationInput.evidenceReferences,
};

void missingIdentity;