import {
  allowedNextStatuses,
  batchStatus,
  canTransitionStatus,
  commandStatus,
  liquidationStatus,
  memberStatus,
  poolStatus,
  propertyStatus,
  transitionStatus,
  type BatchStatus,
  type CommandStatus,
  type LiquidationStatus,
  type MemberStatus,
  type PoolStatus,
  type PropertyStatus,
} from "./domain-statuses.js";

const propertyActive: PropertyStatus = propertyStatus("active");
const propertyClosed: PropertyStatus = propertyStatus("closed");
const poolOpen: PoolStatus = poolStatus("open");
const poolFrozen: PoolStatus = poolStatus("frozen");
const memberActive: MemberStatus = memberStatus("active");
const commandReceived: CommandStatus = commandStatus("received");
const batchOpen: BatchStatus = batchStatus("open");
const liquidationPlanned: LiquidationStatus =
  liquidationStatus("planned");

canTransitionStatus(
  "property",
  propertyActive,
  propertyStatus("suspended"),
);
const poolTransition =
  transitionStatus("pool", poolOpen, poolFrozen);

if (poolTransition.ok) {
  const nextPoolStatus: PoolStatus = poolTransition.value;
  void nextPoolStatus;
}
allowedNextStatuses("member", memberActive);

// @ts-expect-error Plain strings are not validated PropertyStatus values.
const plainPropertyStatus: PropertyStatus = "active";

// @ts-expect-error PoolStatus is not assignable to PropertyStatus.
const propertyFromPool: PropertyStatus = poolOpen;

// @ts-expect-error PropertyStatus is not assignable to MemberStatus.
const memberFromProperty: MemberStatus = propertyActive;

// @ts-expect-error MemberStatus is not assignable to CommandStatus.
const commandFromMember: CommandStatus = memberActive;

// @ts-expect-error CommandStatus is not assignable to BatchStatus.
const batchFromCommand: BatchStatus = commandReceived;

// @ts-expect-error BatchStatus is not assignable to LiquidationStatus.
const liquidationFromBatch: LiquidationStatus = batchOpen;

// @ts-expect-error Property transitions require PropertyStatus arguments.
canTransitionStatus("property", poolOpen, poolFrozen);

// @ts-expect-error The target must belong to the selected lifecycle.
transitionStatus("member", memberActive, propertyClosed);

// @ts-expect-error Status lookup requires the selected lifecycle type.
allowedNextStatuses("liquidation", commandReceived);

void plainPropertyStatus;
void propertyFromPool;
void memberFromProperty;
void commandFromMember;
void batchFromCommand;
void liquidationFromBatch;
void liquidationPlanned;