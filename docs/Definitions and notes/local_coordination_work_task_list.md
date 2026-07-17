# Local Coordination Protocol — Work Task List

This document is distinct from the general GTD ledger.

Purpose: convert the current design into short ordered work tickets that can be executed without rethinking the whole project.

Rule: breakable implementation work happens first in the morning at **119**. Creative/design shaping happens at **Hickory**. After every major step, return to **435** to reset before starting the next development action.

---

# Work Ticket Format

Every real work task should use this shape:

```md
Task ID:
Name:
Phase:
Place:
Estimate:
Goal:
Inputs needed:
Steps:
Done when:
Next reset:
Status:
Result notes:
```

Use this format so the morning task can be executed without thinking about the whole system.

---

# Place Key

- `1143` — wake / start point.
- `435` — reset point, planning point, food/body/exercise point.
- `119` — focused computer work, breakable implementation, code, deployment.
- `Hickory` — creative development work, diagrams, model decisions, writing.

---

# Status Key

- `not started` — not touched yet.
- `ready` — clear enough to do next.
- `active` — currently being worked.
- `blocked` — needs a decision or setup.
- `done` — completed and checked.

---

# Current Work Sequence

```text
Phase 0 — Maintain project system
Phase 1 — Scaffold real Cloudflare Worker
Phase 2 — Create D1 database + migrations
Phase 3 — Seed one test point
Phase 4 — Create one QR entrance
Phase 5 — Build GET /q/:qrCode
Phase 6 — Build “log something here”
Phase 7 — Build point intelligence v1
Phase 8 — Deploy test version
Phase 9 — Map the larger LCP operating system
```

---

# Phase 0 — Maintain Project System

## TASK-000 — Maintain Project Documents

Task ID: `TASK-000`

Name: Maintain project documents

Phase: 0 — Maintain project system

Place: 435 or Hickory

Estimate: 10–20 minutes per session

Goal: Keep the GTD ledger, definition notebook, codebase index, work task list, and calendar current.

Inputs needed:
- Current conversation decisions
- Current file set

Steps:
1. Capture accepted decisions.
2. Update definition notebook if model/type rules changed.
3. Update GTD ledger if project tasks changed.
4. Update codebase index if files changed.
5. Update work task list if build order changed.
6. Update calendar if location/timing changed.

Done when:
- The next session can restart from the documents without re-explaining the whole project.

Next reset:
- Return to 435, record the next concrete action.

Status: `active`

Result notes:
- Keep this light. Do not let document maintenance become the project.

---

# Phase 1 — Scaffold Real Cloudflare Worker

## BUILD-001 — Worker Scaffold

Task ID: `BUILD-001`

Name: Create Cloudflare Worker scaffold

Phase: 1 — Worker Setup

Place: 119

Estimate: 60–90 minutes

Goal: Create a real Cloudflare Worker project that serves one plain page locally.

Inputs needed:
- Computer
- Terminal
- Cloudflare account
- Wrangler available or installable
- Project folder location chosen

Steps:
1. Create project folder: `local-coordination-worker/`.
2. Create `package.json`.
3. Create `wrangler.toml`.
4. Create `tsconfig.json`.
5. Create `src/index.ts`.
6. Add one route that returns plain HTML.
7. Run local dev server.
8. Open the local URL in the browser.
9. Write down what worked or broke.

Done when:
- A local browser shows a plain page from the Worker.

Next reset:
- Leave 119, return to 435, record result.

Status: `ready`

Result notes:
- This is the first breakable implementation task.

---

# Phase 2 — Create D1 Database + Migrations

## BUILD-002 — D1 Database Binding

Task ID: `BUILD-002`

Name: Create and bind D1 database

Phase: 2 — Database Setup

Place: 119

Estimate: 45–60 minutes

Goal: Create the Cloudflare D1 database and bind it to the Worker as `POINTS_DB`.

Inputs needed:
- Worker scaffold from BUILD-001
- Cloudflare/Wrangler access

Steps:
1. Create D1 database.
2. Add D1 binding to `wrangler.toml`.
3. Confirm local Worker can see `env.POINTS_DB`.
4. Record any configuration errors.

Done when:
- Worker config has a valid `POINTS_DB` binding.

Next reset:
- Leave 119, return to 435, record result.

Status: `not started`

Result notes:
- Do not add all tables yet. First prove the binding exists.

---

## BUILD-003 — Initial SQL Migration

Task ID: `BUILD-003`

Name: Create initial D1 migration

