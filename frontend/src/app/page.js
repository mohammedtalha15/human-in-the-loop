"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InteractiveStudio from "@/components/InteractiveStudio";
import ResearchCatalogGrid from "@/components/ResearchCatalogGrid";
import SarvamFooter from "@/components/SarvamFooter";
import { startAgent, getStatus, resumeAgent, getCatalog } from "@/lib/api";

export default function HomePage() {
  const [threadId, setThreadId] = useState(null);
  const [status, setStatus] = useState(null); // "running" | "interrupted" | "completed" | null
  const [product, setProduct] = useState(null);
  const [logs, setLogs] = useState([]);
  const [finalStatus, setFinalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [catalog, setCatalog] = useState([]);

  const pollIntervalRef = useRef(null);

  // Load catalog on mount
  const refreshCatalog = useCallback(async () => {
    try {
      const data = await getCatalog();
      setCatalog(data.products || []);
    } catch (err) {
      console.warn("Catalog fetch error:", err);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  // Polling controller
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (tid) => {
      stopPolling();
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await getStatus(tid);
          setLogs(res.logs || []);
          setProduct(res.product);
          setStatus(res.status);
          setFinalStatus(res.final_status);

          if (res.status === "interrupted" || res.status === "completed") {
            stopPolling();
            if (res.status === "completed") {
              refreshCatalog();
            }
          }
        } catch (err) {
          console.error("Poll error:", err);
        }
      }, 1200);
    },
    [stopPolling, refreshCatalog]
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // Handle Starting Agent
  const handleStartAgent = useCallback(
    async (query) => {
      setError(null);
      setLoading(true);
      setLogs([]);
      setProduct(null);
      setFinalStatus(null);
      setStatus("running");

      try {
        const startRes = await startAgent(query || "Find a high-performing dropshipping candidate");
        setThreadId(startRes.thread_id);

        // Immediate check
        const statusRes = await getStatus(startRes.thread_id);
        setLogs(statusRes.logs || []);
        setProduct(statusRes.product);
        setStatus(statusRes.status);
        setFinalStatus(statusRes.final_status);

        if (statusRes.status === "running") {
          startPolling(startRes.thread_id);
        } else if (statusRes.status === "completed") {
          refreshCatalog();
        }
      } catch (err) {
        setError(err.message || "Failed to start agent");
        setStatus(null);
      } finally {
        setLoading(false);
      }
    },
    [startPolling, refreshCatalog]
  );

  // Handle Resuming Agent (Approve / Edit / Reject)
  const handleResumeAgent = useCallback(
    async (action, editedData = null) => {
      if (!threadId) return;
      setLoading(true);
      setError(null);

      try {
        const resumeRes = await resumeAgent(threadId, action, editedData);
        setLogs(resumeRes.logs || []);
        setFinalStatus(resumeRes.final_status);
        setStatus("completed");
        setProduct(null);
        refreshCatalog();
      } catch (err) {
        setError(err.message || "Failed to submit decision");
      } finally {
        setLoading(false);
      }
    },
    [threadId, refreshCatalog]
  );

  return (
    <div className="relative min-h-screen bg-[#F8F9FB] flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      <div>
        {/* Floating Navbar */}
        <Navbar
          onStartAgent={() => handleStartAgent()}
          isRunning={status === "running" || loading}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mb-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-rose-500 hover:text-rose-700 text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Sarvam.ai Deep Hero Section */}
        <HeroSection
          onStartAgent={() => handleStartAgent()}
          isRunning={status === "running" || loading}
        />

        {/* Sarvam.ai Interactive Studio (HITL Workspace) */}
        <InteractiveStudio
          logs={logs}
          status={status}
          product={product}
          finalStatus={finalStatus}
          loading={loading}
          onStartAgent={handleStartAgent}
          onResumeAgent={handleResumeAgent}
          catalogCount={catalog.length}
        />

        {/* Verified Research Catalog Grid */}
        <ResearchCatalogGrid products={catalog} />
      </div>

      {/* Sarvam.ai Minimalist Clean Footer */}
      <SarvamFooter />
    </div>
  );
}
