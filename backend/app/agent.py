"""
Haul Spire — LangGraph agent with dynamic interrupt() for human-in-the-loop.

Graph topology:
    START → research_product → human_review → finalize_product → END
"""

from __future__ import annotations

import asyncio
import random
from datetime import datetime, timezone

from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt

from app.database import save_product
from app.models import AgentState, LogEntry, ProductData


# ---------------------------------------------------------------------------
# Mock product templates (simulates AI research)
# ---------------------------------------------------------------------------

_PRODUCT_TEMPLATES = [
    {
        "name": "AeroGlow LED Strip Kit (10m RGBIC)",
        "category": "Electronics",
        "wholesale_cost": 8.50,
        "retail_price": 29.99,
        "supplier_url": "https://supplier-example.com/aeroglow-led",
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400",
        "description": "WiFi-enabled RGBIC LED strips with music sync, 10m length. Trending on TikTok with 2.4M views.",
    },
    {
        "name": "CloudNest Memory Foam Pillow",
        "category": "Home & Garden",
        "wholesale_cost": 6.20,
        "retail_price": 24.99,
        "supplier_url": "https://supplier-example.com/cloudnest-pillow",
        "image_url": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
        "description": "Ergonomic cervical memory foam pillow. 4.7★ avg across 12K reviews. High repeat purchase rate.",
    },
    {
        "name": "SnapCharge MagSafe Power Bank 5000mAh",
        "category": "Electronics",
        "wholesale_cost": 11.30,
        "retail_price": 39.99,
        "supplier_url": "https://supplier-example.com/snapcharge-magsafe",
        "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
        "description": "Ultra-slim magnetic wireless power bank. Compatible with iPhone 13-16 series. Rising search volume +340%.",
    },
    {
        "name": "ZenBrew Portable Pour-Over Coffee Maker",
        "category": "Kitchen",
        "wholesale_cost": 4.80,
        "retail_price": 19.99,
        "supplier_url": "https://supplier-example.com/zenbrew-pourover",
        "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        "description": "Collapsible silicone pour-over dripper with reusable mesh filter. Perfect for travel & camping.",
    },
    {
        "name": "LumiDesk RGB Mouse Pad XL",
        "category": "Gaming",
        "wholesale_cost": 5.90,
        "retail_price": 22.99,
        "supplier_url": "https://supplier-example.com/lumidesk-mousepad",
        "image_url": "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
        "description": "Extended RGB gaming mouse pad (800×300mm) with 14 lighting modes. Non-slip rubber base.",
    },
    {
        "name": "PetPulse Smart Feeder",
        "category": "Pet Supplies",
        "wholesale_cost": 18.40,
        "retail_price": 54.99,
        "supplier_url": "https://supplier-example.com/petpulse-feeder",
        "image_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
        "description": "App-controlled automatic pet feeder with camera & voice recording. 4L capacity. WiFi enabled.",
    },
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _log(icon: str, message: str) -> LogEntry:
    return LogEntry(timestamp=_now(), icon=icon, message=message)


# ---------------------------------------------------------------------------
# Node 1: Research Product (mock AI)
# ---------------------------------------------------------------------------

async def research_product(state: AgentState) -> dict:
    """Simulates an AI agent researching and finding a product."""
    logs: list[LogEntry] = list(state.get("logs", []))

    logs.append(_log("🚀", "Agent started — initializing product research pipeline…"))
    await asyncio.sleep(0.6)

    logs.append(_log("🔍", "Scanning trending product databases and social signals…"))
    await asyncio.sleep(0.8)

    # Pick a random product template
    template = random.choice(_PRODUCT_TEMPLATES)

    logs.append(_log("📦", f"Found candidate: **{template['name']}**"))
    await asyncio.sleep(0.5)

    logs.append(_log("📊", "Analyzing profit margins and supplier reliability…"))
    await asyncio.sleep(0.7)

    # Calculate margin and confidence
    margin = round(
        ((template["retail_price"] - template["wholesale_cost"]) / template["retail_price"]) * 100, 1
    )
    confidence = round(random.uniform(0.72, 0.96), 2)

    product = ProductData(
        name=template["name"],
        category=template["category"],
        wholesale_cost=template["wholesale_cost"],
        retail_price=template["retail_price"],
        margin_pct=margin,
        supplier_url=template["supplier_url"],
        confidence_score=confidence,
        image_url=template.get("image_url", ""),
        description=template.get("description", ""),
    )

    logs.append(
        _log("✅", f"Research complete — margin {margin}%, confidence {confidence}")
    )
    logs.append(_log("⏸️", "Submitting for **human review**…"))

    return {"product": product.model_dump(), "logs": logs}


# ---------------------------------------------------------------------------
# Node 2: Human Review (interrupt)
# ---------------------------------------------------------------------------

async def human_review(state: AgentState) -> dict:
    """Pauses the graph and surfaces the product payload for human approval."""
    product = state["product"]
    logs: list[LogEntry] = list(state.get("logs", []))

    # Dynamic interrupt — surfaces the product data to the caller.
    # The return value of interrupt() is whatever the human sends back
    # via Command(resume=...).
    human_decision = interrupt(product)

    action = human_decision.get("action", "reject")
    logs.append(_log("👤", f"Human decision received: **{action.upper()}**"))

    return {"human_decision": human_decision, "logs": logs}


# ---------------------------------------------------------------------------
# Node 3: Finalize Product
# ---------------------------------------------------------------------------

async def finalize_product(state: AgentState) -> dict:
    """Processes the human decision: save approved/edited product or log rejection."""
    logs: list[LogEntry] = list(state.get("logs", []))
    decision = state.get("human_decision", {})
    action = decision.get("action", "reject")
    product = state.get("product", {})

    if action == "approve":
        await save_product(product)
        logs.append(_log("💾", f"Product **{product.get('name', '')}** saved to catalog!"))
        return {"final_status": "approved", "logs": logs}

    elif action == "edit":
        edited = decision.get("edited_data", {})
        # Merge edits into the product
        merged = {**product, **edited}
        # Recalculate margin if prices changed
        if "wholesale_cost" in edited or "retail_price" in edited:
            wc = float(merged.get("wholesale_cost", 0))
            rp = float(merged.get("retail_price", 1))
            merged["margin_pct"] = round(((rp - wc) / rp) * 100, 1) if rp > 0 else 0
        await save_product(merged)
        logs.append(_log("✏️", f"Product **{merged.get('name', '')}** saved with edits!"))
        return {"product": merged, "final_status": "approved", "logs": logs}

    else:  # reject
        logs.append(_log("❌", f"Product **{product.get('name', '')}** rejected."))
        return {"final_status": "rejected", "logs": logs}


# ---------------------------------------------------------------------------
# Build the graph
# ---------------------------------------------------------------------------

def build_graph() -> StateGraph:
    """Constructs the LangGraph StateGraph (not yet compiled)."""
    builder = StateGraph(AgentState)

    builder.add_node("research_product", research_product)
    builder.add_node("human_review", human_review)
    builder.add_node("finalize_product", finalize_product)

    builder.add_edge(START, "research_product")
    builder.add_edge("research_product", "human_review")
    builder.add_edge("human_review", "finalize_product")
    builder.add_edge("finalize_product", END)

    return builder
