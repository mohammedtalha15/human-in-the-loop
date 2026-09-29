"""
Haul Spire — FastAPI application.

Manages the LangGraph lifecycle via a lifespan context manager and exposes
endpoints to start, poll, and resume the agent.
"""

from __future__ import annotations

import uuid
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from langgraph.types import Command

from app.agent import build_graph
from app.database import get_products, init_db
from app.models import ResumeRequest, StartRequest, StatusResponse


# ---------------------------------------------------------------------------
# Application-level state (set during lifespan)
# ---------------------------------------------------------------------------
_graph = None
_checkpointer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Open the checkpointer connection at startup, close on shutdown."""
    global _graph, _checkpointer

    # Initialize the product catalog DB
    await init_db()

    # Create the durable checkpointer (async context manager)
    async with AsyncSqliteSaver.from_conn_string("checkpoints.db") as saver:
        _checkpointer = saver

        # Compile the graph with the checkpointer
        builder = build_graph()
        _graph = builder.compile(checkpointer=_checkpointer)

        yield

        # Cleanup happens automatically when the context manager exits
        _graph = None
        _checkpointer = None


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Haul Spire — HITL Agent API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _config(thread_id: str) -> dict:
    """Build the LangGraph config dict for a given thread."""
    return {"configurable": {"thread_id": thread_id}}


# ---------------------------------------------------------------------------
# POST /agent/start — kick off a new agent run
# ---------------------------------------------------------------------------

@app.post("/agent/start")
async def start_agent(body: StartRequest | None = None):
    """Start a new product research run. Returns the thread_id immediately."""
    if _graph is None:
        raise HTTPException(503, "Agent graph not initialized")

    thread_id = str(uuid.uuid4())
    query = body.query if body else "Find a trending dropshipping product"

    # Run the graph — it will pause at the interrupt() in human_review
    await _graph.ainvoke(
        {"query": query, "logs": [], "product": None, "human_decision": None, "final_status": None},
        config=_config(thread_id),
    )

    return {"thread_id": thread_id, "status": "started"}


# ---------------------------------------------------------------------------
# GET /agent/status/{thread_id} — poll the agent's current state
# ---------------------------------------------------------------------------

@app.get("/agent/status/{thread_id}", response_model=StatusResponse)
async def agent_status(thread_id: str):
    """Check the agent's current state: running, interrupted, or completed."""
    if _graph is None:
        raise HTTPException(503, "Agent graph not initialized")

    config = _config(thread_id)

    try:
        snapshot = await _graph.aget_state(config)
    except Exception as e:
        raise HTTPException(404, f"Thread not found: {e}")

    if snapshot is None or snapshot.values is None:
        raise HTTPException(404, "Thread not found")

    state_values: dict = snapshot.values
    logs = state_values.get("logs", [])
    product = state_values.get("product")
    final_status = state_values.get("final_status")

    # Determine status by inspecting the snapshot
    # If there are pending interrupts → interrupted
    # If next is empty → completed
    # Otherwise → running
    has_interrupts = bool(snapshot.tasks and any(
        hasattr(t, "interrupts") and t.interrupts for t in snapshot.tasks
    ))

    if has_interrupts:
        # Extract the interrupt payload (the product data)
        interrupt_payload = None
        for task in snapshot.tasks:
            if hasattr(task, "interrupts") and task.interrupts:
                interrupt_payload = task.interrupts[0].value
                break
        return StatusResponse(
            thread_id=thread_id,
            status="interrupted",
            product=interrupt_payload if interrupt_payload else product,
            logs=logs,
            final_status=final_status,
        )
    elif not snapshot.next:
        return StatusResponse(
            thread_id=thread_id,
            status="completed",
            product=product,
            logs=logs,
            final_status=final_status,
        )
    else:
        return StatusResponse(
            thread_id=thread_id,
            status="running",
            product=product,
            logs=logs,
            final_status=final_status,
        )


# ---------------------------------------------------------------------------
# POST /agent/resume/{thread_id} — send the human decision back
# ---------------------------------------------------------------------------

@app.post("/agent/resume/{thread_id}")
async def resume_agent(thread_id: str, body: ResumeRequest):
    """Resume the interrupted graph with the human's decision."""
    if _graph is None:
        raise HTTPException(503, "Agent graph not initialized")

    config = _config(thread_id)

    # Validate the thread is actually interrupted
    try:
        snapshot = await _graph.aget_state(config)
    except Exception:
        raise HTTPException(404, "Thread not found")

    has_interrupts = bool(snapshot and snapshot.tasks and any(
        hasattr(t, "interrupts") and t.interrupts for t in snapshot.tasks
    ))
    if not has_interrupts:
        raise HTTPException(400, "Thread is not in an interrupted state")

    # Build the resume payload
    resume_payload = {"action": body.action}
    if body.action == "edit" and body.edited_data:
        resume_payload["edited_data"] = body.edited_data

    # Resume the graph — Command(resume=...) provides the value
    # that interrupt() returns inside human_review node
    await _graph.ainvoke(Command(resume=resume_payload), config=config)

    # Fetch updated state
    snapshot = await _graph.aget_state(config)
    state_values = snapshot.values if snapshot else {}

    return {
        "thread_id": thread_id,
        "status": "completed",
        "final_status": state_values.get("final_status", "unknown"),
        "logs": state_values.get("logs", []),
    }


# ---------------------------------------------------------------------------
# GET /catalog — list all approved products
# ---------------------------------------------------------------------------

@app.get("/catalog")
async def list_catalog():
    """Return all approved products from the catalog database."""
    products = await get_products()
    return {"products": products}
