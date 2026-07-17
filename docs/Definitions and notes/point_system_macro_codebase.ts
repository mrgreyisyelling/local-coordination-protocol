// Local Coordination Protocol — Point System Macro Codebase
// Purpose: macro view only. Functions are intentionally not implemented yet.

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

// Status values are not finalized yet.
export type PointStatus = string;

export type PointId = string;
export type ActorId = string;

export interface Point {
  id: PointId;
  name: string;
  type: PointType;
  creator: ActorId;
  ownerController: ActorId;
  status: PointStatus;
  description: string;
}

export interface NewPointInput {
  name: string;
  type: PointType;
  creator: ActorId;
  ownerController?: ActorId;
  status?: PointStatus;
  description: string;
}

export interface Attachment {
  pointId: PointId;
  attachmentType: string;
  data: unknown;
  createdBy: ActorId;
}

// 1. Begin creation.
export function startPointCreation(input: NewPointInput): Point {
  throw new Error("Not implemented yet");
}

// 2. Generate unique system ID.
export function generatePointId(): PointId {
  throw new Error("Not implemented yet");
}

// 3. Set name.
export function setPointName(point: Point, name: string): Point {
  throw new Error("Not implemented yet");
}

// 4. Set type.
export function setPointType(point: Point, type: PointType): Point {
  throw new Error("Not implemented yet");
}

// 5. Record creator.
export function recordPointCreator(point: Point, creator: ActorId): Point {
  throw new Error("Not implemented yet");
}

// 6. Assign owner/controller.
export function assignOwnerController(point: Point, ownerController: ActorId): Point {
  throw new Error("Not implemented yet");
}

// 7. Set status.
export function setPointStatus(point: Point, status: PointStatus): Point {
  throw new Error("Not implemented yet");
}

// 8. Set description.
export function setPointDescription(point: Point, description: string): Point {
  throw new Error("Not implemented yet");
}

// 9. Validate minimum fields.
export function validatePoint(point: Point): boolean {
  throw new Error("Not implemented yet");
}

// 10. Save point.
export function savePoint(point: Point): Promise<Point> {
  throw new Error("Not implemented yet");
}

// 11. Fetch point.
export function getPoint(pointId: PointId): Promise<Point | null> {
  throw new Error("Not implemented yet");
}

// 12. List points.
export function listPoints(filters?: Partial<Point>): Promise<Point[]> {
  throw new Error("Not implemented yet");
}

// 13. Update point.
export function updatePoint(pointId: PointId, changes: Partial<Point>): Promise<Point> {
  throw new Error("Not implemented yet");
}

// 14. Attach later information.
export function attachToPoint(pointId: PointId, attachment: Attachment): Promise<void> {
  throw new Error("Not implemented yet");
}

// Macro flow: create a point through the full required sequence.
export async function createPoint(input: NewPointInput): Promise<Point> {
  throw new Error("Not implemented yet");
}
