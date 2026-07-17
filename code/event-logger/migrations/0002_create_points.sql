CREATE TABLE IF NOT EXISTS points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  point_type TEXT NOT NULL,
  marker_code TEXT NOT NULL UNIQUE,
  trust_code TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS point_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO points (
  label,
  point_type,
  marker_code,
  trust_code,
  status,
  description,
  created_at
)
VALUES (
  'Office Front Door',
  'door',
  'p-office-front-door',
  'ABC123',
  'posted',
  'First test point',
  datetime('now')
);
