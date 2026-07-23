declare const centsBrand: unique symbol;
declare const seniorityPositionBrand: unique symbol;

export type Cents = number & {
  readonly [centsBrand]: "Cents";
};

export type SeniorityPosition = number & {
  readonly [seniorityPositionBrand]: "SeniorityPosition";
};

function assertNonNegativeSafeInteger(
  value: number,
  concept: string
): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(
      `${concept} must be a safe integer`
    );
  }

  if (value < 0) {
    throw new RangeError(
      `${concept} must not be negative`
    );
  }
}

export function cents(value: number): Cents {
  assertNonNegativeSafeInteger(value, "Cents");

  return value as Cents;
}

export function seniorityPosition(
  value: number
): SeniorityPosition {
  assertNonNegativeSafeInteger(
    value,
    "Seniority position"
  );

  return value as SeniorityPosition;
}

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}