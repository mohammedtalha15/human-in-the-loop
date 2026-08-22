"""
Haul Spire — Catalog database helpers (approved products).

Uses a separate SQLite file (catalog.db) from the LangGraph checkpointer.
"""

from __future__ import annotations

import json
from pathlib import Path

import aiosqlite

DB_PATH = Path(__file__).resolve().parent.parent / "catalog.db"

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS approved_products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    wholesale_cost  REAL NOT NULL,
    retail_price    REAL NOT NULL,
    margin_pct      REAL NOT NULL,
    supplier_url    TEXT NOT NULL,
    confidence_score REAL NOT NULL,
    image_url   TEXT    DEFAULT '',
    description TEXT    DEFAULT '',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


async def init_db() -> None:
    """Create the approved_products table if it doesn't exist."""
    async with aiosqlite.connect(str(DB_PATH)) as db:
        await db.execute(CREATE_TABLE_SQL)
        await db.commit()


async def save_product(product: dict) -> int:
    """Insert a product into the catalog. Returns the new row id."""
    async with aiosqlite.connect(str(DB_PATH)) as db:
        cursor = await db.execute(
            """
            INSERT INTO approved_products
                (name, category, wholesale_cost, retail_price, margin_pct,
                 supplier_url, confidence_score, image_url, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                product["name"],
                product["category"],
                product["wholesale_cost"],
                product["retail_price"],
                product["margin_pct"],
                product["supplier_url"],
                product["confidence_score"],
                product.get("image_url", ""),
                product.get("description", ""),
            ),
        )
        await db.commit()
        return cursor.lastrowid  # type: ignore[return-value]


async def get_products() -> list[dict]:
    """Return all approved products from the catalog."""
    async with aiosqlite.connect(str(DB_PATH)) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM approved_products ORDER BY created_at DESC"
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
