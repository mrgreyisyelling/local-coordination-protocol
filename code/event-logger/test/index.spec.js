import { env, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS points (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL, point_type TEXT NOT NULL, marker_code TEXT NOT NULL UNIQUE, trust_code TEXT NOT NULL, status TEXT NOT NULL, description TEXT, created_at TEXT NOT NULL, point_location TEXT, gps_latitude REAL, gps_longitude REAL, gps_accuracy REAL, gps_timestamp TEXT, picture_url TEXT)").run();
    await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS point_addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address_code TEXT NOT NULL UNIQUE,
      point_id INTEGER NOT NULL,
      label TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      FOREIGN KEY (point_id) REFERENCES points(id)
    )
  `).run();
      await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS point_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      point_id INTEGER NOT NULL,
      tag TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (point_id) REFERENCES points(id)
    )
  `).run();
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
        SELECT id, label, point_location, point_type,
               marker_code, status, description
        FROM points
        WHERE marker_code = ?
      `)
      .bind(created.marker_code)
      .first();

    expect(stored).toEqual({
      id: expect.any(Number),
      label: "Dingo 1",
      point_location: "119 Mifflin",
      point_type: "house",
      marker_code: created.marker_code,
      status: "draft",
      description: "The office at 119 Mifflin",
    });
    const addressCode =
      `119-mifflin-front-door-${created.marker_code.slice(-8)}`;

        const addressResponse = await SELF.fetch(
      "http://example.com/api/point-addresses",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          point_id: stored.id,
          address_code: addressCode,
          label: "119 Mifflin front-door QR"
        }),
      }
    );

    expect(addressResponse.status).toBe(200);

    const address = await addressResponse.json();

    expect(address).toMatchObject({
      ok: true,
      address_code: addressCode,
      point_id: stored.id,
      point_label: "Dingo 1",
      landing_path: `/m/${addressCode}`
    });

    const markerResponse = await SELF.fetch(
      `http://example.com/m/${address.address_code}`
    );

    expect(markerResponse.status).toBe(200);
    expect(markerResponse.headers.get("content-type")).toContain("text/html");

    const markerPage = await markerResponse.text();

    expect(markerPage).toContain("<h1>Dingo 1</h1>");
    expect(markerPage).toContain("119 Mifflin");
    expect(markerPage).toContain(`Point ID: ${stored.id}`);
expect(markerPage).toContain(
  `Landing address: ${address.address_code}`);
    expect(markerPage).toContain("The office at 119 Mifflin");
    expect(markerPage).toContain("<strong>Type:</strong> house");
    expect(markerPage).toContain("<strong>Status:</strong> draft");
    expect(markerPage).toContain("Log Activity");
    expect(markerPage).toContain("Programming");
    expect(markerPage).toContain("Activity at this Point");

    const logResponse = await SELF.fetch(
      `http://example.com/api/points/${address.address_code}/log`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tag: "programming", note: "Build 1 test" }),
      }
    );

    expect(logResponse.status).toBe(200);
    expect(await logResponse.json()).toMatchObject({
      ok: true,
      point_id: stored.id,
      marker_code: address.address_code,
      tag: "programming",
      note: "Build 1 test",
    });

    const historyResponse = await SELF.fetch(
      `http://example.com/api/points/${address.address_code}/logs`
    );
    const history = await historyResponse.json();

    expect(history.ok).toBe(true);
    expect(history.logs[0]).toMatchObject({ tag: "programming", note: "Build 1 test" });
  });

  it("lists points by address on the home page", async () => {
        const createResponse = await SELF.fetch(
      "http://example.com/api/points",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          label: "Directory Dingo",
          point_location: "119 Mifflin",
          point_type: "house",
          status: "draft",
          description: "Point created for the directory test"
        }),
      }
    );

    expect(createResponse.status).toBe(200);
    const response = await SELF.fetch("http://example.com/");
    const page = await response.text();

    expect(response.status).toBe(200);
    expect(page).toContain("Local Points");
    expect(page).toContain("Directory Dingo");
    expect(page).toContain("119 Mifflin");
  });

  it("returns 404 for an unknown marker code", async () => {
    const response = await SELF.fetch(
      "http://example.com/m/not-a-real-point"
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Point not found");
  });
});
