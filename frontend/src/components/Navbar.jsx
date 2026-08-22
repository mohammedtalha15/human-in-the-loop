"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Navbar({ onStartAgent, isRunning }) {
  return (
    <header className="sticky top-5 z-50 w-full px-4 sm:px-6 lg:px-8 mb-6">
      <nav className="sarvam-nav mx-auto max-w-6xl rounded-full px-5 sm:px-7 py-3 flex items-center justify-between">
        {/* Brand Logo matching Sarvam's lowercase bold aesthetic */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1b212f] flex items-center justify-center text-white shadow-sm">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* 8-pointed star / diamond blossom emblem matching Sarvam */}
              <path d="M12 2L14.4 8.6L21 9.2L16 13.8L17.5 20.4L12 16.8L6.5 20.4L8 13.8L3 9.2L9.6 8.6L12 2Z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 font-sans lowercase">
            haul spire
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
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
        <div className="flex items-center gap-2.5">
          <button
            onClick={onStartAgent}
            disabled={isRunning}
            className="sarvam-btn-primary px-5 py-2 text-xs font-medium tracking-wide flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRunning ? "Agent Running…" : "Launch Agent"}</span>
          </button>
          <a
            href="#catalog"
            className="hidden sm:inline-flex sarvam-btn-secondary px-4 py-2 text-xs font-medium tracking-wide items-center gap-1"
          >
            <span>View Catalog</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
