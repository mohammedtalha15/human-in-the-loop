# Haul Spire — Human-in-the-Loop (HITL) AI Product Curation

An enterprise-grade, full-stack Human-in-the-Loop (HITL) product curation platform for dropshipping and e-commerce, inspired by **Sarvam.ai's** design language.

## Architecture

- **Backend**: Python 3.13, FastAPI, LangGraph with dynamic `interrupt()`, `AsyncSqliteSaver` durable checkpointer, SQLite (`catalog.db`).
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide React.
- **Design Language**: Replicated from [Sarvam.ai](https://www.sarvam.ai/) (floating pill navbar, oceanic slate hero with dome mesh, 8-pointed star blossom insignia, segmented pill studio tabs, and interactive human review card).

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

FastAPI server runs at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Next.js frontend runs at `http://localhost:3000`.

---

## LangGraph HITL Flow

1. **Node 1 (`research_product`)**: Autonomous AI agent scouts candidate products, calculates wholesale-to-retail margins, and checks confidence scores.
2. **Node 2 (`human_review`)**: Triggers LangGraph's dynamic `interrupt(payload)` to freeze graph execution in `checkpoints.db`.
3. **Node 3 (`finalize_product`)**: Resumes via `Command(resume=payload)` when a human user approves, modifies parameters, or rejects the candidate, persisting verified entries to `catalog.db`.
