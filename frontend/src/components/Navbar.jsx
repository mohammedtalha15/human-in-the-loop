"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Navbar({ onStartAgent, isRunning }) {
  return (
    <header className="sticky top-4 sm:top-5 z-50 w-full px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6">
      <nav className="sarvam-nav mx-auto max-w-6xl rounded-full px-3.5 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between min-w-0">
        {/* Brand Logo matching Sarvam's lowercase bold aesthetic */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1b212f] flex items-center justify-center text-white shadow-sm shrink-0">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* 8-pointed star / diamond blossom emblem matching Sarvam */}
              <path d="M12 2L14.4 8.6L21 9.2L16 13.8L17.5 20.4L12 16.8L6.5 20.4L8 13.8L3 9.2L9.6 8.6L12 2Z" />
            </svg>
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 font-sans lowercase">
            haul spire
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <a
            href="#studio"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
          >
            Platform
          </a>
          <a
            href="#studio"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
          >
            HITL Studio
          </a>
          <a
            href="#catalog"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
          >
            Catalog
          </a>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
          >
            API Docs
          </a>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onStartAgent}
            disabled={isRunning}
            className="sarvam-btn-primary px-3 sm:px-5 py-1.5 sm:py-2 text-xs font-medium tracking-wide flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline sm:inline">
              {isRunning ? "Agent Running…" : "Launch Agent"}
            </span>
            <span className="inline xs:hidden sm:hidden">
              {isRunning ? "Running…" : "Launch"}
            </span>
          </button>
          <a
            href="#catalog"
            className="hidden sm:inline-flex sarvam-btn-secondary px-4 py-2 text-xs font-medium tracking-wide items-center gap-1 whitespace-nowrap"
          >
            <span>View Catalog</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