Phase: 2 — Database Setup

Place: 119

Estimate: 90–120 minutes

Goal: Create and apply the first migration with `points`, `qr_mappings`, and `point_logs`.

Inputs needed:
- D1 binding from BUILD-002
- Accepted table fields from definition notebook

Steps:
1. Create `migrations/0001_initial.sql`.
2. Add `points` table.
3. Add `qr_mappings` table.
4. Add `point_logs` table.
5. Apply migration locally.
6. Confirm tables exist.
7. Record errors/results.

Done when:
- Local D1 has the three required tables.

Next reset:
- Leave 119, return to 435, record result.

Status: `not started`

Result notes:
- This is where schema mistakes will show up. Keep it narrow.

---

# Phase 3 — Seed One Test Point

## BUILD-004 — Seed First Point

Task ID: `BUILD-004`

Name: Seed one active test point

Phase: 3 — Seed Point

Place: Hickory for choosing point, 119 for inserting point

Estimate: 60–90 minutes total

Goal: Get one real point into D1 and prove it can be queried.

Inputs needed:
- Working D1 tables
- First point facts

Steps:
1. At Hickory, choose the first test point.
2. At 119, write seed SQL or seed function.
3. Insert the point into D1.
4. Query the point by ID.
5. Record result.

Done when:
- One active point exists in the database and can be read by ID.

Next reset:
- Return to 435 after the insert/query test.

Status: `not started`

Result notes:
- Suggested first point: a test property, room, or doorway point.

---

# Phase 4 — Create One QR Entrance

## BUILD-005 — Seed QR Mapping

Task ID: `BUILD-005`

Name: Create one QR entrance for the seed point

Phase: 4 — QR Mapping

Place: Hickory for slug choice, 119 for DB insert

Estimate: 45–60 minutes

Goal: Create one `qr_mappings` row that maps a QR code slug to the seed point.

Inputs needed:
- Seed point from BUILD-004
- QR slug choice

Steps:
1. Choose a QR slug, such as `front-door-test`.
2. Insert `qr_mappings` row.
3. Query QR mapping by code.
4. Confirm it resolves to `point_id`.
5. Record result.

Done when:
- QR code slug resolves to the seed point ID.

Next reset:
- Return to 435 after the mapping test.

Status: `not started`

---

# Phase 5 — Build GET `/q/:qrCode`

## BUILD-006 — QR Scan Route

Task ID: `BUILD-006`

Name: Build `/q/:qrCode` route

Phase: 5 — QR Routing

Place: 119

Estimate: 2–3 hours, possibly split into two mornings

Goal: Visiting `/q/:qrCode` loads the mapped point and serves the minimum public point page.

Inputs needed:
- Worker scaffold
- D1 binding
- Seed point
- QR mapping

Steps:
1. Add route parser.
2. Detect `/q/:qrCode`.
3. Look up `qr_mappings.qr_code`.
4. Load point by `point_id`.
5. Check point status.
6. Render minimum public point page.
7. Test locally.
8. Record errors/results.

Done when:
- Browser can visit `/q/front-door-test` and see the active point page.

Next reset:
- Return to 435 after first successful route or after a blocking error.

Status: `not started`

---

# Phase 6 — Build `Log Something Here`

## BUILD-007 — Point Log Submission

Task ID: `BUILD-007`

Name: Build `log something here` flow

Phase: 6 — Point Logs

Place: 119

Estimate: 2–3 hours, likely split into two mornings

Goal: A visitor can submit a note/problem/update/request/observation and create a `point_log` row tied to the point.

Inputs needed:
- Working `/q/:qrCode` route
- `point_logs` table

Steps:
1. Add log form route.
2. Render simple form.
3. Parse form submit.
4. Validate input.
5. Insert `point_log` into D1.
6. Confirm or redirect after submit.
7. Query database to confirm row exists.
8. Record result.

Done when:
- A submitted log appears in `point_logs` with the correct `point_id`.

Next reset:
- Return to 435 after successful submit or blocking error.

Status: `not started`

---

# Phase 7 — Point Intelligence v1

## BUILD-008 — Basic Point Intelligence View

Task ID: `BUILD-008`

Name: Build basic point intelligence view

Phase: 7 — Intelligence

Place: Hickory for page shape, 119 for code

Estimate: 2–3 hours, likely split

Goal: Display a basic current-state view built from point logs.

Inputs needed:
- Working point page
- Working point log submissions
- At least 3 sample logs

