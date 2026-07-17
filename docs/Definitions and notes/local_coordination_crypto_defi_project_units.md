# Local Coordination Protocol — Crypto / DeFi Project Units

Purpose: break the crypto/DeFi side of LCP into logical, unforced units. The goal is not to force a token onto the project. The goal is to identify where blockchain primitives are actually useful.

Core rule: **reality and records come first; crypto comes later where it solves a real coordination, ownership, settlement, audit, or capital problem.**

---

# Simple Position in LCP

```text
Physical houses / people / tasks
  ↓
Point system / records / logs
  ↓
Operations / money / labor / market
  ↓
Crypto / DeFi primitives where useful
```

Crypto is not the communication layer. Crypto is a value, settlement, proof, ownership, and capital layer that can connect to the records created by the point system.

---

# Logical Crypto / DeFi Units

## CRYPTO-001 — Wallet / Actor Identity

Purpose: connect people, managers, workers, investors, and system agents to cryptographic accounts.

Possible primitives:
- wallet address
- signer identity
- role-based access
- multisig / Safe-style control
- delegated permissions

Use only if:
- a person needs to sign an action
- a treasury needs multiple approvers
- a claim needs cryptographic proof

Do not overbuild:
- identity can start off-chain and simple.

---

## CRYPTO-002 — Proof / Audit Anchoring

Purpose: prove that some record, document, log bundle, agreement, or financial snapshot existed at a certain time.

Possible primitives:
- hash commitments
- timestamped events
- Merkle roots
- signed snapshots

Use only if:
- you need an audit trail
- you need outside trust
- you need to prove data was not changed later

Version 1 idea:
- hash a point intelligence snapshot or financial report and later anchor it on-chain.

---

## CRYPTO-003 — Treasury / Reserve Management

Purpose: hold and move shared funds with clear controls.

Possible primitives:
- multisig treasury
- stablecoin balances
- payment approvals
- spend policies
- budget buckets

Use only if:
- system money needs shared custody
- outside participants need trust in fund movement
- payments need transparent authorization

This is one of the most practical early crypto units.

---

## CRYPTO-004 — Stablecoin Payments / Settlement

Purpose: settle payments without depending fully on banks.

Possible primitives:
- USDC / USDT-style stablecoin payments
- payment receipts
- invoice settlement
- worker payouts
- vendor payments

Use only if:
- counterparties can actually use stablecoins
- the system benefits from faster settlement
- payment proof matters

Do not force:
- rent and ordinary bills can stay normal money until crypto solves a real problem.

---

## CRYPTO-005 — Internal Accounting / EEU Ledger

Purpose: represent internal contribution, credit, participation, or local value.

Possible primitives:
- off-chain ledger first
- non-transferable credit later
- ERC-20-like unit only if necessary
- claim / balance / transfer records

Use only if:
- people earn internal credit
- credits can be spent or redeemed
- the unit has clear rules

Warning:
- this should not become a token before the economic rules are clear.

---

## CRYPTO-006 — Labor Escrow / Milestone Payments

Purpose: hold value for tasks and release it when work is completed or approved.

Possible primitives:
- escrow contract
- task bounty
- milestone release
- dispute flow
- worker payout

Use only if:
- tasks have clear acceptance rules
- work completion can be verified
- payment risk is real

Connection to points:
- task point = work object
- point logs = proof/update trail
- escrow = payment mechanism

---

## CRYPTO-007 — Market Settlement / Local Exchange

Purpose: support offers, requests, reservations, sales, labor, or resource exchange.

Possible primitives:
- offer contract
- order / bid / reservation
- escrow settlement
- fee capture
- reputation hooks

Use only if:
- there is a real market object
- the exchange needs enforceable settlement
- participants need trust-minimized payment or reservation

---

## CRYPTO-008 — Ownership / Claim Registry

Purpose: represent claims, stakes, membership, or participation rights.

