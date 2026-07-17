import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Hello World worker", () => {
	it("responds with Hello World! (unit style)", async () => {
		const request = new Request("http://example.com");
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`
			"
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
			  "
		`);
	});

	it("responds with Hello World! (integration style)", async () => {
		const response = await SELF.fetch("http://example.com");
		expect(await response.text()).toMatchInlineSnapshot(`
			"
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
			  "
		`);
	});
});
