# Local Coordination Protocol — Work Calendar

Purpose: place work in the correct physical location and protect the difference between creative design work and breakable implementation work.

Rule: after every major work step, return to **435** before beginning the next development action. The return to 435 is part of the system, not wasted time.

---

# Locations

## 1143
Start point. Wake up here.

## 435
Reset point. Use for planning, food, exercise, short review, and switching state.

## 119
Focused computer work. Use for code, Cloudflare, D1, deployment, debugging, tests, and anything that can break.

## Hickory
Creative development work. Use for diagrams, system design, language, model definitions, page flow, and project explanation.

---

# Daily Base Rhythm

| Time | Location | Mode | Action |
|---|---|---|---|
| 4:30 | 1143 | wake | Wake up |
| 4:30–5:15 | 1143 → 435 | transition | Walk to 435 |
| 5:15–6:00 | 435 | body | Yoga / exercise |
| 6:00–6:45 | 435 | reset | Shower / eat |
| 6:45–7:15 | 435 | planning | Define the day; choose one main result |
| 7:15–9:00 | 119 | build | Morning breakable implementation block |
| 9:00–9:30 | 119 → 435 | reset | Exit and reset after major step |
| 9:30–11:00 | Hickory | design | Creative development / diagrams / definitions |
| 11:00–11:30 | Hickory → 435 | reset | Exit and reset after major step |
| 11:30–1:00 | 119 or Hickory | focused second block | Use 119 for code, Hickory for design |
| 1:00–1:30 | 435 | review | Record result, next action, blockers |
| Day end | 435 | body/reset | Exercise, eat, walk home to sleep |

This is a template. Adjust around obligations, but keep the location logic.

---

# Weekly Result Plan — Current Build Sequence

## Day 1 — Worker Exists

Main result: the real Cloudflare Worker project exists and serves one plain local page.

| Block | Location | Task | Estimate | Success condition |
|---|---|---|---:|---|
| Morning build | 119 | Morning Build Ticket 001 — Worker scaffold | 60–90 min | local Worker page runs |
| Reset | 435 | Record what worked/broke | 10 min | notes captured |
| Design | Hickory | Review public point page flow | 45–60 min | page flow clean enough to code |

## Day 2 — Database Exists

Main result: D1 is bound and local migrations create required tables.

| Block | Location | Task | Estimate | Success condition |
|---|---|---|---:|---|
| Morning build | 119 | Create D1 database + binding | 45–60 min | `POINTS_DB` configured |
| Morning build | 119 | Create/apply initial migration | 60–90 min | tables exist locally |
| Reset | 435 | Record errors/results | 10 min | next exact fix known |

## Day 3 — One Point Exists

Main result: one test point exists in D1 and can be queried.

| Block | Location | Task | Estimate | Success condition |
|---|---|---|---:|---|
| Design | Hickory | Choose first real/test point | 15 min | point facts chosen |
| Build | 119 | Seed point into D1 | 30–45 min | point row exists |
| Build | 119 | Query point from Worker | 45–60 min | Worker can load point |
| Reset | 435 | Record result | 10 min | next route task clear |

## Day 4 — QR Resolves to Point

Main result: `/q/:qrCode` resolves to a point ID.

| Block | Location | Task | Estimate | Success condition |
|---|---|---|---:|---|
| Design | Hickory | Choose QR slug | 10 min | QR slug chosen |
| Build | 119 | Insert QR mapping | 20–30 min | mapping row exists |
| Build | 119 | Implement QR lookup | 60–90 min | QR returns point ID |
| Reset | 435 | Record result | 10 min | page render task clear |

## Day 5 — Point Page Works

Main result: visiting `/q/:qrCode` shows the public point page.

| Block | Location | Task | Estimate | Success condition |
|---|---|---|---:|---|
| Build | 119 | Implement point lookup + page render | 90–120 min | point page appears |
| Reset | 435 | Record result | 10 min | log form task clear |
| Design | Hickory | Review point page language | 30–45 min | page copy acceptable |

