#!/usr/bin/env python3
"""Import properties from list_of_properties.md into the local SQLite database."""

from datetime import datetime, timezone
from pathlib import Path
import re
import sqlite3


ROOT = Path(__file__).resolve().parent.parent
PROPERTY_LIST = ROOT / "properties"/ "list_of_properties.md"
DATABASE = ROOT / "data" / "market.db"


def slugify(address: str) -> str:
    """Convert an address into the stable identifier used by the file generator."""
    slug = address.lower()
    slug = re.sub(r"\bstreet\b", "", slug)
    slug = re.sub(r"\bavenue\b", "", slug)
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def read_addresses() -> list[str]:
    """Read nonblank, non-heading lines from the property list."""
    addresses = []

    for line in PROPERTY_LIST.read_text(encoding="utf-8").splitlines():
        address = line.strip().lstrip("-* ").strip()
        if address and not address.startswith("#"):
            addresses.append(address)

    return addresses


def main() -> None:
    if not PROPERTY_LIST.exists():
        raise SystemExit(f"Property list not found: {PROPERTY_LIST}")

    if not DATABASE.exists():
        raise SystemExit(
            f"Database not found: {DATABASE}\n"
            "Run migration 001 before importing properties."
        )

    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    inserted = 0
    skipped = 0

    with sqlite3.connect(DATABASE) as connection:
        for address in read_addresses():
            property_id = f"prop-{slugify(address)}"
            cursor = connection.execute(
                """
                INSERT OR IGNORE INTO properties (
                    property_id,
                    address,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?)
                """,
                (property_id, address, now, now),
            )

            if cursor.rowcount == 1:
                print(f"Inserted: {property_id} — {address}")
                inserted += 1
            else:
                print(f"Skipped existing: {property_id} — {address}")
                skipped += 1

    print(f"Done: {inserted} inserted, {skipped} skipped")


if __name__ == "__main__":
    main()
