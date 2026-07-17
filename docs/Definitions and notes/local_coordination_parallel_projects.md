# Local Coordination Protocol — Parallel Project Map

Purpose: separate the LCP into connected silos so each system can be described without forcing the point system to carry everything.

Core rule: **the point system is the communication/addressing layer.** It lets people, places, objects, tasks, documents, logs, and pages be reached, named, updated, and talked about. Other systems can reference points, but they should have their own models.

---

# Simple Silo Map

```text
LCP
├── 1. Communication / Point System
├── 2. House Operations System
├── 3. Financial System
├── 4. Labor Pool System
├── 5. EEU / Internal Unit System
├── 6. Market / Exchange System
├── 7. Intelligence / History System
└── 8. Game Layer
```

---

# 1. Communication / Point System

## Purpose
Create a shared local language for naming things, scanning things, logging things, and attaching information to real-world places, people, objects, tasks, and documents.

## We have already defined
- point
- point types
- point status
- QR entrance
- QR-to-point mapping
- public point page
- point log
- point intelligence snapshot

## Key objects
- `point`
- `qr_mapping`
- `point_log`
- `point_intelligence_snapshot`

## Interface with other systems
Every other silo can refer to a point by `point_id`.

---

# 2. House Operations System

## Purpose
Manage the real-world operation of houses, rooms, people, tasks, issues, inspections, maintenance, cleaning, supplies, keys, and routines.

## Key questions
- Which houses are active?
- Which rooms/spaces exist inside each house?
- Who occupies, manages, uses, or maintains each space?
- What tasks are open?
- What recurring work happens at each property?
- What needs attention today?

## Possible objects
- property
- room
- occupancy
- house role
- work order
- maintenance issue
- inspection event
- supply need
- key/access item

## Interface with points
Properties, rooms, tasks, and issue locations can all be points. Operations records reference those points.

---

# 3. Financial System

## Purpose
Track the money flow of the local system: rent, bills, taxes, repairs, loans, reserves, project budgets, payouts, financing, capital sources, and property-level performance.

## Key questions
- What money comes in?
- What money goes out?
- What money is owed?
- What money is reserved?
- Which house produces or consumes cash?
- What capital is needed next?

## Possible objects
- account
- transaction
- rent charge
- bill
- invoice
- loan/note
- reserve bucket
- budget
- property P&L
- capital contribution

## Interface with points
Transactions and budgets can reference a property point, person point, agreement point, task point, or document point.

---

# 4. Labor Pool System

## Purpose
Organize people who can do work, what they can do, what tasks are available, what has been assigned, what has been completed, and how labor is paid or credited.

## Key questions
- Who can work?
- What skills/capacity do they have?
- What tasks need people?
- Who is assigned?
- What was completed?
- What is owed or credited?

## Possible objects
- worker profile
- skill
- availability
- task assignment
- completed work record
- payout/credit record
- quality/reliability note

## Interface with points
Workers are person points. Tasks are task points. Work locations are property/room/location points.

---

# 5. EEU / Internal Unit System

## Purpose
Define the internal unit, credit, or accounting layer that can represent contribution, local value, claims, credits, or exchange capacity inside the system.

## Key questions
- What is one unit?
- How is it created?
- How is it earned?
- How is it spent?
- Can it be redeemed?
- Is it money, credit, accounting, reputation, or game score?
- What rules prevent confusion or abuse?

## Possible objects
- unit account
- unit balance
- issuance event
- transfer
- redemption
- contribution credit
- local claim
- rule/policy

## Interface with points
EEU records can reference people, tasks, properties, agreements, and market listings by `point_id`.

---

# 6. Market / Exchange System

## Purpose
Create a structured way for people to offer, request, buy, sell, rent, trade, reserve, or claim things inside the local network.

## Key questions
- What can be offered?
- What can be requested?
- Who can participate?
- What price/unit is used?
- What counts as accepted?
- What happens after a deal is made?

## Possible objects
- listing
- offer
- request
- bid
- reservation
- order
- exchange agreement
- fulfillment record

## Interface with points
Listings can reference resource points, room points, task points, event points, or agreement points.

---

# 7. Intelligence / History System

## Purpose
Let points accumulate memory, history, context, and summarized current state. Eventually points can be compared, queried, and related to each other.

