
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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A6BCC]"></div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] p-6 text-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-sm w-full">
          <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-[#1A1E26] mb-2">Error</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="w-full py-3 bg-[#1A6BCC] hover:bg-[#155baa] text-white rounded-lg font-bold transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-32 font-sans selection:bg-[#1A6BCC] selection:text-white">
      {/* Header with Doctor Info */}
      <div className="fixed top-0 left-0 w-full bg-white z-40 border-b border-gray-200 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1A6BCC]">
            <Stethoscope size={24} className="stroke-[2]" />
          </div>
          <div>
            <h2 className="font-bold text-[#1A1E26] text-lg leading-tight">Dr. {doctor?.name || "Doctor"}</h2>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1 font-medium">
              <MapPin size={13} className="text-[#1A6BCC]" />
              <span>{doctor?.hospitalName || doctor?.location || "Clinic Location"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-28 space-y-6">
        {/* Booking Mode */}
        <div className="bg-gray-100 p-1 rounded-xl flex border border-gray-200">
          <button
            onClick={() => {
              setBookingFor("self");
              setFormData({
                ...formData,
                name: CURRENT_USER.name,
                age: CURRENT_USER.age,
                gender: CURRENT_USER.gender,
                phone: CURRENT_USER.phone,
                relation: ""
              });
            }}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              bookingFor === "self" 
                ? "bg-white text-[#1A6BCC] shadow-xs border border-gray-200/50" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <User size={16} /> Myself
          </button>
          <button
            onClick={() => {
              setBookingFor("other");
              setFormData({
                ...formData,
                name: "",
                age: "",
                gender: "",
                relation: ""
              });
            }}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              bookingFor === "other" 
                ? "bg-white text-[#1A6BCC] shadow-xs border border-gray-200/50" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users size={16} /> Someone Else
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
          <Info size={20} className="text-[#1A6BCC] shrink-0" />
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Booking for <span className="font-bold text-[#1A6BCC]">{new Date(appointmentDate).toDateString()}</span>. A unique token will be generated.
          </p>
        </div>

        {/* Patient Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5 shadow-none">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={bookingFor === "self"}
              placeholder="Full Patient Name"
              className={`w-full border p-3.5 rounded-lg text-[#1A1E26] font-medium outline-none transition-all ${
                bookingFor === "self" 
                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" 
                  : "bg-white border-gray-200 focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC]"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                readOnly={bookingFor === "self"}
                placeholder="Years"
                className={`w-full border p-3.5 rounded-lg text-[#1A1E26] font-medium outline-none transition-all ${
                  bookingFor === "self" 
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" 
                    : "bg-white border-gray-200 focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC]"
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={bookingFor === "self"}
                  className={`w-full border p-3.5 rounded-lg font-medium outline-none transition-all appearance-none ${
                    bookingFor === "self" 
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" 
                      : "bg-white border-gray-200 focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] text-[#1A1E26]"
                  }`}
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-450" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="w-full border border-gray-200 p-3.5 pl-12 rounded-lg text-[#1A1E26] font-medium focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] outline-none transition-all"
              />
            </div>
          </div>

          <AnimatePresence>
            {bookingFor === "other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">Relationship</label>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="w-full border p-3.5 rounded-lg font-medium border-gray-200 text-[#1A1E26] focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] outline-none transition-all"
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
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-5 shadow-none">
          <h3 className="text-sm font-bold text-[#1A1E26] flex items-center gap-2">
            Visit Information
          </h3>
          
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full border border-gray-200 p-3.5 rounded-lg font-medium text-[#1A1E26] focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] outline-none transition-all"
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
            className="w-full border border-gray-200 p-3.5 rounded-lg font-medium text-[#1A1E26] focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleOpenSummary}
            disabled={!isValid}
            className={`w-full py-4 rounded-lg font-bold text-white text-base flex items-center justify-center gap-2 transition-all ${
              isValid
                ? "bg-[#1A6BCC] hover:bg-[#155baa] active:scale-[0.98]"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }`}
          >
            Review Summary
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !tokenResult && setShowSummary(false)}
              className="absolute inset-0 bg-[#1A1E26]/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-xl p-6 relative overflow-hidden border border-gray-200 shadow-xl z-10"
            >
              {!tokenResult ? (
                <>
                  <button 
                    onClick={() => setShowSummary(false)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={18} />
                  </button>

                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-[#1A6BCC] rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Ticket size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1E26]">Booking Summary</h3>
                    <p className="text-gray-500 text-xs mt-1">Review your details before confirming</p>
                  </div>

                  <div className="space-y-3.5 bg-gray-50 border border-gray-200 p-5 rounded-lg mb-6">
                    <div className="flex justify-between items-center pb-2.5 border-b border-gray-200">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Patient</span>
                      <span className="font-semibold text-sm text-[#1A1E26]">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-gray-200">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doctor</span>
                      <span className="font-semibold text-sm text-[#1A1E26]">Dr. {doctor?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2.5 border-b border-gray-200">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
                      <span className="font-semibold text-sm text-[#1A1E26]">{new Date(appointmentDate).toDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment</span>
                      <span className="font-bold text-sm text-[#1A6BCC]">₹0 (Free)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookNow}
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#1A6BCC] hover:bg-[#155baa] text-white rounded-lg font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    {isSubmitting ? "Generating Token..." : "Confirm & Book Now"}
                    {!isSubmitting && <CheckCircle2 size={18} />}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1E26] mb-1">Booking Confirmed!</h3>
                  <p className="text-gray-500 text-sm mb-6">Your appointment has been successfully scheduled.</p>

                  <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 p-6 rounded-lg mb-6">
                    <span className="text-[#1A6BCC] font-bold uppercase tracking-wider text-[10px]">Your Token Number</span>
                    <div className="text-5xl font-black text-[#1A6BCC] mt-2 tracking-tight">
                      {tokenResult}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full py-3.5 bg-[#1A1E26] hover:bg-black text-white rounded-lg font-bold text-base transition-colors"
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