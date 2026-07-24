import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";
import {
  propertyId,
  type PropertyId,
} from "./identifiers.js";
import {
  propertyStatus,
  type PropertyStatus,
} from "./domain-statuses.js";

export interface PropertyAddressInput {
  readonly line1: string;
  readonly line2?: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly countryCode: string;
}

export interface PropertyCreationInput {
  readonly id: string;
  readonly address: PropertyAddressInput;
  readonly legalDescription: string;
  readonly ownerReference: string;
  readonly evidenceReferences: readonly string[];
}

export interface PropertyAddress {
  readonly line1: string;
  readonly line2?: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly countryCode: string;
}

export interface Property {
  readonly id: PropertyId;
  readonly status: PropertyStatus;
  readonly address: Readonly<PropertyAddress>;
  readonly legalDescription: string;
  readonly ownerReference: string;
  readonly evidenceReferences: readonly string[];
}

type InputRecord = Readonly<Record<string, unknown>>;
type InvalidPropertyResult<T = never> = DomainResult<
  T,
  DomainError<"invalid-input">
>;

function isInputRecord(value: unknown): value is InputRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function invalidPropertyInput<T = never>(
  path: string,
  expected: string,
): InvalidPropertyResult<T> {
  return domainFailure(
    domainError(
      "invalid-input",
      `Invalid Property creation input at ${path}.`,
      {
        path,
        expected,
      },
    ),
  );
}

function readRequiredString(
  record: InputRecord,
  key: string,
  path: string,
): InvalidPropertyResult<string> {
  const value = record[key];

  if (typeof value !== "string") {
    return invalidPropertyInput(path, "a nonempty string");
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    return invalidPropertyInput(path, "a nonempty string");
  }

  return domainSuccess(normalized);
}

function parseAddress(
  value: unknown,
): InvalidPropertyResult<Readonly<PropertyAddress>> {
  if (!isInputRecord(value)) {
    return invalidPropertyInput(
      "$.address",
      "an address object",
    );
  }

  const line1 = readRequiredString(
    value,
    "line1",
    "$.address.line1",
  );
  if (!line1.ok) {
    return line1;
  }

  const locality = readRequiredString(
    value,
    "locality",
    "$.address.locality",
  );
  if (!locality.ok) {
    return locality;
  }

  const region = readRequiredString(
    value,
    "region",
    "$.address.region",
  );
  if (!region.ok) {
    return region;
  }

  const postalCode = readRequiredString(
    value,
    "postalCode",
    "$.address.postalCode",
  );
  if (!postalCode.ok) {
    return postalCode;
  }

  const countryCode = readRequiredString(
    value,
    "countryCode",
    "$.address.countryCode",
  );
  if (!countryCode.ok) {
    return countryCode;
  }

  const rawLine2 = value.line2;
  let line2: string | undefined;

  if (rawLine2 !== undefined) {
    if (typeof rawLine2 !== "string") {
      return invalidPropertyInput(
        "$.address.line2",
        "a nonempty string when supplied",
      );
    }

    line2 = rawLine2.trim();

    if (line2.length === 0) {
      return invalidPropertyInput(
        "$.address.line2",
        "a nonempty string when supplied",
      );
    }
  }

  if (line2 === undefined) {
    return domainSuccess(
      Object.freeze({
        line1: line1.value,
        locality: locality.value,
        region: region.value,
        postalCode: postalCode.value,
        countryCode: countryCode.value,
      }),
    );
  }

  return domainSuccess(
    Object.freeze({
      line1: line1.value,
      line2,
      locality: locality.value,
      region: region.value,
      postalCode: postalCode.value,
      countryCode: countryCode.value,
    }),
  );
}

function parseEvidenceReferences(
  value: unknown,
): InvalidPropertyResult<readonly string[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return invalidPropertyInput(
      "$.evidenceReferences",
      "a nonempty array of nonempty strings",
    );
  }

  const references: string[] = [];

  for (const [index, reference] of value.entries()) {
    const path = `$.evidenceReferences[${index}]`;

    if (typeof reference !== "string") {
      return invalidPropertyInput(path, "a nonempty string");
    }

    const normalized = reference.trim();

    if (normalized.length === 0) {
      return invalidPropertyInput(path, "a nonempty string");
    }

    references.push(normalized);
  }

  return domainSuccess(Object.freeze(references));
}

export function createProperty(
  input: unknown,
): DomainResult<Property, DomainError<"invalid-input">> {
  if (!isInputRecord(input)) {
    return invalidPropertyInput("$", "a Property creation object");
  }

  const rawId = readRequiredString(input, "id", "$.id");
  if (!rawId.ok) {
    return rawId;
  }

  let id: PropertyId;

  try {
    id = propertyId(rawId.value);
  } catch {
    return invalidPropertyInput(
      "$.id",
      "a canonical PropertyId",
    );
  }

  const address = parseAddress(input.address);
  if (!address.ok) {
    return address;
  }

  const legalDescription = readRequiredString(
    input,
    "legalDescription",
    "$.legalDescription",
  );
  if (!legalDescription.ok) {
    return legalDescription;
  }

  const ownerReference = readRequiredString(
    input,
    "ownerReference",
    "$.ownerReference",
  );
  if (!ownerReference.ok) {
    return ownerReference;
  }

  const evidenceReferences = parseEvidenceReferences(
    input.evidenceReferences,
  );
  if (!evidenceReferences.ok) {
    return evidenceReferences;
  }

  const property: Property = Object.freeze({
    id,
    status: propertyStatus("proposed"),
    address: address.value,
    legalDescription: legalDescription.value,
    ownerReference: ownerReference.value,
    evidenceReferences: evidenceReferences.value,
  });

  return domainSuccess(property);
}