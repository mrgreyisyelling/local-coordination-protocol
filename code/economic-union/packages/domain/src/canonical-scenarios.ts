import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";

export const CANONICAL_SCENARIO_SCHEMA_VERSION = 1 as const;

export const CANONICAL_ACTION_TYPE_VALUES = [
  "property-recorded",
  "deposit-recorded",
  "transfer-recorded",
  "liquidation-proceeds-recorded",
] as const;

export type CanonicalActionType =
  (typeof CANONICAL_ACTION_TYPE_VALUES)[number];

export interface CanonicalPropertyInputV1 {
  readonly propertyId: string;
  readonly approvedValueCents: number;
  readonly seniorDebtCents: number;
  readonly expectedCapacityContributionCents: number;
}

export interface CanonicalMemberInputV1 {
  readonly memberId: string;
  readonly displayName: string;
}

export interface CanonicalPropertyActionV1 {
  readonly sequence: number;
  readonly type: "property-recorded";
  readonly propertyId: string;
}

export interface CanonicalDepositActionV1 {
  readonly sequence: number;
  readonly type: "deposit-recorded";
  readonly memberId: string;
  readonly amountCents: number;
  readonly expectedSeniorityStart: number;
  readonly expectedSeniorityEnd: number;
}

export interface CanonicalTransferActionV1 {
  readonly sequence: number;
  readonly type: "transfer-recorded";
  readonly senderMemberId: string;
  readonly recipientMemberId: string;
  readonly amountCents: number;
  readonly expectedSeniorityStart: number;
  readonly expectedSeniorityEnd: number;
}

export interface CanonicalLiquidationProceedsActionV1 {
  readonly sequence: number;
  readonly type: "liquidation-proceeds-recorded";
  readonly amountCents: number;
}

export type CanonicalActionV1 =
  | CanonicalPropertyActionV1
  | CanonicalDepositActionV1
  | CanonicalTransferActionV1
  | CanonicalLiquidationProceedsActionV1;

export interface CanonicalBalanceV1 {
  readonly memberId: string;
  readonly amountCents: number;
}

export interface CanonicalIntervalV1 {
  readonly memberId: string;
  readonly start: number;
  readonly end: number;
  readonly status: "live" | "paid" | "terminated";
}

export interface CanonicalDistributionV1 {
  readonly destinationId: string;
  readonly destinationType: "member" | "homeowner-surplus-pool";
  readonly amountCents: number;
}

export interface CanonicalInvariantCheckV1 {
  readonly invariantId: string;
  readonly assertion: string;
  readonly expected: true;
}

export interface CanonicalScenarioV1 {
  readonly schemaVersion: 1;
  readonly scenarioId: string;
  readonly title: string;
  readonly description: string;
  readonly inputs: {
    readonly properties: readonly CanonicalPropertyInputV1[];
    readonly members: readonly CanonicalMemberInputV1[];
  };
  readonly actions: readonly CanonicalActionV1[];
  readonly expected: {
    readonly pooledCapacityCents: number;
    readonly issuedSupplyCents: number;
    readonly liveSupplyBeforeLiquidationCents: number;
    readonly preLiquidationBalances: readonly CanonicalBalanceV1[];
    readonly preLiquidationIntervals: readonly CanonicalIntervalV1[];
    readonly liquidation: {
      readonly proceedsCents: number;
      readonly tokenDistributions: readonly CanonicalDistributionV1[];
      readonly paidIntervals: readonly CanonicalIntervalV1[];
      readonly terminatedIntervals: readonly CanonicalIntervalV1[];
      readonly terminatedClaimsCents: number;
      readonly homeownerSurplus: readonly CanonicalDistributionV1[];
    };
  };
  readonly invariantChecks: readonly CanonicalInvariantCheckV1[];
}

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonemptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isCents = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isSequence = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1;

const isSeniority = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1;

const invalid = (
  path: string,
  expected: string,
): DomainResult<never, DomainError<"invalid-input">> =>
  domainFailure(
    domainError(
      "invalid-input",
      `Invalid canonical scenario value at ${path}.`,
      { path, expected },
    ),
  );

const validateProperty = (
  value: unknown,
  path: string,
): DomainResult<CanonicalPropertyInputV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "property object");
  if (!isNonemptyString(value.propertyId)) {
    return invalid(`${path}.propertyId`, "nonempty string");
  }
  if (!isCents(value.approvedValueCents)) {
    return invalid(`${path}.approvedValueCents`, "nonnegative safe integer cents");
  }
  if (!isCents(value.seniorDebtCents)) {
    return invalid(`${path}.seniorDebtCents`, "nonnegative safe integer cents");
  }
  if (!isCents(value.expectedCapacityContributionCents)) {
    return invalid(
      `${path}.expectedCapacityContributionCents`,
      "nonnegative safe integer cents",
    );
  }
  return domainSuccess(value as unknown as CanonicalPropertyInputV1);
};

