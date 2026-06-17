/**
 * ZocdocShowcase.jsx — Live preview page for all three Zocdoc-Clean components
 *
 * Route: /zocdoc-showcase  (add to App.jsx to preview)
 *
 * This file exists purely so developers can visually inspect all three
 * components with realistic mock data. Delete or gate it before production.
 */

import React, { useState } from "react";
import DoctorProfileRow from "../Components/DoctorProfileRow";
import LiveTokenTracker from "../Components/LiveTokenTracker";
import AppointmentBookingForm from "../Components/AppointmentBookingForm";

/* ─── Mock Data ─────────────────────────────────────── */

const MOCK_DOCTORS = [
  {
    _id: "doc001",
    fullName: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    degree: "MD, DM Cardiology",
    college: "AIIMS Delhi",
    clinicName: "Heart Care Centre",
    location: "Bandra West, Mumbai",
    fees: 800,
    experience: 14,
    rating: 4.9,
    reviewCount: 312,
    isVerified: true,
    isOnline: true,
    image: null,
  },
  {
    _id: "doc002",
    fullName: "Dr. Arjun Mehta",
    specialization: "Dermatologist",
    degree: "MBBS, MD Dermatology",
    college: "Grant Medical College",
    clinicName: "SkinFirst Clinic",
    location: "Koregaon Park, Pune",
    fees: 600,
    experience: 9,
    rating: 4.7,
    reviewCount: 184,
    isVerified: true,
    isOnline: false,
    image: null,
  },
];

const MOCK_DOCTOR_FOR_FORM = {
  _id: "doc001",
  fullName: "Priya Sharma",
  specialization: "Cardiologist",
  clinicName: "Heart Care Centre",
  location: "Bandra West, Mumbai",
  fees: 800,
};

const MOCK_DATE = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // tomorrow

/* ─── Section wrapper ────────────────────────────────── */

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-14">
      <div className="mb-5">
        <div className="inline-block text-[11px] font-bold text-[#1A6BCC] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
          Component Preview
        </div>
        <h2 className="text-xl font-bold text-[#1A1E26] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

/* ─── Live Token Demo Controls ─────────────────────── */

function TokenDemoControls({ currentToken, myToken, onAdvance }) {
  return (
    <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
      <span className="text-xs font-semibold text-gray-500">Simulate queue advance:</span>
      <button
        onClick={onAdvance}
        disabled={currentToken >= myToken}
        className="text-xs font-bold text-white bg-[#1A6BCC] hover:bg-[#155baa] px-3 py-1.5 rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Call Next Patient →
      </button>
      <span className="text-xs text-gray-400">
        Token {currentToken} / {myToken} serving
      </span>
    </div>
  );
}

/* ─── Main Showcase ─────────────────────────────────── */

export default function ZocdocShowcase() {
  const [liveToken, setLiveToken] = useState(5);
  const MY_TOKEN = 12;

  const handleBookSlot = (doctorId, date, time) => {
    alert(`Slot clicked!\nDoctor ID: ${doctorId}\nDate: ${date}\nTime: ${time}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 mb-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block text-[11px] font-bold text-[#1A6BCC] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            MediQ · Zocdoc-Clean Design System
          </div>
          <h1 className="text-3xl font-black text-[#1A1E26] tracking-tight mb-2">
            Component Showcase
          </h1>
          <p className="text-gray-500 text-sm max-w-xl">
            All three redesigned components rendered with live mock data. Use these as
            drop-in replacements in your existing routes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">

        {/* ─── Component A ─── */}
        <Section
          title="A · Doctor Profile Row"
          subtitle="Dense horizontal search result row with inline time-slot calendar. Click a time badge to trigger onBookSlot()."
        >
          <div className="space-y-3">
            {MOCK_DOCTORS.map((doc) => (
              <DoctorProfileRow
                key={doc._id}
                doctor={doc}
                onBookSlot={handleBookSlot}
              />
            ))}
          </div>

          {/* Integration note */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700 font-medium">
            <strong>Drop-in:</strong> Replace the{" "}
            <code className="bg-amber-100 px-1 rounded">motion.div</code> grid
            cards in <code className="bg-amber-100 px-1 rounded">DoctorList.jsx</code>{" "}
            with <code className="bg-amber-100 px-1 rounded">&lt;DoctorProfileRow doctor={"{doc}"} onBookSlot={"{handleBookSlot}"} /&gt;</code>.
          </div>
        </Section>

        {/* ─── Component B ─── */}
        <Section
          title="B · Live Token Tracker"
          subtitle="Flat WebSocket queue panel. Advance the token with the control below to see it react."
        >
          <div className="max-w-md">
            <LiveTokenTracker
              myToken={MY_TOKEN}
              currentToken={liveToken}
              isConnected={true}
              doctorName="Dr. Priya Sharma"
              appointmentDate={MOCK_DATE}
            />
            <TokenDemoControls
              currentToken={liveToken}
              myToken={MY_TOKEN}
              onAdvance={() => setLiveToken((t) => Math.min(t + 1, MY_TOKEN))}
            />
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700 font-medium">
            <strong>Drop-in:</strong> Replace the dark <code className="bg-amber-100 px-1 rounded">bg-slate-900</code>{" "}
            Token Progress card in <code className="bg-amber-100 px-1 rounded">PatientDashboard.jsx</code>{" "}
            (lines 427–457) with{" "}
            <code className="bg-amber-100 px-1 rounded">&lt;LiveTokenTracker myToken={"{upcoming.tokenNumber}"} currentToken={"{currentToken}"} isConnected={"{socketConnected}"} /&gt;</code>.
          </div>
        </Section>

        {/* ─── Component C ─── */}
        <Section
          title="C · Appointment Booking Form"
          subtitle="Accessible, single-column form with flat focus borders, inline validation, and a confirmation sheet."
        >
          <AppointmentBookingForm
            doctor={MOCK_DOCTOR_FOR_FORM}
            appointmentDate={MOCK_DATE}
            onSuccess={(token) => alert(`Success! Token: ${token}`)}
            onBack={() => alert("Back pressed")}
          />

          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700 font-medium">
            <strong>Drop-in:</strong> Use instead of <code className="bg-amber-100 px-1 rounded">BookAppointment.jsx</code>.
            Pass <code className="bg-amber-100 px-1 rounded">doctor</code>, <code className="bg-amber-100 px-1 rounded">appointmentDate</code>,{" "}
            <code className="bg-amber-100 px-1 rounded">onSuccess</code>, and <code className="bg-amber-100 px-1 rounded">onBack</code> props.
            The same <code className="bg-amber-100 px-1 rounded">/appointment/book-appointment</code> API endpoint is called.
          </div>
        </Section>

      </div>
    </div>
  );
}
