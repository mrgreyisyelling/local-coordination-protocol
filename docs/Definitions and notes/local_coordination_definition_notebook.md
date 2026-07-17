# Local Coordination Protocol — Definition Notebook

This document contains only model definitions, type definitions, and system rules as they are decided. It should be rewritten as the project becomes clearer. Use this document later when creating data structures, schemas, APIs, database tables, or smart-contract models.

---

# 1. Core System Definition

## Local Coordination Protocol
A system for describing and coordinating a real-world local space made of houses, people, rooms, locations, resources, agreements, events, tasks, payments, and documents.

## Point System
Everything in the system is represented as a **point**.

A point is the smallest named object in the system that can receive information, relationships, resources, logs, documents, or updates.

---

# 2. Point Definition

## Point
A point is a system object with a unique ID, a name, a type, a creator, an owner/controller, a status, and a description.

## Minimum Point Fields
Every point must have:

- `id`
- `name`
- `type`
- `creator`
- `ownerController`
- `status`
- `description`

## Smallest Valid Point
A point is valid when it has all minimum fields.

## Point Creation Logic

```text
START
  ↓
Someone creates a point
  ↓
System gives it an ID
  ↓
Creator names it
  ↓
Creator chooses type
  ↓
System records creator
  ↓
Owner/controller is assigned
  ↓
Status is set
  ↓
Description is added
  ↓
Point is saved
  ↓
Other things can attach to it later
```

---

# 3. Version 1 Point Types

These are accepted starting types. They can be defined more specifically later.

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

---

# 4. Field Definitions

## `id`
A unique identifier created by the system.

## `name`
The human-readable name of the point.

## `type`
The kind of point. Version 1 types are listed above.

## `creator`
The person, user, system, or process that created the point.

## `ownerController`
The person, system, or authority that controls the point.

## `status`
The current condition of the point. Version 1 statuses are:

- `draft`
- `active`
- `inactive`
- `disputed`
- `archived`

## `description`
A short plain-language explanation of what the point is.

---

# 5. Version 1 Status Types

Accepted starting statuses:

- `draft` — created but not ready to use as a trusted active object.
- `active` — live and usable in the system.
- `inactive` — real, but not currently being used.
- `disputed` — contested, uncertain, or requiring review.
- `archived` — preserved for history, but no longer active.

---

# 6. Undefined Definitions

These are intentionally not finalized yet.

## Ownership / Control Rules
Not yet defined.

Open questions:

- Does every point need a human owner?
- Can a point own or control another point?
- When does control revert to the central system?
- What happens when the creator is unknown?
- What happens when a point is disputed?

## Visibility / Permission Rules
Not yet defined.

Open questions:

- What is public?
- What is private?
- What is permissioned?
- Who can edit a point?
- Who can attach information to a point?

---

# 7. Macro Function Definitions

These are the system-level functions needed to create a point. They are definitions only, not final code.

## `startPointCreation()`
Begins the process of creating a new point.

## `generatePointId()`
Creates a unique ID for the point.

## `setPointName(point, name)`
Adds or changes the point name.

## `setPointType(point, type)`
Assigns the point type.

## `recordPointCreator(point, creator)`
Records who created the point.

## `assignOwnerController(point, ownerController)`
Assigns who owns or controls the point.

## `setPointStatus(point, status)`
Sets the current point status.

## `setPointDescription(point, description)`
Adds or changes the point description.

## `validatePoint(point)`
Checks whether the point has all minimum fields.

## `savePoint(point)`
Saves the point into the system.

## `attachToPoint(pointId, attachment)`
Allows information, relationships, resources, logs, documents, or updates to be attached later.

---

# 8. Cloudflare D1 Database Definition

The point system will use a Cloudflare D1 database to store point information.

## Database Binding

The Worker environment should expose the point database through a binding named:

- `POINTS_DB`

## Required Version 1 Tables

- `points` — stores the minimum point fields and timestamps.
- `point_attachments` — stores later information attached to a point.
- `schema_versions` — records what database schema version is currently installed.

## Point Record Fields

The database record version of a point should include:

- `id`
- `name`
- `type`
- `creator`
- `owner_controller`
- `status`
- `description`
- `created_at`
- `updated_at`

## Database Setup Logic

```text
START
  ↓
Cloudflare Worker receives env
  ↓
Check for POINTS_DB binding
  ↓
Create or verify required tables
  ↓
Create or verify indexes
  ↓
Record schema version
  ↓
Database is ready to accept point creation
```

## Database Function Groups

- Cloudflare / D1 setup functions
- Migration / schema functions
- Serialization functions
- Point repository functions
- Attachment repository functions
- Point creation flow connected to D1

---

# 9. Active Point Public Page Definition

Version 1 accepts a minimal public point page.

## Active Point Page Shows

- `name`
- `type`
- `description`
- `status`
- `ownerController`
- a `log something here` action/button

## Public Page Rule

When a QR code maps to an active point, the Worker should serve a simple public point page generated from the point record.

The page is a view of the point. It is not the point itself.

---

# 10. QR Scan / Point Content Routing Definition

When a point is active and someone scans a QR code, the request should be handled by a Cloudflare Worker.

