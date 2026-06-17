/**
 * Home.jsx — MediQ Home Page
 * Zocdoc-Clean v2 — precision-refined pass:
 *  - Uniform slate badge palette (no rainbow colors)
 *  - Uniform slate-100 icon backgrounds
 *  - Flat sliding tab toggle for How It Works
 *  - Ghost "Watch Demo" text button
 *  - Muted trust logos (opacity-40 → hover:opacity-70)
 *  - Crisp rounded-lg / rounded-xl radius restraint
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Activity,
  ChevronRight,
  Play,
  X,
  Search,
  MapPin,
  Star,
  Zap,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Framer Motion Variants ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

/* ─── Data ────────────────────────────────────────────── */
const STEPS_PATIENT = [
  {
    step: "01",
    title: "Find Your Doctor",
    text: "Search by specialty or location. View rich profiles, verified reviews, and available slots in real-time.",
  },
  {
    step: "02",
    title: "Book & Get Token",
    text: "Select your preferred time. Instantly receive a secure digital Token Number directly on your device.",
  },
  {
    step: "03",
    title: "Live Track & Visit",
    text: "Monitor the 'Current Serving Token' live. Arrive at the clinic exactly when it's your turn.",
  },
];
const STEPS_DOCTOR = [
  {
    step: "01",
    title: "Register Clinic",
    text: "Setup your partner account. Configure fees, intelligent scheduling, and daily capacity in minutes.",
  },
  {
    step: "02",
    title: "Start the Queue",
    text: "Hit 'Go Live' upon arrival. Your scheduled patients receive instant notifications automatically.",
  },
  {
    step: "03",
    title: "Digital Practice",
    text: "Manage tokens with one click. Issue e-prescriptions seamlessly saved to your cloud records.",
  },
];

// REFINEMENT 1 — All tags normalized to a single uniform neutral palette.
// No more rainbow colors; let typography and layout do the heavy lifting.
const FEATURES = [
  {
    icon: Clock,
    title: "Live Queue Tracking",
    desc: "Watch your token progress in real-time via WebSocket. Arrive precisely when your doctor is ready.",
    tag: "Real-time",
    wide: true,
  },
  {
    icon: CalendarCheck,
    title: "Instant Booking",
    desc: "Find top specialists and secure your slot instantly with zero phone calls.",
    tag: "Instant",
    wide: false,
  },
  {
    icon: ShieldCheck,
    title: "Secure Digital Records",
    desc: "Your entire medical history, prescriptions, and lab reports are encrypted and stored safely on the cloud.",
    tag: "Encrypted",
    wide: false,
  },
  {
    icon: Zap,
    title: "Zero Wait Time",
    desc: "Our token system eliminates physical queue waiting. Patients are notified to arrive only when their turn is near.",
    tag: "Smart",
    wide: false,
  },
  {
    icon: Lock,
    title: "In-Network Verified",
    desc: "Every doctor on MediQ is background-verified with credentials checked so you always book with confidence.",
    tag: "Verified",
    wide: false,
  },
];

const TRUST_LOGOS = [
  "Apollo", "Fortis", "Max Healthcare", "Aster", "Narayana", "Manipal",
];

/* ─── Sub-components ─────────────────────────────────── */

/** Thin horizontal divider used between page sections */
function SectionDivider() {
  return <div className="border-t border-gray-200 w-full" />;
}

/** Stat pill used in the metrics bar */
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 px-4 gap-1">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${color}`}>
        <Icon size={18} />
      </div>
      <span className="text-2xl font-black text-[#1A1E26] tracking-tight">{value}</span>
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

/**
 * REFINEMENT 1 — FeatureCard:
 *  · Icon: uniform slate-100 bg (no colored borders, no per-card hue)
 *  · Tag:  single neutral palette — slate-100 / slate-700, uppercase, tracking-wide
 *  · Radius: rounded-lg (max 8px) for a crisp product feel
 */
