"use client";

import React from "react";

export default function SarvamFooter() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-12 overflow-hidden">
      <div className="max-w-6xl mx-auto min-w-0">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-12 sm:mb-16 min-w-0">
          {/* Logo Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#1b212f] flex items-center justify-center text-white">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.4 8.6L21 9.2L16 13.8L17.5 20.4L12 16.8L6.5 20.4L8 13.8L3 9.2L9.6 8.6L12 2Z" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 font-sans lowercase">
                haul spire
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Autonomous AI agent curation platform with Human-in-the-Loop decision verification.
            </p>
          </div>

          {/* Column: Products */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#studio" className="hover:text-slate-900 transition-colors">LangGraph Agent</a></li>
              <li><a href="#studio" className="hover:text-slate-900 transition-colors">HITL Decision Studio</a></li>
              <li><a href="#catalog" className="hover:text-slate-900 transition-colors">Product Catalog</a></li>
              <li><a href="#studio" className="hover:text-slate-900 transition-colors">Margin Predictor</a></li>
            </ul>
          </div>

          {/* Column: APIs */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-4">
              APIs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">POST /agent/start</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">GET /agent/status</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">POST /agent/resume</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">GET /catalog</a></li>
            </ul>
          </div>

          {/* Column: Architecture */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><span className="text-slate-500">FastAPI</span></li>
              <li><span className="text-slate-500">LangGraph interrupt()</span></li>
              <li><span className="text-slate-500">AsyncSqliteSaver</span></li>
              <li><span className="text-slate-500">Next.js App Router</span></li>
            </ul>
          </div>

          {/* Column: Company */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><a href="#" className="hover:text-slate-900 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Research Blog</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy & Legal</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Haul Spire Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500 font-medium">LangGraph Checkpointer Active (checkpoints.db)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
