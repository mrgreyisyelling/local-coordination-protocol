CREATE TABLE IF NOT EXISTS point_addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address_code TEXT NOT NULL UNIQUE,
  point_id INTEGER NOT NULL,
  label TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  FOREIGN KEY (point_id) REFERENCES points(id)
);

CREATE INDEX IF NOT EXISTS idx_point_addresses_point_id
ON point_addresses(point_id);

CREATE INDEX IF NOT EXISTS idx_point_addresses_status
ON point_addresses(status);

INSERT OR IGNORE INTO point_addresses (
  address_code,
  point_id,
  label,
  status,
  created_at
)
SELECT
  marker_code,
  id,
  'Original point address',
  'active',
  created_at
FROM points;
