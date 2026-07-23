import {
  accountId,
  batchId,
  commandId,
  createDeterministicTestIdentifierGenerator,
  depositId,
  eventId,
  liquidationId,
  memberId,
  propertyId,
  type AccountId,
  type BatchId,
  type CommandId,
  type DepositId,
  type EventId,
  type IdentifierGenerator,
  type LiquidationId,
  type MemberId,
  type PropertyId,
} from "./index.js";

const payload = "00000000000000000000000001";

const member = memberId(`mem_${payload}`);
const account = accountId(`acct_${payload}`);
const property = propertyId(`prop_${payload}`);
const deposit = depositId(`dep_${payload}`);
const command = commandId(`cmd_${payload}`);
const event = eventId(`evt_${payload}`);
const batch = batchId(`batch_${payload}`);
const liquidation = liquidationId(`liq_${payload}`);

function requiresMemberId(_value: MemberId): void {}
function requiresAccountId(_value: AccountId): void {}
function requiresPropertyId(_value: PropertyId): void {}
function requiresDepositId(_value: DepositId): void {}
function requiresCommandId(_value: CommandId): void {}
function requiresEventId(_value: EventId): void {}
function requiresBatchId(_value: BatchId): void {}
function requiresLiquidationId(_value: LiquidationId): void {}

requiresMemberId(member);
requiresAccountId(account);
requiresPropertyId(property);
requiresDepositId(deposit);
requiresCommandId(command);
requiresEventId(event);
requiresBatchId(batch);
requiresLiquidationId(liquidation);

// A raw string is not a validated identifier.
// @ts-expect-error plain strings are not MemberId values
requiresMemberId(`mem_${payload}`);

// Entity identifiers are not interchangeable.
// @ts-expect-error PropertyId is not MemberId
requiresMemberId(property);
// @ts-expect-error MemberId is not AccountId
requiresAccountId(member);
// @ts-expect-error AccountId is not PropertyId
requiresPropertyId(account);
// @ts-expect-error CommandId is not DepositId
requiresDepositId(command);
// @ts-expect-error EventId is not CommandId
requiresCommandId(event);
// @ts-expect-error BatchId is not EventId
requiresEventId(batch);
// @ts-expect-error LiquidationId is not BatchId
requiresBatchId(liquidation);
// @ts-expect-error DepositId is not LiquidationId
requiresLiquidationId(deposit);

const generator: IdentifierGenerator =
  createDeterministicTestIdentifierGenerator();

const generatedMember: MemberId = generator.next("member");
const generatedProperty: PropertyId = generator.next("property");

requiresMemberId(generatedMember);
requiresPropertyId(generatedProperty);

// The kind argument determines the generator result type.
// @ts-expect-error generated PropertyId is not MemberId
const invalidGeneratedMember: MemberId = generator.next("property");

void invalidGeneratedMember;