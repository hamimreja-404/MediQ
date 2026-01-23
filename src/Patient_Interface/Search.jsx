import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock, 
  IndianRupee, 
  Stethoscope, 
  ChevronDown, 
  ArrowRight,
  BadgeCheck,
  Calendar,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DEMO DATA CLASS STRUCTURE ---
class DoctorData {
  constructor(id, name, specialty, degree, experience, location, clinic, fees, rating, reviews, image, nextSlot, tags) {
    this.id = id;
    this.name = name;
    this.specialty = specialty;
    this.degree = degree;
    this.experience = experience;
    this.location = location;
    this.clinic = clinic;
    this.fees = fees;
    this.rating = rating;
    this.reviews = reviews;
    this.image = image; // Using color codes for avatars in this demo
    this.nextSlot = nextSlot;
    this.tags = tags || [];
  }
}

// --- DEMO DATABASE ---
const DOCTORS_DB = [
  new DoctorData(1, "Dr. Anjali Sharma", "Cardiologist", "MBBS, MD, DM", 12, "Indiranagar, Bangalore", "Heart Beat Clinic", 800, 4.9, 124, "bg-purple-100 text-purple-600", "Today, 4:00 PM", ["Heart", "BP"]),
  new DoctorData(2, "Dr. Rajesh Koothrappali", "Dermatologist", "MBBS, DVD", 8, "Koramangala, Bangalore", "Skin & Glow Center", 600, 4.7, 89, "bg-teal-100 text-teal-600", "Tomorrow, 10:00 AM", ["Acne", "Hair"]),
  new DoctorData(3, "Dr. Sunita Williams", "General Physician", "MBBS, MD", 15, "Whitefield, Bangalore", "Family Health Point", 500, 4.8, 210, "bg-blue-100 text-blue-600", "Today, 6:30 PM", ["Fever", "Flu"]),
  new DoctorData(4, "Dr. Kabir Singh", "Orthopedic", "MBBS, MS (Ortho)", 5, "Bandra West, Mumbai", "Bone & Joint Care", 1200, 4.5, 56, "bg-orange-100 text-orange-600", "Today, 8:00 PM", ["Fracture", "Pain"]),
  new DoctorData(5, "Dr. Gregory House", "General Physician", "MD (Diagnostician)", 20, "Princeton, Plainsboro", "Princeton Plainsboro", 2000, 5.0, 500, "bg-slate-200 text-slate-700", "Thu, 11:00 AM", ["Rare Cases", "Complex"]),
  new DoctorData(6, "Dr. Meredith Grey", "Surgeon", "MD, FACS", 10, "Seattle, WA", "Grey Sloan Memorial", 1500, 4.9, 340, "bg-pink-100 text-pink-600", "Fri, 2:00 PM", ["Surgery", "Trauma"]),
];

// --- EXTRACTED LISTS FOR FILTERS ---
const LOCATIONS = [...new Set(DOCTORS_DB.map(d => d.location))];
const SPECIALTIES = [...new Set(DOCTORS_DB.map(d => d.specialty))];

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-teal-600">
        <div className="bg-teal-500 text-white p-1.5 rounded-lg"><Stethoscope size={20} /></div>
        <span className="text-xl font-bold tracking-tight text-slate-800">MediQ</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
           <User size={32} className="text-slate-400 mt-1" />
        </div>
      </div>
    </div>
  </nav>
);

const DoctorCard = ({ doctor }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-300 overflow-hidden group"
  >
    <div className="p-5 flex gap-4">
      {/* Avatar */}
      <div className={`w-20 h-20 rounded-2xl ${doctor.image} flex items-center justify-center text-2xl font-bold shrink-0 group-hover:scale-105 transition-transform`}>
        {doctor.name.split(" ")[1][0]}
      </div>
      
      {/* Info */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-slate-900 leading-tight">{doctor.name}</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">{doctor.degree}</p>
          </div>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
            <Star size={12} fill="currentColor" /> {doctor.rating}
          </div>
        </div>

        <div className="mt-2 text-sm text-slate-600 font-medium">{doctor.specialty}</div>
        
        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
           <MapPin size={12} /> {doctor.location}
        </div>
      </div>
    </div>

    {/* Clinic & Availability Strip */}
    <div className="px-5 py-3 bg-slate-50 border-y border-slate-100 flex justify-between items-center text-xs">
      <div className="flex items-center gap-2 text-slate-600">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        Next: <span className="font-bold text-slate-800">{doctor.nextSlot}</span>
      </div>
      <div className="text-slate-500">{doctor.experience}+ Years Exp.</div>
    </div>

    {/* Action Footer */}
    <div className="p-4 flex items-center justify-between gap-4">
      <div>
        <div className="text-xs text-slate-400 font-medium">Consultation Fee</div>
        <div className="text-lg font-bold text-slate-800 flex items-center">
          <IndianRupee size={16} strokeWidth={3} /> {doctor.fees}
        </div>
      </div>
      <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
        Book Visit <ArrowRight size={16} />
      </button>
    </div>
  </motion.div>
);

// --- MAIN SEARCH PAGE ---
export default function SearchDoctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(DOCTORS_DB);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter Logic
  useEffect(() => {
    const results = DOCTORS_DB.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.clinic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty ? doc.specialty === selectedSpecialty : true;
      const matchesLocation = selectedLocation ? doc.location.includes(selectedLocation) : true;
      
      return matchesSearch && matchesSpecialty && matchesLocation;
    });
    setFilteredDoctors(results);
  }, [searchTerm, selectedSpecialty, selectedLocation]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* --- SEARCH HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-15 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Search doctors, clinics, symptoms..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-transparent focus:bg-white focus:border-teal-500 rounded-xl outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm border border-slate-200 md:hidden"
            >
              <Filter size={18} className="text-teal-600" />
            </button>
          </div>

          {/* Filters (Desktop Row / Mobile Expandable) */}
          <motion.div 
            initial={false}
            animate={{ height: isFilterOpen ? 'auto' : 'auto' }}
            className={`mt-4 flex-col md:flex-row gap-3 ${isFilterOpen ? 'flex' : 'hidden md:flex'} items-center justify-center`}
          >
            {/* Specialty Filter */}
            <div className="relative group w-full md:w-48">
              <select 
                className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative group w-full md:w-48">
              <select 
                className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-teal-500 cursor-pointer"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(selectedSpecialty || selectedLocation) && (
              <button 
                onClick={() => {setSelectedSpecialty(''); setSelectedLocation(''); setSearchTerm('')}}
                className="text-sm text-red-500 font-medium hover:underline px-2"
              >
                Clear
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* --- RESULTS GRID --- */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
          </h2>
          <div className="text-sm text-slate-500">
            Sort by: <span className="font-bold text-slate-700 cursor-pointer">Relevance</span>
          </div>
        </div>

        <AnimatePresence>
          {filteredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-700">No doctors found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search for something else.</p>
              <button 
                onClick={() => {setSelectedSpecialty(''); setSelectedLocation(''); setSearchTerm('')}}
                className="mt-6 text-teal-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}