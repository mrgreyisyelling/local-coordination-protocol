# Local Coordination Protocol — Codebase Index

This document tracks the codebases and macro-code files currently being developed for the point system. Keep this document current as files are added, merged, replaced, or turned into real implementation code.

---

# Current Macro Flow

```text
1. Define point model
2. Create point
3. Store point in Cloudflare D1
4. Create QR entrance
5. Map QR entrance to point
6. Scan QR
7. Worker resolves QR → point_id
8. Worker serves public point page
9. Visitor logs something at the point
10. System stores point_log data
11. Intelligence layer processes logs into a snapshot
```

---

# Step Checklist

| Step | System step | Concept defined? | Code outline exists? | Current file | Status |
|---:|---|---|---|---|---|
| 1 | Point model definition | Yes | Yes | `point_system_macro_codebase.ts` | Macro only |
| 2 | Point creation flow | Yes | Yes | `point_system_macro_codebase.ts` | Macro only |
| 3 | Cloudflare D1 point storage | Yes | Yes | `point_system_cloudflare_d1_macro.ts` | Macro only |
| 4 | Points table schema | Yes | Yes | `point_system_cloudflare_d1_macro.ts` | SQL strings outlined |
| 5 | QR entrance / QR mapping | Yes | Yes | `point_system_cloudflare_qr_router_macro.ts` | Macro only |
| 6 | QR scan routing | Yes | Yes | `point_system_cloudflare_qr_router_macro.ts` | Macro only |
| 7 | Public point page | Yes | Yes | `point_system_cloudflare_qr_router_macro.ts` | Macro only |
| 8 | `log something here` action | Yes | Yes | `point_system_point_log_macro.ts` | Macro only |
| 9 | `point_logs` table | Yes | Yes | `point_system_point_log_macro.ts` | SQL strings outlined |
| 10 | Point intelligence snapshot | Yes | Yes | `point_system_point_intelligence_macro.ts` | Macro only |
| 11 | `point_intelligence_snapshots` table | Yes | Yes | `point_system_point_intelligence_macro.ts` | SQL strings outlined |
| 12 | Real Cloudflare Worker app | No | No | not created yet | Next build step |
| 13 | Real D1 migration files | No | No | not created yet | Needed later |
| 14 | Tests | No | No | not created yet | Needed later |
| 15 | Deployment config | No | No | not created yet | Needed later |
| 16 | Point-local knowledge graph | Yes | Yes | `point_system_knowledge_graph_macro.ts` | Macro only |

---

# Current Codebases / Working Files

## 1. `point_system_macro_codebase.ts`
Purpose: core point model and point creation macro flow.

Contains outlines for:

- `Point`
- `NewPointInput`
- `Attachment`
- `startPointCreation()`
- `generatePointId()`
- `setPointName()`
- `setPointType()`
- `recordPointCreator()`
- `assignOwnerController()`
- `setPointStatus()`
- `setPointDescription()`
- `validatePoint()`
- `savePoint()`
- `getPoint()`
- `listPoints()`
- `updatePoint()`
- `attachToPoint()`
- `createPoint()`

Status: macro outline only; not implementation-ready yet.

---

## 2. `point_system_cloudflare_d1_macro.ts`
Purpose: Cloudflare D1 database setup and point storage layer.

Contains outlines for:

- Cloudflare env binding: `POINTS_DB`
- points table schema
- point attachments table schema
- schema version table
- migration/setup functions
- point serialization functions
- point repository functions
- database-backed point creation functions

Status: macro outline only; good enough to become real D1 migration + repository code.

---

## 3. `point_system_cloudflare_qr_router_macro.ts`
Purpose: Cloudflare Worker routing from QR scan to point page.

Contains outlines for:

- Worker `fetch`/request handling
- `/q/:qrCode` route
- `/p/:pointId` route
- `/m/:markerCode` route
- `qr_mappings` table schema
- QR-to-point resolution
- point status behavior
- point page rendering
- content source resolution
- first public action: `log something here`

Status: macro outline only; likely becomes the first real Worker entry point.

---

## 4. `point_system_point_log_macro.ts`
Purpose: submitted data points attached to stable points.

Contains outlines for:

- `PointLog`
- `PointLogSubmissionInput`
- `point_logs` table schema
- log form rendering
- log submission handling
- log validation
- log creation
- log repository functions
- confirmation/redirect flow

Status: macro outline only; likely gets implemented after point creation + QR scan routing works.

---

## 5. `point_system_point_intelligence_macro.ts`
Purpose: gather and process point logs into an intelligence snapshot.

Contains outlines for:

- `PointIntelligenceInput`
- `PointIntelligenceSnapshot`
- `point_intelligence_snapshots` table schema
- gathering point + logs
- sorting/filtering/grouping logs
- extracting issues, requests, and updates
- generating summary/current state/tags
- saving and rendering intelligence snapshots

Status: macro outline only; later layer, not first implementation target.

---


---

## 6. `point_system_knowledge_graph_macro.ts`
Purpose: point-specific AI and local knowledge graph layer.

Contains outlines for:

- `PointFact`
- `PointEvent`
- `PointEdge`
- `PointLocalGraph`
- `PointContextBundle`
- point fact/event/edge tables
- fact and event extraction from point logs
- local graph retrieval
- point context bundle creation
- point-specific question answering
- point-local summary and next-action recommendations

Status: macro outline only; design-first AI layer. Do not implement before the basic point/log loop exists, unless doing isolated prototype work.

# Supporting Definition Files

## `local_coordination_definition_notebook.md`
Purpose: canonical definitions for models, types, statuses, tables, and rules.

Status: keep current. Use this before creating real schemas or API structures.

## `local_coordination_gtd.md`
Purpose: project tracker, task ledger, decision log, and next action queue.

Status: keep current. Use this to prevent restarting context.

## `point_system_qr_scan_flow.md`
Purpose: plain-English QR scan and point-content delivery flow.

Status: accepted outline. Keep it as the readable flow document.

---

# Build Priority

The next real coding step should not be intelligence. The next real coding step should be assembling the smallest Cloudflare Worker project that proves this loop:

```text
create point → save to D1 → create QR mapping → scan /q/:qrCode → serve point page
```

That means the first real implementation target is:

```text
Cloudflare Worker + D1 + /q/:qrCode route + plain HTML point page
```

---

# Immediate Next Code Decision

Choose whether to turn the macro code into a real Cloudflare Worker project now.

If yes, create these real files next:

```text
wrangler.toml
package.json
tsconfig.json
src/index.ts
src/types.ts
src/db/schema.sql
src/db/points.ts
src/db/qrMappings.ts
src/views/pointPage.ts
```

---

# Build Boundary Added

Design work and breakable implementation work are now separated.

## Design Work
Safe to continue during broad project-thinking sessions:

- refine definitions
- outline flows
- diagram systems
- decide table fields
- decide route meanings
- maintain the task ledger

## Breakable Morning Work
Should happen first in a work session, before larger project thinking:

- Cloudflare Worker scaffold
- Wrangler config
- D1 migrations
- route implementation
- database queries
- form submission handling
- deployment
- testing

## First Morning Build Target

```text
Create real Cloudflare Worker scaffold → serve one plain page locally.
```

Supporting file: `local_coordination_build_outline.md`
