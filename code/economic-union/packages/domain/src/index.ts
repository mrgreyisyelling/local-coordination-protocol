import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
export * from "./properties.js";
export * from "./valuations.js";
export * from "./property-capacity.js";
