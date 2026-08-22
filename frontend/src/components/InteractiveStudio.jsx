"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Pencil,
  ExternalLink,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Tag,
  Package,
  Layers,
  ArrowRight,
  RotateCw,
  Clock,
  Activity,
  Sliders,
  Check,
  X,
  Play,
  Pause,
  Save,
} from "lucide-react";

const PRESET_QUERIES = [
  "Trending Smart Home Gadgets",
  "High-Margin MagSafe Accessories",
  "Ergonomic Workspace Essentials",
  "Viral Fitness Tech Products",
];

const TAB_OPTIONS = [
  { id: "research", label: "Product Research", icon: Search },
  { id: "approval", label: "Human Review", icon: ShieldCheck },
  { id: "pricing", label: "Margin & Pricing", icon: TrendingUp },
  { id: "catalog", label: "Verified Catalog", icon: Package },
];

export default function InteractiveStudio({
  logs = [],
  status,
  product,
  finalStatus,
  loading,
  onStartAgent,
  onResumeAgent,
  catalogCount = 0,
}) {
  const [activeTab, setActiveTab] = useState("research");
  const [customQuery, setCustomQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const logScrollRef = useRef(null);

  // Auto switch tab when state changes
  useEffect(() => {
    if (status === "interrupted") {
      setActiveTab("approval");
    } else if (status === "running") {
      setActiveTab("research");
    }
  }, [status]);

  // Auto scroll logs
  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  // Handle edit toggle
  const startEditMode = () => {
    if (!product) return;
    setEditedData({ ...product });
    setIsEditing(true);
  };

  const cancelEditMode = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleFieldChange = (key, value) => {
    setEditedData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "wholesale_cost" || key === "retail_price") {
        const wc = parseFloat(key === "wholesale_cost" ? value : next.wholesale_cost) || 0;
        const rp = parseFloat(key === "retail_price" ? value : next.retail_price) || 1;
        next.margin_pct = rp > 0 ? parseFloat((((rp - wc) / rp) * 100).toFixed(1)) : 0;
      }
      return next;
    });
  };

  const handleSaveEdit = () => {
    onResumeAgent("edit", editedData);
    setIsEditing(false);
  };

  const activeProduct = isEditing ? editedData : product;

  return (
    <section id="studio" className="relative px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Section Header matching Sarvam's editorial font styling */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-4">
            <span>Human-in-the-Loop Studio</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight mb-4">
            The AI Platform Curators Build On
          </h2>
          <p className="text-slate-600 text-base font-light leading-relaxed">
            Direct autonomous agents to scout high-yield e-commerce products, then approve, adjust pricing, or reject in a single unified cockpit.
          </p>
        </div>

        {/* Main Studio Card Container matching Sarvam's playground design */}
        <div className="sarvam-studio-card p-4 sm:p-8">
          {/* Segmented Tab Pill Navigation */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 sm:pb-0 mb-8 gap-2 border-b border-slate-100 sm:border-0">
            <div className="inline-flex p-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 gap-1 sm:gap-2">
              {TAB_OPTIONS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-900" : "text-slate-500"}`} />
                    <span>{tab.label}</span>
                    {tab.id === "approval" && status === "interrupted" && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Split Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ─────── LEFT PANE: Agent Reasoning Stream & Search Trigger (5 cols) ─────── */}
            <div className="lg:col-span-5 flex flex-col justify-between sarvam-subcard p-5 sm:p-6 bg-slate-50/60 border border-slate-200/80">
              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-700" />
                    <span className="font-semibold text-xs tracking-wider uppercase text-slate-700">
                      Reasoning Trace
                    </span>
                  </div>

                  {status === "running" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Agent Active
                    </span>
                  )}
                  {status === "interrupted" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      Awaiting Review
                    </span>
                  )}
                  {status === "completed" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
                      <Check className="w-3 h-3 text-slate-700" />
                      Completed
                    </span>
                  )}
                  {!status && (
                    <span className="text-[11px] font-medium text-slate-600">
                      Standby
                    </span>
                  )}
                </div>

                {/* Custom Query Prompt Input */}
                <div className="mb-4">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Product Research Directive
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="e.g. Find viral electronics with >65% profit margin..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    />
                  </div>

                  {/* Preset prompt pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {PRESET_QUERIES.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setCustomQuery(preset);
                          onStartAgent(preset);
                        }}
                        disabled={loading}
                        className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Log Stream Container */}
                <div
                  ref={logScrollRef}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 h-[300px] overflow-y-auto space-y-2.5 shadow-inner"
                >
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center px-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-600">
                        <Search className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-slate-700">No active research stream</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Launch the agent to observe real-time LangGraph node execution.
                      </p>
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5"
                      >
                        <span className="text-sm flex-shrink-0 mt-0.5">{log.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs text-slate-700 leading-snug"
                            dangerouslySetInnerHTML={{
                              __html: log.message.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-slate-900 font-semibold">$1</strong>'
                              ),
                            }}
                          />
                          <p className="text-[10px] text-slate-600 mt-1 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {/* Thinking Pulse */}
                  {status === "running" && (
                    <div className="flex items-center gap-2 py-2 px-2 text-xs text-slate-500 font-medium">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span>Agent running LangGraph execution node…</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button at bottom of Left Pane */}
              <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center justify-between gap-3">
                <button
                  onClick={() => onStartAgent(customQuery || undefined)}
                  disabled={loading}
                  className="sarvam-btn-primary flex-1 py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{status === "completed" ? "New Product Discovery" : loading ? "Running Agent…" : "Run Research Node"}</span>
                </button>
              </div>
            </div>

            {/* ─────── RIGHT PANE: Human Decision Inspector & Approval Card (7 cols) ─────── */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {/* 1. Interrupted / Pending Human Decision State */}
                {status === "interrupted" && product ? (
                  <motion.div
                    key="interrupted"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                  >
                    <div>
                      {/* Top Header with Amber Pulse Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                          </span>
                          <span className="text-xs font-semibold text-amber-900 tracking-wide uppercase">
                            Pending Human Validation
                          </span>
                        </div>

                        <span className="text-xs text-slate-600 font-mono">
                          interrupt_payload_v1
                        </span>
                      </div>

                      {/* Product Overview Card */}
                      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-200">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 mb-1.5">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <span>{product.category}</span>
                          </div>

                          {isEditing ? (
                            <input
                              type="text"
                              value={editedData.name || ""}
                              onChange={(e) => handleFieldChange("name", e.target.value)}
                              className="w-full font-bold text-base text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1 mb-1 focus:outline-none focus:border-slate-500"
                            />
                          ) : (
                            <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                              {product.name}
                            </h3>
                          )}

                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* 4 Core Financial Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {/* Wholesale Cost */}
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            Wholesale Cost
                          </span>
                          {isEditing ? (
                            <div className="flex items-center">
                              <span className="text-xs text-slate-400 mr-1">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={editedData.wholesale_cost || ""}
                                onChange={(e) => handleFieldChange("wholesale_cost", e.target.value)}
                                className="w-full font-bold text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-base text-slate-900">
                              ${activeProduct.wholesale_cost}
                            </span>
                          )}
                        </div>

                        {/* Retail MSRP */}
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            Target Retail
                          </span>
                          {isEditing ? (
                            <div className="flex items-center">
                              <span className="text-xs text-slate-400 mr-1">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={editedData.retail_price || ""}
                                onChange={(e) => handleFieldChange("retail_price", e.target.value)}
                                className="w-full font-bold text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-base text-slate-900">
                              ${activeProduct.retail_price}
                            </span>
                          )}
                        </div>

                        {/* Profit Margin */}
                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                            Profit Margin
                          </span>
                          <span className="font-bold text-base text-emerald-700">
                            {activeProduct.margin_pct}%
                          </span>
                        </div>

                        {/* Confidence Score */}
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            AI Confidence
                          </span>
                          <span className="font-bold text-base text-slate-900">
                            {Math.round((activeProduct.confidence_score || 0.85) * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Supplier Link */}
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 mb-6">
                        <span className="text-slate-500 font-medium">Verified Supplier:</span>
                        <a
                          href={product.supplier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-slate-900 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{product.supplier_url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Sarvam Action Buttons Row */}
                    <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={loading}
                            className="sarvam-btn-primary flex-1 py-3 px-5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save & Approve Parameters</span>
                          </button>
                          <button
                            onClick={cancelEditMode}
                            className="sarvam-btn-secondary py-3 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Approve (Primary Sarvam Dark Pill) */}
                          <button
                            onClick={() => onResumeAgent("approve")}
                            disabled={loading}
                            className="sarvam-btn-primary flex-1 py-3 px-5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Approve & Save to Catalog</span>
                          </button>

                          {/* Edit (Secondary Outline Pill) */}
                          <button
                            onClick={startEditMode}
                            disabled={loading}
                            className="sarvam-btn-secondary py-3 px-5 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-600" />
                            <span>Edit Parameters</span>
                          </button>

                          {/* Reject (Subtle Rose Pill) */}
                          <button
                            onClick={() => onResumeAgent("reject")}
                            disabled={loading}
                            className="py-3 px-5 rounded-full text-xs font-semibold tracking-wide bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ) : status === "completed" ? (
                  /* 2. Completed State Card */
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-200"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <h3 className="font-serif-display text-2xl font-normal text-slate-900 mb-2">
                      {finalStatus === "approved"
                        ? "Product Successfully Cataloged"
                        : "Decision Processed: Rejected"}
                    </h3>

                    <p className="text-slate-500 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                      {finalStatus === "approved"
                        ? "The product parameters were committed to catalog.db via SQLite checkpointer."
                        : "The research candidate was discarded without cataloging."}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onStartAgent()}
                        className="sarvam-btn-primary py-2.5 px-6 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Discover Next Product</span>
                      </button>

                      <a
                        href="#catalog"
                        className="sarvam-btn-secondary py-2.5 px-5 text-xs font-semibold tracking-wide flex items-center gap-1.5"
                      >
                        <span>View Catalog ({catalogCount})</span>
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  /* 3. Standby / Idle Welcome Studio State */
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-8"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700 mb-4">
                        <span>LangGraph HITL Architecture</span>
                      </div>

                      <h3 className="font-serif-display text-2xl sm:text-3xl font-normal text-slate-900 mb-3">
                        Dynamic Human-in-the-Loop Engine
                      </h3>

                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                        Our LangGraph backend employs <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-[11px]">interrupt()</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-[11px]">AsyncSqliteSaver</code> checkpointers to hold state indefinitely until a human validates or modifies the candidate.
                      </p>

                      {/* 3 Pipeline Step Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            Node 1
                          </span>
                          <h4 className="text-xs font-bold text-slate-800">Scout & Margin</h4>
                          <p className="text-[11px] text-slate-500 mt-1">Autonomous candidate sourcing.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                            Node 2 (Interrupt)
                          </span>
                          <h4 className="text-xs font-bold text-amber-900">Human Approval</h4>
                          <p className="text-[11px] text-amber-700 mt-1">Pauses graph execution.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                            Node 3
                          </span>
                          <h4 className="text-xs font-bold text-emerald-900">Durable Catalog</h4>
                          <p className="text-[11px] text-emerald-700 mt-1">Saves approved parameters.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Ready to scout candidates
                      </span>
                      <button
                        onClick={() => onStartAgent()}
                        disabled={loading}
                        className="sarvam-btn-primary py-2.5 px-6 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Start First Discovery Run</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
