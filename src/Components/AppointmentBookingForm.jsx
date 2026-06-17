/**
 * COMPONENT C — AppointmentBookingForm
 * Zocdoc-Clean, accessible single-column booking form
 *
 * Props:
 *  doctor  – { _id, fullName, specialization, clinicName, location, fees }
 *  appointmentDate – string (ISO "YYYY-MM-DD")
 *  onSuccess(tokenNumber) – called after a successful booking
 *  onBack() – called when user wants to go back
 *
 * The form mirrors the existing BookAppointment.jsx API contract so it can
 * be used as a drop-in replacement with zero backend changes.
 */

import React, { useState } from "react";
import {
  User,
  Users,
  Phone,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Info,
  Stethoscope,
  MapPin,
  ArrowLeft,
  X,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ─── Design tokens (matching Zocdoc-Clean palette) ──── */
const CLS = {
  label:
    "block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase",
  input:
    "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-[#1A1E26] placeholder:text-gray-400 focus:outline-none focus:border-[#1A6BCC] focus:ring-2 focus:ring-[#1A6BCC]/15 transition-all duration-150 disabled:bg-[#F4F5F7] disabled:text-gray-400 disabled:cursor-not-allowed",
  inputError:
    "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15",
};

/* ─── Field Components ───────────────────────────────── */

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={CLS.label}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-rose-500 font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
}

/* ─── Tab Toggle ─────────────────────────────────────── */

