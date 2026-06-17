import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Stethoscope,
  Filter,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import toast, { Toaster } from "react-hot-toast";
import DoctorProductCard from "../Components/DoctorProductCard";

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorsList() {
  const navigate = useNavigate();

  // -- STATE --
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [sortBy, setSortBy] = useState("default"); // default | fees_low | fees_high | exp_high

  const location = useLocation();
  const isDemo = new URLSearchParams(location.search).get("demo") === "true";
  // -- FETCH DATA --
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("Fetching doctors from API...");
        setIsLoading(true);
        const response = await fetch(`${API_URL}/doctor/doctors`);
        console.log("Fetching doctors ");

        if (!response.ok) {
          console.error("Failed to fetch doctors:", response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Response received from API");
        const data = await response.json();
        // Handle different possible API response structures
        // If data is array use it, otherwise check for data.doctors or data.data
        const doctorList = Array.isArray(data)
          ? data
          : data.doctors || data.data || [];

        setDoctors(doctorList);
        setError(null);
      } catch (err) {
        console.log("Fetch error caught in catch block");
        console.error("Error fetching doctors:", err);
        setError(
          "Failed to load doctors. Please ensure the backend is running.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // -- FILTERING LOGIC --
  const uniqueSpecializations = useMemo(() => {
    if (!doctors.length) return ["All"];
    return [
      "All",
      ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
    ];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        const nameMatch =
          doc.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false;
        const clinicMatch =
          doc.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false;
        const locationMatch =
          doc.location?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false;

        const matchesSearch = nameMatch || clinicMatch || locationMatch;
        const matchesSpec =
          selectedSpec === "All" || doc.specialization === selectedSpec;

        return matchesSearch && matchesSpec;
      })
      .sort((a, b) => {
        if (sortBy === "fees_low") return (a.fees || 0) - (b.fees || 0);
        if (sortBy === "fees_high") return (b.fees || 0) - (a.fees || 0);
        if (sortBy === "exp_high")
          return (b.experience || 0) - (a.experience || 0);
        return 0;
      });
  }, [doctors, searchTerm, selectedSpec, sortBy]);

  // -- HANDLERS --
  const handleCardClick = (id) => {
    {isDemo ? navigate(`/doctor/${id}?demo=true`): navigate(`/doctor/${id}`)}
  };

  const handleBookSlot = (doctorId, date, time) => {
    const doc = doctors.find((d) => d._id === doctorId);
    if (!doc) return;
    const params = new URLSearchParams({
      doctorId: doc._id,
      doctorName: doc.fullName,
      date: date,
      location: doc.location || "City Clinic",
    });
    if (isDemo) {
      params.append("demo", "true");
    }
    navigate(`/book-appointment?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
        <p className="text-slate-600 mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (isDemo) {
      toast.success("Demo Mode Activated");

      setTimeout(() => {
        toast(" Step 1: Click any doctor card");
      }, 3000);

    }
  }, [isDemo]);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#1A6BCC] selection:text-white">
      {isDemo && (
        <div className="fixed bottom-6 right-6 bg-white shadow-md border border-gray-200 rounded-xl p-4 z-50 w-56 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🩺</span>
            <h4 className="font-bold text-[#1A1E26] text-xs tracking-wide uppercase">
              Demo Guide
            </h4>
          </div>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Click on any <strong className="text-[#1A6BCC]">Time Slot</strong> to book instantly, or click the doctor's details to view their full profile.
          </p>
        </div>
      )}

      <Toaster position="top-right" />
      {/* --- HEADER SECTION --- */}
      <section className="pt-32 pb-12 px-4 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1A6BCC] text-xs font-bold mb-4 border border-blue-100">
              <Stethoscope size={14} />
              <span>Find Your Specialist</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1E26] tracking-tight mb-3">
              Book appointments with{" "}
              <span className="text-[#1A6BCC]">top doctors.</span>
            </h1>
            <p className="text-base text-gray-500 max-w-2xl">
              Verified specialists, transparent fees, and zero waiting time.
            </p>
          </motion.div>

          {/* --- SEARCH & FILTER BAR --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 p-4 bg-white rounded-xl shadow-xs border border-gray-200 flex flex-col md:flex-row gap-4 items-center"
          >
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search doctor, clinic, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F4F5F7] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A6BCC] focus:bg-white text-[#1A1E26] placeholder-gray-400 font-medium transition-all"
              />
            </div>

            {/* Specialization Dropdown */}
            <div className="relative w-full md:w-64 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Stethoscope size={18} />
              </div>
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#F4F5F7] border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A6BCC] focus:bg-white cursor-pointer text-[#1A1E26] font-medium"
              >
                {uniqueSpecializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-48">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Filter size={18} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#F4F5F7] border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A6BCC] focus:bg-white cursor-pointer text-[#1A1E26] font-medium"
              >
                <option value="default">Sort By</option>
                <option value="fees_low">Price: Low to High</option>
                <option value="fees_high">Price: High to Low</option>
                <option value="exp_high">Experience: High to Low</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- DOCTORS LIST --- */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 size={40} className="animate-spin mb-4 text-[#1A6BCC]" />
              <p>Finding the best doctors for you...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-500 font-medium">
                Showing {filteredDoctors.length} results
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredDoctors.map((doc) => (
                    <motion.div
                      key={doc._id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <DoctorProductCard
                        doctor={doc}
                        onBookSlot={handleBookSlot}
                        onViewProfile={handleCardClick}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredDoctors.length === 0 && !isLoading && (
                  <div className="col-span-full py-20 text-center border border-dashed border-gray-200 rounded-xl bg-white">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={24} />
                    </div>
                    <h3 className="text-base font-bold text-[#1A1E26]">
                      No doctors found
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
