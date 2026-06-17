/**
 * Features.jsx — MediQ Platform Capabilities
 *
 * Zocdoc-Clean v2 design language:
 *  - Crisp flat white canvas, #F4F5F7 / slate-50 section breaks
 *  - Deep navy #1A1E26 text, #1A6BCC exclusive accent
 *  - Zero shadows, zero glassmorphism, zero rounded-full badges
 *  - All badges: uniform bg-slate-100 text-slate-600 rounded uppercase
 *  - All icons: uniform bg-slate-100 rounded-lg slate-600
 *  - Max radius: rounded-lg (8px) on cards, rounded-xl (12px) on hero
 *  - 1px border-gray-200 containers, flat section dividers
 *  - ChevronRight strokeWidth 1.5, generous tracking-tight headings
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Clock,
  FileText,
  BarChart3,
  MessageCircle,
  Users,
  Shield,
  Wifi,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

/* ─── Animation variants ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ─── Data ────────────────────────────────────────────── */
const DEEP_DIVE = [
  {
    id: 1,
    tag: "Queue",
    title: "The Intelligent Live Queue",
    desc: "Stop shouting names in the waiting room. Our algorithm calculates estimated wait times based on the doctor's average speed. Patients track their status on their phone and arrive just in time.",
    points: [
      "Real-time token updates via WebSocket",
      "Walk-in & online booking sync",
      "Automatic 'Next Patient' push alerts",
    ],
    icon: Clock,
    visual: "queue",
  },
  {
    id: 2,
    tag: "Prescriptions",
    title: "1-Click E-Prescriptions",
    desc: "Doctors spend 40% of their time writing the same meds. With MediQ, create templates for common diagnoses and generate a professional PDF prescription in seconds.",
    points: [
      "Custom letterhead support",
      "Save favourite medicine combos",
      "Instant patient history access",
    ],
    icon: FileText,
    visual: "rx",
  },
  {
    id: 3,
    tag: "Analytics",
    title: "Clinic Analytics & Growth",
    desc: "Run your clinic like a business. Visualize your peak hours, track daily revenue, and understand patient retention rates through simple, beautiful charts.",
    points: [
      "Daily revenue reports",
      "Patient demographic breakdown",
      "Peak-hour heatmaps",
    ],
    icon: BarChart3,
    visual: "chart",
  },
];

const GRID_ITEMS = [
  {
    title: "WhatsApp Alerts",
    desc: "Send booking confirmations and 'You are Next' alerts directly to WhatsApp.",
    icon: MessageCircle,
    tag: "Notify",
  },
  {
    title: "Walk-in Manager",
    desc: "Seamlessly slot emergency patients between online bookings without disruption.",
    icon: Users,
    tag: "Manage",
  },
  {
    title: "Bank-Grade Security",
    desc: "256-bit encryption ensures patient data never leaks or gets exposed.",
    icon: Shield,
    tag: "Secure",
  },
  {
    title: "Offline Mode",
    desc: "Works even if the internet drops. Syncs automatically when back online.",
    icon: Wifi,
    tag: "Resilient",
  },
];

