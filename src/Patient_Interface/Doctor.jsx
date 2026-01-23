import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Share2, 
  Heart, 
  IndianRupee, 
  ChevronRight, 
  ShieldCheck, 
  ThumbsUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA FOR SINGLE DOCTOR ---
const DOCTOR = {
  id: 1,
  name: "Dr. Anjali Sharma",
  specialty: "Cardiologist",
  degrees: "MBBS, MD (Cardiology), DM",
  experience: 12,
  about: "Dr. Anjali Sharma is a renowned Cardiologist with over 12 years of experience in interventional cardiology. She specializes in managing complex heart conditions, hypertension, and preventive cardiology. She is an alumnus of AIIMS Delhi and is known for her patient-centric approach.",
  clinic: {
    name: "Heart Beat Clinic",
    address: "124, 1st Main Rd, Indiranagar, Bangalore",
    timings: "10:00 AM - 08:00 PM",
    images: ["bg-blue-100", "bg-blue-50", "bg-teal-50"], // Placeholders
    mapUrl: "#"
  },
  fees: 800,
  rating: 4.9,
  reviewCount: 124,
  patientsTreated: "5000+",
  image: "bg-purple-100 text-purple-600", // Avatar Placeholder
  availability: {
    today: ["10:00 AM", "10:20 AM", "04:00 PM", "04:30 PM", "05:00 PM"],
    tomorrow: ["10:00 AM", "11:00 AM", "02:00 PM", "02:20 PM", "06:00 PM"],
    nextDay: ["09:00 AM", "09:30 AM", "10:00 AM", "11:30 AM"]
  },
  reviews: [
    { user: "Rahul K.", rating: 5, text: "Very patient listener. Explained the issue clearly.", date: "2 days ago" },
    { user: "Sneha G.", rating: 4, text: "Wait time was a bit long, but treatment was excellent.", date: "1 week ago" }
  ]
};

// --- COMPONENTS ---

