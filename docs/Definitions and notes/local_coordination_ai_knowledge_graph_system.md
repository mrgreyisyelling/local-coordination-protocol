# Local Coordination Protocol — AI / Local Knowledge Graph System

Purpose: define the AI/intelligence system as its own LCP project track.

Core rule: AI is not the source of truth. The source of truth is the recorded system: points, logs, relationships, tasks, documents, money records, operations records, and human decisions. AI reads those records and turns them into context, summaries, questions, recommendations, and point-specific intelligence.

---

# 1. Plain-Language Definition

The AI system creates **point-specific intelligence**.

A point-specific intelligence system takes the records around a point — its base record, logs, tasks, documents, relationships, money records, and history — and builds a local understanding of that point.

In plain language:

```text
Each important thing gets a local memory.
That memory grows from what happens around it.
AI uses that memory to answer: what is this, what happened here, what matters now, and what should happen next?
```

---

# 2. Important Boundary

Do not start by training a custom model.

Start by building a clean local knowledge system:

```text
records → facts/events → relationships → local graph → retrieved context → AI summary/reasoning
```

The model is “molded” by the point data because the point’s local graph controls the context the model sees.

---

# 3. Core Idea

## Point-local knowledge graph

A point-local knowledge graph is the set of facts, events, and relationships connected to one point.

Example:

```text
Point: 815 Prospect
  ├── has log: “front steps unsafe”
  ├── has task: “repair front steps”
  ├── has document: city notice
  ├── has person: David / buyer / contractor / manager
  ├── has payment: repair budget
  └── has related point: front door / basement / permit case
```

The graph can expand outward:

```text
Point itself
  ↓
Direct logs and relationships
  ↓
Connected people/tasks/documents/payments
  ↓
Nearby or related points
  ↓
System-level pattern
```

---

# 4. Version 1 AI Objects

## `point_fact`
A clean claim or observed fact extracted from raw data.

Example:

```text
Front steps are unsafe.
```

## `point_event`
Something that happened at or about a point.

Example:

```text
A repair request was submitted on July 9.
```

## `point_edge`
A typed relationship between two records or points.

Examples:

```text
point A HAS_TASK task B
person C MANAGES property A
document D SUPPORTS issue E
```

## `point_context_bundle`
The set of records retrieved for an AI response about a point.

## `point_intelligence_snapshot`
A processed summary of what is known about a point at a moment in time.

## `point_agent_profile`
Optional later object describing how a point should speak, answer, prioritize, or behave.

---

# 5. Version 1 Flow

```text
Point receives logs / tasks / documents / relationships
  ↓
System extracts facts and events
  ↓
System creates typed edges
  ↓
System builds point-local graph
  ↓
System retrieves the graph neighborhood for a point
  ↓
AI summarizes current state
  ↓
AI suggests questions / risks / next actions
  ↓
Human reviews or acts
```

---

# 6. What the AI Should Answer First

Version 1 should answer only practical questions:

```text
What is this point?
What happened here?
What is currently known?
What is unresolved?
What tasks or requests are open?
Who or what is connected?
What should I look at next?
```

Do not make it magical yet.

---

# 7. Local Knowledge Graph Tables — Draft

## `point_facts`
- `id`
- `point_id`
- `fact_type`
- `body`
- `source_type`
- `source_id`
- `confidence`
- `status`
- `created_at`
- `updated_at`

## `point_events`
- `id`
- `point_id`
- `event_type`
- `body`
- `source_type`
- `source_id`
- `occurred_at`
- `created_at`

## `point_edges`
- `id`
- `from_point_id`
- `to_point_id`
- `edge_type`
- `source_type`
- `source_id`
- `status`
- `created_at`
- `updated_at`

## `point_context_bundles`
- `id`
- `point_id`
- `query`
- `included_record_count`
- `context_json`
- `created_at`

---

# 8. Graph Edge Types — Draft

Starting edge types:

- `HAS_LOG`
- `HAS_TASK`
- `HAS_DOCUMENT`
- `HAS_EVENT`
- `HAS_ISSUE`
- `MANAGED_BY`
- `OCCUPIED_BY`
- `OWNED_BY`
- `PAID_BY`
- `OWES`
- `RELATES_TO`
- `BLOCKED_BY`
- `SUPPORTS`
- `REPLACES`
- `CONFLICTS_WITH`

These can be cleaned later.

---

# 9. AI Project Units

## AI-001 — Point Context Builder
Build the system that gathers all records connected to one point.

## AI-002 — Fact/Event Extraction
Turn raw logs and records into clean facts and events.

## AI-003 — Point Edge Builder
Create typed relationships between points and records.

## AI-004 — Local Knowledge Graph
Build the point-local graph and neighborhood retrieval.

## AI-005 — Point Intelligence Snapshot
Summarize current state, open issues, open requests, notable updates, and tags.

## AI-006 — Point Question Answering
Answer practical questions about a point using retrieved local context.

## AI-007 — Cross-Point Reasoning
Compare related points and detect patterns across houses, rooms, people, tasks, and money.

## AI-008 — Point-to-Point Communication
Let one point surface relevant information to another point through typed relationships and summarized context.

---

# 10. Version 1 Minimum

The smallest useful version is:

```text
For one active point:
- gather its point record
- gather its point_logs
- extract simple facts/events manually or with a simple parser
- create a few typed edges
- generate a current-state summary
- show open issues and next actions
```

This should happen before vector databases, fine-tuning, autonomous agents, or complex model orchestration.

---

# 11. Hickory Design Ticket

## DESIGN-012 — AI / Local Knowledge Graph System

Place: Hickory

Estimate: 60–90 minutes

Goal: define the point-specific AI system that creates local knowledge graphs around points.

Done when:
- the local graph object list is accepted
- the first graph edge types are accepted
- the first point-specific intelligence flow is accepted
- the first 119 build ticket is clear

---

# 12. 119 Build Candidate

## BUILD-AI-001 — Create point graph tables

Place: 119

Estimate: 90–120 minutes

Goal: create the first D1 tables for `point_facts`, `point_events`, and `point_edges`.

Do not start until DESIGN-012 is accepted.
