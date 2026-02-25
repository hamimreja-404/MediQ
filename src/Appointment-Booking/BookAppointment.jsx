
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Info,
  MapPin,
  Phone,
  X,
  Ticket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:5000/api";

const CURRENT_USER = {
  name: "Arjun Kumar",
  age: 28,
  gender: "Male",
  phone: "9876543210"
};

export default function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const doctorId = searchParams.get("doctorId");
  const appointmentDate = searchParams.get("date");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingFor, setBookingFor] = useState("self");
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenResult, setTokenResult] = useState(null);

  const [formData, setFormData] = useState({
    name: CURRENT_USER.name,
    age: CURRENT_USER.age,
    gender: CURRENT_USER.gender,
    phone: CURRENT_USER.phone,
    relation: "",
    reason: "",
    notes: ""
  });

  // Fetch Doctor Details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/doctor/doctor-id/${doctorId}`);
        if (!response.ok) throw new Error("Failed to fetch doctor details");
        const data = await response.json();
        console.log("Doctor Data:", data);
        setDoctor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenSummary = () => {
    setShowSummary(true);
  };

  const handleBookNow = async () => {
    setIsSubmitting(true);
    const payload = {
      doctorId,
      appointmentDate: appointmentDate,
      patientType: bookingFor,
      patientDetails: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        relation: bookingFor === "self" ? "self" : formData.relation
      },
      reason: formData.reason,
      notes: formData.notes
    };

    console.log("Submitting Booking Data:", payload);

    try {
      const response = await fetch(`${API_BASE}/appointment/book-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      console.log("Booking Response:", result);
      if (response.ok) {
        setTokenResult(result.tokenNumber || "A-12"); // Fallback for demo
      } else {
        throw new Error(result.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.name && formData.age && formData.gender && formData.phone && formData.reason && (bookingFor === "self" || formData.relation);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-sm">
          <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      {/* Header with Doctor Info */}
      <div className="fixed top-0 left-0 w-full bg-white z-40 border-b border-slate-100 px-4 py-3 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <Stethoscope size={24} />
          </div>
          <div>
            <h2 className="font-black text-slate-900 leading-tight">Dr. {doctor?.name || "Doctor"}</h2>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
              <MapPin size={12} className="text-teal-500" />
              <span>{doctor?.hospitalName || "Clinic Location"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-24 space-y-6">
        {/* Booking Mode */}
        <div className="bg-slate-200 p-1.5 rounded-2xl flex shadow-inner">
          <button
            onClick={() => setBookingFor("self")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              bookingFor === "self" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
            }`}
          >
            <User size={16} /> Myself
          </button>
          <button
            onClick={() => setBookingFor("other")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              bookingFor === "other" ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
            }`}
          >
            <Users size={16} /> Someone Else
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
          <Info size={20} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Booking for <span className="font-bold text-blue-800">{new Date(appointmentDate).toDateString()}</span>. A unique token will be generated.
          </p>
        </div>

        {/* Patient Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={bookingFor === "self"}
              placeholder="Full Patient Name"
              className={`w-full border p-4 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                bookingFor === "self" ? "bg-slate-50 text-slate-500" : "bg-white border-slate-200"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                readOnly={bookingFor === "self"}
                placeholder="Years"
                className={`w-full border p-4 rounded-2xl font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                  bookingFor === "self" ? "bg-slate-50 text-slate-500" : "bg-white border-slate-200"
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={bookingFor === "self"}
                className={`w-full border p-4 rounded-2xl font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none ${
                  bookingFor === "self" ? "bg-slate-50 text-slate-500" : "bg-white border-slate-200"
                }`}
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">Phone Number</label>
            <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    className="w-full border border-slate-200 p-4 pl-12 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
            </div>
          </div>

          <AnimatePresence>
            {bookingFor === "other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">Relationship</label>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="w-full border p-4 rounded-2xl font-medium border-slate-200 outline-none"
                >
                  <option value="">Choose Relation</option>
                  <option>Parent</option>
                  <option>Spouse</option>
                  <option>Child</option>
                  <option>Sibling</option>
                  <option>Friend</option>
                  <option>Other</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Visit Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            Visit Information
          </h3>
          
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full border border-slate-200 p-4 rounded-2xl font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          >
            <option value="">Reason for visit</option>
            <option>General Checkup</option>
            <option>Follow-up</option>
            <option>Sudden Fever/Pain</option>
            <option>Report Analysis</option>
            <option>Other</option>
          </select>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes (Optional)..."
            className="w-full border border-slate-200 p-4 rounded-2xl font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 z-40">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleOpenSummary}
            disabled={!isValid}
            className={`w-full py-5 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
              isValid
                ? "bg-teal-600 shadow-teal-600/20 active:scale-[0.98]"
                : "bg-slate-300 cursor-not-allowed shadow-none"
            }`}
          >
            Review Summary
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !tokenResult && setShowSummary(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 relative overflow-hidden"
            >
              {!tokenResult ? (
                <>
                  <button 
                    onClick={() => setShowSummary(false)}
                    className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500"
                  >
                    <X size={20} />
                  </button>

                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Ticket size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Booking Summary</h3>
                    <p className="text-slate-500 text-sm">Review your details before confirming</p>
                  </div>

                  <div className="space-y-4 bg-slate-50 p-6 rounded-3xl mb-8">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient</span>
                      <span className="font-bold text-slate-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</span>
                      <span className="font-bold text-slate-900">Dr. {doctor?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</span>
                      <span className="font-bold text-slate-900">{new Date(appointmentDate).toDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment</span>
                      <span className="font-black text-teal-600">₹0 (Free)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookNow}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    {isSubmitting ? "Generating Token..." : "Confirm & Book Now"}
                    {!isSubmitting && <CheckCircle2 size={22} />}
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-24 h-24 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-slate-500 mb-8">Your appointment has been successfully scheduled.</p>

                  <div className="bg-teal-50 border-2 border-dashed border-teal-200 p-8 rounded-3xl mb-8">
                    <span className="text-teal-600 font-bold uppercase tracking-[0.2em] text-xs">Your Token Number</span>
                    <div className="text-6xl font-black text-teal-700 mt-2 tracking-tighter">
                      {tokenResult}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg"
                  >
                    Go to Home
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}