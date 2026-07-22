export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/test") {
  return new Response("TEST ROUTE WORKS");
  }
    if (url.pathname === "/") {
      return new Response(getHomePage(), {
        headers: {
          "Content-Type": "text/html"
        }
      });
    }

    if (url.pathname === "/api/log" && request.method === "POST") {
      return handleCreateLog(request, env);
    }

    if (url.pathname === "/api/logs" && request.method === "GET") {
      return handleGetLogs(env);
    }

    if (
      url.pathname.startsWith("/m/") &&
      request.method === "GET"
    ) {
      return handlePointPage(request, env);
    }

        return new Response("Not found", { status: 404 });
  }
};

async function handleCreateLog(request, env) {
  try {
    const body = await request.json();

    const tag = body.tag || "untagged";
    const note = body.note || "";
    const createdAt = new Date().toISOString();

    await env.DB
      .prepare(
        "INSERT INTO logs (tag, note, created_at) VALUES (?, ?, ?)"
      )
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
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

async function handleGetLogs(env) {
  const result = await env.DB
    .prepare(
      "SELECT id, tag, note, created_at FROM logs ORDER BY id DESC LIMIT 100"
    )
    .all();

  return Response.json(result.results);
}

async function handlePointPage(request, env) {
  const url = new URL(request.url);

  const markerCode =
    url.pathname.replace("/m/", "");

  const point = await env.DB
    .prepare(`
      SELECT *
      FROM points
      WHERE marker_code = ?
    `)
    .bind(markerCode)
    .first();

  if (!point) {
    return new Response(
      "Point not found",
      { status: 404 }
    );
  }

  return new Response(
    getPointPage(point),
    {
      headers: {
        "Content-Type":
          "text/html; charset=utf-8"
      }
    }
  );
}

function getPointPage(point) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${point.label}</title>
    <meta name="viewport"
          content="width=device-width, initial-scale=1">
  </head>
  <body>

  <h1>${point.label}</h1>

  <p>
  Type:
  ${point.point_type}
  </p>

  <p>
  Status:
  ${point.status}
  </p>

  <p>
  Trust Code:
  ${point.trust_code}
  </p>

  <p>
  ${point.description || ""}
  </p>

  </body>
  </html>
  `;
  }

function getHomePage() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Phone Event Logger</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <h1>Event Logger</h1>

      <button onclick="logEvent('programming')">Programming</button>
      <button onclick="logEvent('cleaning')">Cleaning</button>
      <button onclick="logEvent('property')">Property</button>
      <button onclick="logEvent('repair')">Repair</button>
      <button onclick="logEvent('communication')">Communication</button>
      <button onclick="logEvent('break')">Break</button>

      <input id="note" placeholder="Optional note">

      <script>
        async function logEvent(tag) {
          const note = document.getElementById("note").value;

          const response = await fetch("/api/log", {
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

          alert("Logged: " + tag);

          document.getElementById("note").value = "";
        }
      </script>
    </body>
    </html>
  `;
}