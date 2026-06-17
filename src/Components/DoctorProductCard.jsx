/**
 * COMPONENT — DoctorProductCard
 * Zocdoc-Clean v2 Doctor Search Result Card (Product-style)
 *
 * Props:
 *  doctor  – { _id, fullName, image, specialization, degree, college,
 *               clinicName, location, fees, experience, rating,
 *               reviewCount, isVerified, isOnline }
 *  onBookSlot(doctorId, date, time) – called when a time badge is clicked
 *  onViewProfile(doctorId) – called when the card info is clicked
 */

import React, { useMemo } from "react";
import { Star, MapPin, Award, GraduationCap, CheckCircle } from "lucide-react";

const FALLBACK_IMG =
  "https://plus.unsplash.com/premium_vector-1728572090276-1fcf27ce399d?w=800&auto=format&fit=crop&q=60";

export default function DoctorProductCard({ doctor, onBookSlot, onViewProfile }) {
  // Generate tomorrow's date and mock times for direct transactional booking
  const slotData = useMemo(() => {
    const base = new Date();
    const tomorrow = new Date(base);
    tomorrow.setDate(base.getDate() + 1);
    
    // Choose times based on doctor's ID char code to make them look dynamic
    const charCode = doctor?._id ? doctor._id.charCodeAt(doctor._id.length - 1) : 0;
    const TIMES_OPTIONS = [
      ["09:00 AM", "10:30 AM", "12:00 PM"],
      ["10:00 AM", "11:15 AM", "01:30 PM"],
      ["11:00 AM", "01:45 PM", "03:30 PM"],
      ["02:00 PM", "03:15 PM", "04:30 PM"],
    ];
    
    return {
      label: tomorrow.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      isoDate: tomorrow.toISOString().split("T")[0],
      times: TIMES_OPTIONS[charCode % 4],
    };
  }, [doctor?._id]);

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
    rating = 4.8,
    reviewCount = 142,
    isVerified = false,
    isOnline = true,
  } = doctor;

  // Generate deterministic but realistic rating & review count if missing
  const displayRating = rating || 4.7;
  const displayReviews = reviewCount || 98;

  return (
    <article
      className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:border-[#1A6BCC] transition-all duration-200 group h-full"
      aria-label={`Doctor profile for ${fullName}`}
    >
      {/* ── TOP SECTION: Image + Overlays ── */}
      <div
        onClick={() => onViewProfile?.(_id)}
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden shrink-0 cursor-pointer"
      >
        <img
          src={image || FALLBACK_IMG}
          alt={fullName}
          onError={(e) => {
            e.target.src = FALLBACK_IMG;
          }}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-[11px] font-bold text-[#1A1E26] flex items-center gap-1 shadow-xs">
          <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
          <span>{displayRating.toFixed(1)}</span>
          <span className="text-gray-400 font-normal">({displayReviews})</span>
        </div>

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-full shadow-xs text-[#1A6BCC]">
            <Award size={14} className="stroke-[2.5]" title="Verified Doctor" />
          </div>
        )}

        {/* Online Status Dot */}
        <span
          className={`absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full border-2 border-white ${
            isOnline ? "bg-emerald-500" : "bg-gray-300"
          }`}
          title={isOnline ? "Online & Available" : "Offline"}
        />
      </div>

      {/* ── MIDDLE SECTION: Info ── */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div
          onClick={() => onViewProfile?.(_id)}
          className="cursor-pointer"
        >
          {/* Specialty Chip */}
          <span className="inline-block text-[10px] font-bold text-[#1A6BCC] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider mb-2">
            {specialization}
          </span>

          {/* Doctor Name */}
          <h3 className="text-base font-bold text-[#1A1E26] leading-snug tracking-tight group-hover:text-[#1A6BCC] transition-colors line-clamp-1">
            {fullName}
          </h3>

          {/* Degree & College */}
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <GraduationCap size={13} className="shrink-0 text-gray-400" />
            <span className="truncate">
              {degree} {college ? ` · ${college}` : ""}
            </span>
          </div>

          {/* Experience tag */}
          <p className="text-[11px] font-medium text-gray-400 mt-1">
            {experience}+ years clinical experience
          </p>

          {/* Location / Clinic */}
          <div className="flex items-start gap-1.5 mt-3 text-xs text-gray-500">
            <MapPin size={13} className="shrink-0 mt-0.5 text-gray-400" />
            <span className="line-clamp-2">
              <span className="font-semibold text-gray-700">{clinicName}</span>
              {" · "}
              {location}
            </span>
          </div>
        </div>

        {/* ── BOTTOM SECTION: Price + Direct Booking slots ── */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col justify-end">
          {/* Fees & Network Row */}
          <div className="flex justify-between items-center mb-3 text-xs">
            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle size={12} className="fill-emerald-50" />
              In-Network
            </div>
            <div className="font-bold text-[#1A1E26] text-sm">
              ₹{fees}{" "}
              <span className="text-[10px] font-normal text-gray-400">/ visit</span>
            </div>
          </div>

          {/* Booking Slots Row */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex justify-between items-center mb-1.5 px-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Tomorrow ({slotData.label})
              </span>
              <span className="text-[9px] font-semibold text-[#1A6BCC]">
                Direct Book
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {slotData.times.map((time) => (
                <button
                  key={time}
                  id={`slot-${_id}-${slotData.isoDate}-${time.replace(/\s|:/g, "")}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card navigation
                    onBookSlot?.(_id, slotData.isoDate, time);
                  }}
                  className="text-center text-[10px] font-bold text-[#1A6BCC] bg-white hover:bg-[#1A6BCC] hover:text-white border border-blue-100 hover:border-[#1A6BCC] rounded-md py-1 px-1 transition-all duration-150 active:scale-95 whitespace-nowrap"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
