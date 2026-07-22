#!/usr/bin/env python3
"""Generate one Markdown record per address in list_of_properties.md."""

from datetime import date
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent
PROPERTY_LIST = ROOT / "list_of_properties.md"
OUTPUT_DIRECTORY = ROOT / "indivdual_properties"


def slugify(address: str) -> str:
    """Convert an address into a stable filename-safe identifier."""
    slug = address.lower()
    slug = re.sub(r"\bstreet\b", "", slug)
    slug = re.sub(r"\bavenue\b", "", slug)
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def read_addresses() -> list[str]:
    addresses = []

    for line in PROPERTY_LIST.read_text(encoding="utf-8").splitlines():
        address = line.strip().lstrip("-* ").strip()
        if address and not address.startswith("#"):
            addresses.append(address)

    return addresses


def property_record(address: str, slug: str) -> str:
    today = date.today().isoformat()
    return f"""---
property_id: prop-{slug}
name: {address}
street_address: {address}
city: Lansing
state: Michigan
postal_code:
property_type:
status:
ownership_entity:
acquisition_date:
acquisition_price:
current_value:
mortgage_balance:
monthly_payment:
annual_property_tax:
annual_insurance:
created: {today}
updated: {today}
---

# {address}

## Role in the system

## Physical property

## Ownership and debt

## Market history

## Source documents

## Notes
"""


def main() -> None:
    OUTPUT_DIRECTORY.mkdir(exist_ok=True)

    created = 0
    skipped = 0

    for address in read_addresses():
        slug = slugify(address)
        destination = OUTPUT_DIRECTORY / f"{slug}.md"

        if destination.exists():
            print(f"Skipped existing: {destination.name}")
            skipped += 1
            continue

        destination.write_text(property_record(address, slug), encoding="utf-8")
        print(f"Created: {destination.name}")
        created += 1

    print(f"Done: {created} created, {skipped} skipped")


if __name__ == "__main__":
    main()
