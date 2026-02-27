
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const handleBookAppointment = () => {
    if (!doctor || !selectedDate) return;
    const params = new URLSearchParams({
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: selectedDate,
      location: doctor.location,
    });
    navigate(
      `/book-appointment?${params.toString()}`,
    );
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
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Dynamic Background Header */}
      <div className="h-72 bg-linear-to-br from-teal-500 via-teal-600 to-sky-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 grid lg:grid-cols-3 gap-8">
        {/* LEFT & CENTER CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden border-4 border-white shadow-lg relative z-10">
                  <img
                    src={`https://plus.unsplash.com/premium_vector-1728572090276-1fcf27ce399d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jdG9yfGVufDB8fDB8fHww`}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full border-4 border-white z-20 shadow-sm">
                  <UserCheck size={16} className="text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase">
                    {doctor.specialization}
                  </span>
                  <div className="flex items-center gap-1 text-teal-600 font-bold text-xs uppercase bg-teal-50 px-3 py-1 rounded-lg">
                    <ShieldCheck size={14} /> Verified
                  </div>
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-1">
                  {doctor.name}
                </h1>
                <p className="text-slate-500 text-lg font-medium flex items-center gap-2">
                  <Stethoscope size={18} className="text-slate-400" />
                  {doctor.degree} •{" "}
                  <span className="text-slate-900 font-bold">
                    {doctor.experience}+ yrs
                  </span>{" "}
                  experience
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Consultation
                    </p>
                    <p className="text-lg font-bold text-teal-600">
                      ₹{doctor.fees}
                    </p>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Patients
                    </p>
                    <p className="text-lg font-bold text-slate-700">500+</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details Card */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
              <h3 className="font-bold text-xl text-slate-900 mb-6 flex gap-2 items-center">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <MapPin size={20} />
                </div>
                Clinic Details
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="font-bold text-lg text-slate-800">
                    {doctor.clinicName}
                  </p>
                  <p className="text-slate-500 leading-relaxed mt-1">
                    {doctor.location}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Clock size={16} className="text-teal-500" />
                    <span>Availability: {doctor.timing}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col"
            >
              <h3 className="font-bold text-xl text-slate-900 mb-6 flex gap-2 items-center">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-xl">
                  <MessageSquare size={20} />
                </div>
                Patient Reviews
              </h3>

              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="flex gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" size={24} />
                  ))}
                </div>
                <p className="text-3xl font-black text-slate-900">4.9</p>
                <p className="text-slate-400 text-sm font-medium">
                  Out of 128 reviews
                </p>
                <button className="mt-4 text-teal-600 font-bold text-sm hover:underline flex items-center gap-1">
                  View all reviews <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT BOOKING SIDEBAR */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 shadow-2xl shadow-teal-900/10 border border-teal-50 sticky top-24"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Book Appointment
              </h3>
              <p className="text-slate-500 mt-1">
                Select a date to secure your slot
              </p>
            </div>

            {/* DATE SELECTION GRID */}
            <div className="mb-6">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-3 block tracking-widest">
                Available Dates
              </label>
              <div className="grid grid-cols-3 gap-3">
                {availableDates.map((dateObj, index) => {
                  const isSelected = selectedDate === dateObj.fullDate;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(dateObj.fullDate)}
                      className={`
                        relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200
                        ${isSelected 
                          ? "bg-teal-50 border-teal-500 shadow-sm" 
                          : "bg-white border-slate-100 hover:border-teal-200 hover:bg-slate-50"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full p-0.5">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                      <span 
                        className={`text-xs font-bold uppercase mb-1 ${isSelected ? "text-teal-600" : "text-slate-400"}`}
                      >
                        {dateObj.dayName}
                      </span>
                      <span 
                        className={`text-lg font-black ${isSelected ? "text-teal-700" : "text-slate-700"}`}
                      >
                        {dateObj.displayDate}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  System
                </span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Token Based
                </span>
              </div>
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate}
              className="w-full py-5 rounded-2xl bg-teal-600 text-white font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none"
            >
              Book Now
              <ChevronRight size={20} />
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                Token generated instantly after payment
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                Wait time depends on queue position
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}