## Key questions
- What happened here?
- What changed?
- What is unresolved?
- What does this point need next?
- Which other points are connected?
- What pattern is emerging across houses, people, tasks, or money?

## Possible objects
- point history
- point timeline
- intelligence snapshot
- issue summary
- relationship graph
- recurring pattern
- recommended next action

## Interface with points
This system reads from point logs, relationships, tasks, documents, money records, and operations data.

---

# 8. Game Layer

## Purpose
Create a game or play layer on top of the real operating system so people can participate, progress, contribute, compete, cooperate, earn status, unlock roles, or complete quests.

## Key questions
- What is the game?
- Who is the player?
- What actions count?
- What are points/scores/levels/badges?
- What real-world behavior is the game trying to encourage?
- How does the game avoid corrupting the real system?

## Possible objects
- player
- quest
- mission
- score
- badge
- level
- challenge
- reward
- season
- rule set

## Interface with points
Game actions can reference real points, logs, tasks, events, and market actions, but the game layer should not be treated as the source of truth for legal, financial, or operational records.

---

# Recommended Order of Definition

Do not design every silo at full depth right now. Define the edges first.

```text
1. Communication / Point System — already in progress
2. House Operations System — next practical operating layer
3. Financial System — needed to understand survival and growth
4. Labor Pool System — needed to get work done
5. Market / Exchange System — needed to coordinate offers/requests
6. EEU / Internal Unit System — define only after money/labor/market are clearer
7. Intelligence / History System — already partially started, expands later
8. Game Layer — last, after the real system is coherent
```

---

# First Design Pass for Each Silo

For each silo, create a one-page definition with this shape:

```md
Silo name:
Purpose:
What it manages:
Core objects:
Inputs:
Outputs:
What references points:
What should not be mixed into this silo:
Version 1 minimum:
Open questions:
```

---

# Immediate Next Design Task

Define the next silo after the communication system:

```text
House Operations System
```

Reason: house operations touches houses, rooms, people, tasks, calendar, documents, labor, and money. It is the most concrete bridge between the point system and the real world.


---

# Silo Design Tasks

Each parallel project gets a Hickory design ticket before it becomes build work.

```text
DESIGN-003 — House Operations
DESIGN-004 — Financial System
DESIGN-005 — Labor Pool
DESIGN-006 — Market / Exchange
DESIGN-007 — EEU / Internal Unit
DESIGN-008 — Intelligence / History
DESIGN-009 — Game Layer
DESIGN-010 — Cross-Silo Wiring Map
```

Rule: finish the one-page silo definition before creating a 119 build ticket.

---

# Crypto / DeFi Project Units

The crypto layer should be treated as its own project track. It belongs mostly to the financial, market, EEU, governance, ownership, proof, and capital layers.

Core rule: do not force crypto into the base system. Use it only where it improves settlement, proof, custody, ownership, governance, financing, or programmable market behavior.

Current crypto project units:
- wallet / actor identity
- proof / audit anchoring
- treasury / reserve management
- stablecoin payment settlement
- internal accounting / EEU ledger
- labor escrow / milestone payments
- market settlement
- ownership / claim registry
- financing / capital formation
- DeFi yield / liquidity management
- governance / rule execution
- on-chain / off-chain bridge


---

# 9. AI / Local Knowledge Graph System

## Purpose
Create point-specific intelligence by building local knowledge graphs around individual points or sets of points.

## Plain-language model
A point becomes smarter as records accumulate around it. Logs, tasks, documents, events, relationships, and money records become facts and edges in a local graph. AI reads that local graph to summarize the point, answer questions, and suggest next actions.

## Key objects
- `point_fact`
- `point_event`
- `point_edge`
- `point_context_bundle`
- `point_local_graph`
- `point_intelligence_snapshot`

## Key questions
- What is known about this point?
- What happened here?
- What is unresolved?
- Which other points are connected?
- What pattern is emerging?
- What should happen next?

## Interface with points
The AI system reads from points, point logs, relationships, operations records, documents, money records, and later market/labor/game records. It writes summaries, facts, events, edges, context bundles, and recommendations.

## Boundary
AI is not the source of truth. Records are the source of truth. AI is the interpretation layer.
