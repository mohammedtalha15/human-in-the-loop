"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Tag,
  ArrowUpRight,
} from "lucide-react";

export default function ResearchCatalogGrid({ products = [] }) {
  return (
    <section id="catalog" className="relative px-4 sm:px-6 lg:px-8 py-16 bg-slate-50/50 border-t border-slate-200/60">
      <div className="max-w-6xl mx-auto">
        {/* Section Title matching Sarvam's 'Research & Updates' */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
              <span>Verified Catalog</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Curated & Verified Products
            </h2>
          </div>

          <p className="text-slate-500 text-sm max-w-sm">
            All items below have been discovered by the LangGraph agent and approved through human verification.
          </p>
        </div>

        {/* 3-Column Card Grid matching Sarvam's cards layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-[28px] border border-slate-200 p-8">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif-display text-2xl text-slate-800 mb-1">
                No Products Cataloged Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Launch the research agent above and approve a product candidate to store it into your durable SQLite catalog.
              </p>
            </div>
          ) : (
            products.map((item, index) => {
              // Color schemes for Sarvam style gradient boxes
              const gradients = [
                "from-emerald-500 via-teal-500 to-emerald-700",
                "from-indigo-500 via-purple-500 to-indigo-700",
                "from-amber-500 via-rose-500 to-amber-700",
                "from-blue-500 via-cyan-500 to-blue-700",
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="bg-white rounded-[28px] border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                >
                  <div>
                    {/* Top Tag & Category */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-600">
                        {item.category || "E-Commerce"}
                      </span>
                      <span className="text-[11px] text-slate-600 font-mono">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Active"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight mb-2 group-hover:text-slate-700 transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                      {item.description || "High-performing product curated via human-in-the-loop workflow."}
                    </p>
                  </div>

                  {/* Sarvam Graphic Card Preview Container */}
                  <div>
                    <div className="relative rounded-[20px] overflow-hidden mb-5 aspect-[16/10] bg-slate-100 border border-slate-100 flex items-center justify-center">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-serif-display text-2xl font-bold p-4 text-center`}>
                          {item.name}
                        </div>
                      )}

                      {/* Margin Floating Badge */}
                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white text-xs font-bold text-emerald-700 shadow-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{item.margin_pct}% Margin</span>
                      </div>
                    </div>

                    {/* Financial Summary & External Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-[10px] text-slate-600 uppercase font-medium block">Wholesale</span>
                          <span className="font-bold text-xs text-slate-700">${item.wholesale_cost}</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div>
                          <span className="text-[10px] text-slate-600 uppercase font-medium block">Retail MSRP</span>
                          <span className="font-bold text-xs text-slate-900">${item.retail_price}</span>
                        </div>
                      </div>

                      <a
                        href={item.supplier_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                        title="View Supplier Link"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
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