/* ─── Visual Mockups ─────────────────────────────────── */
function VisualMockup({ type }) {
  return (
    /* Flat container — rounded-lg, 1px border, no shadow */
    <div className="w-full bg-[#F4F5F7] rounded-xl border border-gray-200 aspect-[4/3] relative overflow-hidden">
      {/* Simulated browser chrome bar */}
      <div className="h-8 bg-white border-b border-gray-200 flex items-center px-4 gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        <div className="ml-3 h-4 w-40 bg-gray-100 rounded" />
      </div>

      <div className="p-5 h-full">
        {/* Queue mockup */}
        {type === "queue" && (
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Now Serving</p>
                <p className="text-2xl font-black text-[#1A1E26]">12</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Your Token</p>
                <p className="text-2xl font-black text-[#1A6BCC]">17</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1A6BCC] rounded-full" style={{ width: "71%" }} />
            </div>
            <p className="text-xs text-slate-500 font-medium text-center">~30 min wait · 5 patients ahead</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {["Token 13", "Token 14", "Token 15"].map((t) => (
                <div key={t} className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-center">
                  <p className="text-[10px] font-semibold text-slate-500">{t}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* E-Prescription mockup */}
        {type === "rx" && (
          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 bg-gray-200 rounded" />
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-wide px-2 py-0.5 rounded">
                Template
              </span>
            </div>
            <div className="border border-dashed border-gray-300 rounded-lg px-3 py-2.5 flex items-center gap-2 text-slate-400">
              <FileText size={14} strokeWidth={1.5} />
              <span className="text-xs font-medium">Rx Template: Viral Fever</span>
            </div>
            <div className="space-y-1.5">
              {["Paracetamol 500mg", "Cetirizine 10mg", "ORS Sachet"].map((med) => (
                <div key={med} className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-gray-100 rounded px-3 py-1.5">
                  <CheckCircle2 size={12} className="text-[#1A6BCC] shrink-0" strokeWidth={1.75} />
                  {med}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-8 flex-1 bg-[#1A6BCC] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-semibold">Generate PDF</span>
              </div>
              <div className="h-8 w-16 bg-gray-100 rounded-lg" />
            </div>
          </div>
        )}

        {/* Analytics mockup */}
        {type === "chart" && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-wide px-2 py-0.5 rounded">This Week</span>
            </div>
            <div className="flex items-end gap-2 h-28 border-b border-l border-gray-200 pb-0 px-1">
              {[35, 60, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all duration-500"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 5 ? "#1A6BCC" : "#E2E8F0",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 px-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="text-[9px] font-medium text-slate-400 flex-1 text-center">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function Features() {
  return (
    <div className="min-h-screen bg-white text-[#1A1E26] font-sans overflow-x-hidden">

      {/* ════════════════════════════════════════════════
          HERO — flat white, no background image overlay
      ════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Uniform slate badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-3 py-1 rounded">
                <Zap size={11} strokeWidth={2} />
                Platform Capabilities
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-[#1A1E26] leading-[1.07] tracking-tight mb-5"
            >
              Everything you need to run
              <br />
              <span className="text-[#1A6BCC]">a modern clinic.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10"
            >
              From booking to billing, MediQ automates the chaos so you can
              focus on the cure.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Link
                to="/pricing"
                className="flex items-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors duration-150 active:scale-95"
              >
                See Pricing
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/doctors?demo=true"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1A1E26] transition-colors"
              >
                <ChevronRight size={14} strokeWidth={1.5} />
                Try Live Demo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          DEEP DIVE — alternating feature rows
      ════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-20">
          {DEEP_DIVE.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 === 1;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className={`flex flex-col md:flex-row items-center gap-12 ${isReversed ? "md:flex-row-reverse" : ""}`}
              >
                {/* ── Text column ── */}
                <div className="flex-1 min-w-0">
                  {/* Uniform slate tag */}
                  <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded mb-4">
                    {feature.tag}
                  </span>

                  {/* Icon — uniform slate-100 square */}
                  <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-3">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-7 max-w-md">
                    {feature.desc}
                  </p>

                  {/* Check points */}
                  <ul className="space-y-3">
                    {feature.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm font-medium text-[#1A1E26]"
                      >
                        <CheckCircle2
                          size={16}
                          strokeWidth={1.75}
                          className="text-[#1A6BCC] shrink-0"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── Visual column ── */}
                <div className="flex-1 w-full max-w-md md:max-w-none">
                  <VisualMockup type={feature.visual} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ════════════════════════════════════════════════
          MORE FEATURES — flat 4-col grid
      ════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="mb-10">
            <p className="text-[10px] font-semibold text-[#1A6BCC] uppercase tracking-widest mb-2">
              And more
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight">
                More powerful features.
              </h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Designed to handle every edge-case a busy clinic encounters daily.
              </p>
            </div>
          </div>

          {/* Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {GRID_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3 hover:border-slate-400 transition-colors duration-200 group"
                >
                  {/* Header row: icon + badge */}
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                      <Icon size={16} strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 uppercase tracking-wide px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#1A1E26] mb-1 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ════════════════════════════════════════════════
          CTA — flat white card, singular primary button
      ════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Text */}
            <div className="max-w-md">
              <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded mb-4">
                Get Started
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-3">
                Start your free trial today.
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                No credit card required. Set up your clinic in under 5 minutes and experience the difference.
              </p>
            </div>

            {/* Button stack */}
            <div className="flex flex-col gap-4 items-start md:items-center shrink-0">
              {/* Primary */}
              <Link
                to="/pricing"
                id="features-cta-btn"
                className="flex items-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-sm px-7 py-3.5 rounded-lg transition-colors duration-150 active:scale-95 whitespace-nowrap"
              >
                View Pricing Plans
                <ArrowRight size={15} />
              </Link>

              {/* Ghost */}
              <Link
                to="/doctors?demo=true"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1A1E26] transition-colors group"
              >
                <ChevronRight
                  size={13}
                  strokeWidth={1.5}
                  className="text-slate-400 group-hover:text-[#1A6BCC] transition-colors"
                />
                <span className="underline-offset-2 group-hover:underline">
                  Try the live demo first
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