## Day 6 — Log Submission Works

Main result: the `log something here` button creates a `point_log` record.

| Block | Location | Task | Estimate | Success condition |
|---|---|---|---:|---|
| Build | 119 | Render log form | 45–60 min | form appears |
| Build | 119 | Handle form submit | 60–90 min | log row saved |
| Reset | 435 | Record result | 10 min | intelligence task clear |

## Day 7 — First Intelligence View

Main result: point logs can be gathered and summarized in a basic view.

| Block | Location | Task | Estimate | Success condition |
|---|---|---|---:|---|
| Design | Hickory | Decide v1 intelligence page shape | 30–45 min | output sections chosen |
| Build | 119 | Query/group logs | 45–60 min | logs grouped |
| Build | 119 | Render simple intelligence view | 60–90 min | current-state view appears |
| Reset | 435 | Record next phase | 10 min | deployment or refinement chosen |

---

# Current Priority

Next work session at **119** should begin with:

**Morning Build Ticket 001 — Worker Scaffold**

Do not re-argue the whole protocol before doing this. Open the work task list, start the ticket, and record only what works or breaks.


---

# Calendar Update — Hickory Silo Design Work

When defining LCP silos, use **Hickory**. This is creative/design work, not breakable implementation.

## Standard Hickory Design Block

| Step | Location | Action |
|---:|---|---|
| 1 | 435 | Reset, eat/drink, choose one design ticket |
| 2 | Hickory | Work one silo definition only |
| 3 | Hickory | Capture purpose, objects, flows, point connections, v1 minimum |
| 4 | 435 | Return, record result, choose next ticket |

## Hickory Design Queue

| Order | Ticket | Work | Estimate | Success condition |
|---:|---|---|---:|---|
| 1 | DESIGN-003 | House Operations Silo | 60–90 min | one-page definition exists |
| 2 | DESIGN-004 | Financial System Silo | 60–90 min | one-page definition exists |
| 3 | DESIGN-005 | Labor Pool Silo | 60–90 min | one-page definition exists |
| 4 | DESIGN-006 | Market / Exchange Silo | 60–90 min | one-page definition exists |
| 5 | DESIGN-007 | EEU / Internal Unit Silo | 60–90 min | one-page definition exists |
| 6 | DESIGN-008 | Intelligence / History Silo | 60–90 min | one-page definition exists |
| 7 | DESIGN-009 | Game Layer | 60–90 min | one-page definition exists |
| 8 | DESIGN-010 | Cross-Silo Wiring Map | 60–90 min | source-of-truth map + next build ticket |

## Current Next Creative Development Block

### DESIGN-003 — House Operations Silo

Place: Hickory

Estimate: 60–90 minutes

Goal: Define the house operations system as the next silo after the point/communication system.

Sequence:
1. Start from 435 reset.
2. Go to Hickory.
3. Define House Operations with one-page silo format.
4. Return to 435.
5. Record result and choose next silo.

Done when:
- House Operations has a clear purpose, core objects, inputs, outputs, point references, and version 1 minimum.

---

# 119 Build Rule

119 is for implementation only: Cloudflare, D1, code, deployment, debugging, tests, and anything that can break.

Current 119 priority remains:

**BUILD-001 — Worker Scaffold**

Do not move a silo to 119 until its Hickory definition is clear enough to create a specific build ticket.


---

# Calendar Update — AI / Local Knowledge Graph

This is Hickory design work until the graph schema is accepted.

## DESIGN-012 Block

| Step | Location | Action | Success condition |
|---:|---|---|---|
| 1 | 435 | Reset and choose one AI question | one question selected |
| 2 | Hickory | Define point-local graph objects | facts/events/edges/context accepted |
| 3 | Hickory | Define first point-specific intelligence flow | v1 flow accepted |
| 4 | 435 | Record result and next 119 build ticket | build ticket clear |

Current AI design result target:

```text
One point can gather local context and answer: what is currently known about this point?
```
