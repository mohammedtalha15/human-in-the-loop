"""
Haul Spire — Pydantic models and LangGraph state definition.
"""

from __future__ import annotations

from typing import Any, Optional
from typing_extensions import TypedDict

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Core product schema
# ---------------------------------------------------------------------------

class ProductData(BaseModel):
    """Structured product data the AI agent produces for human review."""

    name: str = Field(..., description="Product display name")
    category: str = Field(..., description="Product category (e.g. Electronics, Home & Garden)")
    wholesale_cost: float = Field(..., ge=0, description="Wholesale/supplier cost in USD")
    retail_price: float = Field(..., ge=0, description="Suggested retail price in USD")
    margin_pct: float = Field(..., ge=0, le=100, description="Profit margin percentage")
    supplier_url: str = Field(..., description="Supplier product page URL")
    confidence_score: float = Field(
        ..., ge=0, le=1, description="AI confidence in this product (0-1)"
    )
    image_url: str = Field(default="", description="Product image URL")
    description: str = Field(default="", description="Short product description")


# ---------------------------------------------------------------------------
# LangGraph agent state
# ---------------------------------------------------------------------------

class LogEntry(TypedDict):
    """A single log/reasoning step from the agent."""
    timestamp: str
    icon: str
    message: str


class AgentState(TypedDict, total=False):
    """Full state flowing through the LangGraph."""
    product: Optional[dict]          # ProductData as dict
    logs: list[LogEntry]
    human_decision: Optional[dict]   # {"action": "approve"|"reject"|"edit", "edited_data": {...}}
    final_status: Optional[str]      # "approved" | "rejected" | "error"
    query: Optional[str]             # Optional search query from user


# ---------------------------------------------------------------------------
# API request / response models
# ---------------------------------------------------------------------------

class StartRequest(BaseModel):
    """Body for POST /agent/start."""
    query: str = Field(
        default="Find a trending dropshipping product",
        description="Optional search prompt for the agent",
    )


class ResumeRequest(BaseModel):
    """Body for POST /agent/resume/{thread_id}."""
    action: str = Field(
        ..., description="One of: approve, reject, edit"
    )
    edited_data: Optional[dict[str, Any]] = Field(
        default=None,
        description="If action is 'edit', the modified product fields",
    )


class StatusResponse(BaseModel):
    """Response for GET /agent/status/{thread_id}."""
    thread_id: str
    status: str  # "running" | "interrupted" | "completed" | "error"
    product: Optional[dict[str, Any]] = None
    logs: list[dict[str, Any]] = []
    final_status: Optional[str] = None
