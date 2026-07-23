declare const centsBrand: unique symbol;
declare const seniorityPositionBrand: unique symbol;

export type Cents = number & {
  readonly [centsBrand]: "Cents";
};

export type SeniorityPosition = number & {
  readonly [seniorityPositionBrand]: "SeniorityPosition";
};

export function cents(value: number): Cents {
  return value as Cents;
}

export function seniorityPosition(value: number): SeniorityPosition {
  return value as SeniorityPosition;
}

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}