/**
 * FAQ_1.jsx — MediQ Help Center
 * Zocdoc-Clean v2:
 *  - Flat white hero, inline search bar (no glow / blur ring)
 *  - Tab toggle: flat sliding white-pill on slate-100 track
 *  - Accordion: border-b rows inside flat white rounded-lg container
 *  - Active question: text-[#1A6BCC], chevron rotates 180°
 *  - No-results state: uniform slate-100 icon container
 *  - CTA: flat white panel, primary button + ghost link
 */

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  FileQuestion,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/* ─── Data ────────────────────────────────────────────── */
const QUESTIONS = {
  patients: [
    {
      q: "Is there a fee to book an appointment?",
      a: "Yes, there is a nominal platform fee of ₹5 per booking. This secures your slot and helps us maintain server infrastructure.",
    },
    {
      q: "How does the Live Queue work?",
      a: "Once you book, you receive a Token Number (e.g., #12). On the appointment day, open the app to see the 'Current Serving Token'. If the doctor is on #8, you know you still have time before leaving home.",
    },
    {
      q: "Can I cancel my appointment?",
      a: "Yes — up to 1 hour before the scheduled time. The ₹5 platform fee is non-refundable.",
    },
    {
      q: "Do I need to download an app?",
      a: "No! MediQ works perfectly in your phone browser (Chrome, Safari). Downloading the app gives you better push notifications.",
    },
    {
      q: "Where can I see my prescription?",
      a: "After your visit, the doctor uploads your prescription. Find it in 'My Records' on your dashboard — downloadable as PDF.",
    },
  ],
  doctors: [
    {
      q: "What are the subscription charges?",
      a: "Three tiers: Starter (₹499/mo), Professional (₹999/mo), and Multi-Clinic (₹4,999/mo). Start free and upgrade when ready.",
    },
    {
      q: "Do I need special hardware?",
      a: "No. The MediQ dashboard runs on any laptop, tablet, or smartphone. A reliable internet connection is recommended for real-time queue sync.",
    },
    {
      q: "Can I manage walk-in patients?",
      a: "Absolutely. The Walk-In Manager lets you add patients who arrive directly. They get a token number and are automatically slotted into the queue.",
    },
    {
      q: "Is patient data secure?",
      a: "Yes — 256-bit encryption, healthcare data standards compliant. Your patient data is yours; we never sell or share it.",
    },
  ],
};

/* ─── Accordion Item ─────────────────────────────────── */
function AccordionItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 text-left group focus:outline-none"
      >
        <span
          className={`text-sm font-semibold pr-4 transition-colors ${
            isOpen ? "text-[#1A6BCC]" : "text-[#1A1E26] group-hover:text-[#1A6BCC]"
          }`}
        >
          {q}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={1.5}
          className={`shrink-0 transition-all duration-200 ${
            isOpen ? "rotate-180 text-[#1A6BCC]" : "text-gray-300"
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function FAQ() {
  const [activeTab,   setActiveTab]   = useState("patients");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex,   setOpenIndex]   = useState(0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOpenIndex(null);
    setSearchQuery("");
  };

  const currentQuestions = QUESTIONS[activeTab];
  const filteredQuestions = currentQuestions.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#1A1E26] font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200 pt-28 pb-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Uniform slate badge */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-3 py-1 rounded mb-6">
              <HelpCircle size={11} strokeWidth={2} />
              Help Center
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-[#1A1E26] tracking-tight leading-[1.08] mb-4">
              How can we
              <br />
              <span className="text-[#1A6BCC]">help you?</span>
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Search across all questions, or browse by category below.
            </p>

            {/* Flat inline search bar (no glow, no blur) */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 max-w-md mx-auto focus-within:border-[#1A6BCC] transition-colors">
              <Search size={16} className="text-gray-400 shrink-0" strokeWidth={1.75} />
              <input
                type="text"
                placeholder="Search questions…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-medium text-[#1A1E26] placeholder:text-gray-400 focus:outline-none bg-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ BODY
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* ── Tab toggle (flat sliding indicator) ── */}
          <div className="flex justify-center mb-8">
            <div
              role="tablist"
              aria-label="FAQ for"
              className="relative flex bg-slate-100 rounded-lg p-1"
            >
              {/* Sliding white indicator */}
              <div
                aria-hidden="true"
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm border border-gray-200 transition-transform duration-200 ease-out ${
                  activeTab === "doctors" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
                }`}
              />
              {[
                { key: "patients", label: "For Patients" },
                { key: "doctors",  label: "For Doctors"  },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  onClick={() => handleTabChange(key)}
                  className={`relative z-10 px-6 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-150 rounded-md w-36 text-center ${
                    activeTab === key ? "text-[#1A1E26]" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Accordion container ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {filteredQuestions.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg px-6">
                  {filteredQuestions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      q={item.q}
                      a={item.a}
                      isOpen={openIndex === index}
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                  ))}
                </div>
              ) : (
                /* No-results state */
                <div className="bg-white border border-gray-200 rounded-lg px-6 py-16 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <FileQuestion size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1E26] mb-1">No matching questions</h3>
                  <p className="text-xs text-gray-500">Try a different search term, or contact our support team.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ═══════════════════════════════════════════
          CONTACT CTA PANEL
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Text */}
            <div className="max-w-md">
              {/* Uniform slate icon */}
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-5">
                <MessageCircle size={18} strokeWidth={1.75} />
              </div>
              <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded mb-4">
                Still need help?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-3">
                Talk to our team.
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Can't find the answer you're looking for? Our support team typically replies within 2 hours.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-start gap-3 shrink-0">
              {/* Primary */}
              <a
                href="mailto:support@mediq.app"
                id="faq-contact-btn"
                className="flex items-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-sm px-7 py-3.5 rounded-lg transition-colors duration-150 active:scale-95 whitespace-nowrap"
              >
                <Mail size={14} />
                Email Support
              </a>

              {/* Ghost: phone */}
              <a
                href="tel:+919434405501"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1A1E26] transition-colors group"
              >
                <Phone size={13} strokeWidth={1.5} className="text-slate-400 group-hover:text-[#1A6BCC] transition-colors" />
                <span className="underline-offset-2 group-hover:underline">+91 94344 05501</span>
              </a>

              <Link
                to="/pricing"
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                View pricing plans →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