const validateMember = (
  value: unknown,
  path: string,
): DomainResult<CanonicalMemberInputV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "member object");
  if (!isNonemptyString(value.memberId)) {
    return invalid(`${path}.memberId`, "nonempty string");
  }
  if (!isNonemptyString(value.displayName)) {
    return invalid(`${path}.displayName`, "nonempty string");
  }
  return domainSuccess(value as unknown as CanonicalMemberInputV1);
};

const validateAction = (
  value: unknown,
  path: string,
  expectedSequence: number,
): DomainResult<CanonicalActionV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "action object");
  if (!isSequence(value.sequence) || value.sequence !== expectedSequence) {
    return invalid(`${path}.sequence`, `consecutive sequence ${expectedSequence}`);
  }
  if (
    !isNonemptyString(value.type) ||
    !CANONICAL_ACTION_TYPE_VALUES.includes(
      value.type as CanonicalActionType,
    )
  ) {
    return invalid(`${path}.type`, "declared canonical action type");
  }

  if (value.type === "property-recorded") {
    if (!isNonemptyString(value.propertyId)) {
      return invalid(`${path}.propertyId`, "nonempty string");
    }
    return domainSuccess(value as unknown as CanonicalPropertyActionV1);
  }

  if (value.type === "deposit-recorded") {
    if (!isNonemptyString(value.memberId)) {
      return invalid(`${path}.memberId`, "nonempty string");
    }
    if (!isCents(value.amountCents) || value.amountCents === 0) {
      return invalid(`${path}.amountCents`, "positive safe integer cents");
    }
    if (!isSeniority(value.expectedSeniorityStart)) {
      return invalid(`${path}.expectedSeniorityStart`, "positive safe integer");
    }
    if (
      !isSeniority(value.expectedSeniorityEnd) ||
      value.expectedSeniorityEnd < value.expectedSeniorityStart
    ) {
      return invalid(
        `${path}.expectedSeniorityEnd`,
        "seniority at or after expectedSeniorityStart",
      );
    }
    return domainSuccess(value as unknown as CanonicalDepositActionV1);
  }

  if (value.type === "transfer-recorded") {
    if (!isNonemptyString(value.senderMemberId)) {
      return invalid(`${path}.senderMemberId`, "nonempty string");
    }
    if (!isNonemptyString(value.recipientMemberId)) {
      return invalid(`${path}.recipientMemberId`, "nonempty string");
    }
    if (!isCents(value.amountCents) || value.amountCents === 0) {
      return invalid(`${path}.amountCents`, "positive safe integer cents");
    }
    if (!isSeniority(value.expectedSeniorityStart)) {
      return invalid(`${path}.expectedSeniorityStart`, "positive safe integer");
    }
    if (
      !isSeniority(value.expectedSeniorityEnd) ||
      value.expectedSeniorityEnd < value.expectedSeniorityStart
    ) {
      return invalid(
        `${path}.expectedSeniorityEnd`,
        "seniority at or after expectedSeniorityStart",
      );
    }
    return domainSuccess(value as unknown as CanonicalTransferActionV1);
  }

  if (!isCents(value.amountCents)) {
    return invalid(`${path}.amountCents`, "nonnegative safe integer cents");
  }
  return domainSuccess(
    value as unknown as CanonicalLiquidationProceedsActionV1,
  );
};

const validateBalance = (
  value: unknown,
  path: string,
): DomainResult<CanonicalBalanceV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "balance object");
  if (!isNonemptyString(value.memberId)) {
    return invalid(`${path}.memberId`, "nonempty string");
  }
  if (!isCents(value.amountCents)) {
    return invalid(`${path}.amountCents`, "nonnegative safe integer cents");
  }
  return domainSuccess(value as unknown as CanonicalBalanceV1);
};

const validateInterval = (
  value: unknown,
  path: string,
): DomainResult<CanonicalIntervalV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "interval object");
  if (!isNonemptyString(value.memberId)) {
    return invalid(`${path}.memberId`, "nonempty string");
  }
  if (!isSeniority(value.start)) {
    return invalid(`${path}.start`, "positive safe integer");
  }
  if (!isSeniority(value.end) || value.end < value.start) {
    return invalid(`${path}.end`, "seniority at or after start");
  }
  if (
    value.status !== "live" &&
    value.status !== "paid" &&
    value.status !== "terminated"
  ) {
    return invalid(`${path}.status`, "live, paid, or terminated");
  }
  return domainSuccess(value as unknown as CanonicalIntervalV1);
};

const validateDistribution = (
  value: unknown,
  path: string,
): DomainResult<CanonicalDistributionV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "distribution object");
  if (!isNonemptyString(value.destinationId)) {
    return invalid(`${path}.destinationId`, "nonempty string");
  }
  if (
    value.destinationType !== "member" &&
    value.destinationType !== "homeowner-surplus-pool"
  ) {
    return invalid(
      `${path}.destinationType`,
      "member or homeowner-surplus-pool",
    );
  }
  if (!isCents(value.amountCents)) {
    return invalid(`${path}.amountCents`, "nonnegative safe integer cents");
  }
  return domainSuccess(value as unknown as CanonicalDistributionV1);
};

