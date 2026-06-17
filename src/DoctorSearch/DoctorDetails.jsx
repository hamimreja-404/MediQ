
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Star,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  UserCheck,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Date Selection State
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();
  const isDemo = new URLSearchParams(location.search).get("demo") === "true";
  // Helper to generate next 3 days
  const generateNext3Days = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

dates.push({
        fullDate: `${year}-${month}-${day}`,
        dayName: i === 0 ? "Today" : i === 1 ? "Tmrw" : date.toLocaleDateString("en-US", { weekday: "short" }),
        displayDate: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }), // 14 Feb
        isAvailable: true // Mock availability
      });
    }
    return dates;
  };

  useEffect(() => {
    // Initialize dates
    const dates = generateNext3Days();
    setAvailableDates(dates);
    setSelectedDate(dates[0].fullDate); // Default to Today

    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `${API_URL}/doctor/doctor-id/${decodeURIComponent(id)}`,
        );
        const data = await res.json();
        console.log("API Response:", data);
        if (!data.success || !data.doctor) {
          throw new Error("Doctor not found");
        }

        // If backend provides specific dates later, we can merge them here
        // if (data.availableDates) setAvailableDates(data.availableDates);

        setDoctor(data.doctor);
      } catch (err) {
        setError("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);
  useEffect(() => {
    if (isDemo) {
      setTimeout(() => {
        toast(" Step 2: Click on Book Now");
      }, 3000);

    }
  }, [isDemo]);
  const handleBookAppointment = () => {
    if (!doctor || !selectedDate) return;
    const params = new URLSearchParams({
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: selectedDate,
      location: doctor.location,
    });
    if (isDemo) {
  params.append("demo", "true");
}
    {isDemo ? navigate(`/book-appointment?${params.toString()}`): navigate(`/book-appointment?${params.toString()}`)}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
          <p className="text-slate-500 font-medium">
            Loading specialist profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-sm">
          <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Oops!</h2>
          <p className="text-slate-600 mb-6">
            {error || "We couldn't find the doctor you're looking for."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-20 font-sans selection:bg-[#1A6BCC] selection:text-white">
      {isDemo && (
        <div className="fixed bottom-6 right-6 bg-white shadow-md border border-gray-200 rounded-xl p-4 z-50 w-56 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🖱️</span>
            <h4 className="font-bold text-[#1A1E26] text-xs tracking-wide uppercase">
              Demo Guide
            </h4>
          </div>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Click the <strong className="text-[#1A6BCC]">Book Now</strong> button to start the patient journey.
          </p>
        </div>
      )}
      
      <Toaster position="top-right" />

      {/* --- FLAT WHITE HEADER SECTION --- */}
      <section className="pt-28 pb-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border border-gray-200 relative z-10">
                <img
                  src={doctor.image || `https://plus.unsplash.com/premium_vector-1728572090276-1fcf27ce399d?w=800&auto=format&fit=crop&q=60`}
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.src = `https://plus.unsplash.com/premium_vector-1728572090276-1fcf27ce399d?w=800&auto=format&fit=crop&q=60`;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-full border border-white z-20 shadow-xs">
                <UserCheck size={12} className="text-white" />
              </div>
            </div>

            {/* Core Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="bg-blue-50 text-[#1A6BCC] px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase">
                  {doctor.specialization}
                </span>
                <div className="flex items-center gap-1 text-[#1A6BCC] font-bold text-[10px] uppercase bg-blue-50 px-2.5 py-0.5 rounded-md">
                  <ShieldCheck size={12} className="stroke-[2.5]" /> Verified Profile
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-[#1A1E26] tracking-tight">
                {doctor.name}
              </h1>

              <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                <Stethoscope size={15} className="text-slate-400" />
                <span>{doctor.degree}</span>
                <span className="text-gray-300">•</span>
                <span>
                  <strong className="text-[#1A1E26] font-semibold">
                    {doctor.experience}+ yrs
                  </strong>{" "}
                  clinical experience
                </span>
              </p>

              {/* Consultation Fee and Network Badge */}
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
                  <Check size={12} className="stroke-[3]" />
                  In-Network
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-md text-[#1A1E26] font-semibold">
                  Consultation Fee: <span className="text-[#1A6BCC] font-bold">₹{doctor.fees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid lg:grid-cols-3 gap-8">
        {/* LEFT & CENTER CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-none"
            >
              <h3 className="font-bold text-base text-[#1A1E26] mb-5 flex gap-2.5 items-center">
                <div className="p-2 bg-blue-50 text-[#1A6BCC] rounded-lg shrink-0">
                  <MapPin size={16} />
                </div>
                Clinic Details
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="font-bold text-base text-[#1A1E26]">
                    {doctor.clinicName}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mt-1">
                    {doctor.location}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                    <Clock size={14} className="text-[#1A6BCC]" />
                    <span>Availability: {doctor.timing}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-none flex flex-col"
            >
              <h3 className="font-bold text-base text-[#1A1E26] mb-5 flex gap-2.5 items-center">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg shrink-0">
                  <MessageSquare size={16} />
                </div>
                Patient Reviews
              </h3>

              <div className="flex-1 flex flex-col justify-center items-center text-center py-2">
                <div className="flex gap-0.5 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" size={16} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-3xl font-black text-[#1A1E26]">4.9</p>
                <p className="text-gray-400 text-xs font-semibold mt-1">
                  Out of 128 verified ratings
                </p>

              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT BOOKING SIDEBAR */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-none sticky top-24"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-50 text-[#1A6BCC] rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#1A1E26]">
                Book Appointment
              </h3>
              <p className="text-gray-400 text-xs font-semibold mt-1">
                Select a date to secure your slot
              </p>
            </div>

            {/* DATE SELECTION GRID */}
            <div className="mb-5">
              <label className="text-[9px] uppercase font-bold text-gray-400 ml-0.5 mb-2.5 block tracking-widest">
                Available Dates
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableDates.map((dateObj, index) => {
                  const isSelected = selectedDate === dateObj.fullDate;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(dateObj.fullDate)}
                      className={`
                        relative flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-150
                        ${isSelected 
                          ? "bg-blue-50 border-[#1A6BCC] text-[#1A6BCC]" 
                          : "bg-white border-gray-100 hover:border-gray-200 hover:bg-slate-50"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 bg-[#1A6BCC] text-white rounded-full p-0.5">
                          <Check size={8} strokeWidth={4} />
                        </div>
                      )}
                      <span 
                        className={`text-[9px] font-bold uppercase mb-0.5 ${isSelected ? "text-[#1A6BCC]" : "text-gray-400"}`}
                      >
                        {dateObj.dayName}
                      </span>
                      <span 
                        className={`text-sm font-bold ${isSelected ? "text-[#1A6BCC]" : "text-[#1A1E26]"}`}
                      >
                        {dateObj.displayDate}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3.5 mb-6 border border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                  Booking System
                </span>
                <span className="text-[10px] bg-blue-50 text-[#1A6BCC] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Token Based
                </span>
              </div>
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate}
              className="w-full py-4 rounded-lg bg-[#1A6BCC] hover:bg-[#155baa] text-white font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Book Appointment
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}