Possible primitives:
- membership token
- share / claim record
- revenue claim record
- agreement-linked ownership primitive

Use only if:
- legal structure is clear
- rights are well-defined
- claims are not misleading

Warning:
- property ownership and investment claims are legally sensitive. Do not start here.

---

## CRYPTO-009 — Financing / Capital Formation

Purpose: let outside or local capital support property, labor, or system growth.

Possible primitives:
- note registry
- investment pool
- revenue-share claim
- vault-like capital pool
- repayment schedule

Use only if:
- the financing model is legally and economically clear
- repayment source is known
- investor rights are explicit

This is advanced and should come after operations, financial records, and legal structure are clear.

---

## CRYPTO-010 — DeFi Yield / Liquidity Management

Purpose: manage treasury assets, stablecoin yield, liquidity, or reserves.

Possible primitives:
- ERC-4626-like vault
- lending protocol interaction
- AMM liquidity
- reserve allocation policy

Use only if:
- principal risk is understood
- treasury controls are mature
- accounting is clean

This is not an early LCP requirement. It is a later DeFi research track.

---

## CRYPTO-011 — Governance / Rule Execution

Purpose: coordinate decisions about budgets, treasury, policies, upgrades, and shared resources.

Possible primitives:
- proposal records
- vote records
- multisig execution
- timelocks
- quorum rules

Use only if:
- there are multiple real stakeholders
- decisions need transparent authority
- execution must follow rules

---

## CRYPTO-012 — On-chain / Off-chain Bridge

Purpose: connect LCP records to smart contracts without pretending the blockchain knows everything about the real world.

Possible primitives:
- oracle-like updater
- signed data payloads
- snapshot hashes
- event indexer
- subgraph / indexer

Use only if:
- off-chain LCP records must trigger or inform on-chain contracts
- on-chain contracts need verified inputs

Rule:
- LCP remains the real-world source of records; blockchain stores proofs, claims, settlement, and enforceable financial logic.

---

# Recommended Crypto Build Order

```text
1. Wallet / actor identity
2. Proof / audit anchoring
3. Treasury / reserve management
4. Stablecoin payment receipts
5. Internal accounting / EEU ledger
6. Labor escrow
7. Market settlement
8. Governance
9. Ownership / claim registry
10. Financing / capital formation
11. DeFi yield / liquidity
12. On-chain / off-chain bridge
```

---

# First Practical Crypto Design Ticket

## DESIGN-011 — Crypto / DeFi Silo

Place: Hickory

Estimate: 60–90 minutes

Goal: define which crypto primitives LCP actually needs, without forcing unnecessary tokenization.

Done when:
- crypto units are listed
- each unit has a purpose
- early, middle, and late units are separated
- the first RareSkills-aligned Solidity project is identified

---

# First RareSkills-Aligned Project Candidates

## Candidate A — LCP Registry
A smart contract that registers hashes or identifiers for LCP snapshots.

Best for:
- events
- access control
- storage layout
- minimal safe Solidity
- explainability

## Candidate B — Task Escrow
A smart contract that holds a stablecoin task bounty and releases payment when approved.

Best for:
- ERC-20 interaction
- approvals
- transfer safety
- reentrancy/security thinking
- test-driven development

## Candidate C — Treasury Policy Contract
A simple contract or multisig-adjacent module that tracks budget approvals and allowed spending categories.

Best for:
- role-based control
- governance-like constraints
- event logs
- policy execution

## Candidate D — EEU Prototype Ledger
A minimal internal balance ledger, probably off-chain first, but later modeled as a non-transferable or controlled ERC-20-like contract if the rules demand it.

Best for:
- token design questions
- accounting invariants
- transfer restrictions
- preventing premature tokenization

---

# Current Recommendation

Start with:

```text
LCP Registry → Task Escrow → Treasury Policy → EEU Ledger
```

Do not start with property tokens, yield vaults, or outside financing. Those are powerful but premature.
