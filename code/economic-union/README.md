# LCP Economic Union

This directory contains the prototype Economic Union system for the Local Coordination Protocol.

It is intentionally separate from `code/event-logger`. The event logger handles the Point information system. This workspace handles property capacity, deposits, token claims, seniority, internal transfers, and final liquidation.

## Structure

### `packages/domain`

Contains the core economic rules and calculations. Domain code does not depend on databases, web frameworks, Cloudflare, or Ethereum.

### `packages/protocol`

Defines commands, events, shared messages, and the rules for communicating with the domain.

### `apps/ledger-worker`

Contains the backend responsible for receiving requests, verifying authorization, applying domain rules, and storing results.

### `apps/member-web`

Contains the future member interface for balances, seniority holdings, transfers, and transaction history.

### `apps/admin-web`

Contains the future administrative interface for properties, valuations, debt, deposits, capacity, and liquidation.

### `contracts`

Contains future Solidity contracts for transaction commitments, verification, and settlement.

### `test-vectors`

Contains canonical economic examples that must produce identical results across TypeScript, backend, and Solidity implementations.

### `docs`

Contains economic rules, architecture decisions, invariants, event definitions, and prototype limitations.

## Prototype boundary

The prototype uses simulated properties, deposits, members, transfers, and liquidation proceeds. It does not accept real money, create legally enforceable claims, or deploy a production financial instrument.

## Development rule

Financial logic must remain outside `code/event-logger`. Applications may communicate later through explicit interfaces, but their source code and responsibilities remain separate.