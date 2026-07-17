# Local Coordination Protocol — GTD Task Ledger

## Current Working Picture
We are building a local coordination system for a space filled with houses, people, and points.

The first technical foundation is the **point system**:
- Everything in the system is a point.
- People are points.
- Houses/properties are points.
- Locations, data, rooms, resources, and agreements can also be points.
- A point has a unique ID.
- A point may begin undefined, then get assigned information types.
- A point can be owned/controlled by an identified creator, or control can revert to the central system.
- Information and resources can be directed toward a point.

## My Job / AI Job
- Keep the current mental model brief and updated.
- Track projects, tasks, open questions, and decisions.
- Ask for one specific next input at a time.
- Turn the user’s raw explanations into structured work.
- Keep the user focused on completion instead of constantly restarting context.

## User Job
- Provide the actual project facts, decisions, and constraints.
- Focus one area at a time.
- Confirm, reject, or edit the structure.
- Keep updating this ledger as the project becomes clearer.

---

# Projects

## 1. Point System Foundation
Goal: Define what a point is and how points behave.

### Tasks
- [ ] Define the minimum fields every point must have.
- [ ] Define optional fields a point can gain later.
- [ ] Define point types: person, house/property, room, location, resource, agreement, event, task, payment.
- [ ] Define point ownership/control rules.
- [ ] Define how information/resources are directed toward a point.
- [ ] Define what makes a point active, inactive, claimed, unclaimed, trusted, or disputed.
- [ ] Create 3 example points: one person, one house, one room/location.

### Open Questions
- What is the smallest valid point?
- Does a point need a human owner?
- Can a point own or control another point?
- What information is public/private/permissioned?

---

## 2. Map of the Local Space
Goal: Describe the real-world network of houses, people, rooms, and useful locations.

### Tasks
- [ ] List the first properties included in the system.
- [ ] List the first people included in the system.
- [ ] List rooms/spaces inside each property.
- [ ] List important non-house locations.
- [ ] Define what relationships matter between these points.

---

## 3. Relationship Model
Goal: Define how points connect to other points.

### Tasks
- [ ] Define relationship types: owns, occupies, manages, uses, pays, owes, maintains, improves, visits, stores, supports.
- [ ] Define whether relationships have start/end dates.
- [ ] Define whether relationships need proof/documents.
- [ ] Create example relationships between one person and one house.

---

## 4. Data / Schema Design
Goal: Turn the point system into a clean digital model.

### Tasks
- [ ] Draft plain-English schema for points.
- [ ] Draft plain-English schema for relationships.
- [ ] Draft plain-English schema for events/logs.
- [ ] Draft plain-English schema for agreements/payments.
- [ ] Convert schemas into technical tables or objects later.

---

## 5. Working Prototype
Goal: Build a simple usable version before over-designing.

### Tasks
- [ ] Decide first build environment.
- [ ] Create point creation flow.
- [ ] Create point list/view page.
- [ ] Create relationship creation flow.
- [ ] Create basic event log tied to points.
- [ ] Create export/import backup.

---

## 6. Project Brief for Jeff / Outside Reviewer
Goal: Make the system understandable to a technical mentor/reviewer.

### Tasks
- [ ] Write one-page explanation of the project.
- [ ] Write one-page explanation of the point system.
- [ ] Prepare 3 diagrams: space, point model, relationship model.
- [ ] Prepare 5 mentor questions.
- [ ] Identify what feedback is needed from Jeff.

---

# Next Action Queue

1. [ ] Create a ChatGPT Project named **Local Coordination Protocol**.
2. [ ] Add this file to that project as the running task ledger.
3. [ ] Confirm the first build focus: **Point System Foundation**.
4. [ ] Answer this next question: **What are the minimum fields every point must have?**

---

# Decision Log

- Decision: Everything in the system will be modeled as a point.
- Decision: People and houses are both point types.
- Decision: Work starts with the point system foundation.

---

# Session Log

## Session 1
Starting board defines the project as a space filled with houses, people, and points. The immediate task is to create the point-system foundation and begin GTD-style task tracking.

---

## Session Update — Design / Build Boundary

Decision: work is now split into two modes.

- Design mode: continue defining the system, flows, models, and documents.
- Build mode: first thing in the morning, do one short breakable implementation task without rethinking the whole project.

The next real implementation target is not intelligence or relationships. It is the smallest Cloudflare Worker scaffold that can serve one page.

### Morning Build Queue

1. [ ] Create real Cloudflare Worker scaffold.
2. [ ] Get `wrangler dev` serving one plain page.
3. [ ] Create first D1 migration for `points` and `qr_mappings`.
4. [ ] Implement `GET /q/:qrCode` with hardcoded HTML.
5. [ ] Connect `/q/:qrCode` to D1 lookup.
6. [ ] Seed one test point and one QR mapping.

### Current Next Action

Before continuing deeper design, maintain the outline of:

- what has been touched
- what has code outlines
- what still needs building
- which tasks should be saved for morning implementation

---

# Session Update — Work Ticket Structure

Decision: the work task list is distinct from the GTD ledger.

Accepted work ticket fields:

- Task ID
- Name
- Phase
- Place
- Estimate
- Goal
- Inputs needed
- Steps
- Done when
- Next reset
- Status
- Result notes

Decision: 119 is for breakable computer implementation. Hickory is for creative development and system design. 435 is the reset point after major work steps.

---

# Session Update — Larger LCP Operating Map

The seed-point technical loop is defined enough to pause. The next design layer is to identify the larger operating points that the LCP must manage:

- houses / properties
- rooms / spaces
- people
- tasks / work orders
- calendar / events
- money flows
- agreements
- documents / proof
- resources / assets
- logs / intelligence

Next design question: choose the first three real-world operating points to model after the seed point.
