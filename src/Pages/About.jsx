/**
 * About.jsx — MediQ About Us
 * Zocdoc-Clean v2:
 *  - Flat white hero (no cinematic background image overlay)
 *  - Story section: two-column, flat stat strip (no glass card)
 *  - Values: 3 flat border-gray-200 cards, uniform slate-100 icons
 *  - Team: flat horizontal rows (not centered circles)
 *  - CTA: flat white panel, singular primary button + ghost link
 *  - Zero teal fill colors, zero blur, zero glow, zero rounded-full
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Target,
  Award,
  Search,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Activity,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";

/* ─── Assets ──────────────────────────────────────────── */
const HamimImg = "https://res.cloudinary.com/dm01lhkax/image/upload/v1772214480/Photo_Hamim_byjk9z.png";
const LabibImg  = "https://res.cloudinary.com/dm01lhkax/image/upload/v1772214567/DP_ksdcxq.jpg";

/* ─── Data ────────────────────────────────────────────── */
const STATS = [
  { value: "50+",  label: "Clinics Digitized" },
  { value: "12k",  label: "Hours Saved"       },
  { value: "10k+", label: "Happy Patients"    },
  { value: "98%",  label: "Satisfaction Rate" },
];

const VALUES = [
  {
    icon: Heart,
    title: "Patient First",
    desc: "Every line of code we write is dedicated to making the patient's healthcare journey smoother and completely stress-free.",
    tag: "Core",
  },
  {
    icon: Search,
    title: "Absolute Transparency",
    desc: "No hidden fees. No deceptive wait times. Complete clarity is the foundation of trust in medical care.",
    tag: "Principle",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    desc: "Your health data is sacred. We treat all medical records with the highest level of modern 256-bit encryption.",
    tag: "Trust",
  },
];

const TEAM = [
  { name: "Hamim Reja",  role: "Founder & CEO",    image: HamimImg },
  { name: "Labib Hasan", role: "Marketing Head",   image: LabibImg  },
];

/* ─── Animation variants ─────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ─── Main Page ─────────────────────────────────────── */
export default function About() {
  return (
    <div className="min-h-screen bg-white text-[#1A1E26] font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO — flat white, no background overlay
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200 pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Uniform slate badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-3 py-1 rounded mb-6">
              <Target size={11} strokeWidth={2} />
              Our Mission
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-[#1A1E26] tracking-tight leading-[1.08] mb-5"
            >
              Building the digital backbone
              <br />
              <span className="text-[#1A6BCC]">of healthcare.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed"
            >
              MediQ was born from a simple belief: no one should wait hours for a 10-minute consultation. We are intelligently bridging the gap between doctors and patients.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STORY — two-column text + image
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-14">

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:w-1/2"
            >
              <p className="text-[10px] font-semibold text-[#1A6BCC] uppercase tracking-widest mb-2">
                The Origin
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-6">
                Because your time
                <br />
                is invaluable.
              </h2>

              <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                <p>
                  It started in a crowded clinic waiting room. Our founder watched an elderly patient wait 3 hours just to show a simple report. The doctor was stressed, the staff was overwhelmed, and the patients exhausted.
                </p>
                <p>
                  The problem wasn't the medical care — it was the management. The technology existed to solve this, but it remained locked outside local everyday clinics.
                </p>

                {/* Pull quote — flat left-border, no card shadow */}
                <blockquote className="pl-4 border-l-2 border-[#1A6BCC] my-6">
                  <p className="text-sm font-semibold text-[#1A1E26] leading-relaxed">
                    "So, we built MediQ. Not just to book appointments, but to fundamentally respect everyone's time."
                  </p>
                </blockquote>
              </div>

              {/* Flat stat strip */}
              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-5">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-[#1A1E26] tracking-tight">{value}</div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="lg:w-1/2 w-full"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-slate-50 relative">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2832&auto=format&fit=crop"
                  alt="Clinic waiting room"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Subtle flat overlay with icon — no blur, no glass */}
                <div className="absolute inset-0 bg-[#1A1E26]/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                    <Activity size={24} className="text-white" strokeWidth={1.75} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ═══════════════════════════════════════════
          VALUES — flat 3-col card grid
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-[10px] font-semibold text-[#1A6BCC] uppercase tracking-widest mb-2">
              Core Tenets
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight">
                What drives us.
              </h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Three principles that guide every product decision we make.
              </p>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {VALUES.map(({ icon: Icon, title, desc, tag }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4 hover:border-slate-400 transition-colors duration-200 group"
              >
                <div className="flex items-start justify-between">
                  {/* Uniform slate-100 icon */}
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  {/* Uniform slate badge */}
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 uppercase tracking-wide px-2 py-0.5 rounded">
                    {tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1E26] mb-1.5 tracking-tight">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ═══════════════════════════════════════════
          TEAM — flat horizontal profile rows
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-[10px] font-semibold text-[#1A6BCC] uppercase tracking-widest mb-2">
              The Team
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-2">
              Meet the minds behind MediQ.
            </h2>
            <p className="text-sm text-gray-500">
              A small, dedicated team combining medical insight with world-class engineering.
            </p>
          </div>

          {/* Flat row cards */}
          <div className="flex flex-col gap-3">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="flex items-center gap-5 bg-white border border-gray-200 rounded-lg p-5 hover:border-slate-400 transition-colors group"
              >
                {/* Photo */}
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-slate-50">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl font-black">
                      {member.name[0]}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#1A1E26] tracking-tight">{member.name}</h3>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                    {member.role}
                  </p>
                </div>

                {/* LinkedIn ghost icon */}
                <Linkedin
                  size={16}
                  strokeWidth={1.5}
                  className="text-gray-200 group-hover:text-[#1A6BCC] transition-colors shrink-0"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ═══════════════════════════════════════════
          CTA PANEL
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
              <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded mb-4">
                Join Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-3">
                Want to be part of the change?
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We are always looking for passionate engineers, designers, and medical professionals who believe healthcare deserves better technology.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-center gap-4 shrink-0">
              {/* Primary */}
              <Link
                to="/contact"
                id="about-cta-btn"
                className="flex items-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-sm px-7 py-3.5 rounded-lg transition-colors duration-150 active:scale-95 whitespace-nowrap"
              >
                View Open Positions
                <ArrowRight size={15} />
              </Link>

              {/* Ghost */}
              <Link
                to="/features"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1A1E26] transition-colors group"
              >
                <ChevronRight size={13} strokeWidth={1.5} className="text-slate-400 group-hover:text-[#1A6BCC] transition-colors" />
                <span className="underline-offset-2 group-hover:underline">Explore what we built</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}