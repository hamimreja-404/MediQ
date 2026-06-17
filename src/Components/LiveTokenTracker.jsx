/**
 * COMPONENT B — LiveTokenTracker
 * Zocdoc-Clean flat WebSocket queue tracker widget
 *
 * Props:
 *  myToken       – number  (the patient's own token)
 *  currentToken  – number  (live token being served, from socket.io)
 *  isConnected   – boolean (WebSocket connection status)
 *  doctorName    – string
 *  appointmentDate – string (ISO date)
 *
 * Usage inside PatientDashboard:
 *   <LiveTokenTracker
 *     myToken={upcoming.tokenNumber}
 *     currentToken={currentToken}
 *     isConnected={socketConnected}
 *     doctorName={upcoming.doctorId.fullName}
 *     appointmentDate={upcoming.appointmentDate}
 *   />
 */

import React, { useMemo } from "react";
import { Clock, CalendarDays } from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────── */

const AVG_MINS_PER_PATIENT = 15;

function calcWait(myToken, currentToken) {
  if (myToken < currentToken) return { label: "Turn passed", urgent: false };
  if (myToken === currentToken) return { label: "It's your turn!", urgent: true };
  const ahead = myToken - currentToken;
  const mins = ahead * AVG_MINS_PER_PATIENT;
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return { label: `~${h}h ${m}m wait`, ahead, urgent: false };
  }
  return { label: `~${mins} min wait`, ahead, urgent: false };
}

/* ─── Sub-components ─────────────────────────────────── */

function QueueStatusBadge({ ahead, urgent }) {
  if (urgent) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        Your turn now
      </span>
    );
  }
  if (ahead <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
        Turn passed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
      {ahead} {ahead === 1 ? "patient" : "patients"} ahead of you
    </span>
  );
}

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div
        className="h-full bg-[#1A6BCC] rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */

export default function LiveTokenTracker({
  myToken = 12,
  currentToken = 8,
  isConnected = true,
  doctorName = "Dr. Unknown",
  appointmentDate,
}) {
  const { label, ahead, urgent } = useMemo(
    () => calcWait(myToken, currentToken),
    [myToken, currentToken]
  );

  const dateLabel = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <section
      id="live-token-tracker"
      aria-label="Live appointment queue tracker"
      className="w-full bg-white border border-gray-200 rounded-xl"
    >
      {/* ── Header bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? "bg-emerald-500" : "bg-gray-300"}`}
            title={isConnected ? "Live connection active" : "Disconnected"}
          />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Live Queue
          </span>
          {!isConnected && (
            <span className="text-[10px] text-gray-400">(reconnecting…)</span>
          )}
        </div>
        {dateLabel && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <CalendarDays size={12} />
            {dateLabel}
          </div>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="px-5 py-5">
        {/* Doctor */}
        <p className="text-xs text-gray-400 font-medium mb-1">
          Appointment with{" "}
          <span className="text-[#1A1E26] font-semibold">{doctorName}</span>
        </p>

        {/* Token numbers row */}
        <div className="flex items-end gap-6 mt-3">
          {/* My token – big hero number */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Your Token
            </p>
            <p
              className={`text-6xl font-black tracking-tighter leading-none ${urgent ? "text-rose-600" : "text-[#1A1E26]"}`}
              aria-live="polite"
            >
              {myToken}
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-gray-100 self-center" />

          {/* Current live token */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Now Serving
            </p>
            <p className="text-3xl font-black text-[#1A6BCC] tracking-tighter leading-none">
              {currentToken}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <ProgressBar value={currentToken} max={myToken} />
        </div>

        {/* Status text + badge */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <QueueStatusBadge ahead={ahead} urgent={urgent} />

          {/* Wait time chip */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Clock size={12} />
            {label}
          </div>
        </div>
      </div>
    </section>
  );
}
