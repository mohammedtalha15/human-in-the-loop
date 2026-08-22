"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export default function HeroSection({ onStartAgent, isRunning }) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-2 pb-12">
      {/* Ambient background glow halo */}
      <div className="ambient-halo top-[-100px] left-1/2 -translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto">
        <div className="sarvam-hero-card text-white px-6 sm:px-12 pt-16 pb-12 sm:pb-16 relative overflow-hidden flex flex-col items-center text-center">
          {/* Subtle Wireframe Dome Background SVG identical to Sarvam.ai */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-40 overflow-hidden flex justify-center">
            <svg
              width="1000"
              height="380"
              viewBox="0 0 1000 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[120%] max-w-none text-white/30"
            >
              <ellipse
                cx="500"
                cy="380"
                rx="480"
                ry="260"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <ellipse
                cx="500"
                cy="380"
                rx="400"
                ry="210"
                stroke="currentColor"
                strokeWidth="1"
              />
              <ellipse
                cx="500"
                cy="380"
                rx="310"
                ry="160"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <ellipse
                cx="500"
                cy="380"
                rx="210"
                ry="105"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M100 380 C 220 180, 780 180, 900 380"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <path
                d="M200 380 C 300 240, 700 240, 800 380"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <path
                d="M320 380 C 380 290, 620 290, 680 380"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <line x1="500" y1="120" x2="500" y2="380" stroke="currentColor" strokeWidth="0.8" />
              <line x1="350" y1="140" x2="350" y2="380" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 3" />
              <line x1="650" y1="140" x2="650" y2="380" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Top Pill Feature Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-medium text-white/90 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous LangGraph Agent with Dynamic Interrupt</span>
          </motion.div>

          {/* Main Title with Sarvam's signature high-end serif styling */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal tracking-tight text-white leading-[1.12] max-w-4xl mb-6"
          >
            Curate the Future of E-Commerce with Haul Spire
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-200/90 font-sans max-w-2xl font-light leading-relaxed mb-10"
          >
            Autonomous AI product discovery, dynamic pricing analytics, and high-margin supplier verification — supervised by human intelligence.
          </motion.p>

          {/* Center Emblem: 8-pointed Diamond Star Flower */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-white/25 rounded-full blur-xl scale-150 pointer-events-none" />
            <div className="relative w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white drop-shadow-md"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L14.6 8.4L22 9.1L16.4 14.3L18.1 21.6L12 17.6L5.9 21.6L7.6 14.3L2 9.1L9.4 8.4L12 1Z" />
              </svg>
            </div>
          </motion.div>

          {/* Sarvam Glass Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5"
          >
            <button
              onClick={onStartAgent}
              disabled={isRunning}
              className="sarvam-btn-glass px-8 py-3.5 text-sm sm:text-base font-medium flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isRunning ? "Agent Running Research…" : "Start Agent Discovery"}</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>
            <a
              href="#studio"
              className="text-xs text-white/75 hover:text-white underline underline-offset-4 transition-colors font-medium px-4 py-2"
            >
              Open Interactive Studio ↓
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
