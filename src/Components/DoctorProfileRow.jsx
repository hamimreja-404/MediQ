/**
 * COMPONENT A — DoctorProfileRow
 * Zocdoc-Clean Doctor Search Result Row
 *
 * Props:
 *  doctor  – { _id, fullName, image, specialization, degree, college,
 *               clinicName, location, fees, experience, rating,
 *               reviewCount, isVerified, isOnline, timing }
 *  onBookSlot(doctorId, date, time) – called when a time badge is clicked
 */

import React, { useMemo } from "react";
import { Star, MapPin, CheckCircle, Award, GraduationCap } from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────── */

const FALLBACK_IMG =
  "https://plus.unsplash.com/premium_vector-1728572090276-1fcf27ce399d?w=800&auto=format&fit=crop&q=60";

/**
 * Return next N calendar days starting tomorrow,
 * each with 3 mock available time-slots.
 */
function useNextSlots(n = 3) {
  return useMemo(() => {
    const slots = [];
    const base = new Date();
    const TIMES = [
      ["10:30 AM", "11:15 AM", "12:00 PM"],
      ["09:00 AM", "10:45 AM", "02:30 PM"],
      ["11:00 AM", "01:15 PM", "03:30 PM"],
    ];
    for (let i = 1; i <= n; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      slots.push({
        label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        isoDate: d.toISOString().split("T")[0],
        times: TIMES[(i - 1) % 3],
      });
    }
    return slots;
  }, [n]);
}

function StarRating({ rating = 4.5, reviewCount = 0 }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={
              i < full
                ? "text-amber-400 fill-amber-400"
                : hasHalf && i === full
                ? "text-amber-300 fill-amber-300"
                : "text-gray-200 fill-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-[#1A1E26]">{rating.toFixed(1)}</span>
      {reviewCount > 0 && (
        <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */

export default function DoctorProfileRow({ doctor, onBookSlot, onViewProfile }) {
  const slots = useNextSlots(3);

  if (!doctor) return null;

  const {
    _id,
    fullName = "Dr. Unknown",
    image,
    specialization = "General Physician",
    degree = "MBBS",
    college = "",
    clinicName = "City Clinic",
    location = "—",
    fees = 0,
    experience = 0,
    rating = 4.5,
    reviewCount = 0,
    isVerified = false,
    isOnline = true,
  } = doctor;

  return (
    <article
      className="w-full bg-white border border-gray-200 rounded-xl hover:border-[#1A6BCC] transition-colors duration-200 group"
      aria-label={`Doctor profile for ${fullName}`}
    >
      <div className="flex flex-col md:flex-row md:divide-x md:divide-gray-100">

        {/* ── LEFT COLUMN: Avatar + Credentials ───────────── */}
        <div 
          onClick={() => onViewProfile?.(_id)}
          className="flex items-start gap-4 p-5 md:w-60 lg:w-72 shrink-0 cursor-pointer"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
              <img
                src={image || FALLBACK_IMG}
                alt={fullName}
                onError={(e) => { e.target.src = FALLBACK_IMG; }}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online dot */}
            <span
              className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-gray-300"}`}
              title={isOnline ? "Available today" : "Offline"}
            />
          </div>

          {/* Name + credentials */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-[#1A1E26] tracking-tight leading-snug">
                {fullName}
              </h3>
              {isVerified && (
                <Award size={14} className="text-[#1A6BCC] shrink-0" title="Verified Doctor" />
              )}
            </div>

            {/* Degree + College */}
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-500">
              <GraduationCap size={11} className="shrink-0" />
              <span className="truncate">{degree}{college ? ` · ${college}` : ""}</span>
            </div>

            {/* Star rating */}
            <div className="mt-2">
              <StarRating rating={rating} reviewCount={reviewCount} />
            </div>

            {/* Experience badge */}
            <div className="mt-2">
              <span className="inline-block text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {experience}+ yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* ── MIDDLE COLUMN: Details ───────────────────────── */}
        <div 
          onClick={() => onViewProfile?.(_id)}
          className="flex flex-col justify-center gap-3 px-5 py-4 flex-1 min-w-0 cursor-pointer"
        >
          {/* Specialty chip */}
          <div>
            <span className="inline-block text-[11px] font-bold text-[#1A6BCC] bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {specialization}
            </span>
          </div>

          {/* Clinic + location */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
            <span className="truncate">
              <span className="font-medium text-[#1A1E26]">{clinicName}</span>
              {" · "}
              {location}
            </span>
          </div>

          {/* In-network + fee row */}
          <div className="flex items-center flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle size={13} className="fill-emerald-50" />
              In-Network
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle size={13} className="fill-emerald-50" />
              Verified Profile
            </div>
            <div className="ml-auto font-bold text-[#1A1E26] text-sm">
              ₹{fees}{" "}
              <span className="text-[11px] font-normal text-gray-400">/ visit</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Inline slot calendar ──────────── */}
        <div className="px-4 py-4 flex gap-2 overflow-x-auto md:overflow-x-visible scrollbar-none md:justify-end shrink-0">
          {slots.map((day) => (
            <div
              key={day.isoDate}
              className="flex flex-col gap-1.5 min-w-[96px]"
            >
              {/* Day header */}
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center whitespace-nowrap">
                {day.label}
              </p>

              {/* Time slot badges */}
              {day.times.map((time) => (
                <button
                  key={time}
                  id={`slot-${_id}-${day.isoDate}-${time.replace(/\s|:/g, "")}`}
                  onClick={() => onBookSlot?.(_id, day.isoDate, time)}
                  className="w-full text-center text-xs font-semibold text-[#1A6BCC] bg-blue-50 hover:bg-[#1A6BCC] hover:text-white border border-blue-100 hover:border-[#1A6BCC] rounded-lg py-1.5 px-2 transition-all duration-150 active:scale-95 whitespace-nowrap"
                >
                  {time}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
