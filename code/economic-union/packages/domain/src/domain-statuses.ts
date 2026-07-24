import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";


declare const propertyStatusBrand: unique symbol;
declare const poolStatusBrand: unique symbol;
declare const memberStatusBrand: unique symbol;
declare const commandStatusBrand: unique symbol;
declare const batchStatusBrand: unique symbol;
declare const liquidationStatusBrand: unique symbol;

export const PROPERTY_STATUS_VALUES = [
  "proposed",
  "active",
  "suspended",
  "rejected",
  "liquidating",
  "closed",
] as const;

export const POOL_STATUS_VALUES = [
  "open",
  "frozen",
  "liquidating",
  "closed",
] as const;

export const MEMBER_STATUS_VALUES = [
  "pending",
  "active",
  "suspended",
  "closed",
] as const;

export const COMMAND_STATUS_VALUES = [
  "received",
  "accepted",
  "rejected",
] as const;

export const BATCH_STATUS_VALUES = [
  "open",
  "sealed",
  "committed",
] as const;

export const LIQUIDATION_STATUS_VALUES = [
  "planned",
  "active",
  "settled",
  "cancelled",
  "closed",
] as const;

type PropertyStatusValue = (typeof PROPERTY_STATUS_VALUES)[number];
type PoolStatusValue = (typeof POOL_STATUS_VALUES)[number];
type MemberStatusValue = (typeof MEMBER_STATUS_VALUES)[number];
type CommandStatusValue = (typeof COMMAND_STATUS_VALUES)[number];
type BatchStatusValue = (typeof BATCH_STATUS_VALUES)[number];
type LiquidationStatusValue =
  (typeof LIQUIDATION_STATUS_VALUES)[number];

export type PropertyStatus = PropertyStatusValue & {
  readonly [propertyStatusBrand]: "PropertyStatus";
};
export type PoolStatus = PoolStatusValue & {
  readonly [poolStatusBrand]: "PoolStatus";
};
export type MemberStatus = MemberStatusValue & {
  readonly [memberStatusBrand]: "MemberStatus";
};
export type CommandStatus = CommandStatusValue & {
  readonly [commandStatusBrand]: "CommandStatus";
};
export type BatchStatus = BatchStatusValue & {
  readonly [batchStatusBrand]: "BatchStatus";
};
export type LiquidationStatus = LiquidationStatusValue & {
  readonly [liquidationStatusBrand]: "LiquidationStatus";
};

export type LifecycleKind =
  | "property"
  | "pool"
  | "member"
  | "command"
  | "batch"
  | "liquidation";

export interface StatusValueByLifecycle {
  readonly property: PropertyStatusValue;
  readonly pool: PoolStatusValue;
  readonly member: MemberStatusValue;
  readonly command: CommandStatusValue;
  readonly batch: BatchStatusValue;
  readonly liquidation: LiquidationStatusValue;
}

export interface StatusByLifecycle {
  readonly property: PropertyStatus;
  readonly pool: PoolStatus;
  readonly member: MemberStatus;
  readonly command: CommandStatus;
  readonly batch: BatchStatus;
  readonly liquidation: LiquidationStatus;
}

type TransitionTables = {
  readonly [K in LifecycleKind]: {
    readonly [S in StatusValueByLifecycle[K]]:
      readonly StatusValueByLifecycle[K][];
  };
};

const STATUS_VALUES = {
  property: PROPERTY_STATUS_VALUES,
  pool: POOL_STATUS_VALUES,
  member: MEMBER_STATUS_VALUES,
  command: COMMAND_STATUS_VALUES,
  batch: BATCH_STATUS_VALUES,
  liquidation: LIQUIDATION_STATUS_VALUES,
} as const satisfies Record<LifecycleKind, readonly string[]>;

const ALLOWED_TRANSITIONS = {
  property: {
    proposed: ["active", "rejected"],
    active: ["suspended", "liquidating"],
    suspended: ["active", "liquidating"],
    rejected: [],
    liquidating: ["closed"],
    closed: [],
  },
  pool: {
    open: ["frozen", "liquidating"],
    frozen: ["open", "liquidating"],
    liquidating: ["closed"],
    closed: [],
  },
  member: {
    pending: ["active", "closed"],
    active: ["suspended", "closed"],
    suspended: ["active", "closed"],
    closed: [],
  },
  command: {
    received: ["accepted", "rejected"],
    accepted: [],
    rejected: [],
  },
  batch: {
    open: ["sealed"],
    sealed: ["committed"],
    committed: [],
  },
  liquidation: {
    planned: ["active", "cancelled"],
    active: ["settled"],
    settled: ["closed"],
    cancelled: [],
    closed: [],
  },
} as const satisfies TransitionTables;

function statusValue<K extends LifecycleKind>(
  kind: K,
  value: string,
): StatusByLifecycle[K] {
  const values = STATUS_VALUES[kind] as readonly string[];

  if (!values.includes(value)) {
    throw new RangeError(`Unknown ${kind} status: ${value}`);
  }

  return value as StatusByLifecycle[K];
}

export function propertyStatus(value: string): PropertyStatus {
  return statusValue("property", value);
}

export function poolStatus(value: string): PoolStatus {
  return statusValue("pool", value);
}

export function memberStatus(value: string): MemberStatus {
  return statusValue("member", value);
}

export function commandStatus(value: string): CommandStatus {
  return statusValue("command", value);
}

export function batchStatus(value: string): BatchStatus {
  return statusValue("batch", value);
}

export function liquidationStatus(
  value: string,
): LiquidationStatus {
  return statusValue("liquidation", value);
}

export function parseStatus<K extends LifecycleKind>(
  kind: K,
  value: string,
): StatusByLifecycle[K] {
  return statusValue(kind, value);
}

export function allowedNextStatuses<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
): readonly StatusByLifecycle[K][] {
  const table = ALLOWED_TRANSITIONS[kind] as Record<
    string,
    readonly string[]
  >;

  return table[from] as readonly StatusByLifecycle[K][];
}

export function canTransitionStatus<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
  to: StatusByLifecycle[K],
): boolean {
  const allowed = allowedNextStatuses(kind, from) as readonly string[];

  return allowed.includes(to);
}

export function transitionStatus<K extends LifecycleKind>(
  kind: K,
  from: StatusByLifecycle[K],
  to: StatusByLifecycle[K],
): DomainResult<
  StatusByLifecycle[K],
  DomainError<"invalid-status-transition">
> {
  if (!canTransitionStatus(kind, from, to)) {
    return domainFailure(
      domainError(
        "invalid-status-transition",
        `Cannot transition ${kind} status from ${from} to ${to}`,
        {
          lifecycle: kind,
          from,
          to,
        },
      ),
    );
  }

  return domainSuccess(to);
}
