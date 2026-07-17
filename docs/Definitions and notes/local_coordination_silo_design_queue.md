# Local Coordination Protocol — Silo Design Queue

Purpose: hold the Hickory design tasks for the parallel LCP systems.

Rule: these are **design tickets**, not coding tickets. Do them at **Hickory**. After each major design ticket, return to **435** to reset and record the result. Anything breakable or implementation-heavy moves to **119** as a separate build ticket.

---

# Current Silo Understanding

```text
Point System = communication/addressing layer
House Operations = management layer
Financial System = money/capital layer
Labor Pool = work execution layer
EEU = internal unit/accounting layer
Market = exchange layer
Intelligence / History = memory/understanding layer
Game = participation/play layer
AI / Knowledge Graph = point-specific intelligence layer
```

---

# Hickory Design Queue

| Order | Ticket | Silo | Place | Estimate | Status | Output |
|---:|---|---|---|---:|---|---|
| 1 | DESIGN-003 | House Operations | Hickory | 60–90 min | ready | one-page silo definition |
| 2 | DESIGN-004 | Financial System | Hickory | 60–90 min | not started | one-page silo definition |
| 3 | DESIGN-005 | Labor Pool | Hickory | 60–90 min | not started | one-page silo definition |
| 4 | DESIGN-006 | Market / Exchange | Hickory | 60–90 min | not started | one-page silo definition |
| 5 | DESIGN-007 | EEU / Internal Unit | Hickory | 60–90 min | not started | one-page silo definition |
| 6 | DESIGN-008 | Intelligence / History | Hickory | 60–90 min | not started | one-page silo definition |
| 7 | DESIGN-009 | Game Layer | Hickory | 60–90 min | not started | one-page silo definition |
| 8 | DESIGN-010 | Cross-Silo Wiring | Hickory | 60–90 min | not started | connection map + next build ticket |

---

# One-Page Silo Definition Template

Use this same shape for every silo.

```md
# [Silo Name]

## Purpose
What this system exists to manage.

## Source of Truth
What records this system owns.

## Core Objects
The main objects/entities in this system.

## Basic Flows
The 2–4 most important flows.

## Inputs
What information this system receives.

## Outputs
What this system produces.

## Connection to Points
Which objects reference `point_id`.

## Version 1 Minimum
The smallest useful version.

## Open Questions
What still needs to be decided.
```

---

# Location Rule

```text
Hickory = design the silo
435 = reset and record result
119 = build the implementation after the silo is clear
```

---

# Current Next Ticket

## DESIGN-003 — House Operations

Place: Hickory

Goal: define how houses, rooms, people, tasks, issues, inspections, supplies, and recurring operations are managed.

Done when:
- House Operations has a one-page silo definition.
- The first 3 operating objects are named.
- The next design/build ticket is clear.

---

# Added Crypto / DeFi Design Ticket

## DESIGN-011 — Crypto / DeFi Silo

Place: Hickory

Estimate: 60–90 minutes

Goal: break LCP crypto into logical and unforced units: identity, proof, treasury, settlement, EEU, escrow, market settlement, governance, ownership claims, financing, DeFi liquidity, and off-chain/on-chain bridges.

Done when:
- crypto units are listed
- each unit has a purpose
- early/middle/late units are separated
- the first RareSkills-aligned Solidity project is selected

Status: `ready after current silo queue, or active if user chooses crypto next`


---

# Added AI / Knowledge Graph Design Ticket

## DESIGN-012 — AI / Local Knowledge Graph System

Place: Hickory

Estimate: 60–90 minutes

Goal: define the point-specific intelligence system: local knowledge graphs, point facts, point events, point edges, point context bundles, and AI summaries/recommendations.

Done when:
- point-local knowledge graph is defined
- first graph objects are accepted
- first edge types are accepted
- first point-specific AI questions are accepted
- first 119 build ticket is clear

Status: `active design track`
