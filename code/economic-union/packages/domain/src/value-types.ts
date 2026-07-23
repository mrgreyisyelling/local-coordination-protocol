declare const centsBrand: unique symbol;
declare const basisPointsBrand: unique symbol;
declare const seniorityPositionBrand: unique symbol;
declare const eventSequenceBrand: unique symbol;
declare const nonceBrand: unique symbol;

export type Cents = number & { readonly [centsBrand]: "Cents" };
export type BasisPoints = number & {
  readonly [basisPointsBrand]: "BasisPoints";
};
export type SeniorityPosition = number & {
  readonly [seniorityPositionBrand]: "SeniorityPosition";
};
export type EventSequence = number & {
  readonly [eventSequenceBrand]: "EventSequence";
};
export type Nonce = number & { readonly [nonceBrand]: "Nonce" };

export type Comparison = -1 | 0 | 1;

function requireSafeInteger(
  value: number,
  name: string,
): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${name} must be a safe integer`);
  }
}

function compareIntegers(left: number, right: number): Comparison {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

export function cents(value: number): Cents {
  requireSafeInteger(value, "Cents");

  if (value < 0) {
    throw new RangeError("Cents must be nonnegative");
  }

  return value as Cents;
}

export function addCents(left: Cents, right: Cents): Cents {
  return cents(left + right);
}

export function subtractCents(left: Cents, right: Cents): Cents {
  return cents(left - right);
}

export function compareCents(
  left: Cents,
  right: Cents,
): Comparison {
  return compareIntegers(left, right);
}

export function basisPoints(value: number): BasisPoints {
  requireSafeInteger(value, "BasisPoints");

  if (value < 0 || value > 10_000) {
    throw new RangeError(
      "BasisPoints must be between 0 and 10,000",
    );
  }

  return value as BasisPoints;
}

export function compareBasisPoints(
  left: BasisPoints,
  right: BasisPoints,
): Comparison {
  return compareIntegers(left, right);
}

export function seniorityPosition(
  value: number,
): SeniorityPosition {
  requireSafeInteger(value, "SeniorityPosition");

  if (value < 1) {
    throw new RangeError(
      "SeniorityPosition must be at least 1",
    );
  }

  return value as SeniorityPosition;
}

export function compareSeniorityPositions(
  left: SeniorityPosition,
  right: SeniorityPosition,
): Comparison {
  return compareIntegers(left, right);
}

export function eventSequence(value: number): EventSequence {
  requireSafeInteger(value, "EventSequence");

  if (value < 0) {
    throw new RangeError("EventSequence must be nonnegative");
  }

  return value as EventSequence;
}

export function nextEventSequence(
  current: EventSequence,
): EventSequence {
  return eventSequence(current + 1);
}

export function compareEventSequences(
  left: EventSequence,
  right: EventSequence,
): Comparison {
  return compareIntegers(left, right);
}

export function nonce(value: number): Nonce {
  requireSafeInteger(value, "Nonce");

  if (value < 0) {
    throw new RangeError("Nonce must be nonnegative");
  }

  return value as Nonce;
}

export function nextNonce(current: Nonce): Nonce {
  return nonce(current + 1);
}

export function compareNonces(
  left: Nonce,
  right: Nonce,
): Comparison {
  return compareIntegers(left, right);
}