function FeatureCard({ icon: Icon, title, desc, tag, wide }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4 hover:border-slate-400 transition-colors duration-200 group ${wide ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-start justify-between">
        {/* Uniform slate-100 icon container — no per-card accent color */}
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        {/* Uniform neutral badge — no rainbow */}
        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 uppercase tracking-wide px-2 py-0.5 rounded">
          {tag}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#1A1E26] mb-1.5 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/**
 * REFINEMENT 3 — StepRow:
 *  · Tighter vertical padding (py-5 from py-6)
 *  · Step number radius: rounded-lg (crisp square-rounded, not pill)
 *  · ChevronRight strokeWidth 1.5 (thinner, more minimal)
 */
function StepRow({ step, title, text, isPatient }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-start gap-5 py-5 border-b border-gray-100 last:border-0 group"
    >
      {/* Step number — uniform rounded-lg, no per-tab colored borders */}
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center text-sm font-black shrink-0 transition-colors duration-200 ${
          isPatient
            ? "bg-slate-100 text-[#1A6BCC] group-hover:bg-[#1A6BCC] group-hover:text-white"
            : "bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white"
        }`}
      >
        {step}
      </div>

      {/* Text */}
      <div className="flex-1 pt-0.5">
        <h3 className="text-sm font-bold text-[#1A1E26] mb-0.5">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
      </div>

      {/* Thinner arrow — strokeWidth 1.5 */}
      <ChevronRight
        size={15}
        strokeWidth={1.5}
        className="text-gray-300 group-hover:text-[#1A6BCC] transition-colors mt-1 shrink-0"
      />
    </motion.div>
  );
}

/* ─── Hero Search Bar (Zocdoc-style) ─────────────────── */
function HeroSearchBar({ navigate }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-200"
    >
      {/* Specialty / Doctor search */}
      <div className="flex items-center gap-3 px-4 py-3.5 flex-1 min-w-0">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Specialty, doctor, or condition"
          className="w-full text-sm font-medium text-[#1A1E26] placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 px-4 py-3.5 sm:w-52 min-w-0">
        <MapPin size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or area"
          className="w-full text-sm font-medium text-[#1A1E26] placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* CTA */}
      <button
        type="submit"
        id="hero-search-btn"
        className="bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-sm px-6 py-3.5 transition-colors duration-150 whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
      >
        Find Doctors
        <ArrowRight size={16} />
      </button>
    </form>
  );
}

/* ─── Main Export ────────────────────────────────────── */
export default function HomePage() {
  const [manualTab, setManualTab] = useState("patient");
  const [totalDoctor, setTotalDoctor] = useState(0);
  const [totalPatient, setTotalPatient] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/smallDatas/small-data`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTotalDoctor(data.totalDoctor || 0);
        setTotalPatient(data.totalPatient || 0);
      } catch (_) {
        /* silently fall back to default values */
      }
    };
    fetchData();
  }, []);

  const activeSteps = manualTab === "patient" ? STEPS_PATIENT : STEPS_DOCTOR;

  return (
    <div className="min-h-screen bg-white text-[#1A1E26] font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          HERO  — flat white, Zocdoc-style search-driven
      ══════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-10"
          >
            {/* Pill badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1A6BCC] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Queue System Active
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1E26] leading-[1.08] tracking-tight mb-5"
            >
              Book doctors.
              <br />
              <span className="text-[#1A6BCC]">Skip the waiting room.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Find verified specialists, book a slot, and track your live queue token — all from one place.
            </motion.p>

            {/* Trust bar */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4 flex-wrap text-xs text-gray-400 mb-10"
            >
              {[
                { icon: CheckCircle, text: "Verified doctors" },
                { icon: ShieldCheck, text: "Secure records" },
                { icon: Star, text: "4.9 avg rating" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon size={13} className="text-emerald-500" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <HeroSearchBar navigate={navigate} />
          </motion.div>

          {/* Popular specialties */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 flex-wrap justify-center mt-5"
          >
            <span className="text-xs text-gray-400 font-medium">Popular:</span>
            {["Cardiologist", "Dermatologist", "Pediatrician", "Orthopedic", "Dentist"].map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/doctors?q=${s}`)}
                className="text-xs font-semibold text-[#1A6BCC] hover:underline underline-offset-2 transition"
              >
                {s}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          METRICS BAR — flat, inline, divider-separated
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#F4F5F7] border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
          <StatPill icon={Stethoscope} label="Active Doctors"  value={totalDoctor || "500+"} color="bg-blue-50 text-[#1A6BCC]" />
          <StatPill icon={Users}       label="Happy Patients"  value={totalPatient || "10k+"} color="bg-emerald-50 text-emerald-600" />
          <StatPill icon={Activity}    label="Daily Queues"    value="1.5k+"  color="bg-amber-50 text-amber-600" />
          <StatPill icon={Star}        label="User Rating"     value="4.9/5"  color="bg-rose-50 text-rose-500" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY MEDIQ — flat feature grid, 1px borders
      ══════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="mb-10">
            <p className="text-[11px] font-bold text-[#1A6BCC] uppercase tracking-widest mb-2">
              Why MediQ
            </p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight max-w-md">
                Every tool you need for a flawless medical visit.
              </h2>
              <p className="text-sm text-gray-500 max-w-xs">
                We've redesigned the medical visit from the ground up — eliminating wait times and paperwork.
              </p>
            </div>
          </div>

          {/* Feature grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className={f.wide ? "sm:col-span-2 md:col-span-1" : ""}>
                <FeatureCard {...f} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS — flat step rows, tab toggle
      ══════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header + tab toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-[11px] font-bold text-[#1A6BCC] uppercase tracking-widest mb-2">
                How It Works
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight">
                Seamlessly designed
                <br />
                for everyone.
              </h2>
            </div>

            {/*
             * REFINEMENT 2 — Flat sliding-indicator tab toggle.
             * Active state = crisp white layer over slate-100 track.
             * No solid color fills — fully integrated feel.
             */}
            <div
              role="tablist"
              aria-label="Guide for"
              className="relative flex bg-slate-100 rounded-lg p-1 self-start"
            >
              {/* Sliding white indicator */}
              <div
                aria-hidden="true"
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm border border-gray-200 transition-transform duration-200 ease-out ${
                  manualTab === "doctor" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
                }`}
              />
              {[
                { key: "patient", label: "Patients" },
                { key: "doctor",  label: "Doctors"  },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={manualTab === key}
                  onClick={() => setManualTab(key)}
                  className={`relative z-10 px-5 py-2 text-xs font-semibold tracking-wide uppercase transition-colors duration-150 rounded-md w-28 text-center ${
                    manualTab === key
                      ? "text-[#1A1E26]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Step rows — rounded-lg for crisp restraint */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={manualTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                variants={stagger}
              >
                {activeSteps.map((s, i) => (
                  <StepRow
                    key={s.step}
                    {...s}
                    isPatient={manualTab === "patient"}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/*
       * REFINEMENT 4 — Trust strip:
       * Logos use opacity-40 hover:opacity-70 for a clean muted hierarchy.
       * Perfectly centered flex row. No bespoke colors fighting for attention.
       */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center mb-7">
            Trusted by leading hospital networks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="text-sm font-black text-slate-900 tracking-tight select-none opacity-30 hover:opacity-60 transition-opacity duration-200 cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/*
       * REFINEMENT 4 — CTA panel:
       * · "Try Live Demo" = singular high-contrast primary button (rounded-lg)
       * · "Watch Demo"   = ghost text button — no container, inline Play icon,
       *   subtle hover underline. Removes the bulky bordered block.
       * · Badge: uniform slate palette, not blue-on-blue
       * · Panel radius: rounded-xl (12px)
       */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Text */}
            <div className="max-w-lg">
              <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-wide px-2.5 py-1 rounded mb-4">
                Join The Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-3">
                Ready to transform your medical practice?
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Connect with thousands of doctors who have digitized their clinics, saved time, and dramatically improved patient satisfaction.
              </p>
            </div>

            {/* Button stack — primary + ghost only */}
            <div className="flex flex-col items-start md:items-center gap-4 shrink-0">
              {/* PRIMARY: singular high-contrast CTA */}
              <Link
                to="/doctors?demo=true"
                id="cta-demo-btn"
                className="flex items-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-sm px-7 py-3.5 rounded-lg transition-colors duration-150 active:scale-95 whitespace-nowrap"
              >
                Try Live Demo
                <ArrowRight size={15} />
              </Link>

              {/* GHOST: flat text button — no border, no bg */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                id="cta-video-btn"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1A1E26] transition-colors group"
              >
                <Play size={13} className="text-slate-400 group-hover:text-[#1A6BCC] transition-colors" />
                <span className="underline-offset-2 hover:underline">Watch a 2-min demo</span>
              </button>

              <Link
                to="/pricing"
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                View pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VIDEO MODAL — kept intact from original
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-[#1A1E26]/80 cursor-pointer"
            />

            {/* Video container */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl bg-black rounded-2xl shadow-2xl overflow-hidden aspect-video border border-gray-700 z-10"
            >
              {/* Close */}
              <button
                onClick={() => setIsVideoModalOpen(false)}
                aria-label="Close video"
                className="absolute top-3 right-3 z-20 w-9 h-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/nWdUnOx9OIA?autoplay=1&rel=0"
                title="MediQ Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}