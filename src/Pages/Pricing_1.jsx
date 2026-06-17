/**
 * Pricing_1.jsx — MediQ Pricing
 * Zocdoc-Clean v2:
 *  - Flat white hero, uniform slate-100 badge
 *  - Billing toggle: flat sliding white-pill on slate-100 track (same pattern as Home HIW)
 *  - Plan cards: rounded-xl, 1px border-gray-200, zero shadow, zero lift
 *  - Featured card: #1A1E26 deep navy fill — premium, not teal/gradient
 *  - All check icons: text-[#1A6BCC] strokeWidth 1.75
 *  - Comparison table: rounded-lg, flat dividers, no outer shadow
 *  - Mini FAQ accordion: flat border-b rows, no card boxes
 *  - CTA: singular primary button + ghost link
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  CreditCard,
  ArrowRight,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Data ────────────────────────────────────────────── */
const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price_m: "499",
    price_y: "4,999",
    desc: "Perfect for solo doctors just getting started.",
    cta: "Start for Free",
    ctaLink: "/contact",
    features: [
      "1 Doctor Profile",
      "100 Appointments / month",
      "Basic Live Queue",
      "SMS Notifications",
    ],
    notIncluded: ["E-Prescriptions", "Advanced Analytics", "Priority Support"],
    featured: false,
  },
  {
    key: "pro",
    name: "Professional",
    price_m: "999",
    price_y: "9,999",
    desc: "For busy clinics that need automation & speed.",
    cta: "Get Professional",
    ctaLink: "/contact",
    badge: "Most Popular",
    features: [
      "5 Doctor Profiles",
      "Unlimited Appointments",
      "Advanced Live Queue",
      "PDF E-Prescriptions",
      "SMS / WhatsApp Alerts",
      "Basic Analytics",
    ],
    notIncluded: ["Custom Branding", "24/7 Priority Support"],
    featured: true,
  },
  {
    key: "clinic",
    name: "Multi-Clinic",
    price_m: "4,999",
    price_y: "14,999",
    desc: "Advanced control for hospitals & chains.",
    cta: "Contact Sales",
    ctaLink: "/contact",
    features: [
      "Unlimited Doctors",
      "Unlimited Appointments",
      "Advanced Analytics",
      "Custom Branding",
      "24/7 Priority Support",
      "Top Search Listing",
    ],
    notIncluded: [],
    featured: false,
  },
];

const TABLE_ROWS = [
  { label: "Doctor Profiles",       s: "1",       p: "5",           c: "Unlimited" },
  { label: "Monthly Appointments",  s: "100",     p: "Unlimited",   c: "Unlimited" },
  { label: "Live Queue System",     s: "Basic",   p: "Advanced",    c: "Advanced"  },
  { label: "E-Prescriptions",       s: false,     p: true,          c: true        },
  { label: "SMS / WhatsApp Alerts", s: false,     p: true,          c: true        },
  { label: "Advanced Analytics",    s: false,     p: "Basic",       c: "Advanced"  },
  { label: "Support",               s: "Email",   p: "Email + Chat",c: "24/7 Priority" },
];

const FAQS = [
  { q: "Can I switch plans later?",           a: "Yes — upgrade or downgrade any time. Pro-rated charges apply automatically." },
  { q: "Is there a setup fee?",               a: "No. All plans include free onboarding resources. Enterprise gets managed setup." },
  { q: "What payment methods do you accept?", a: "All major credit cards (Visa, Mastercard), UPI, and mobile banking." },
];

/* ─── Sub-components ─────────────────────────────────── */

