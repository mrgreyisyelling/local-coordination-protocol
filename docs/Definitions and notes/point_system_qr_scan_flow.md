# Local Coordination Protocol — QR Scan / Point Content Flow

This document defines the macro flow for what happens when someone scans a QR code tied to a point.

---

# Current Goal

When a point is active and someone scans its QR code, the system should route the request through a Cloudflare Worker and return the right content for that point.

The first version should stay minimal:

- no standalone server
- no heavy frontend app
- no complicated content management system
- edge-first delivery through Cloudflare
- D1 stores the point record
- the Worker decides what to show
- richer content can be referenced later through Cloudflare bindings or external systems

---

# Basic Scan Flow

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

---

# Suggested Route Types

## `/p/:pointId`
Direct point route.

Use this when the QR code directly contains the point ID.

Example:

```text
/p/pt_123
```

## `/q/:qrCode`
QR lookup route.

Use this when the physical QR code has its own stable code that maps to a point.

This is better long term because the QR sticker can remain the same even if the point changes.

Example:

```text
/q/front-door-815
```

## `/m/:markerCode`
Physical marker route.

Use this for signs, rooms, places, objects, markers, or field labels.

Example:

```text
/m/p-hickory-7g3k9a
```

---

# Point Status Behavior

## `active`
Serve the normal point page.

## `draft`
Do not serve public content yet. Show draft/inactive message or creator view.

## `inactive`
Show inactive message or limited information.

## `disputed`
Show disputed/review message.

## `archived`
Show archived historical view.

---

# Version 1 Content Delivery Choice

Recommended first solution:

```text
Cloudflare Worker generates simple HTML at the edge using the point record from D1.
```

This means a working point page can exist before there is a full frontend app.

Accepted minimum active point page content:

- point name
- point type
- point description
- point status
- owner/controller
- `log something here` button

---

# Later Content Sources

A point page can later include content from:

- Worker-generated HTML
- Workers Static Assets for CSS/JS/images
- KV for small cached content fragments
- R2 for files, images, PDFs, or larger generated pages
- external URLs or APIs
- future attachments stored in D1

---

# First Decision Needed

Choose the first scan route style.

Recommended:

```text
/q/:qrCode maps to a point
```

Reason: this lets physical QR codes stay stable while the underlying point can be changed, redirected, retired, or disputed.
---

# QR Is Not the Point

Decision: a QR code is a pointer, alias, or physical marker. It is not the point itself.

This means:

- one point can have multiple QR codes
- a QR code can move without changing the point
- a QR code can be retired or replaced
- the point data remains stable
- the Worker resolves `/q/:qrCode` into a `point_id` before loading the point

Version 1 should add a QR mapping layer between the scan route and the point table.

```text
/q/:qrCode
  ↓
qr_mappings table
  ↓
point_id
  ↓
points table
  ↓
point page
```

---

# Accepted Version 1 QR Flow

This is the accepted basic flow:

```text
Create point
  ↓
Store point in D1
  ↓
Create QR code entrance
  ↓
Create qr_mappings record
  ↓
QR code maps to point_id
  ↓
Person scans QR
  ↓
Worker serves content for the mapped point
```

In plain language:

> A person scans a QR code and is sent to a page that delivers the point data associated with the point that QR code currently points toward.

The QR code is therefore an entrance to the point, not the point itself.



# Accepted Minimum Public Point Page

Version 1 public point page shows:

- point name
- point type
- point description
- point status
- owner/controller
- `log something here` button

The first page is intentionally plain. It proves the scan-to-point loop works before the system adds permissions, media, attachments, or complex views.

## Current End-to-End Loop

```text
Create point
  ↓
Store point in D1
  ↓
Create QR entrance
  ↓
Map QR to point_id
  ↓
Scan QR
  ↓
Worker resolves point
  ↓
Worker serves active point page
```

---

---

# Accepted First Point Action

The first accepted action on a public active point page is:

```text
log something here
```

This means a visitor can submit a note, problem, update, request, or observation tied to the point they reached.

## Log Submission Flow

```text
Point page
  ↓
Click `log something here`
  ↓
Simple log form opens
  ↓
Visitor writes note/update/problem/request/observation
  ↓
Submit
  ↓
Worker creates point_log record in D1
  ↓
point_log is attached to the current point_id
  ↓
Visitor receives confirmation
```

## Data Meaning

In plain language, the visitor is creating a **data point**.

In the database, this should be called a `point_log` record to avoid confusing it with the stable `points` table.

```text
points table = stable objects
point_logs table = submitted data points attached to stable objects
```