Steps:
1. At Hickory, decide the v1 intelligence view sections.
2. At 119, query logs for a point.
3. Sort logs by time.
4. Group logs by type.
5. Extract issues/requests/updates.
6. Render simple current-state view.
7. Record result.

Done when:
- A page can show what is currently known about a point from its logs.

Next reset:
- Return to 435 and decide whether to persist snapshots or deploy first.

Status: `not started`

---

# Phase 8 — Deploy Test Version

## BUILD-009 — Deploy Test Loop

Task ID: `BUILD-009`

Name: Deploy test scan-to-point loop

Phase: 8 — Deployment

Place: 119

Estimate: 90–120 minutes

Goal: Deploy the first public Cloudflare version of the scan-to-point loop.

Inputs needed:
- Working local `/q/:qrCode` route
- Remote D1 migration
- Cloudflare account

Steps:
1. Confirm local loop works.
2. Apply remote D1 migrations.
3. Deploy Worker.
4. Test public `/q/:qrCode` URL.
5. Record errors/results.

Done when:
- Public URL resolves a QR code to a point page.

Next reset:
- Return to 435 and write the next field-test ticket.

Status: `not started`

---

# Phase 9 — Map Larger LCP Operating System

## DESIGN-001 — Operating Points Inventory

Task ID: `DESIGN-001`

Name: List the operating points that need to be touched

Phase: 9 — Larger LCP Operating System

Place: Hickory

Estimate: 45–60 minutes

Goal: Expand from seed point to the broader operating system: houses, tasks, calendar, money, agreements, people, documents, and resources.

Inputs needed:
- Current houses/properties
- Current people/managers
- Current money flows
- Current calendar obligations
- Current recurring tasks

Steps:
1. List the first operating domains.
2. Decide which domains become point types or related tables later.
3. Pick the first 3 real-world points to model.
4. Add them to the definition notebook or operating points document.

Done when:
- There is a short accepted inventory of the LCP areas that need to be modeled next.

Next reset:
- Return to 435 and choose the next design/build ticket.

Status: `ready`

Result notes:
- This is creative development, not coding.

---

# Phase 10 — Define Parallel LCP Silos

## DESIGN-002 — Parallel Project Map

Task ID: `DESIGN-002`

Name: Define the parallel LCP project silos

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 45–60 minutes

Goal: Separate the larger LCP into distinct connected systems so the point system does not have to contain everything.

Inputs needed:
- Current point system definition
- Current operating points inventory
- Known systems: houses, tasks, calendar, money, labor, EEU, market, intelligence, game

Steps:
1. Define the point system as the communication/addressing layer.
2. List the parallel silos.
3. State what each silo manages.
4. State how each silo connects back to points.
5. Choose the next silo to define in detail.

Done when:
- A short accepted silo map exists.

Next reset:
- Return to 435, record which silo is next.

Status: `done`

Result notes:
- Created `local_coordination_parallel_projects.md`.
- Recommended next detailed silo: House Operations System.

---

## DESIGN-003 — House Operations Silo

Task ID: `DESIGN-003`

Name: Define House Operations System

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Define the system that manages houses, rooms, people, tasks, issues, inspections, supplies, and recurring operations.

Inputs needed:
- First active houses/properties
- Known rooms/spaces
- Current managers/occupants
- Current open tasks
- Current recurring house obligations

Steps:
1. List what House Operations manages.
2. Define its core objects.
3. Define which objects are points.
4. Define what data belongs outside the point table.
5. Define the basic operating flows: issue → task → assignment → completion → record.
6. Identify what connects to calendar, labor, money, and documents.
7. Write the version 1 minimum system.

Done when:
- House Operations has a one-page silo definition.
- The first 3 house-operation objects are identified.
- The next design/build ticket is clear.

Next reset:
- Return to 435, record result, choose whether the next Hickory block is Financial System or an example house-operation map.

Status: `ready`

Result notes:
- This is Hickory design work, not 119 build work.

---

## DESIGN-004 — Financial System Silo

Task ID: `DESIGN-004`

Name: Define Financial System

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Define the system for rent, bills, taxes, repairs, loans, reserves, budgets, payouts, financing, and property-level performance.

Inputs needed:
- Current property list
- Known rents/income
- Known fixed costs
- Known debts/notes
- Current repair/project costs
- Any reserve or payout rules already decided

Steps:
1. List all money inflows.
2. List all money outflows.
3. Define the core financial objects.
4. Define what belongs to a property, person, task, agreement, or document point.
5. Define the basic flows: charge → payment → allocation → reserve/payout.
6. Separate real money from internal unit/accounting ideas.
7. Write the version 1 minimum financial system.