/** Flat accordion item for the mini FAQ */
function FaqRow({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className={`text-sm font-semibold transition-colors ${open ? "text-[#1A6BCC]" : "text-[#1A1E26] group-hover:text-[#1A6BCC]"}`}>
          {q}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={1.5}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-[#1A6BCC]" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Check / cross cell for comparison table */
function Cell({ val }) {
  if (val === true)  return <CheckCircle2 className="mx-auto text-[#1A6BCC]" size={16} strokeWidth={1.75} />;
  if (val === false) return <XCircle      className="mx-auto text-gray-200"   size={16} strokeWidth={1.75} />;
  return <span className="text-xs font-medium text-[#1A1E26]">{val}</span>;
}

/* ─── Main Page ─────────────────────────────────────── */
export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const getPrice = (plan) => billing === "monthly" ? plan.price_m : plan.price_y;

  return (
    <div className="min-h-screen bg-white text-[#1A1E26] font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200 pt-28 pb-14 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Uniform slate badge */}
          <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-3 py-1 rounded mb-6">
            <CreditCard size={11} strokeWidth={2} />
            Flexible Plans
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#1A1E26] tracking-tight leading-[1.08] mb-4">
            Transparent pricing for
            <br />
            <span className="text-[#1A6BCC]">practices of all sizes.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-10">
            No hidden fees. No credit card required for the free tier.
          </p>

          {/* ── Billing Toggle (flat sliding indicator) ── */}
          <div className="inline-flex items-center gap-3">
            <span className={`text-sm font-semibold transition-colors ${billing === "monthly" ? "text-[#1A1E26]" : "text-slate-400"}`}>
              Monthly
            </span>

            {/* Track */}
            <div
              role="switch"
              aria-checked={billing === "yearly"}
              className="relative flex bg-slate-100 rounded-lg p-1 cursor-pointer"
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
            >
              {/* Sliding white pill */}
              <div
                aria-hidden="true"
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm border border-gray-200 transition-transform duration-200 ease-out ${billing === "yearly" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"}`}
              />
              {["Monthly", "Yearly"].map((label) => (
                <span
                  key={label}
                  className={`relative z-10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide w-20 text-center transition-colors duration-150 ${
                    (billing === "monthly" && label === "Monthly") || (billing === "yearly" && label === "Yearly")
                      ? "text-[#1A1E26]"
                      : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            <span className={`text-sm font-semibold transition-colors ${billing === "yearly" ? "text-[#1A1E26]" : "text-slate-400"}`}>
              Yearly
            </span>

            {/* Save badge — uniform slate */}
            {billing === "yearly" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-wide px-2 py-0.5 rounded"
              >
                Save 20%
              </motion.span>
            )}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          PLAN CARDS
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-14 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={`relative flex flex-col rounded-xl border p-7 ${
                plan.featured
                  ? "bg-[#1A1E26] border-[#1A1E26] md:-mt-4 md:mb-4"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Most Popular badge — uniform, restrained */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-semibold bg-[#1A6BCC] text-white uppercase tracking-widest px-3 py-1 rounded">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name + desc */}
              <div className="mb-5">
                <h3 className={`text-base font-bold mb-1 ${plan.featured ? "text-white" : "text-[#1A1E26]"}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs leading-relaxed ${plan.featured ? "text-slate-400" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className={`flex items-baseline gap-1 ${plan.featured ? "text-white" : "text-[#1A1E26]"}`}>
                  <span className="text-3xl font-black tracking-tight">₹{getPrice(plan)}</span>
                  <span className={`text-sm font-medium ${plan.featured ? "text-slate-400" : "text-gray-400"}`}>/mo</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to={plan.ctaLink}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors duration-150 mb-7 ${
                  plan.featured
                    ? "bg-[#1A6BCC] hover:bg-[#155baa] text-white"
                    : "border border-gray-200 hover:border-slate-400 text-[#1A1E26]"
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </Link>

              {/* Feature list */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs font-medium">
                    <CheckCircle2
                      size={14}
                      strokeWidth={1.75}
                      className={plan.featured ? "text-[#1A6BCC] shrink-0" : "text-[#1A6BCC] shrink-0"}
                    />
                    <span className={plan.featured ? "text-slate-300" : "text-[#1A1E26]"}>{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs font-medium">
                    <XCircle
                      size={14}
                      strokeWidth={1.75}
                      className={plan.featured ? "text-slate-600 shrink-0" : "text-gray-200 shrink-0"}
                    />
                    <span className={plan.featured ? "text-slate-600" : "text-gray-300"}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ═══════════════════════════════════════════
          COMPARISON TABLE
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-[10px] font-semibold text-[#1A6BCC] uppercase tracking-widest mb-2">Compare</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight">
              Plan comparison
            </h2>
          </div>

          {/* Flat table — rounded-lg, 1px border, no shadow */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="px-5 py-3.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.key}
                      className={`px-5 py-3.5 text-center text-xs font-bold ${p.featured ? "text-[#1A6BCC]" : "text-[#1A1E26]"}`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TABLE_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-[#1A1E26]">{row.label}</td>
                    <td className="px-5 py-3.5 text-center text-slate-500"><Cell val={row.s} /></td>
                    <td className="px-5 py-3.5 text-center font-semibold"><Cell val={row.p} /></td>
                    <td className="px-5 py-3.5 text-center text-slate-500"><Cell val={row.c} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ═══════════════════════════════════════════
          MINI FAQ
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <p className="text-[10px] font-semibold text-[#1A6BCC] uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight">
              Common questions
            </h2>
          </div>

          {/* Flat accordion — white container, border-b rows */}
          <div className="bg-white border border-gray-200 rounded-lg px-6">
            {FAQS.map((item) => (
              <FaqRow key={item.q} {...item} />
            ))}
          </div>

          <p className="mt-5 text-xs text-slate-400 text-center">
            Still have questions?{" "}
            <Link to="/faq" className="text-[#1A6BCC] hover:underline underline-offset-2 font-semibold">
              Visit our full Help Center →
            </Link>
          </p>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-gray-200" />

      {/* ═══════════════════════════════════════════
          CTA PANEL
      ═══════════════════════════════════════════ */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
              <span className="inline-block text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded mb-4">
                Get Started Today
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1E26] tracking-tight leading-tight mb-3">
                Start your free trial. No card needed.
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Pick any plan and set up your clinic in under 5 minutes. Upgrade, downgrade, or cancel anytime.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-center gap-4 shrink-0">
              <Link
                to="/contact"
                id="pricing-cta-btn"
                className="flex items-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-sm px-7 py-3.5 rounded-lg transition-colors duration-150 active:scale-95 whitespace-nowrap"
              >
                Start for Free
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/features"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#1A1E26] transition-colors group"
              >
                <ChevronRight size={13} strokeWidth={1.5} className="text-slate-400 group-hover:text-[#1A6BCC] transition-colors" />
                <span className="underline-offset-2 group-hover:underline">See all features first</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}