const validateInvariantCheck = (
  value: unknown,
  path: string,
): DomainResult<CanonicalInvariantCheckV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid(path, "invariant check object");
  if (
    !isNonemptyString(value.invariantId) ||
    !/^INV-[A-Z]+-[0-9]{3}$/.test(value.invariantId)
  ) {
    return invalid(`${path}.invariantId`, "stable INV-FAMILY-NNN identifier");
  }
  if (!isNonemptyString(value.assertion)) {
    return invalid(`${path}.assertion`, "nonempty string");
  }
  if (value.expected !== true) {
    return invalid(`${path}.expected`, "literal true");
  }
  return domainSuccess(value as unknown as CanonicalInvariantCheckV1);
};

const validateArray = <T>(
  value: unknown,
  path: string,
  validateItem: (
    item: unknown,
    itemPath: string,
    index: number,
  ) => DomainResult<T, DomainError<"invalid-input">>,
): DomainResult<readonly T[], DomainError<"invalid-input">> => {
  if (!Array.isArray(value)) return invalid(path, "array");
  const validated: T[] = [];
  for (const [index, item] of value.entries()) {
    const result = validateItem(item, `${path}[${index}]`, index);
    if (!result.ok) return result;
    validated.push(result.value);
  }
  return domainSuccess(validated);
};

export const validateCanonicalScenario = (
  value: unknown,
): DomainResult<CanonicalScenarioV1, DomainError<"invalid-input">> => {
  if (!isRecord(value)) return invalid("$", "scenario object");
  if (value.schemaVersion !== CANONICAL_SCENARIO_SCHEMA_VERSION) {
    return invalid("$.schemaVersion", "literal 1");
  }
  if (!isNonemptyString(value.scenarioId)) {
    return invalid("$.scenarioId", "nonempty string");
  }
  if (!isNonemptyString(value.title)) {
    return invalid("$.title", "nonempty string");
  }
  if (!isNonemptyString(value.description)) {
    return invalid("$.description", "nonempty string");
  }

  if (!isRecord(value.inputs)) return invalid("$.inputs", "inputs object");
  const properties = validateArray(
    value.inputs.properties,
    "$.inputs.properties",
    validateProperty,
  );
  if (!properties.ok) return properties;
  const members = validateArray(
    value.inputs.members,
    "$.inputs.members",
    validateMember,
  );
  if (!members.ok) return members;

  const actions = validateArray(
    value.actions,
    "$.actions",
    (item, path, index) => validateAction(item, path, index + 1),
  );
  if (!actions.ok) return actions;

  if (!isRecord(value.expected)) {
    return invalid("$.expected", "expected-results object");
  }
  if (!isCents(value.expected.pooledCapacityCents)) {
    return invalid("$.expected.pooledCapacityCents", "nonnegative safe integer cents");
  }
  if (!isCents(value.expected.issuedSupplyCents)) {
    return invalid("$.expected.issuedSupplyCents", "nonnegative safe integer cents");
  }
  if (!isCents(value.expected.liveSupplyBeforeLiquidationCents)) {
    return invalid(
      "$.expected.liveSupplyBeforeLiquidationCents",
      "nonnegative safe integer cents",
    );
  }

  const balances = validateArray(
    value.expected.preLiquidationBalances,
    "$.expected.preLiquidationBalances",
    validateBalance,
  );
  if (!balances.ok) return balances;
  const intervals = validateArray(
    value.expected.preLiquidationIntervals,
    "$.expected.preLiquidationIntervals",
    validateInterval,
  );
  if (!intervals.ok) return intervals;

  if (!isRecord(value.expected.liquidation)) {
    return invalid("$.expected.liquidation", "liquidation object");
  }
  const liquidation = value.expected.liquidation;
  if (!isCents(liquidation.proceedsCents)) {
    return invalid(
      "$.expected.liquidation.proceedsCents",
      "nonnegative safe integer cents",
    );
  }
  const tokenDistributions = validateArray(
    liquidation.tokenDistributions,
    "$.expected.liquidation.tokenDistributions",
    validateDistribution,
  );
  if (!tokenDistributions.ok) return tokenDistributions;
  const paidIntervals = validateArray(
    liquidation.paidIntervals,
    "$.expected.liquidation.paidIntervals",
    validateInterval,
  );
  if (!paidIntervals.ok) return paidIntervals;
  const terminatedIntervals = validateArray(
    liquidation.terminatedIntervals,
    "$.expected.liquidation.terminatedIntervals",
    validateInterval,
  );
  if (!terminatedIntervals.ok) return terminatedIntervals;
  if (!isCents(liquidation.terminatedClaimsCents)) {
    return invalid(
      "$.expected.liquidation.terminatedClaimsCents",
      "nonnegative safe integer cents",
    );
  }
  const homeownerSurplus = validateArray(
    liquidation.homeownerSurplus,
    "$.expected.liquidation.homeownerSurplus",
    validateDistribution,
  );
  if (!homeownerSurplus.ok) return homeownerSurplus;

  const invariantChecks = validateArray(
    value.invariantChecks,
    "$.invariantChecks",
    validateInvariantCheck,
  );
  if (!invariantChecks.ok) return invariantChecks;

  return domainSuccess(value as unknown as CanonicalScenarioV1);
};