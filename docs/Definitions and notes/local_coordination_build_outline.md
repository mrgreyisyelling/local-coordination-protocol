# Local Coordination Protocol — Build Outline

Purpose: Separate what has been designed from what still needs real implementation. Use this before morning work sessions so coding starts from a small task instead of from the whole project.

---

# Current Rule

Design work can continue during broad thinking sessions.

Breakable implementation work should happen first in the morning, before larger project thinking starts.

Morning work should begin from one short task with a clear expected result.

---

# What We Have Touched

## 1. Point Model
Status: designed, macro code outlined.

A point is the stable object in the system.

Accepted minimum point fields:

- `id`
- `name`
- `type`
- `creator`
- `ownerController`
- `status`
- `description`

Accepted version 1 point types:

- `person`
- `property`
- `room`
- `location`
- `resource`
- `agreement`
- `event`
- `task`
- `payment`
- `document`

Accepted version 1 statuses:

- `draft`
- `active`
- `inactive`
- `disputed`
- `archived`

Code outline: `point_system_macro_codebase.ts`

---

## 2. Cloudflare D1 Storage
Status: designed, macro code outlined.

The point data will be stored in Cloudflare D1 through a Worker binding named `POINTS_DB`.

Accepted `points` table fields:

- `id`
- `name`
- `type`
- `creator`
- `owner_controller`
- `status`
- `description`
- `created_at`
- `updated_at`

Code outline: `point_system_cloudflare_d1_macro.ts`

---

## 3. QR Entrance / QR Mapping
Status: designed, macro code outlined.

A QR code is not the point. A QR code is an entrance, alias, or physical pointer that resolves to a point.

Accepted relationship:

```text
many QR codes → one point
one point → many QR codes
```

Accepted route:

```text
/q/:qrCode
```

Accepted `qr_mappings` table fields:

- `qr_code`
- `point_id`
- `label`
- `status`
- `created_at`
- `updated_at`

Code outline: `point_system_cloudflare_qr_router_macro.ts`

---

## 4. QR Scan / Public Point Page
Status: designed, macro code outlined.

Accepted scan flow:

```text
Person scans QR
  ↓
Worker receives /q/:qrCode
  ↓
Worker resolves QR → point_id
  ↓
Worker loads point from D1
  ↓
Worker checks status
  ↓
Worker serves active point page
```

Accepted minimum active point page content:

- `name`
- `type`
- `description`
- `status`
- `ownerController`
- `log something here` button

Code outline: `point_system_cloudflare_qr_router_macro.ts`

---

## 5. Point Logs / Submitted Data Points
Status: designed, macro code outlined.

When someone submits from a point page, they create a `point_log` record attached to the stable point.

Accepted `point_logs` fields:

- `id`
- `point_id`
- `source_qr_code`
- `submitted_by`
- `log_type`
- `body`
- `status`
- `created_at`
- `updated_at`

Accepted log types:

- `note`
- `problem`
- `update`
- `request`
- `observation`

Code outline: `point_system_point_log_macro.ts`

---

## 6. Point Intelligence Snapshot
Status: designed, macro code outlined.

Point intelligence is the processed understanding of a point based on the base point record plus visible logs.

Accepted snapshot fields:

- `point_id`
- `source_log_count`
- `summary`
- `current_state`
- `open_issues`
- `open_requests`
- `notable_updates`
- `tags`
- `generated_at`

Code outline: `point_system_point_intelligence_macro.ts`

---

# What Needs Building

## Build Layer 1 — Real Project Scaffold
Status: not built.

Needed files:

- `package.json`
- `wrangler.toml`
- `tsconfig.json`
- `src/index.ts`
- `src/types.ts`
- `src/db/schema.sql`
- `src/db/points.ts`
- `src/db/qrMappings.ts`
- `src/views/pointPage.ts`

Goal: Cloudflare Worker project exists and runs locally.

Breakable work: yes.

Morning task candidate: create the scaffold and get `wrangler dev` running.

---

## Build Layer 2 — D1 Migration Files
Status: not built.

Needed real SQL:

- `points` table
- `qr_mappings` table
- `point_logs` table
- `point_intelligence_snapshots` table later
- indexes

Goal: local and remote D1 databases can be created and migrated.

Breakable work: yes.

Morning task candidate: create first migration with only `points` and `qr_mappings`.

---

## Build Layer 3 — First Working Route
Status: not built.

First route target:

```text
GET /q/:qrCode
```

Expected behavior:

```text
/q/test-door
  ↓
looks up qr_mappings.test-door
  ↓
loads mapped point
  ↓
returns simple HTML page
```

Goal: scan route works end-to-end with fake/test data.

Breakable work: yes.

Morning task candidate: implement `/q/:qrCode` with hardcoded response first, then D1 lookup.

---

## Build Layer 4 — Point Creation Path
Status: not built.

Needed action:

- create a point record
- save it in D1
- create a QR mapping record for it

Goal: one real point exists and can be reached through `/q/:qrCode`.

Breakable work: yes.

Morning task candidate: write a tiny seed script or admin-only route that creates one test point and QR mapping.

---

## Build Layer 5 — Log Something Here
Status: not built.

Needed actions:

- render a log form
- submit the form
- validate the submission
- create `point_log`
- redirect or confirm

Goal: visitor can submit a note/problem/update/request/observation attached to the point.

Breakable work: yes.

Morning task candidate: build POST `/points/:pointId/logs` or POST `/q/:qrCode/log` after scan route works.

---

## Build Layer 6 — Intelligence Snapshot
Status: not built.

Needed actions:

- gather logs for a point
- group logs by type
- extract open issues and requests
- generate a simple non-AI summary first
- store snapshot later

Goal: show “what is known about this point.”

Breakable work: yes, but later.

Morning task candidate: not first. Do this after logs exist.

---

# Morning Work Queue

Use this when returning in work mode.

## Morning Task 1
Create the real Cloudflare Worker scaffold.

Done when:

- project files exist
- TypeScript compiles
- `wrangler dev` can serve a simple page

## Morning Task 2
Create the first D1 migration.

Done when:

- `points` table exists
- `qr_mappings` table exists
- local migration applies successfully

## Morning Task 3
Implement `GET /q/:qrCode` with a hardcoded page.

Done when:

- visiting `/q/test-door` returns HTML

## Morning Task 4
Connect `GET /q/:qrCode` to D1.

Done when:

- `/q/test-door` loads a point through `qr_mappings`

## Morning Task 5
Create one seed/test point.

Done when:

- one point exists
- one QR mapping exists
- the QR route displays that point

---

# Current Recommendation

Keep designing now if useful, but do not start fragile implementation late in the session.

The first real morning build task should be:

```text
Create the real Cloudflare Worker scaffold and serve one plain page.
```

Do not start with the whole protocol. Start with the serverless shell.

---

# Added Work Discipline

Design work and build work are now separated.

- Design work happens at Hickory.
- Breakable implementation work happens at 119.
- 435 is the reset point between major steps.

The ordered implementation list now lives in:

- `local_coordination_work_task_list.md`

The location/time plan now lives in:

- `local_coordination_calendar.md`

---

# Work Ticket Structure Accepted

The work task list now uses repeatable tickets with:

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

This separates broad project tracking from executable work.

---

# Larger LCP Operating System — Next Design Layer

The first seed-point loop is technically defined. The next broad LCP layer is the operating map:

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

This is design work and belongs at **Hickory**, not 119.
