declare const memberIdBrand: unique symbol;
declare const accountIdBrand: unique symbol;
declare const propertyIdBrand: unique symbol;
declare const depositIdBrand: unique symbol;
declare const commandIdBrand: unique symbol;
declare const eventIdBrand: unique symbol;
declare const batchIdBrand: unique symbol;
declare const liquidationIdBrand: unique symbol;

export type MemberId = string & {
  readonly [memberIdBrand]: "MemberId";
};
export type AccountId = string & {
  readonly [accountIdBrand]: "AccountId";
};
export type PropertyId = string & {
  readonly [propertyIdBrand]: "PropertyId";
};
export type DepositId = string & {
  readonly [depositIdBrand]: "DepositId";
};
export type CommandId = string & {
  readonly [commandIdBrand]: "CommandId";
};
export type EventId = string & {
  readonly [eventIdBrand]: "EventId";
};
export type BatchId = string & {
  readonly [batchIdBrand]: "BatchId";
};
export type LiquidationId = string & {
  readonly [liquidationIdBrand]: "LiquidationId";
};

export type IdentifierKind =
  | "member"
  | "account"
  | "property"
  | "deposit"
  | "command"
  | "event"
  | "batch"
  | "liquidation";

export interface IdentifierByKind {
  readonly member: MemberId;
  readonly account: AccountId;
  readonly property: PropertyId;
  readonly deposit: DepositId;
  readonly command: CommandId;
  readonly event: EventId;
  readonly batch: BatchId;
  readonly liquidation: LiquidationId;
}

export interface IdentifierGenerator {
  next<K extends IdentifierKind>(kind: K): IdentifierByKind[K];
}

const IDENTIFIER_PREFIXES = {
  member: "mem",
  account: "acct",
  property: "prop",
  deposit: "dep",
  command: "cmd",
  event: "evt",
  batch: "batch",
  liquidation: "liq",
} as const satisfies Record<IdentifierKind, string>;

const CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const PAYLOAD_LENGTH = 26;
const PAYLOAD_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

function identifierValue<K extends IdentifierKind>(
  kind: K,
  value: string,
): IdentifierByKind[K] {
  const prefix = IDENTIFIER_PREFIXES[kind];
  const separatorIndex = value.indexOf("_");

  if (separatorIndex === -1) {
    throw new RangeError(`${kind} identifier must contain one separator`);
  }

  const actualPrefix = value.slice(0, separatorIndex);
  const payload = value.slice(separatorIndex + 1);

  if (actualPrefix !== prefix) {
    throw new RangeError(
      `${kind} identifier must use the ${prefix} prefix`,
    );
  }

  if (!PAYLOAD_PATTERN.test(payload)) {
    throw new RangeError(
      `${kind} identifier must contain a ${PAYLOAD_LENGTH}-character Crockford Base32 payload`,
    );
  }

  return value as IdentifierByKind[K];
}

export function memberId(value: string): MemberId {
  return identifierValue("member", value);
}

export function accountId(value: string): AccountId {
  return identifierValue("account", value);
}

export function propertyId(value: string): PropertyId {
  return identifierValue("property", value);
}

export function depositId(value: string): DepositId {
  return identifierValue("deposit", value);
}

export function commandId(value: string): CommandId {
  return identifierValue("command", value);
}

export function eventId(value: string): EventId {
  return identifierValue("event", value);
}

export function batchId(value: string): BatchId {
  return identifierValue("batch", value);
}

export function liquidationId(value: string): LiquidationId {
  return identifierValue("liquidation", value);
}

export function parseIdentifier<K extends IdentifierKind>(
  kind: K,
  value: string,
): IdentifierByKind[K] {
  return identifierValue(kind, value);
}

function encodeTestSequence(sequence: number): string {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new RangeError(
      "Test identifier sequence must be a positive safe integer",
    );
  }

  let remainder = sequence;
  let encoded = "";

  while (remainder > 0) {
    const digit = remainder % 32;
    encoded = CROCKFORD_BASE32[digit] + encoded;
    remainder = Math.floor(remainder / 32);
  }

  return encoded.padStart(PAYLOAD_LENGTH, "0");
}

export function deterministicTestId<K extends IdentifierKind>(
  kind: K,
  sequence: number,
): IdentifierByKind[K] {
  const value =
    `${IDENTIFIER_PREFIXES[kind]}_${encodeTestSequence(sequence)}`;

  return identifierValue(kind, value);
}

export function createDeterministicTestIdentifierGenerator(
  startingSequence = 1,
): IdentifierGenerator {
  if (!Number.isSafeInteger(startingSequence) || startingSequence < 1) {
    throw new RangeError(
      "Starting test identifier sequence must be a positive safe integer",
    );
  }

  let nextSequence = startingSequence;

  return {
    next<K extends IdentifierKind>(
      kind: K,
    ): IdentifierByKind[K] {
      const identifier = deterministicTestId(kind, nextSequence);

      if (nextSequence === Number.MAX_SAFE_INTEGER) {
        throw new RangeError("Test identifier sequence is exhausted");
      }

      nextSequence += 1;

      return identifier;
    },
  };
}