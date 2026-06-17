/**
 * Footer.jsx — MediQ
 * Zocdoc-Clean v2 refinements:
 *  - Brand column aligns flush to the right-side column grid
 *  - Footer links: text-slate-500 hover:text-slate-900 transition-colors
 *  - Uniform crisp slate-100 border, flat white background
 *  - Column headings: text-[#1A1E26] font-semibold (not heavy bold)
 *  - Logo mark: slate-100 bg with slate-700 icon (no teal fill)
 */
import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

const LINKS = {
  Product: [
    { to: "/features", label: "Features" },
    { to: "/pricing",  label: "Pricing"  },
    { to: "/faq",      label: "FAQ"      },
  ],
  Company: [
    { to: "/about",   label: "About Us" },

  ],

};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Main grid ──────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700">
                <Stethoscope size={16} strokeWidth={1.75} />
              </div>
              <span className="text-base font-black text-[#1A1E26] tracking-tight">
                MediQ
              </span>
            </Link>

            {/* Brand description — aligns with column top */}
            <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">
              Simplifying healthcare access for everyone, everywhere.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-[#1A1E26] uppercase tracking-widest mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ─────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            &copy; {year} MediQ Healthcare Systems. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}