/**
 * Local Coordination Protocol — QR / Point Traffic Router Macro
 *
 * Purpose:
 * Handle the request flow after someone scans a QR code for an active point.
 *
 * Assumed platform:
 * - Cloudflare Worker
 * - Cloudflare D1 binding: POINTS_DB
 * - Optional Cloudflare Workers Static Assets binding: ASSETS
 * - Optional KV/R2 bindings later for richer content
 *
 * This file is intentionally macro-level.
 * Function bodies are not developed yet.
 */

// -----------------------------------------------------------------------------
// Cloudflare Environment
// -----------------------------------------------------------------------------

export interface Env {
  POINTS_DB: D1Database;

  /** Optional: static CSS/JS/images deployed with the Worker. */
  ASSETS?: Fetcher;

  /** Optional later: globally cached content fragments. */
  CONTENT_KV?: KVNamespace;

  /** Optional later: larger files, images, PDFs, generated pages, exports. */
  CONTENT_BUCKET?: R2Bucket;
}

// -----------------------------------------------------------------------------
// Core Models
// -----------------------------------------------------------------------------

export type PointStatus = "draft" | "active" | "inactive" | "disputed" | "archived";

export type PointType =
  | "person"
  | "property"
  | "room"
  | "location"
  | "resource"
  | "agreement"
  | "event"
  | "task"
  | "payment"
  | "document";

export interface Point {
  id: string;
  name: string;
  type: PointType;
  creator: string;
  ownerController: string;
  status: PointStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ScanReferenceType = "point-id" | "qr-code" | "marker-code" | "unknown";

export interface ScanReference {
  rawPath: string;
  referenceType: ScanReferenceType;
  value: string;
}

export type PointViewMode =
  | "public-point-page"
  | "private-point-page"
  | "creator-dashboard"
  | "maintenance-view"
  | "disputed-view"
  | "archived-view"
  | "not-found-view";

export interface PointViewDecision {
  pointId?: string;
  mode: PointViewMode;
  reason: string;
}

export type ContentSourceType =
  | "edge-generated-html"
  | "worker-static-asset"
  | "kv-content"
  | "r2-object"
  | "external-url"
  | "none";

export interface ContentSource {
  sourceType: ContentSourceType;
  key?: string;
  url?: string;
  contentType?: string;
}

export interface PointPageContext {
  request: Request;
  scanReference: ScanReference;
  point: Point;
  viewDecision: PointViewDecision;
  contentSources: ContentSource[];
}

// -----------------------------------------------------------------------------
// Worker Entry Point
// -----------------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env, ctx);
  },
};

// -----------------------------------------------------------------------------
// Top-Level Request Flow
// -----------------------------------------------------------------------------

export async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  throw new Error("Not implemented: handleRequest");
}

export async function routeRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  throw new Error("Not implemented: routeRequest");
}

// -----------------------------------------------------------------------------
// QR / Point Scan Flow
// -----------------------------------------------------------------------------

export async function handlePointScan(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  throw new Error("Not implemented: handlePointScan");
}

export function parseScanReference(request: Request): ScanReference {
  throw new Error("Not implemented: parseScanReference");
}

export async function resolveScannedReference(
  scanReference: ScanReference,
  env: Env,
): Promise<string | null> {
  throw new Error("Not implemented: resolveScannedReference");
}

export async function getPointForScan(pointId: string, env: Env): Promise<Point | null> {
  throw new Error("Not implemented: getPointForScan");
}

export function checkPointIsServable(point: Point | null): boolean {
  throw new Error("Not implemented: checkPointIsServable");
}

export function decidePointView(point: Point | null, request: Request): PointViewDecision {
  throw new Error("Not implemented: decidePointView");
}

export async function buildPointPageContext(
  request: Request,
  scanReference: ScanReference,
  point: Point,
  viewDecision: PointViewDecision,
  env: Env,
): Promise<PointPageContext> {
  throw new Error("Not implemented: buildPointPageContext");
}

