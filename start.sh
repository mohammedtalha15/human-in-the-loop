#!/bin/bash

# Haul Spire — Single command server starter
# Runs FastAPI backend on :8000 and Next.js frontend on :3000

echo "🚀 Starting Haul Spire Backend (FastAPI + LangGraph on :8000)..."
cd "$(dirname "$0")/backend"
source .venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "✨ Starting Haul Spire Frontend (Next.js on :3000)..."
cd "../frontend"
npm run dev -- -p 3000 &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "✅ Both servers are running!"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:8000 (Docs: http://localhost:8000/docs)"
echo ""
echo "Press Ctrl+C to stop both servers."

wait
