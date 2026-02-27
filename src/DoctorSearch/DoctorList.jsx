import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Award,
  Stethoscope,
  Filter,
  ChevronDown,
  Banknote,
  GraduationCap,
  ArrowRight,
  Star,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL ;
// Common Image for all doctors (Fallback if API doesn't provide one)
const COMMON_DOC_IMG =
  "https://plus.unsplash.com/premium_vector-1728572090276-1fcf27ce399d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jdG9yfGVufDB8fDB8fHww";

export default function DoctorsList() {
  const navigate = useNavigate();

  // -- STATE --
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [sortBy, setSortBy] = useState("default"); // default | fees_low | fees_high | exp_high

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
        const doctorList = Array.isArray(data) ? data : (data.doctors || data.data || []);
        
        setDoctors(doctorList);
        setError(null);
      } catch (err) {
        console.log("Fetch error caught in catch block");
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please ensure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // -- FILTERING LOGIC --
  const uniqueSpecializations = useMemo(() => {
    if (!doctors.length) return ["All"];
    return ["All", ...new Set(doctors.map((d) => d.specialization).filter(Boolean))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const nameMatch = doc.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const clinicMatch = doc.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const locationMatch = doc.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      
      const matchesSearch = nameMatch || clinicMatch || locationMatch;
      const matchesSpec = selectedSpec === "All" || doc.specialization === selectedSpec;
      
      return matchesSearch && matchesSpec;
    }).sort((a, b) => {
      if (sortBy === "fees_low") return (a.fees || 0) - (b.fees || 0);
      if (sortBy === "fees_high") return (b.fees || 0) - (a.fees || 0);
      if (sortBy === "exp_high") return (b.experience || 0) - (a.experience || 0);
      return 0;
    });
  }, [doctors, searchTerm, selectedSpec, sortBy]);

  // -- HANDLERS --
  const handleCardClick = (id) => {

    navigate(`/doctor/${id}`);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      {/* --- HEADER SECTION --- */}
      <section className="pt-32 pb-12 px-4 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mb-4 border border-teal-200">
              <Stethoscope size={14} />
              <span>Find Your Specialist</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Book appointments with{" "}
              <span className="text-teal-600">top doctors.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Verified specialists, transparent fees, and zero waiting time.
            </p>
          </motion.div>

          {/* --- SEARCH & FILTER BAR --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 p-4 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col md:flex-row gap-4 items-center"
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
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
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
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer text-slate-700 font-medium"
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
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer text-slate-700 font-medium"
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
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          
          {isLoading ? (
             // Loading State
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 size={40} className="animate-spin mb-4 text-teal-500" />
                <p>Finding the best doctors for you...</p>
             </div>
          ) : (
            <>
              <div className="mb-6 text-slate-500 font-medium">
                Showing {filteredDoctors.length} results
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredDoctors.map((doc) => (
                    <motion.div
                      key={doc._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -5 }}
                      onClick={() => handleCardClick(doc._id)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col sm:flex-row"
                    >
                      {/* Image Section */}
                      <div className="sm:w-48 h-48 sm:h-auto bg-slate-100 relative shrink-0">
                        <img
                          src={doc.image || COMMON_DOC_IMG} 
                          alt={doc.fullName}
                          onError={(e) => { e.target.src = COMMON_DOC_IMG; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                          <Star
                            size={12}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          {doc.rating || "New"}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
                                {doc.specialization}
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                {doc.fullName}
                              </h3>
                            </div>
                            {doc.isVerified && (
                              <div
                                className="text-teal-500"
                                title="Verified Doctor"
                              >
                                <Award size={20} />
                              </div>
                            )}
                          </div>

                          <div className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                            <GraduationCap size={16} className="text-slate-400" />
                            <span>
                              {doc.degree} - {doc.college}
                            </span>
                          </div>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="w-8 flex justify-center">
                                <MapPin size={16} className="text-slate-400" />
                              </div>
                              <span className="truncate">
                                {doc.clinicName}, {doc.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="w-8 flex justify-center">
                                <Clock size={16} className="text-slate-400" />
                              </div>
                              <span>{doc.timing}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="w-8 flex justify-center">
                                <Stethoscope size={16} className="text-slate-400" />
                              </div>
                              <span>{doc.experience} Years Experience</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer / Price */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-xs text-slate-400 font-medium">
                              Consultation Fee
                            </div>
                            <div className="text-lg font-bold text-slate-900 flex items-center gap-1">
                              <Banknote size={16} className="text-teal-500" />₹
                              {doc.fees}
                            </div>
                          </div>
                          <button className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 group-hover:bg-teal-500 group-hover:text-teal-700">
                            Book Now <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredDoctors.length === 0 && !isLoading && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">
                      No doctors found
                    </h3>
                    <p className="text-slate-500">
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