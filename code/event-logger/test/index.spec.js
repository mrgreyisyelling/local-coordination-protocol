import { env, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS points (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, point_type TEXT NOT NULL, marker_code TEXT NOT NULL UNIQUE, trust_code TEXT NOT NULL, status TEXT NOT NULL, description TEXT, created_at TEXT NOT NULL, point_location TEXT, gps_latitude REAL, gps_longitude REAL, gps_accuracy REAL, gps_timestamp TEXT, picture_url TEXT)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS point_links (id INTEGER PRIMARY KEY AUTOINCREMENT, from_point_id INTEGER NOT NULL, to_point_id INTEGER NOT NULL, relationship_type TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL)").run();
});

describe("Build 1 - Create a Point", () => {
  it("creates a point, persists it in D1, and renders its public marker page", async () => {
    const createResponse = await SELF.fetch("http://example.com/api/points", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        label: "Dingo 1",
        point_location: "119 Mifflin",
        point_type: "house",
        status: "draft",
        description: "The office at 119 Mifflin",
      }),
    });

    expect(createResponse.status).toBe(200);

    const created = await createResponse.json();

    expect(created).toMatchObject({
      ok: true,
      label: "Dingo 1",
      point_location: "119 Mifflin",
      point_type: "house",
      status: "draft",
      description: "The office at 119 Mifflin",
    });

    expect(created.marker_code).toMatch(/^p-dingo-1-[a-f0-9]{8}$/);
    expect(created.trust_code).toMatch(/^[A-Z0-9]{6}$/);

    const stored = await env.DB
      .prepare(`
        SELECT label, point_location, point_type,
               marker_code, status, description
        FROM points
        WHERE marker_code = ?
      `)
      .bind(created.marker_code)
      .first();

    expect(stored).toEqual({
      label: "Dingo 1",
      point_location: "119 Mifflin",
      point_type: "house",
      marker_code: created.marker_code,
      status: "draft",
      description: "The office at 119 Mifflin",
    });

    const markerResponse = await SELF.fetch(
      `http://example.com/m/${created.marker_code}`
    );

    expect(markerResponse.status).toBe(200);
    expect(markerResponse.headers.get("content-type")).toContain("text/html");

    const markerPage = await markerResponse.text();

    expect(markerPage).toContain("<h1>Dingo 1</h1>");
    expect(markerPage).toContain("The office at 119 Mifflin");
    expect(markerPage).toContain("<strong>Type:</strong> house");
    expect(markerPage).toContain("<strong>Status:</strong> draft");
  });

  it("returns 404 for an unknown marker code", async () => {
    const response = await SELF.fetch(
      "http://example.com/m/not-a-real-point"
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Point not found");
  });
});
