CREATE TABLE IF NOT EXISTS point_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_point_id INTEGER NOT NULL,
  to_point_id INTEGER NOT NULL,
  relationship_type TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);
