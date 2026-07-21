CREATE TABLE properties (
    property_id TEXT PRIMARY KEY,
    address TEXT NOT NULL UNIQUE,

    estimated_price_cents INTEGER,

    homeowner_id TEXT,
    mortgage_balance_cents INTEGER NOT NULL DEFAULT 0,

    union_ownership_cents INTEGER NOT NULL DEFAULT 0,
    homeowner_ownership_cents INTEGER NOT NULL DEFAULT 0,
    original_owner_ownership_cents INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);