Done when:
- Financial System has a one-page silo definition.
- The first money-flow records are named.
- The boundary between Financial System and EEU is clear enough for now.

Next reset:
- Return to 435, record result, then choose Labor Pool or EEU depending on what feels most urgent.

Status: `not started`

Result notes:
- Do not code this yet. Define the model first.

---

## DESIGN-005 — Labor Pool Silo

Task ID: `DESIGN-005`

Name: Define Labor Pool System

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Define the system for workers, skills, availability, task assignment, completed work, payout/credit, and reliability.

Inputs needed:
- Current helpers/workers
- Common work types
- Current open tasks
- How people are paid or credited
- What reliability/quality signals matter

Steps:
1. List who can do work.
2. List the kinds of work the system needs.
3. Define core labor objects.
4. Define the basic flow: task appears → worker accepts/gets assigned → work done → reviewed → paid/credited.
5. Define how labor references house-operation tasks.
6. Define what information should be visible to workers.
7. Write the version 1 minimum labor pool system.

Done when:
- Labor Pool has a one-page silo definition.
- Worker, task assignment, completed work, and payout/credit are separated.
- The connection to House Operations and Financial/EEU is clear.

Next reset:
- Return to 435, record result, then choose Financial/EEU/Market follow-up.

Status: `not started`

Result notes:
- This is the bridge between plans and physical execution.

---

## DESIGN-006 — Market / Exchange Silo

Task ID: `DESIGN-006`

Name: Define Market / Exchange System

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Define the system for offers, requests, listings, bids, reservations, orders, and exchanges inside the local network.

Inputs needed:
- What can be offered
- What can be requested
- Who can participate
- Known resources, rooms, services, tasks, or goods
- Whether exchange uses dollars, EEU, barter, or mixed terms

Steps:
1. List first market categories.
2. Define listing, offer, request, reservation, and fulfillment.
3. Define what each market object references by point_id.
4. Define the basic flow: request/listing → offer → acceptance → fulfillment → record.
5. Define what counts as a completed exchange.
6. Define what should be public, private, or permissioned.
7. Write the version 1 minimum market system.

Done when:
- Market/Exchange has a one-page silo definition.
- The first exchange type is chosen.
- The boundary between Market, Financial System, and EEU is clear enough for now.

Next reset:
- Return to 435, record result, then choose whether to define EEU next.

Status: `not started`

Result notes:
- Market is not the same as money. It is the coordination layer for offers and requests.

---

## DESIGN-007 — EEU / Internal Unit Silo

Task ID: `DESIGN-007`

Name: Define EEU / Internal Unit System

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Define whether the EEU is money, credit, accounting, reputation, score, internal claim, or some mixture; and how it is created, earned, spent, transferred, or redeemed.

Inputs needed:
- Current EEU idea
- What behaviors it should encourage
- What it should not pretend to be
- How it relates to dollars
- How it relates to labor, rent, market exchange, and game mechanics

Steps:
1. Define what EEU is in plain language.
2. Define what EEU is not.
3. Define how units are issued.
4. Define how units are earned.
5. Define how units are spent or redeemed.
6. Define what records are needed: account, balance, transfer, issuance, redemption.
7. Write the version 1 minimum EEU system.

Done when:
- EEU has a one-page silo definition.
- The system has a clear boundary from legal money and from game score.
- The first safe use case is identified.

Next reset:
- Return to 435, record result, then choose Financial, Market, or Game follow-up.

Status: `not started`

Result notes:
- Be careful here. This system can get confusing fast. Keep it concrete and non-magical.

---

## DESIGN-008 — Intelligence / History Silo

Task ID: `DESIGN-008`

Name: Define Intelligence / History System

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Define how points accumulate timelines, logs, summaries, relationships, current state, recommendations, and cross-point communication.

Inputs needed:
- Point log model
- Intelligence snapshot model
- House operations examples
- Current idea of points having history and communicating with each other

Steps:
1. Define what counts as history.
2. Define what counts as intelligence.
3. Define the difference between raw logs and processed summaries.
4. Define how one point knows about another point.
5. Define the basic flow: logs/events → timeline → summary → current state → recommendation.
6. Define what should be generated automatically versus reviewed by a human.
7. Write the version 1 minimum intelligence/history system.

