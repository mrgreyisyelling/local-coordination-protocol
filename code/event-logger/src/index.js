export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/test") {
  return new Response("TEST ROUTE WORKS");
    }
    if (url.pathname === "/") {
      return getPointDirectoryPage(env);
    }

    if (url.pathname === "/api/log" && request.method === "POST") {
      return handleCreateLog(request, env);
    }

    if (url.pathname === "/api/logs" && request.method === "GET") {
      return handleGetLogs(request, env);;
    }
if (
  url.pathname === "/admin/points/new" &&
  request.method === "GET"
) {
  return new Response(getNewPointPage(), {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

if (
  url.pathname === "/api/points" &&
  request.method === "POST"
) {
  return createPoint(request, env);
}
if (
  url.pathname === "/api/point-addresses" &&
  request.method === "POST"
) {
  return createPointAddress(request, env);
}
    if (
      url.pathname.startsWith("/m/") &&
      request.method === "GET"
    ) {
      return handlePointPage(request, env);
    }

if (
  url.pathname.startsWith("/api/points/") &&
  url.pathname.endsWith("/log") &&
  request.method === "POST"
) {
  return createPointLog(request, env);
}

if (
  url.pathname.startsWith("/api/points/") &&
  url.pathname.endsWith("/logs") &&
  request.method === "GET"
) {
  return getPointLogs(request, env);
}

if (
  url.pathname === "/admin/point-links/new" &&
  request.method === "GET"
) {
  return getPointLinkPage(env);
}

if (
  url.pathname === "/api/point-links" &&
  request.method === "POST"
) {
  return createPointLink(request, env);
}

if (
  url.pathname === "/admin" &&
  request.method === "GET"
) {
  return getAdminIndexPage();
}

if (url.pathname === "/admin/points" && request.method === "GET") {
  return getPointsAdminPage(env);
}

        return new Response("Not found", { status: 404 });
  }
};

function isAuthorized(request, env) {
  const providedSecret = request.headers.get("x-log-secret");
  return providedSecret && env.LOG_SECRET && providedSecret === env.LOG_SECRET;
}



async function getPointsAdminPage(env) {
  const points = await getAllPoints(env);

  const rows = points.map(point => `
    <tr>
      <td>${point.id}</td>
      <td><a href="/m/${point.marker_code}">${point.label}</a></td>
      <td>${point.point_type}</td>
      <td>${point.marker_code}</td>
    </tr>
  `).join("");

  return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>All Points</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>All Points</h1>

  <p><a href="/admin">Admin Home</a></p>
  <p><a href="/admin/points/new">Create New Point</a></p>

  <table border="1" cellpadding="8">
    <thead>
      <tr>
        <th>ID</th>
        <th>Label</th>
        <th>Type</th>
        <th>Marker Code</th>
      </tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="4">No points yet.</td></tr>`}
    </tbody>
  </table>
</body>
</html>
`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}


async function handleCreateLog(request, env) {
  if (!isAuthorized(request, env)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const tag = body.tag || "untagged";
    const note = body.note || "";
    const createdAt = new Date().toISOString();

    await env.DB
      .prepare("INSERT INTO logs (tag, note, created_at) VALUES (?, ?, ?)")
      .bind(tag, note, createdAt)
      .run();

    return Response.json({
      ok: true,
      tag,
      note,
      created_at: createdAt
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

async function handleGetLogs(request, env) {
  if (!isAuthorized(request, env)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await env.DB
    .prepare("SELECT id, tag, note, created_at FROM logs ORDER BY id DESC LIMIT 50")
    .all();

  return Response.json(result.results);
}

async function handlePointPage(request, env) {
  const url = new URL(request.url);

  const markerCode =
    url.pathname.replace("/m/", "");

  const point = await getPointByAddressCode(env, markerCode);

  if (!point) {
    return new Response(
      "Point not found",
      { status: 404 }
    );
  }

const relationships = await getPointRelationships(env, point.id);

return new Response(
  getPointPage(point, relationships),
    {
      headers: {
        "Content-Type":
          "text/html; charset=utf-8"
      }
    }
  );
}

function slugifyLabel(label) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateTrustCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

async function createPoint(request, env) {
  try {
    const body = await request.json();

    const label = body.label || "Unnamed Point";
    const pointLocation = body.point_location || "";
    const gpsLatitude = body.gps_latitude || null;
    const gpsLongitude = body.gps_longitude || null;
    const gpsAccuracy = body.gps_accuracy || null;
    const gpsTimestamp = body.gps_timestamp || null;
    const pictureUrl = body.picture_url || "";
    const pointType = body.point_type || "temporary field marker";
    const status = body.status || "draft";
    const description = body.description || "";

    const baseSlug = slugifyLabel(label) || "point";
    const shortId = crypto.randomUUID().slice(0, 8);

    const markerCode = `p-${baseSlug}-${shortId}`;
    const trustCode = generateTrustCode();
    const createdAt = new Date().toISOString();

    await env.DB
  .prepare(`
    INSERT INTO points (
      label,
      point_location,
      gps_latitude,
      gps_longitude,
      gps_accuracy,
      gps_timestamp,
      picture_url,
      point_type,
      marker_code,
      trust_code,
      status,
      description,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
      .bind(
        label,
        pointLocation,
        gpsLatitude,
        gpsLongitude,
        gpsAccuracy,
        gpsTimestamp,
        pictureUrl,
        pointType,
        markerCode,
        trustCode,
        status,
        description,
        createdAt
      )
      .run();

    return Response.json({
      ok: true,
      label,
      point_location: pointLocation,
      gps_latitude: gpsLatitude,
      gps_longitude: gpsLongitude,
      gps_accuracy: gpsAccuracy,
      gps_timestamp: gpsTimestamp,
      picture_url: pictureUrl,
      point_type: pointType,
      marker_code: markerCode,
      trust_code: trustCode,
      status,
      description,
      created_at: createdAt
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

async function createPointAddress(request, env) {
  try {
    const body = await request.json();

    const pointId = Number(body.point_id);
    const label = (body.label || "").trim();
    const addressCode = slugifyLabel(body.address_code || label);
    const status = body.status || "active";
    const createdAt = new Date().toISOString();

    if (!pointId) {
      return Response.json(
        { ok: false, error: "point_id is required" },
        { status: 400 }
      );
    }

    if (!addressCode) {
      return Response.json(
        { ok: false, error: "address_code or label is required" },
        { status: 400 }
      );
    }

    const point = await env.DB
      .prepare(`
        SELECT id, label
        FROM points
        WHERE id = ?
      `)
      .bind(pointId)
      .first();

    if (!point) {
      return Response.json(
        { ok: false, error: "Point not found" },
        { status: 404 }
      );
    }

    await env.DB
      .prepare(`
        INSERT INTO point_addresses (
          address_code,
          point_id,
          label,
          status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        addressCode,
        pointId,
        label,
        status,
        createdAt
      )
      .run();

    return Response.json({
      ok: true,
      address_code: addressCode,
      point_id: pointId,
      point_label: point.label,
      label,
      status,
      landing_path: `/m/${addressCode}`,
      created_at: createdAt
    });
  } catch (error) {
    const duplicateAddress =
      error.message && error.message.includes("UNIQUE");

    return Response.json(
      {
        ok: false,
        error: duplicateAddress
          ? "That landing address already exists"
          : error.message
      },
      { status: duplicateAddress ? 409 : 500 }
    );
  }
}

function getNewPointPage() {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Create Point</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.4;
    }

    label {
      display: block;
      font-weight: bold;
      margin-top: 14px;
      margin-bottom: 4px;
    }

    input, select, textarea, button {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      font-size: 16px;
      margin-bottom: 10px;
    }

    textarea {
      min-height: 90px;
    }

    button {
      margin-top: 16px;
      cursor: pointer;
    }

    .gps-box {
      border: 1px solid #ccc;
      padding: 12px;
      margin-top: 12px;
      background: #f7f7f7;
    }
  </style>
</head>

<body>
  <h1>Create Point</h1>

  <label>Label</label>
  <input id="label" placeholder="Office Front Door">

  <label>Point Location</label>
  <input id="pointLocation" placeholder="1143 Shepard - front porch">

  <div class="gps-box">
    <strong>GPS Location</strong>

    <button type="button" onclick="captureGPS()">Capture GPS</button>

    <p>Latitude: <span id="gpsLatitudeText"></span></p>
    <p>Longitude: <span id="gpsLongitudeText"></span></p>
    <p>Accuracy: <span id="gpsAccuracyText"></span></p>
    <p>Timestamp: <span id="gpsTimestampText"></span></p>
  </div>

  <label>Picture of Location</label>
  <input id="pictureUrl" placeholder="Picture URL for now">

  <label>Type</label>
  <select id="pointType">
    <option value="house">House</option>
    <option value="room">Room</option>
    <option value="door">Door</option>
    <option value="lamp post">Lamp Post</option>
    <option value="bulletin board">Bulletin Board</option>
    <option value="tool">Tool</option>
    <option value="path marker">Path Marker</option>
    <option value="property node">Property Node</option>
    <option value="temporary field marker">Temporary Field Marker</option>
  </select>

  <label>Status</label>
  <select id="status">
    <option value="draft">Draft</option>
    <option value="posted">Posted</option>
    <option value="anchored">Anchored</option>
    <option value="verified">Verified</option>
    <option value="suspect">Suspect</option>
    <option value="retired">Retired</option>
  </select>

  <label>Description</label>
  <textarea id="description" placeholder="Describe this point"></textarea>

  <button onclick="createPoint()">Create Point</button>

  <pre id="result"></pre>

  <script>
    let gpsLatitude = null;
    let gpsLongitude = null;
    let gpsAccuracy = null;
    let gpsTimestamp = null;

    function captureGPS() {
      if (!navigator.geolocation) {
        alert("GPS not available on this device.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        function(position) {
          gpsLatitude = position.coords.latitude;
          gpsLongitude = position.coords.longitude;
          gpsAccuracy = position.coords.accuracy;
          gpsTimestamp = new Date(position.timestamp).toISOString();

          document.getElementById("gpsLatitudeText").textContent = gpsLatitude;
          document.getElementById("gpsLongitudeText").textContent = gpsLongitude;
          document.getElementById("gpsAccuracyText").textContent = gpsAccuracy + " meters";
          document.getElementById("gpsTimestampText").textContent = gpsTimestamp;
        },
        function(error) {
          alert("GPS failed: " + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }

    async function createPoint() {
      const response = await fetch("/api/points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          label: document.getElementById("label").value,
          point_location: document.getElementById("pointLocation").value,
          gps_latitude: gpsLatitude,
          gps_longitude: gpsLongitude,
          gps_accuracy: gpsAccuracy,
          gps_timestamp: gpsTimestamp,
          picture_url: document.getElementById("pictureUrl").value,
          point_type: document.getElementById("pointType").value,
          status: document.getElementById("status").value,
          description: document.getElementById("description").value
        })
      });

      const result = await response.json();

      if (!result.ok) {
        document.getElementById("result").textContent =
          "Error: " + result.error;
        return;
      }

      location.href = "/m/" + result.marker_code;
    }
  </script>
</body>
</html>
`;
}

function getPointPage(point, relationships = []) {
  const relationshipHtml = relationships.length
    ? relationships.map(link => {
        const otherLabel =
          link.from_marker_code === point.marker_code
            ? link.to_label
            : link.from_label;

        const otherMarker =
          link.from_marker_code === point.marker_code
            ? link.to_marker_code
            : link.from_marker_code;

        return `
          <li>
            <strong>${link.relationship_type}</strong>:
            <a href="/m/${otherMarker}">${otherLabel}</a>
            ${link.note ? `<br><small>${link.note}</small>` : ""}
          </li>
        `;
      }).join("")
    : "<li>No relationships yet.</li>";

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${point.label}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; line-height: 1.4; }
    h1 { margin-bottom: 4px; }
    input, button { display: block; width: 100%; box-sizing: border-box; padding: 14px; margin-bottom: 10px; font-size: 18px; }
    button { cursor: pointer; }
    .point-location { font-size: 18px; margin-top: 0; }
    .point-meta, .small { color: #555; font-size: 13px; }
    .tag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .tag-grid button { min-height: 70px; font-weight: bold; }
    .log-card { border: 1px solid #ccc; border-radius: 8px; padding: 12px; margin: 10px 0; background: #f8f8f8; }
    details { margin: 24px 0; }
  </style>
</head>
<body>

<h1>${point.label}</h1>
<p class="point-location">${point.point_location || point.description || ""}</p>
<p class="point-meta">Point ID: ${point.id}</p>
<p class="point-meta">Landing address: ${point.resolved_address_code}</p>
<p><a href="/">← All Points</a></p>

<h2>Log Activity</h2>
<input id="noteInput" placeholder="Optional note">

<div class="tag-grid">
  <button onclick="logToPoint('programming')">Programming</button>
  <button onclick="logToPoint('cleaning')">Cleaning</button>
  <button onclick="logToPoint('property')">Property</button>
  <button onclick="logToPoint('repair')">Repair</button>
  <button onclick="logToPoint('communication')">Communication</button>
  <button onclick="logToPoint('photo')">Photo</button>
  <button onclick="logToPoint('break')">Break</button>
  <button onclick="logToPoint('other')">Other</button>
</div>

<button onclick="loadPointLogs()">Refresh Logs</button>
<h2>Activity at this Point</h2>
<div id="logList"></div>

<details>
  <summary>Point information</summary>
  <p><strong>Type:</strong> ${point.point_type}</p>
  <p><strong>Status:</strong> ${point.status}</p>
  <p>${point.description || ""}</p>
  <h3>Relationships</h3>
  <ul>${relationshipHtml}</ul>
</details>

<script>
  const markerCode = "${point.resolved_address_code}";

  async function logToPoint(tag) {
    const note = document.getElementById("noteInput").value;

    const response = await fetch("/api/points/" + markerCode + "/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tag: tag,
        note: note
      })
    });

    const result = await response.json();

    if (!result.ok) {
      alert("Log failed: " + result.error);
      return;
    }

    document.getElementById("noteInput").value = "";
    await loadPointLogs();
  }

  async function loadPointLogs() {
    const response = await fetch("/api/points/" + markerCode + "/logs");
    const result = await response.json();

    const logList = document.getElementById("logList");
    logList.innerHTML = "";

    if (!result.ok) {
      logList.innerHTML = "<p>Could not load logs.</p>";
      return;
    }

    for (const log of result.logs) {
      const card = document.createElement("div");
      card.className = "log-card";

      card.innerHTML = \`
        <strong>\${log.tag}</strong>
        <p>\${log.note || ""}</p>
        <div class="small">\${new Date(log.created_at).toLocaleString()}</div>
        <div class="small">\${log.created_at}</div>
      \`;

      logList.appendChild(card);
    }
  }

  loadPointLogs();
</script>

</body>
</html>
`;
}

async function getPointDirectoryPage(env) {
  const points = await getAllPoints(env);
  const cards = points.map(point => `
    <a class="point-card" href="/m/${point.marker_code}">
      <strong>${point.label}</strong>
      <span>${point.point_location || point.point_type}</span>
    </a>
  `).join("");

  return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Local Points</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; }
    .point-card { display: block; border: 1px solid #ccc; border-radius: 8px; padding: 16px; margin: 12px 0; color: #111; text-decoration: none; }
    .point-card strong, .point-card span { display: block; }
    .point-card span { color: #555; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>Local Points</h1>
  <p>Select a location to view its interface and activity.</p>
  ${cards || "<p>No points have been created yet.</p>"}
  <p><a href="/admin/points/new">Create a Point</a></p>
</body>
</html>
  `, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function getHomePage() {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Event Logger</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.4;
    }

    h1 {
      font-size: 28px;
    }

    input, button {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 14px;
      margin-bottom: 10px;
      font-size: 18px;
    }

    button {
      cursor: pointer;
    }

    .tag-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }

    .tag-grid button {
      min-height: 70px;
      font-weight: bold;
    }

    .log-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      background: #f8f8f8;
    }

    .small {
      font-size: 13px;
      color: #555;
    }
  </style>
</head>
<body>
  <h1>Event Logger</h1>

  <input id="secretInput" type="password" placeholder="Logger secret">
  <button id="saveSecretButton">Save Secret On This Device</button>

  <input id="noteInput" placeholder="Optional note">

  <div class="tag-grid">
    <button onclick="logEvent('programming')">Programming</button>
    <button onclick="logEvent('cleaning')">Cleaning</button>
    <button onclick="logEvent('property')">Property</button>
    <button onclick="logEvent('repair')">Repair</button>
    <button onclick="logEvent('communication')">Communication</button>
    <button onclick="logEvent('photo')">Photo</button>
    <button onclick="logEvent('break')">Break</button>
    <button onclick="logEvent('other')">Other</button>
  </div>

  <button onclick="loadLogs()">Refresh Logs</button>

  <h2>Recent Logs</h2>
  <div id="logList"></div>

  <script>
    const secretInput = document.getElementById("secretInput");
    const noteInput = document.getElementById("noteInput");
    const logList = document.getElementById("logList");
    const saveSecretButton = document.getElementById("saveSecretButton");

    secretInput.value = localStorage.getItem("loggerSecret") || "";

    saveSecretButton.addEventListener("click", function () {
      localStorage.setItem("loggerSecret", secretInput.value);
      alert("Secret saved on this device.");
    });

    function getSecret() {
      return localStorage.getItem("loggerSecret") || secretInput.value;
    }

    async function logEvent(tag) {
      const secret = getSecret();

      if (!secret) {
        alert("Enter your logger secret first.");
        return;
      }

      const note = noteInput.value;

      const response = await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-log-secret": secret
        },
        body: JSON.stringify({
          tag: tag,
          note: note
        })
      });

      const result = await response.json();

      if (!result.ok) {
        alert("Log failed: " + (result.error || "Unknown error"));
        return;
      }

      noteInput.value = "";
      await loadLogs();
    }

    async function loadLogs() {
      const secret = getSecret();

      if (!secret) {
        return;
      }

      const response = await fetch("/api/logs", {
        headers: {
          "x-log-secret": secret
        }
      });

      const logs = await response.json();

      if (!Array.isArray(logs)) {
        logList.innerHTML = "<p>Could not load logs.</p>";
        return;
      }

      logList.innerHTML = "";

      for (const log of logs) {
        const card = document.createElement("div");
        card.className = "log-card";

        const localTime = new Date(log.created_at).toLocaleString();

        card.innerHTML = \`
          <strong>\${log.tag}</strong>
          <p>\${log.note || ""}</p>
          <div class="small">\${localTime}</div>
          <div class="small">\${log.created_at}</div>
        \`;

        logList.appendChild(card);
      }
    }

    loadLogs();
  </script>
</body>
</html>
  `;
}

function getMarkerCodeFromPointApiPath(pathname, ending) {
  return pathname
    .replace("/api/points/", "")
    .replace(ending, "");
}

async function getPointByAddressCode(env, addressCode) {
  return await env.DB
    .prepare(`
      SELECT
        p.*,
        pa.address_code AS resolved_address_code,
        pa.label AS address_label
      FROM point_addresses pa
      JOIN points p
        ON p.id = pa.point_id
      WHERE pa.address_code = ?
        AND pa.status = 'active'
    `)
    .bind(addressCode)
    .first();
}

async function createPointLog(request, env) {
  try {
    const url = new URL(request.url);

    const markerCode = getMarkerCodeFromPointApiPath(
      url.pathname,
      "/log"
    );

    const point = await getPointByAddressCode(env, markerCode);

    if (!point) {
      return Response.json(
        { ok: false, error: "Point not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const tag = body.tag || "note";
    const note = body.note || "";
    const createdAt = new Date().toISOString();

    await env.DB
      .prepare(`
        INSERT INTO point_logs (
          point_id,
          tag,
          note,
          created_at
        )
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        point.id,
        tag,
        note,
        createdAt
      )
      .run();

    return Response.json({
      ok: true,
      point_id: point.id,
      marker_code: markerCode,
      tag,
      note,
      created_at: createdAt
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

async function getPointLogs(request, env) {
  const url = new URL(request.url);

  const markerCode = getMarkerCodeFromPointApiPath(
    url.pathname,
    "/logs"
  );

  const point = await getPointByAddressCode(env, markerCode);

  if (!point) {
    return Response.json(
      { ok: false, error: "Point not found" },
      { status: 404 }
    );
  }

  const result = await env.DB
    .prepare(`
      SELECT id, tag, note, created_at
      FROM point_logs
      WHERE point_id = ?
      ORDER BY id DESC
      LIMIT 50
    `)
    .bind(point.id)
    .all();

  return Response.json({
    ok: true,
    point,
    logs: result.results
  });
}

async function getAllPoints(env) {
  const result = await env.DB
    .prepare(`
      SELECT id, label, marker_code, point_type, point_location
      FROM points
      ORDER BY label ASC
    `)
    .all();

  return result.results;
}

async function getPointLinkPage(env) {
  const points = await getAllPoints(env);

  const options = points.map(point => `
    <option value="${point.id}">
      ${point.label} (${point.point_type}) — ${point.marker_code}
    </option>
  `).join("");

  return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Create Point Link</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Create Point Relationship</h1>

  <label>From Point</label>
  <select id="fromPointId">
    ${options}
  </select>

  <label>Relationship</label>
  <select id="relationshipType">
    <option value="near">near</option>
    <option value="part_of">part_of</option>
    <option value="contains">contains</option>
    <option value="same_location">same_location</option>
    <option value="next_on_path">next_on_path</option>
    <option value="previous_on_path">previous_on_path</option>
    <option value="replaced_by">replaced_by</option>
    <option value="verified_by">verified_by</option>
    <option value="routes_to">routes_to</option>
  </select>

  <label>To Point</label>
  <select id="toPointId">
    ${options}
  </select>

  <label>Note</label>
  <textarea id="note" placeholder="Optional note"></textarea>

  <button onclick="createLink()">Create Link</button>

  <pre id="result"></pre>

  <script>
    async function createLink() {
      const response = await fetch("/api/point-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from_point_id: document.getElementById("fromPointId").value,
          to_point_id: document.getElementById("toPointId").value,
          relationship_type: document.getElementById("relationshipType").value,
          note: document.getElementById("note").value
        })
      });

      const result = await response.json();

      document.getElementById("result").textContent =
        JSON.stringify(result, null, 2);
    }
  </script>
</body>
</html>
`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}

async function createPointLink(request, env) {
  try {
    const body = await request.json();

    const fromPointId = Number(body.from_point_id);
    const toPointId = Number(body.to_point_id);
    const relationshipType = body.relationship_type;
    const note = body.note || "";
    const createdAt = new Date().toISOString();

    if (!fromPointId || !toPointId || !relationshipType) {
      return Response.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (fromPointId === toPointId) {
      return Response.json(
        { ok: false, error: "Cannot link a point to itself" },
        { status: 400 }
      );
    }

    await env.DB
      .prepare(`
        INSERT INTO point_links (
          from_point_id,
          to_point_id,
          relationship_type,
          note,
          created_at
        )
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        fromPointId,
        toPointId,
        relationshipType,
        note,
        createdAt
      )
      .run();

    return Response.json({
      ok: true,
      from_point_id: fromPointId,
      to_point_id: toPointId,
      relationship_type: relationshipType,
      note,
      created_at: createdAt
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

function getAdminIndexPage() {
  return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Point System Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Point System Admin</h1>

  <h2>Main Pages</h2>
  <ul>
  	<li><a href="/admin/points">View All Points</a></li>
    <li><a href="/">Event Logger Home</a></li>
    <li><a href="/admin/points/new">Create Point</a></li>
    <li><a href="/admin/point-links/new">Create Point Relationship</a></li>
  </ul>

  <h2>Known Test Point</h2>
  <ul>
    <li><a href="/m/p-office-front-door">Office Front Door</a></li>
  </ul>

  <h2>API Routes</h2>
  <ul>
    <li>POST /api/points</li>
    <li>POST /api/points/:marker_code/log</li>
    <li>GET /api/points/:marker_code/logs</li>
    <li>POST /api/point-links</li>
    <li>POST /api/log</li>
    <li>GET /api/logs</li>
  </ul>
</body>
</html>
`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}

async function getPointRelationships(env, pointId) {
  const result = await env.DB
    .prepare(`
      SELECT
        pl.id,
        pl.relationship_type,
        pl.note,
        pl.created_at,

        from_point.label AS from_label,
        from_point.marker_code AS from_marker_code,

        to_point.label AS to_label,
        to_point.marker_code AS to_marker_code

      FROM point_links pl
      JOIN points from_point ON pl.from_point_id = from_point.id
      JOIN points to_point ON pl.to_point_id = to_point.id

      WHERE pl.from_point_id = ?
         OR pl.to_point_id = ?

      ORDER BY pl.id DESC
    `)
    .bind(pointId, pointId)
    .all();

  return result.results;
}