// -----------------------------------------------------------------------------
// Content Resolution
// -----------------------------------------------------------------------------

export async function resolvePointContentSources(
  point: Point,
  viewDecision: PointViewDecision,
  env: Env,
): Promise<ContentSource[]> {
  throw new Error("Not implemented: resolvePointContentSources");
}

export async function fetchContentSource(
  source: ContentSource,
  request: Request,
  env: Env,
): Promise<Response | null> {
  throw new Error("Not implemented: fetchContentSource");
}

export async function fetchWorkerStaticAsset(
  key: string,
  request: Request,
  env: Env,
): Promise<Response | null> {
  throw new Error("Not implemented: fetchWorkerStaticAsset");
}

export async function fetchKvContent(key: string, env: Env): Promise<string | null> {
  throw new Error("Not implemented: fetchKvContent");
}

export async function fetchR2Object(key: string, env: Env): Promise<Response | null> {
  throw new Error("Not implemented: fetchR2Object");
}

export async function fetchExternalContent(url: string): Promise<Response | null> {
  throw new Error("Not implemented: fetchExternalContent");
}

// -----------------------------------------------------------------------------
// Response Rendering
// -----------------------------------------------------------------------------

export async function renderPointResponse(context: PointPageContext): Promise<Response> {
  throw new Error("Not implemented: renderPointResponse");
}

export function renderPublicPointPage(context: PointPageContext): Response {
  throw new Error("Not implemented: renderPublicPointPage");
}

export function renderPrivatePointPage(context: PointPageContext): Response {
  throw new Error("Not implemented: renderPrivatePointPage");
}

export function renderCreatorDashboard(context: PointPageContext): Response {
  throw new Error("Not implemented: renderCreatorDashboard");
}

export function renderMaintenanceView(context: PointPageContext): Response {
  throw new Error("Not implemented: renderMaintenanceView");
}

export function renderDisputedView(point?: Point): Response {
  throw new Error("Not implemented: renderDisputedView");
}

export function renderArchivedView(point?: Point): Response {
  throw new Error("Not implemented: renderArchivedView");
}

export function renderDraftOrInactiveView(point?: Point): Response {
  throw new Error("Not implemented: renderDraftOrInactiveView");
}

export function renderPointNotFound(): Response {
  throw new Error("Not implemented: renderPointNotFound");
}

export function renderBadScanRequest(): Response {
  throw new Error("Not implemented: renderBadScanRequest");
}

// -----------------------------------------------------------------------------
// Optional Later: Logging and Analytics
// -----------------------------------------------------------------------------

export async function logPointScan(
  scanReference: ScanReference,
  point: Point | null,
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  throw new Error("Not implemented: logPointScan");
}

export function getScanMetadata(request: Request): Record<string, string> {
  throw new Error("Not implemented: getScanMetadata");
}

// -----------------------------------------------------------------------------
// Suggested Route Meanings
// -----------------------------------------------------------------------------

/**
 * GET /p/:pointId
 * Direct public point page.
 * Example: /p/pt_123
 */
export async function handleDirectPointRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  throw new Error("Not implemented: handleDirectPointRoute");
}

/**
 * GET /q/:qrCode
 * QR code lookup route.
 * The QR code may map to a point ID, but can be rotated later without changing
 * the underlying point.
 * Example: /q/front-door-815
 */
export async function handleQrCodeRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  throw new Error("Not implemented: handleQrCodeRoute");
}

/**
 * GET /m/:markerCode
 * Physical marker route.
 * Useful for stickers, room labels, signs, and location markers.
 * Example: /m/p-hickory-7g3k9a
 */
export async function handleMarkerCodeRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  throw new Error("Not implemented: handleMarkerCodeRoute");
}

/**
 * GET /assets/*
 * Static assets route, if using Workers Static Assets.
 */
export async function handleAssetRoute(request: Request, env: Env): Promise<Response> {
  throw new Error("Not implemented: handleAssetRoute");
}
