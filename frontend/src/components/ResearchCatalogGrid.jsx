"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  DollarSign,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  Search,
  Filter,
  Check,
  Copy,
} from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Home & Garden", "Kitchen", "Gaming", "Pet Supplies"];

export default function ResearchCatalogGrid({ products = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        !searchQuery.trim() ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleCopyLink = (item) => {
    if (!item.supplier_url) return;
    navigator.clipboard?.writeText(item.supplier_url);
    setCopiedId(item.id || item.name);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="catalog" className="relative px-3 sm:px-6 lg:px-8 py-12 sm:py-16 bg-slate-50/50 border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Title matching Sarvam's 'Research & Updates' */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 min-w-0">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
              <span>Verified Catalog</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] text-slate-600">{products.length} Items</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight break-words">
              Curated & Verified Products
            </h2>
          </div>

          <p className="text-slate-500 text-xs sm:text-sm max-w-sm">
            All items below have been discovered by the LangGraph agent and approved through human verification.
          </p>
        </div>

        {/* Filters & Search Row */}
        {products.length > 0 && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-8 min-w-0">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1.5 md:pb-0 -mx-1 px-1 min-w-0">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px] max-w-full md:max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter catalog items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all min-w-0"
              />
            </div>
          </div>
        )}

        {/* 3-Column Card Grid matching Sarvam's cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 min-w-0">
          {products.length === 0 ? (
            <div className="col-span-full py-12 sm:py-16 text-center bg-white rounded-[28px] border border-slate-200 p-6 sm:p-8 min-w-0">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif-display text-xl sm:text-2xl text-slate-800 mb-1">
                No Products Cataloged Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Launch the research agent above and approve a product candidate to store it into your durable SQLite catalog.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full py-10 text-center bg-white rounded-[24px] border border-slate-200 p-6">
              <p className="text-xs font-medium text-slate-700">No products match your filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-slate-900 underline font-medium cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredProducts.map((item, index) => {
              // Color schemes for Sarvam style gradient boxes
              const gradients = [
                "from-emerald-500 via-teal-500 to-emerald-700",
                "from-indigo-500 via-purple-500 to-indigo-700",
                "from-amber-500 via-rose-500 to-amber-700",
                "from-blue-500 via-cyan-500 to-blue-700",
              ];
              const gradient = gradients[index % gradients.length];
              const isCopied = copiedId === (item.id || item.name);

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="bg-white rounded-[28px] border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group min-w-0 overflow-hidden"
                >
                  <div className="min-w-0">
                    {/* Top Tag & Category */}
                    <div className="flex items-center justify-between text-xs mb-3 min-w-0 gap-2">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-600 truncate">
                        {item.category || "E-Commerce"}
                      </span>
                      <span className="text-[11px] text-slate-600 font-mono shrink-0">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Active"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight mb-2 group-hover:text-slate-700 transition-colors line-clamp-1 break-words">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-5 break-words">
                      {item.description || "High-performing product curated via human-in-the-loop workflow."}
                    </p>
                  </div>

                  {/* Sarvam Graphic Card Preview Container */}
                  <div className="min-w-0">
                    <div className="relative rounded-[20px] overflow-hidden mb-4 sm:mb-5 aspect-[16/10] bg-slate-100 border border-slate-100 flex items-center justify-center">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-serif-display text-lg sm:text-2xl font-bold p-4 text-center break-words line-clamp-2`}>
                          {item.name}
                        </div>
                      )}

                      {/* Margin Floating Badge */}
                      <div className="absolute bottom-3 right-3 px-2.5 sm:px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white text-[11px] sm:text-xs font-bold text-emerald-700 shadow-sm flex items-center gap-1 shrink-0">
                        <TrendingUp className="w-3 h-3 shrink-0" />
                        <span>{item.margin_pct}% Margin</span>
                      </div>
                    </div>

                    {/* Financial Summary & External Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 min-w-0 gap-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-600 uppercase font-medium block truncate">Wholesale</span>
                          <span className="font-bold text-xs text-slate-700 truncate block">${item.wholesale_cost}</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-600 uppercase font-medium block truncate">Retail MSRP</span>
                          <span className="font-bold text-xs text-slate-900 truncate block">${item.retail_price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyLink(item)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Copy Supplier Link"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={item.supplier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                          title="Open Supplier Link"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