## Scan Flow

```text
QR code is scanned
  ↓
Browser requests a Cloudflare Worker URL
  ↓
Worker parses the route
  ↓
Worker identifies the point or marker
  ↓
Worker loads the point from D1
  ↓
Worker checks point status
  ↓
Worker chooses a view
  ↓
Worker resolves content sources
  ↓
Worker returns a response from the edge
```

## Suggested Route Types

- `/p/:pointId` — direct point route.
- `/q/:qrCode` — QR lookup route that maps a physical QR code to a point.
- `/m/:markerCode` — physical marker route for signs, rooms, objects, or field labels.

## Recommended Version 1 Route

Use:

```text
/q/:qrCode
```

This keeps physical QR codes stable even if the underlying point changes later.

## Version 1 Content Delivery

Accepted: the first version uses Worker-generated HTML using point data from D1.

Accepted minimum active point page content:

- point name
- point type
- point description
- point status
- owner/controller
- `log something here` button

## Later Content Sources

A point page can later reference:

- Workers Static Assets for CSS, JavaScript, and images.
- KV for small globally cached content fragments.
- R2 for files, images, PDFs, or larger generated pages.
- external URLs or APIs.
- future point attachments stored in D1.
---

# 11. QR / Marker Definition

## Core Rule

A **point** is the durable system object. A **QR code** is not the point itself. A QR code is a scannable pointer, alias, or marker that resolves to a point.

## QR-to-Point Relationship

Version 1 accepts this rule:

- Many QR codes may resolve to one point.
- One point may have many QR codes.
- A QR code can be moved, replaced, retired, or remapped without deleting the point.
- The point record stays stable while physical markers can change.

## Practical Meaning

The point is the data object. The QR code is the field interface that lets a person reach that data object from the physical world.

Example:

```text
/q/front-door-sticker-a
/q/front-door-sticker-b
/q/inside-door-label
  ↓
point: 815 Prospect Front Door
```

## QR Mapping Fields

A QR mapping should eventually include:

- `qr_code`
- `point_id`
- `label`
- `status`
- `created_at`
- `updated_at`

Optional later fields:

- `physical_location_note`
- `installed_by`
- `installed_at`
- `retired_at`
- `scan_count`

---

# 12. Accepted QR-to-Point Delivery Rule

Version 1 accepts this scan behavior:

```text
Person scans QR code
  ↓
Browser requests /q/:qrCode
  ↓
Worker looks up qrCode in qr_mappings
  ↓
qr_mappings returns point_id
  ↓
Worker loads that point from points table
  ↓
Worker checks point status
  ↓
If active, Worker serves the point page/content
```

Core definition:

```text
QR code = entrance / pointer
Point = stable data object
Point page = content view generated from that point's data
```

---

# 13. Point Log / Data Point Submission Definition

## Core Rule

When someone clicks `log something here` and submits from a point page, they are creating a **data point** attached to that point.

In the database, version 1 should call this record a `point_log` so it does not get confused with the main `point` object.

```text
Point = stable object
Point log = submitted data point attached to that object
```

## Submission Flow

```text
Person arrives at point page
  ↓
Clicks `log something here`
  ↓
Worker serves simple log form
  ↓
Person submits note/update/problem
  ↓
Worker validates submission
  ↓
Worker creates point_log record in D1
  ↓
point_log is attached to point_id
  ↓
Worker returns confirmation or redirects back to point page
```

## Version 1 Point Log Fields

Suggested minimum fields for a submitted data point:

- `id`
- `point_id`
- `source_qr_code`
- `submitted_by`
- `log_type`
- `body`
- `status`
- `created_at`
- `updated_at`

## Version 1 Log Types

Suggested starting log types:

- `note`
- `problem`
- `update`
- `request`
- `observation`

## Version 1 Log Statuses

Suggested starting log statuses:

- `submitted`
- `reviewed`
- `resolved`
- `hidden`
- `archived`

## Important Distinction

A point log is not automatically a full point. It is submitted data attached to a point.

Later, a log can be promoted into its own point if it becomes important enough to track separately.

---

# 14. Point Intelligence Definition

## Core Rule

Point intelligence is the processed understanding of everything known about a point.

Version 1 intelligence should be built from:

- the point record itself
- all visible `point_logs` attached to that point

Later intelligence can also include:

- relationships
- attachments
- documents
- scan history
- permissions
- external references
- other connected points

## Plain-Language Model

```text
Point
  ↓
Gather attached point_logs
  ↓
Sort and filter logs
  ↓
Group by log type
  ↓
Extract issues / requests / updates / observations
  ↓
Summarize current state
  ↓
Create point intelligence snapshot
```

## Important Distinction

A `point_log` is raw submitted data.

A `point_intelligence_snapshot` is processed understanding created from that raw data.

## Version 1 Intelligence Output

A basic point intelligence snapshot should eventually contain:

- `point_id`
- `source_log_count`
- `summary`
- `current_state`
- `open_issues`
- `open_requests`
- `notable_updates`
- `tags`
- `generated_at`

## Version 1 Intelligence Rule

The first intelligence layer should not try to be magical. It should answer:

```text
What is currently known about this point based on its submitted logs?
```

