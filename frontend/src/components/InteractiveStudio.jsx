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
  Calculator,
  ArrowUpRight,
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

  // Pricing calculator state
  const [simWholesale, setSimWholesale] = useState(12.5);
  const [simRetail, setSimRetail] = useState(39.99);
  const [simUnitsPerMonth, setSimUnitsPerMonth] = useState(250);

  // Auto switch tab when state changes
  useEffect(() => {
    if (status === "interrupted") {
      setActiveTab("approval");
    } else if (status === "running") {
      setActiveTab("research");
    }
  }, [status]);

  // Sync simulator with candidate product when product changes
  useEffect(() => {
    if (product) {
      if (product.wholesale_cost) setSimWholesale(parseFloat(product.wholesale_cost));
      if (product.retail_price) setSimRetail(parseFloat(product.retail_price));
    }
  }, [product]);

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

  // Pricing calculations
  const simMarginPct =
    simRetail > 0 ? parseFloat((((simRetail - simWholesale) / simRetail) * 100).toFixed(1)) : 0;
  const simProfitPerUnit = parseFloat((simRetail - simWholesale).toFixed(2));
  const simMarkup = simWholesale > 0 ? (simRetail / simWholesale).toFixed(2) : 0;
  const simMonthlyProfit = Math.round(simProfitPerUnit * simUnitsPerMonth);

  const applyPricingToProduct = () => {
    if (product && isEditing) {
      handleFieldChange("wholesale_cost", simWholesale);
      handleFieldChange("retail_price", simRetail);
    } else if (product && status === "interrupted") {
      startEditMode();
      setEditedData((prev) => ({
        ...prev,
        ...product,
        wholesale_cost: simWholesale,
        retail_price: simRetail,
        margin_pct: simMarginPct,
      }));
    }
    setActiveTab("approval");
  };

  const activeProduct = isEditing ? editedData : product;

  return (
    <section id="studio" className="relative px-3 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header matching Sarvam's editorial font styling */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3.5">
            <span>Human-in-the-Loop Studio</span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight mb-3.5 break-words">
            The AI Platform Curators Build On
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Direct autonomous agents to scout high-yield e-commerce products, then inspect, adjust pricing, or approve in a single unified cockpit.
          </p>
        </div>

        {/* Main Studio Card Container matching Sarvam's playground design */}
        <div className="sarvam-studio-card p-3 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {/* Segmented Tab Pill Navigation */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar pb-3 sm:pb-0 mb-6 sm:mb-8 gap-2 border-b border-slate-100 sm:border-0 -mx-1 px-1">
            <div className="inline-flex p-1 sm:p-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 gap-1 sm:gap-1.5 shrink-0">
              {TAB_OPTIONS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-slate-900" : "text-slate-500"}`} />
                    <span>{tab.label}</span>
                    {tab.id === "approval" && status === "interrupted" && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional View: When 'Margin & Pricing' Tab is Active */}
          {activeTab === "pricing" ? (
            <motion.div
              key="pricing-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="sarvam-subcard p-4 sm:p-8 bg-slate-50/70 border border-slate-200/90 min-w-0 overflow-hidden"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200/80 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-2">
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Interactive Margin Simulator</span>
                    </div>
                    <h3 className="font-serif-display text-xl sm:text-2xl font-normal text-slate-900">
                      Dropshipping Profit & Markup Engine
                    </h3>
                  </div>

                  {product && (
                    <button
                      onClick={applyPricingToProduct}
                      className="sarvam-btn-primary px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Apply to Current Candidate</span>
                    </button>
                  )}
                </div>

                {/* 2-Column Calculator Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Controls */}
                  <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Wholesale Supplier Cost
                        </label>
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          ${simWholesale.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="0.5"
                        value={simWholesale}
                        onChange={(e) => setSimWholesale(parseFloat(e.target.value) || 1)}
                        className="w-full accent-slate-800 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                        <span>$1.00</span>
                        <span>$50.00</span>
                        <span>$100.00</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Target Retail MSRP
                        </label>
                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ${simRetail.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={Math.max(2, simWholesale)}
                        max="250"
                        step="0.5"
                        value={simRetail}
                        onChange={(e) => setSimRetail(parseFloat(e.target.value) || 2)}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                        <span>${simWholesale.toFixed(2)} min</span>
                        <span>$125.00</span>
                        <span>$250.00</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Estimated Monthly Sales (Units)
                        </label>
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {simUnitsPerMonth} units
                        </span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="1500"
                        step="25"
                        value={simUnitsPerMonth}
                        onChange={(e) => setSimUnitsPerMonth(parseInt(e.target.value) || 25)}
                        className="w-full accent-slate-800 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                        <span>25</span>
                        <span>750</span>
                        <span>1,500</span>
                      </div>
                    </div>
                  </div>

                  {/* Results & Health Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                        Margin Viability Scorecard
                      </span>

                      {/* Large Margin Display */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                          {simMarginPct}%
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          simMarginPct >= 65
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : simMarginPct >= 45
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {simMarginPct >= 65 ? "High-Yield Tier" : simMarginPct >= 45 ? "Solid Viability" : "Low Margin"}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
                        <div
                          className={`h-full transition-all duration-300 ${
                            simMarginPct >= 65
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : simMarginPct >= 45
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                              : "bg-gradient-to-r from-amber-500 to-rose-500"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, simMarginPct))}%` }}
                        />
                      </div>

                      {/* 3 Metric Pills */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                          <span className="text-[10px] font-semibold text-slate-600 block uppercase">
                            Net Profit
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            ${simProfitPerUnit}/unit
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                          <span className="text-[10px] font-semibold text-slate-600 block uppercase">
                            Markup
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {simMarkup}x
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70">
                          <span className="text-[10px] font-semibold text-emerald-700 block uppercase">
                            Monthly Run
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-emerald-800">
                            ${simMonthlyProfit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                      💡 Tip: Haul Spire targets products with at least <strong>55% profit margin</strong> to comfortably absorb ad spend (CAC) while retaining healthy net yields.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "catalog" ? (
            /* Conditional View: When 'Verified Catalog' Tab is Active */
            <motion.div
              key="catalog-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="sarvam-subcard p-6 sm:p-10 bg-slate-50/70 border border-slate-200/90 text-center min-w-0"
            >
              <div className="max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-700 shadow-xs">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display text-2xl font-normal text-slate-900 mb-2">
                  Durable Catalog Repository
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Currently holding <strong>{catalogCount} approved product{catalogCount === 1 ? "" : "s"}</strong> stored via SQLite database checkpointer.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="#catalog"
                    className="sarvam-btn-primary py-2.5 px-6 text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect Catalog Grid Below</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setActiveTab("research")}
                    className="sarvam-btn-secondary py-2.5 px-5 text-xs font-semibold tracking-wide cursor-pointer"
                  >
                    Back to Studio Cockpit
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Split Workspace Layout (Research & Approval Cockpits) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-w-0">
              {/* ─────── LEFT PANE: Agent Reasoning Stream & Search Trigger (5 cols) ─────── */}
              <div className="lg:col-span-5 flex flex-col justify-between sarvam-subcard p-4 sm:p-6 bg-slate-50/60 border border-slate-200/80 min-w-0 overflow-hidden">
                <div className="min-w-0">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/70 min-w-0">
                    <div className="flex items-center gap-2 shrink-0">
                      <Activity className="w-4 h-4 text-slate-700 shrink-0" />
                      <span className="font-semibold text-xs tracking-wider uppercase text-slate-700">
                        Reasoning Trace
                      </span>
                    </div>

                    {status === "running" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Agent Active
                      </span>
                    )}
                    {status === "interrupted" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-800 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        Awaiting Review
                      </span>
                    )}
                    {status === "completed" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 shrink-0">
                        <Check className="w-3 h-3 text-slate-700" />
                        Completed
                      </span>
                    )}
                    {!status && (
                      <span className="text-[11px] font-medium text-slate-600 shrink-0">
                        Standby
                      </span>
                    )}
                  </div>

                  {/* Custom Query Prompt Input */}
                  <div className="mb-4 min-w-0">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Product Research Directive
                    </label>
                    <div className="relative min-w-0">
                      <input
                        type="text"
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        placeholder="e.g. Find viral electronics with >65% profit margin..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all min-w-0"
                      />
                    </div>

                    {/* Preset prompt pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-full">
                      {PRESET_QUERIES.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            setCustomQuery(preset);
                            onStartAgent(preset);
                          }}
                          disabled={loading}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50 truncate max-w-full"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Log Stream Container */}
                  <div
                    ref={logScrollRef}
                    className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 h-[280px] sm:h-[300px] overflow-y-auto space-y-2.5 shadow-inner overscroll-contain min-w-0"
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
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 min-w-0 overflow-hidden"
                        >
                          <span className="text-sm shrink-0 mt-0.5">{log.icon}</span>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <p
                              className="text-xs text-slate-700 leading-snug break-words"
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
                        <div className="flex gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="truncate">Agent executing research node…</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button at bottom of Left Pane */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex items-center justify-between gap-3 min-w-0">
                  <button
                    onClick={() => onStartAgent(customQuery || undefined)}
                    disabled={loading}
                    className="sarvam-btn-primary flex-1 py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 truncate"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {status === "completed"
                        ? "New Product Discovery"
                        : loading
                        ? "Running Agent…"
                        : "Run Research Node"}
                    </span>
                  </button>
                </div>
              </div>

              {/* ─────── RIGHT PANE: Human Decision Inspector & Approval Card (7 cols) ─────── */}
              <div className="lg:col-span-7 flex flex-col justify-between min-w-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* 1. Interrupted / Pending Human Decision State */}
                  {status === "interrupted" && product ? (
                    <motion.div
                      key="interrupted"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm min-w-0 overflow-hidden"
                    >
                      <div className="min-w-0">
                        {/* Top Header with Amber Pulse Badge */}
                        <div className="flex items-center justify-between mb-4 sm:mb-5 min-w-0 gap-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 shrink-0">
                            <span className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                            </span>
                            <span className="text-[11px] sm:text-xs font-semibold text-amber-900 tracking-wide uppercase">
                              Pending Human Validation
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-600 font-mono truncate">
                            interrupt_payload_v1
                          </span>
                        </div>

                        {/* Product Overview Card */}
                        <div className="flex flex-col sm:flex-row items-start gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 min-w-0 overflow-hidden">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Package className="w-7 h-7" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 w-full overflow-hidden">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] sm:text-[11px] font-semibold text-slate-600 mb-1.5 shrink-0">
                              <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{product.category}</span>
                            </div>

                            {isEditing ? (
                              <input
                                type="text"
                                value={editedData.name || ""}
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                                className="w-full font-bold text-sm sm:text-base text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1 mb-1 focus:outline-none focus:border-slate-500 min-w-0"
                              />
                            ) : (
                              <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight break-words">
                                {product.name}
                              </h3>
                            )}

                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed break-words">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        {/* 4 Core Financial Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5 min-w-0">
                          {/* Wholesale Cost */}
                          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs min-w-0 overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1 truncate">
                              Wholesale Cost
                            </span>
                            {isEditing ? (
                              <div className="flex items-center min-w-0">
                                <span className="text-xs text-slate-400 mr-0.5 shrink-0">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editedData.wholesale_cost || ""}
                                  onChange={(e) => handleFieldChange("wholesale_cost", e.target.value)}
                                  className="w-full min-w-0 font-bold text-xs sm:text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none"
                                />
                              </div>
                            ) : (
                              <span className="font-bold text-sm sm:text-base text-slate-900 truncate block">
                                ${activeProduct.wholesale_cost}
                              </span>
                            )}
                          </div>

                          {/* Retail MSRP */}
                          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs min-w-0 overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1 truncate">
                              Target Retail
                            </span>
                            {isEditing ? (
                              <div className="flex items-center min-w-0">
                                <span className="text-xs text-slate-400 mr-0.5 shrink-0">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editedData.retail_price || ""}
                                  onChange={(e) => handleFieldChange("retail_price", e.target.value)}
                                  className="w-full min-w-0 font-bold text-xs sm:text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none"
                                />
                              </div>
                            ) : (
                              <span className="font-bold text-sm sm:text-base text-slate-900 truncate block">
                                ${activeProduct.retail_price}
                              </span>
                            )}
                          </div>

                          {/* Profit Margin */}
                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs min-w-0 overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1 truncate">
                              Profit Margin
                            </span>
                            <span className="font-bold text-sm sm:text-base text-emerald-700 truncate block">
                              {activeProduct.margin_pct}%
                            </span>
                          </div>

                          {/* Confidence Score */}
                          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs min-w-0 overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1 truncate">
                              AI Confidence
                            </span>
                            <span className="font-bold text-sm sm:text-base text-slate-900 truncate block">
                              {Math.round((activeProduct.confidence_score || 0.85) * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* Supplier Link (Safely Clamped) */}
                        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 mb-5 gap-2 min-w-0 overflow-hidden">
                          <span className="text-slate-500 font-medium shrink-0">Supplier URL:</span>
                          <a
                            href={product.supplier_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-900 hover:underline inline-flex items-center gap-1.5 min-w-0 max-w-[200px] sm:max-w-[320px] truncate"
                            title={product.supplier_url}
                          >
                            <span className="truncate">{product.supplier_url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-slate-500" />
                          </a>
                        </div>
                      </div>

                      {/* Sarvam Action Buttons Row */}
                      <div className="pt-3.5 border-t border-slate-200 flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              disabled={loading}
                              className="sarvam-btn-primary flex-1 min-w-[160px] py-2.5 sm:py-3 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Save className="w-4 h-4 shrink-0" />
                              <span className="truncate">Save & Approve Parameters</span>
                            </button>
                            <button
                              onClick={cancelEditMode}
                              className="sarvam-btn-secondary py-2.5 sm:py-3 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <X className="w-4 h-4 shrink-0" />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Approve (Primary Sarvam Dark Pill) */}
                            <button
                              onClick={() => onResumeAgent("approve")}
                              disabled={loading}
                              className="sarvam-btn-primary flex-1 min-w-[160px] py-2.5 sm:py-3 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="truncate">Approve & Save to Catalog</span>
                            </button>

                            {/* Edit (Secondary Outline Pill) */}
                            <button
                              onClick={startEditMode}
                              disabled={loading}
                              className="sarvam-btn-secondary py-2.5 sm:py-3 px-3.5 sm:px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              <span>Edit</span>
                            </button>

                            {/* Reject (Subtle Rose Pill) */}
                            <button
                              onClick={() => onResumeAgent("reject")}
                              disabled={loading}
                              className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-full text-xs font-semibold tracking-wide bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
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
                      className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 min-w-0"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>

                      <h3 className="font-serif-display text-xl sm:text-2xl font-normal text-slate-900 mb-2">
                        {finalStatus === "approved"
                          ? "Product Successfully Cataloged"
                          : "Decision Processed: Rejected"}
                      </h3>

                      <p className="text-slate-500 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                        {finalStatus === "approved"
                          ? "The product parameters were committed to catalog.db via SQLite checkpointer."
                          : "The research candidate was discarded without cataloging."}
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                          onClick={() => onStartAgent()}
                          className="sarvam-btn-primary py-2.5 px-5 sm:px-6 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>Discover Next Product</span>
                        </button>

                        <a
                          href="#catalog"
                          className="sarvam-btn-secondary py-2.5 px-4 sm:px-5 text-xs font-semibold tracking-wide flex items-center gap-1.5"
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
                      className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 min-w-0 overflow-hidden"
                    >
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700 mb-3.5">
                          <span>LangGraph HITL Architecture</span>
                        </div>

                        <h3 className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-normal text-slate-900 mb-2.5">
                          Dynamic Human-in-the-Loop Engine
                        </h3>

                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-5">
                          Our LangGraph backend employs <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-[11px]">interrupt()</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-[11px]">AsyncSqliteSaver</code> checkpointers to hold state indefinitely until a human validates or modifies the candidate.
                        </p>

                        {/* 3 Pipeline Step Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5 min-w-0">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1 truncate">
                              Node 1
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 truncate">Scout & Margin</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Autonomous candidate sourcing.</p>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1 truncate">
                              Node 2 (Interrupt)
                            </span>
                            <h4 className="text-xs font-bold text-amber-900 truncate">Human Approval</h4>
                            <p className="text-[11px] text-amber-700 mt-0.5">Pauses graph execution.</p>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1 truncate">
                              Node 3
                            </span>
                            <h4 className="text-xs font-bold text-emerald-900 truncate">Durable Catalog</h4>
                            <p className="text-[11px] text-emerald-700 mt-0.5">Saves approved parameters.</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 min-w-0">
                        <span className="text-xs text-slate-500 truncate">
                          Ready to scout candidate products
                        </span>
                        <button
                          onClick={() => onStartAgent()}
                          disabled={loading}
                          className="sarvam-btn-primary py-2.5 px-5 sm:px-6 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>Start First Discovery Run</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
