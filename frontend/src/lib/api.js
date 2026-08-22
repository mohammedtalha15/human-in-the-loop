/**
 * Haul Spire — API client for Next.js frontend
 * Communicates with FastAPI LangGraph backend at http://localhost:8000
 */

const BASE_URL = "http://localhost:8000";

/**
 * Start a new agent research run.
 * @param {string} query
 * @returns {Promise<{ thread_id: string, status: string }>}
 */
export async function startAgent(query = "Find a trending dropshipping product") {
  const res = await fetch(`${BASE_URL}/agent/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Start agent failed: ${res.status}`);
  return res.json();
}

/**
 * Poll the agent's current state.
 * @param {string} threadId
 * @returns {Promise<{ thread_id: string, status: string, product: object|null, logs: array, final_status: string|null }>}
 */
export async function getStatus(threadId) {
  const res = await fetch(`${BASE_URL}/agent/status/${threadId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Fetch status failed: ${res.status}`);
  return res.json();
}

/**
 * Resume the interrupted agent with a human decision.
 * @param {string} threadId
 * @param {"approve"|"reject"|"edit"} action
 * @param {object|null} editedData
 * @returns {Promise<{ thread_id: string, status: string, final_status: string, logs: array }>}
 */
export async function resumeAgent(threadId, action, editedData = null) {
  const body = { action };
  if (action === "edit" && editedData) {
    body.edited_data = editedData;
  }
  const res = await fetch(`${BASE_URL}/agent/resume/${threadId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Resume agent failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch all approved products from the catalog.
 * @returns {Promise<{ products: array }>}
 */
export async function getCatalog() {
  const res = await fetch(`${BASE_URL}/catalog`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Fetch catalog failed: ${res.status}`);
  return res.json();
}
