/**
 * Local Coordination Protocol — Point Knowledge Graph Macro
 *
 * Purpose:
 * Define the macro-level functions for point-specific AI and localized
 * knowledge graphs.
 *
 * Core rule:
 * - The source of truth is the recorded system.
 * - AI reads point records, logs, edges, facts, events, and related records.
 * - A point-local graph creates the context used for point intelligence.
 *
 * Assumed platform:
 * - Cloudflare Worker
 * - Cloudflare D1 binding: POINTS_DB
 * - Optional later: vector index, AI model endpoint, queues, cron refresh
 *
 * This file is intentionally macro-level.
 * Function bodies are not developed yet.
 */

export interface Env {
  POINTS_DB: D1Database;
}

export type PointId = string;
export type RecordId = string;

export type PointFactStatus = "candidate" | "accepted" | "rejected" | "stale" | "archived";

export type PointEdgeStatus = "active" | "disputed" | "archived";

export type PointEdgeType =
  | "HAS_LOG"
  | "HAS_TASK"
  | "HAS_DOCUMENT"
  | "HAS_EVENT"
  | "HAS_ISSUE"
  | "MANAGED_BY"
  | "OCCUPIED_BY"
  | "OWNED_BY"
  | "PAID_BY"
  | "OWES"
  | "RELATES_TO"
  | "BLOCKED_BY"
  | "SUPPORTS"
  | "REPLACES"
  | "CONFLICTS_WITH";

export interface PointFact {
  id: string;
  pointId: PointId;
  factType: string;
  body: string;
  sourceType: string;
  sourceId: RecordId;
  confidence?: number;
  status: PointFactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PointEvent {
  id: string;
  pointId: PointId;
  eventType: string;
  body: string;
  sourceType: string;
  sourceId: RecordId;
  occurredAt: string;
  createdAt: string;
}

export interface PointEdge {
  id: string;
  fromPointId: PointId;
  toPointId: PointId;
  edgeType: PointEdgeType;
  sourceType?: string;
  sourceId?: RecordId;
  status: PointEdgeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PointLocalGraph {
  centerPointId: PointId;
  facts: PointFact[];
  events: PointEvent[];
  edges: PointEdge[];
  relatedPointIds: PointId[];
}

export interface PointContextBundle {
  id: string;
  pointId: PointId;
  query?: string;
  includedRecordCount: number;
  contextJson: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Database schema
// -----------------------------------------------------------------------------

export function getCreatePointFactsTableSql(): string {
  throw new Error("Not implemented: getCreatePointFactsTableSql");
}

export function getCreatePointEventsTableSql(): string {
  throw new Error("Not implemented: getCreatePointEventsTableSql");
}

export function getCreatePointEdgesTableSql(): string {
  throw new Error("Not implemented: getCreatePointEdgesTableSql");
}

export function getCreatePointContextBundlesTableSql(): string {
  throw new Error("Not implemented: getCreatePointContextBundlesTableSql");
}

export async function createPointKnowledgeGraphTables(env: Env): Promise<void> {
  throw new Error("Not implemented: createPointKnowledgeGraphTables");
}

// -----------------------------------------------------------------------------
// Fact / event extraction
// -----------------------------------------------------------------------------

export async function extractFactsFromPointLog(logId: string, env: Env): Promise<PointFact[]> {
  throw new Error("Not implemented: extractFactsFromPointLog");
}

export async function extractEventsFromPointLog(logId: string, env: Env): Promise<PointEvent[]> {
  throw new Error("Not implemented: extractEventsFromPointLog");
}

export async function createEdgesFromPointRecord(pointId: PointId, env: Env): Promise<PointEdge[]> {
  throw new Error("Not implemented: createEdgesFromPointRecord");
}

export async function createEdgesFromPointLog(logId: string, env: Env): Promise<PointEdge[]> {
  throw new Error("Not implemented: createEdgesFromPointLog");
}

// -----------------------------------------------------------------------------
// Repository functions
// -----------------------------------------------------------------------------

export async function insertPointFact(fact: PointFact, env: Env): Promise<void> {
  throw new Error("Not implemented: insertPointFact");
}

export async function insertPointEvent(event: PointEvent, env: Env): Promise<void> {
  throw new Error("Not implemented: insertPointEvent");
}

export async function insertPointEdge(edge: PointEdge, env: Env): Promise<void> {
  throw new Error("Not implemented: insertPointEdge");
}

export async function listPointFacts(pointId: PointId, env: Env): Promise<PointFact[]> {
  throw new Error("Not implemented: listPointFacts");
}

export async function listPointEvents(pointId: PointId, env: Env): Promise<PointEvent[]> {
  throw new Error("Not implemented: listPointEvents");
}

export async function listPointEdges(pointId: PointId, env: Env): Promise<PointEdge[]> {
  throw new Error("Not implemented: listPointEdges");
}

// -----------------------------------------------------------------------------
// Local graph retrieval
// -----------------------------------------------------------------------------

export async function getDirectPointNeighborhood(pointId: PointId, env: Env): Promise<PointId[]> {
  throw new Error("Not implemented: getDirectPointNeighborhood");
}

export async function buildPointLocalGraph(pointId: PointId, env: Env): Promise<PointLocalGraph> {
  throw new Error("Not implemented: buildPointLocalGraph");
}

export async function buildPointContextBundle(
  pointId: PointId,
  query: string | undefined,
  env: Env,
): Promise<PointContextBundle> {
  throw new Error("Not implemented: buildPointContextBundle");
}

// -----------------------------------------------------------------------------
// AI-facing functions
// -----------------------------------------------------------------------------

export async function answerQuestionAboutPoint(
  pointId: PointId,
  question: string,
  env: Env,
): Promise<Response> {
  throw new Error("Not implemented: answerQuestionAboutPoint");
}

export async function summarizePointLocalGraph(pointId: PointId, env: Env): Promise<Response> {
  throw new Error("Not implemented: summarizePointLocalGraph");
}

export async function recommendNextActionsForPoint(pointId: PointId, env: Env): Promise<Response> {
  throw new Error("Not implemented: recommendNextActionsForPoint");
}

// -----------------------------------------------------------------------------
// Main refresh flow
// -----------------------------------------------------------------------------

export async function refreshPointKnowledgeGraph(pointId: PointId, env: Env): Promise<PointLocalGraph> {
  throw new Error("Not implemented: refreshPointKnowledgeGraph");
}