function BookingModeToggle({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Booking for"
      className="flex bg-[#F4F5F7] rounded-lg p-1 gap-1"
    >
      {[
        { key: "self", icon: <User size={14} />, label: "Myself" },
        { key: "other", icon: <Users size={14} />, label: "Someone Else" },
      ].map(({ key, icon, label }) => (
        <button
          key={key}
          role="tab"
          type="button"
          id={`booking-tab-${key}`}
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-semibold transition-all duration-150 ${
            value === key
              ? "bg-white text-[#1A6BCC] shadow-sm"
              : "text-gray-500 hover:text-[#1A1E26]"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─── Confirmation Sheet ─────────────────────────────── */

function ConfirmationSheet({
  formData,
  doctor,
  appointmentDate,
  bookingFor,
  onConfirm,
  onClose,
  isSubmitting,
}) {
  const dateStr = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1E26]/50"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Sheet */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#1A1E26]">Review Booking</h2>
          {!isSubmitting && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Summary rows */}
        <div className="px-6 py-5 space-y-3">
          {[
            { label: "Doctor", value: `Dr. ${doctor?.fullName ?? "—"}` },
            { label: "Patient", value: formData.name || "—" },
            { label: "Date", value: dateStr },
            {
              label: "Consultation Fee",
              value: doctor?.fees ? `₹${doctor.fees}` : "Free",
              highlight: true,
            },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {label}
              </span>
              <span
                className={`text-sm font-semibold ${highlight ? "text-[#1A6BCC]" : "text-[#1A1E26]"}`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <button
            id="confirm-booking-btn"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold py-3.5 rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Confirming…
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirm &amp; Book
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Success State ─────────────────────────────────── */

function BookingSuccess({ tokenNumber, onDone }) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-4">
        <CheckCircle2 size={32} className="text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold text-[#1A1E26] mb-1">Booking Confirmed!</h2>
      <p className="text-sm text-gray-500 mb-8">Your appointment is scheduled.</p>

      {/* Token number panel */}
      <div className="w-full border border-gray-200 rounded-xl p-6 mb-8 bg-[#F4F5F7]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Your Queue Token
        </p>
        <p className="text-6xl font-black text-[#1A6BCC] tracking-tighter">
          {tokenNumber}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Show this at the clinic reception
        </p>
      </div>

      <button
        id="go-home-btn"
        onClick={onDone}
        className="w-full bg-[#1A1E26] hover:bg-[#2c3345] text-white font-bold py-3.5 rounded-xl transition-all text-sm"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

/* ─── Validation ─────────────────────────────────────── */

function validate(formData, bookingFor) {
  const errs = {};
  if (!formData.name.trim()) errs.name = "Full name is required.";
  if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120)
    errs.age = "Enter a valid age.";
  if (!formData.gender) errs.gender = "Please select a gender.";
  if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, "")))
    errs.phone = "Enter a valid 10-digit phone number.";
  if (!formData.reason) errs.reason = "Please select a reason for the visit.";
  if (bookingFor === "other" && !formData.relation)
    errs.relation = "Please specify the relationship.";
  return errs;
}

/* ─── Main Export ────────────────────────────────────── */

export default function AppointmentBookingForm({
  doctor = null,
  appointmentDate = null,
  onSuccess,
  onBack,
}) {
  const [bookingFor, setBookingFor] = useState("self");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    relation: "",
    reason: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenResult, setTokenResult] = useState(null);

  /* Pre-fill self data if available in localStorage */
  React.useEffect(() => {
    const stored = localStorage.getItem("mediq_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setFormData((p) => ({
          ...p,
          name: u.fullName || p.name,
          phone: u.mobile || p.phone,
          gender: u.gender || p.gender,
        }));
      } catch (_) {}
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleModeChange = (mode) => {
    setBookingFor(mode);
    setErrors({});
  };

  const handleReview = () => {
    const errs = validate(formData, bookingFor);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstId = Object.keys(errs)[0];
      document.getElementById(`field-${firstId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setShowConfirm(true);
  };

  const handleBookNow = async () => {
    setIsSubmitting(true);
    const payload = {
      doctorId: doctor?._id,
      appointmentDate,
      patientType: bookingFor,
      patientDetails: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        relation: bookingFor === "self" ? "self" : formData.relation,
      },
      reason: formData.reason,
      notes: formData.notes,
    };

    try {
      const res = await fetch(`${API_BASE}/appointment/book-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        const token = result.tokenNumber ?? "T-01";
        setTokenResult(token);
        setShowConfirm(false);
        onSuccess?.(token);
      } else {
        throw new Error(result.message || "Booking failed.");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success view ─────────────────────────── */
  if (tokenResult) {
    return (
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl">
        <BookingSuccess tokenNumber={tokenResult} onDone={onBack} />
      </div>
    );
  }

  return (
    <>
      {/* ── Form shell ────────────────────────── */}
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden">

        {/* ── Sticky doctor context bar ────────── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-[#F4F5F7]">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#1A1E26] transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
            <Stethoscope size={18} className="text-[#1A6BCC]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500">Booking appointment</p>
            <p className="text-sm font-bold text-[#1A1E26] truncate">
              Dr. {doctor?.fullName ?? "—"}
              {doctor?.specialization && (
                <span className="font-normal text-gray-500">
                  {" · "}
                  {doctor.specialization}
                </span>
              )}
            </p>
          </div>
          {doctor?.location && (
            <div className="ml-auto flex items-center gap-1 text-xs text-gray-400 shrink-0">
              <MapPin size={11} />
              <span className="hidden sm:block">{doctor.location}</span>
            </div>
          )}
        </div>

        {/* ── Form body ──────────────────────── */}
        <div className="px-6 py-6 space-y-6">

          {/* Booking mode */}
          <section aria-labelledby="booking-for-heading">
            <p id="booking-for-heading" className={CLS.label}>
              Booking for
            </p>
            <BookingModeToggle value={bookingFor} onChange={handleModeChange} />
          </section>

          {/* Date info pill */}
          {appointmentDate && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
              <Info size={16} className="mt-0.5 shrink-0 text-[#1A6BCC]" />
              <p>
                Appointment scheduled for{" "}
                <strong className="font-semibold">
                  {new Date(appointmentDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </strong>
                . A unique queue token will be issued upon confirmation.
              </p>
            </div>
          )}

          {/* ── Patient details section ─────── */}
          <section aria-labelledby="patient-details-heading">
            <h2
              id="patient-details-heading"
              className="text-sm font-bold text-[#1A1E26] mb-4"
            >
              Patient Details
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <Field id="field-name" label="Full Name *" error={errors.name}>
                <input
                  id="field-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={bookingFor === "self" && !!formData.name && !errors.name}
                  placeholder="Patient's full name"
                  className={`${CLS.input} ${errors.name ? CLS.inputError : ""}`}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "field-name-error" : undefined}
                />
              </Field>

              {/* Age + Gender row */}
              <div className="grid grid-cols-2 gap-4">
                <Field id="field-age" label="Age *" error={errors.age}>
                  <input
                    id="field-age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Years"
                    className={`${CLS.input} ${errors.age ? CLS.inputError : ""}`}
                    aria-required="true"
                    aria-invalid={!!errors.age}
                  />
                </Field>

                <Field id="field-gender" label="Gender *" error={errors.gender}>
                  <select
                    id="field-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={bookingFor === "self" && !!formData.gender}
                    className={`${CLS.input} appearance-none ${errors.gender ? CLS.inputError : ""}`}
                    aria-required="true"
                    aria-invalid={!!errors.gender}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>

              {/* Phone */}
              <Field id="field-phone" label="Phone Number *" error={errors.phone}>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="field-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`${CLS.input} pl-10 ${errors.phone ? CLS.inputError : ""}`}
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                  />
                </div>
              </Field>

              {/* Relationship — only when bookingFor === "other" */}
              {bookingFor === "other" && (
                <Field id="field-relation" label="Relationship *" error={errors.relation}>
                  <select
                    id="field-relation"
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    className={`${CLS.input} appearance-none ${errors.relation ? CLS.inputError : ""}`}
                    aria-required="true"
                    aria-invalid={!!errors.relation}
                  >
                    <option value="">Select relationship</option>
                    <option>Parent</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Sibling</option>
                    <option>Friend</option>
                    <option>Other</option>
                  </select>
                </Field>
              )}
            </div>
          </section>

          {/* ── Visit info section ───────────── */}
          <section aria-labelledby="visit-info-heading">
            <h2
              id="visit-info-heading"
              className="text-sm font-bold text-[#1A1E26] mb-4"
            >
              Visit Information
            </h2>

            <div className="space-y-4">
              {/* Reason */}
              <Field id="field-reason" label="Reason for Visit *" error={errors.reason}>
                <select
                  id="field-reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={`${CLS.input} appearance-none ${errors.reason ? CLS.inputError : ""}`}
                  aria-required="true"
                  aria-invalid={!!errors.reason}
                >
                  <option value="">Select a reason</option>
                  <option>General Checkup</option>
                  <option>Follow-up Visit</option>
                  <option>Sudden Fever / Pain</option>
                  <option>Report Analysis</option>
                  <option>Prescription Renewal</option>
                  <option>Other</option>
                </select>
              </Field>

              {/* Notes */}
              <Field id="field-notes" label="Additional Notes (optional)">
                <textarea
                  id="field-notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any symptoms, allergies, or additional context for the doctor…"
                  className={`${CLS.input} resize-none`}
                />
              </Field>
            </div>
          </section>
        </div>

        {/* ── Sticky footer CTA ──────────────── */}
        <div className="px-6 pb-6">
          <button
            id="review-booking-btn"
            onClick={handleReview}
            className="w-full flex items-center justify-center gap-2 bg-[#1A6BCC] hover:bg-[#155baa] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all duration-150 text-sm"
          >
            Review &amp; Confirm
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Confirmation modal ──────────────── */}
      {showConfirm && (
        <ConfirmationSheet
          formData={formData}
          doctor={doctor}
          appointmentDate={appointmentDate}
          bookingFor={bookingFor}
          onConfirm={handleBookNow}
          onClose={() => setShowConfirm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