// 1. Success Modal
const BookingSuccessModal = ({ isOpen, onClose, slot, date, token }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md relative z-10 shadow-2xl"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 transition={{ type: "spring", delay: 0.2 }}
               >
                 <CheckCircle2 size={48} className="text-teal-600" />
               </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500 mb-6">Your appointment has been successfully scheduled.</p>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
               <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Token Number</div>
               <div className="text-5xl font-black text-teal-600 tracking-tight mb-4">#{token}</div>
               
               <div className="flex justify-between text-sm border-t border-slate-200 pt-4">
                  <div>
                    <span className="block text-slate-400 text-xs">Date</span>
                    <span className="font-bold text-slate-700">{date}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-slate-400 text-xs">Time</span>
                    <span className="font-bold text-slate-700">{slot}</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              View Appointment
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// 2. Main Page
export default function DoctorProfile() {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const slots = selectedDate === 'Today' ? DOCTOR.availability.today 
              : selectedDate === 'Tomorrow' ? DOCTOR.availability.tomorrow 
              : DOCTOR.availability.nextDay;

  const handleBook = () => {
    if(!selectedSlot) return;
    setIsSuccessOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      
      {/* --- HEADER --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <ArrowLeft size={24} />
           </button>
           <h1 className="font-bold text-lg text-slate-800 hidden md:block">Doctor Profile</h1>
           <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><Share2 size={20}/></button>
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><Heart size={20}/></button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: INFO --- */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Profile Card */}
           <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
              <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl ${DOCTOR.image} flex items-center justify-center text-4xl font-bold shrink-0`}>
                 {DOCTOR.name.split(" ")[1][0]}
              </div>
              <div className="flex-1">
                 <div className="flex items-start justify-between">
                    <div>
                       <h1 className="text-2xl font-bold text-slate-900">{DOCTOR.name}</h1>
                       <p className="text-slate-500 font-medium">{DOCTOR.specialty}</p>
                       <p className="text-xs text-slate-400 mt-1">{DOCTOR.degrees}</p>
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                       <Star size={14} fill="currentColor" /> {DOCTOR.rating}
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <div>
                       <div className="text-xs text-slate-400 font-medium uppercase">Patients</div>
                       <div className="text-lg font-bold text-slate-800">{DOCTOR.patientsTreated}</div>
                    </div>
                    <div>
                       <div className="text-xs text-slate-400 font-medium uppercase">Experience</div>
                       <div className="text-lg font-bold text-slate-800">{DOCTOR.experience} Years</div>
                    </div>
                    <div>
                       <div className="text-xs text-slate-400 font-medium uppercase">Reviews</div>
                       <div className="text-lg font-bold text-slate-800">{DOCTOR.reviewCount}</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* About Section */}
           <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-slate-900">About Doctor</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{DOCTOR.about}</p>
           </div>

           {/* Clinic Info */}
           <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="font-bold text-lg text-slate-900">Clinic Info</h3>
                 <button className="text-teal-600 text-sm font-bold hover:underline flex items-center gap-1">
                    Get Directions <ChevronRight size={14} />
                 </button>
              </div>
              
              <div className="flex items-start gap-3 mb-6">
                 <MapPin className="text-slate-400 mt-1 shrink-0" size={20} />
                 <div>
                    <h4 className="font-bold text-slate-800">{DOCTOR.clinic.name}</h4>
                    <p className="text-slate-500 text-sm">{DOCTOR.clinic.address}</p>
                    <p className="text-sm font-medium text-slate-600 mt-1 flex items-center gap-2">
                       <Clock size={14} /> {DOCTOR.clinic.timings}
                    </p>
                 </div>
              </div>

              {/* Clinic Photos Placeholder */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                 {DOCTOR.clinic.images.map((bg, i) => (
                    <div key={i} className={`w-32 h-24 rounded-xl ${bg} shrink-0`}></div>
                 ))}
              </div>
           </div>

           {/* Reviews Preview */}
           <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-900">Patient Stories</h3>
                 <a href="#" className="text-teal-600 text-sm font-bold">View All</a>
              </div>
              <div className="space-y-4">
                 {DOCTOR.reviews.map((review, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-800">{review.user}</span>
                          <span className="text-xs text-slate-400">{review.date}</span>
                       </div>
                       <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, j) => (
                             <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} stroke="currentColor" className={j >= review.rating ? "text-slate-300" : ""} />
                          ))}
                       </div>
                       <p className="text-sm text-slate-600">"{review.text}"</p>
                    </div>
                 ))}
              </div>
           </div>

        </div>

        {/* --- RIGHT COLUMN: BOOKING WIDGET --- */}
        <div className="lg:col-span-1">
           <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900">Book Appointment</h3>
                    <div className="text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-full text-xs">
                       <IndianRupee size={10} className="inline mr-0.5" />{DOCTOR.fees} fee
                    </div>
                 </div>

                 {/* Date Selector */}
                 <div className="mb-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 block">Select Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                       {['Today', 'Tomorrow', 'Fri, 22'].map((date) => (
                          <button
                             key={date}
                             onClick={() => {setSelectedDate(date); setSelectedSlot(null);}}
                             className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm whitespace-nowrap transition-all ${
                                selectedDate === date 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                             }`}
                          >
                             {date}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Slot Selector */}
                 <div className="mb-8">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 block">Available Slots</label>
                    <div className="grid grid-cols-3 gap-2">
                       {slots.map((slot) => (
                          <button
                             key={slot}
                             onClick={() => setSelectedSlot(slot)}
                             className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all ${
                                selectedSlot === slot 
                                ? 'bg-teal-500 text-white border-teal-500 shadow-md' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                             }`}
                          >
                             {slot}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Bill Summary */}
                 {selectedSlot && (
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                       <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-500">Consultation Fee</span>
                          <span className="font-medium">₹{DOCTOR.fees}</span>
                       </div>
                       <div className="flex justify-between text-sm mb-3">
                          <span className="text-slate-500">Booking Charge</span>
                          <span className="font-medium">₹5</span>
                       </div>
                       <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-3">
                          <span>Total Payable</span>
                          <span>₹{DOCTOR.fees + 5}</span>
                       </div>
                    </div>
                 )}

                 {/* CTA */}
                 <button 
                    onClick={handleBook}
                    disabled={!selectedSlot}
                    className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-lg shadow-xl shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                 >
                    {selectedSlot ? 'Confirm Booking' : 'Select a Slot'}
                 </button>
                 
                 <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck size={14} /> Secure Payment • Instant Confirmation
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* --- MOBILE FIXED BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 lg:hidden z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
         <div className="flex gap-4 items-center">
            <div className="flex-1">
               <div className="text-xs text-slate-500">Total Payable</div>
               <div className="text-xl font-bold text-slate-900">₹{DOCTOR.fees + 5}</div>
            </div>
            <button 
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Simplified for demo
               className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30"
            >
               Book Now
            </button>
         </div>
      </div>

      {/* Success Modal Component */}
      <BookingSuccessModal 
         isOpen={isSuccessOpen} 
         onClose={() => setIsSuccessOpen(false)}
         slot={selectedSlot}
         date={selectedDate === 'Today' ? new Date().toLocaleDateString() : 'Tomorrow'}
         token="12"
      />

    </div>
  );
}