Done when:
- Intelligence/History has a one-page silo definition.
- Point history, point timeline, intelligence snapshot, and recommendations are separated.
- The first query this system should answer is chosen.

Next reset:
- Return to 435, record result, then choose whether to build the v1 intelligence view at 119.

Status: `not started`

Result notes:
- This is separate from the basic point system, even though it reads from point logs.

---

## DESIGN-009 — Game Layer

Task ID: `DESIGN-009`

Name: Define Game Layer

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Define the optional game layer on top of the real operating system without confusing game records with legal, financial, or operational truth.

Inputs needed:
- What behavior the game should encourage
- Who the players are
- What actions count
- What rewards/status/progression could exist
- What must remain outside the game

Steps:
1. Define the purpose of the game.
2. Define the player.
3. Define quests/missions/challenges.
4. Define points/scores/levels/badges if needed.
5. Define what real-world actions can create game events.
6. Define what the game is not allowed to override.
7. Write the version 1 minimum game layer.

Done when:
- Game Layer has a one-page silo definition.
- The first playable loop is named.
- The boundary between game score, EEU, money, and operational truth is clear.

Next reset:
- Return to 435, record result, then choose whether the game should remain parked or enter prototype planning.

Status: `not started`

Result notes:
- The game sits on top. It should motivate participation, not distort records.

---

## DESIGN-010 — Cross-Silo Wiring Map

Task ID: `DESIGN-010`

Name: Define how the silos connect

Phase: 10 — Parallel LCP Silos

Place: Hickory

Estimate: 60–90 minutes

Goal: Create the first cross-silo map showing how Communication/Points, House Operations, Financial System, Labor Pool, Market, EEU, Intelligence/History, and Game Layer connect without collapsing into one confusing model.

Inputs needed:
- Completed one-page definitions for each silo
- Current point model
- Current real-world examples

Steps:
1. Draw each silo as a box.
2. List what each silo owns as source of truth.
3. List what each silo reads from other silos.
4. List what each silo writes back.
5. Identify the shared IDs, especially `point_id`.
6. Identify the first buildable end-to-end loop.
7. Decide what gets built first at 119.

Done when:
- There is a clear map of which system owns which records.
- The next actual build ticket is obvious.

Next reset:
- Return to 435, record result, then schedule the next 119 build block.

Status: `not started`

Result notes:
- This is the bridge from Hickory design to 119 implementation.


---

# Phase 11 — AI / Local Knowledge Graph System

## DESIGN-012 — AI / Local Knowledge Graph System

Task ID: `DESIGN-012`

Name: Define point-specific AI and local knowledge graph system

Phase: 11 — AI / Local Knowledge Graph

Place: Hickory

Estimate: 60–90 minutes

Goal: Define how a point or set of points develops local intelligence from logs, facts, events, relationships, documents, tasks, and other records.

Inputs needed:
- point model
- point_log model
- intelligence snapshot model
- examples of one property point, one task point, and one person point
- current idea of points having history and communicating with each other

Steps:
1. Define what a point-local knowledge graph is.
2. Define the first graph objects: facts, events, edges, context bundles.
3. Define the first edge types.
4. Define how raw logs become facts/events.
5. Define how a point retrieves its local context.
6. Define what AI is allowed to answer in v1.
7. Define the first 119 build ticket.

Done when:
- AI / Local Knowledge Graph has a one-page silo definition.
- The smallest useful point-specific intelligence loop is accepted.
- The first buildable graph tables are named.

Next reset:
- Return to 435, record accepted graph objects and first build task.

Status: `active`

Result notes:
- This is Hickory design work. Do not confuse it with training a model. The first AI system is retrieval/context/graph + summaries.

## BUILD-AI-001 — Point Graph Tables

Task ID: `BUILD-AI-001`

Name: Create first point knowledge graph tables

Phase: 11 — AI / Local Knowledge Graph

Place: 119

Estimate: 90–120 minutes

Goal: Create D1 tables for `point_facts`, `point_events`, and `point_edges`.

Inputs needed:
- accepted DESIGN-012 schema
- working D1 migration setup
- existing points and point_logs tables

Steps:
1. Create migration for point graph tables.
2. Add `point_facts`.
3. Add `point_events`.
4. Add `point_edges`.
5. Apply migration locally.
6. Insert one test fact, event, and edge for a seed point.
7. Query the local graph for that point.

Done when:
- One point can return its facts, events, and edges from D1.

Next reset:
- Return to 435 and record result.

Status: `blocked until DESIGN-012 is accepted and base D1 setup exists`
