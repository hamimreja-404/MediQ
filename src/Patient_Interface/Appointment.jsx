import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  MoreVertical, 
  FileText, 
  RefreshCw, 
  AlertCircle,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const APPOINTMENTS = [
  {
    id: 1,
    doctor: "Dr. Anjali Sharma",
    specialty: "Cardiologist",
    clinic: "Heart Beat Clinic",
    address: "Indiranagar, Bangalore",
    date: "Today",
    time: "04:30 PM",
    status: "upcoming",
    type: "Live", // Live queue active
    token: 12,
    img: "bg-purple-100 text-purple-600"
  },
  {
    id: 2,
    doctor: "Dr. Rajesh K.",
    specialty: "Dentist",
    clinic: "Smile Care",
    address: "Koramangala, Bangalore",
    date: "Tomorrow, 24 Oct",
    time: "10:00 AM",
    status: "upcoming",
    type: "Scheduled",
    token: 4,
    img: "bg-teal-100 text-teal-600"
  },
  {
    id: 3,
    doctor: "Dr. Sunita W.",
    specialty: "General Physician",
    clinic: "Family Health Point",
    address: "Whitefield, Bangalore",
    date: "12 Oct, 2023",
    time: "06:00 PM",
    status: "completed",
    diagnosis: "Viral Fever",
    img: "bg-blue-100 text-blue-600"
  },
  {
    id: 4,
    doctor: "Dr. Kabir Singh",
    specialty: "Orthopedic",
    clinic: "Bone & Joint Care",
    address: "Mumbai",
    date: "10 Sep, 2023",
    time: "11:00 AM",
    status: "cancelled",
    reason: "Doctor Unavailable",
    img: "bg-orange-100 text-orange-600"
  },
  {
    id: 5,
    doctor: "Dr. Gregory House",
    specialty: "Diagnostician",
    clinic: "Princeton Plainsboro",
    address: "New Jersey",
    date: "01 Aug, 2023",
    time: "09:00 AM",
    status: "completed",
    diagnosis: "Lupus",
    img: "bg-slate-200 text-slate-700"
  }
];

// --- COMPONENTS ---

const AppointmentCard = ({ appt }) => {
  const isLive = appt.type === 'Live';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group"
    >
      {/* Live Indicator Strip */}
      {isLive && appt.status === 'upcoming' && (
        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className={`w-14 h-14 rounded-xl ${appt.img} flex items-center justify-center font-bold text-lg`}>
            {appt.doctor.split(" ")[1][0]}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{appt.doctor}</h3>
            <p className="text-xs text-slate-500 font-medium">{appt.specialty}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <MapPin size={12} /> {appt.clinic}
            </div>
          </div>
        </div>
        
        {/* Token Badge */}
        {appt.status === 'upcoming' && (
          <div className="text-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
             <div className="text-[10px] text-slate-400 font-bold uppercase">Token</div>
             <div className="text-xl font-bold text-slate-800">#{appt.token}</div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 py-3 border-t border-b border-slate-50 mb-4">
         <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar size={16} className="text-slate-400"/>
            {appt.date}
         </div>
         <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={16} className="text-slate-400"/>
            {appt.time}
         </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-3">
        {appt.status === 'upcoming' ? (
           <>
             {isLive ? (
               <button className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 animate-pulse">
                 <RefreshCw size={16} /> Track Live
               </button>
             ) : (
               <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                 Reschedule
               </button>
             )}
             <button className="p-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50">
               <XCircle size={20} />
             </button>
           </>
        ) : appt.status === 'completed' ? (
           <>
             <button className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                <FileText size={16} /> View Prescription
             </button>
             <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                Book Again
             </button>
           </>
        ) : (
           // Cancelled State
           <div className="w-full flex items-center justify-between">
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                 <AlertCircle size={12}/> {appt.reason || "Cancelled"}
              </span>
              <button className="text-sm font-bold text-teal-600 hover:underline">Book Again</button>
           </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredAppointments = APPOINTMENTS.filter(appt => appt.status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-6">
      
      {/* --- HEADER --- */}
      <div className="bg-white sticky top-0 z-30 border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
           <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <ArrowLeft size={24} />
           </button>
           <h1 className="font-bold text-lg text-slate-800 flex-1">My Appointments</h1>
           <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
              <Search size={22} />
           </button>
        </div>

        {/* --- TABS --- */}
        <div className="px-4 pb-0 flex gap-6 overflow-x-auto no-scrollbar">
           {['upcoming', 'completed', 'cancelled'].map((tab) => (
              <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`pb-3 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab 
                    ? 'border-teal-600 text-teal-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                 }`}
              >
                 {tab}
              </button>
           ))}
        </div>
      </div>

      {/* --- CONTENT LIST --- */}
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
         <AnimatePresence mode="wait">
            {filteredAppointments.length > 0 ? (
               filteredAppointments.map(appt => (
                  <AppointmentCard key={appt.id} appt={appt} />
               ))
            ) : (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
               >
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                     <Calendar size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 capitalize">No {activeTab} Appointments</h3>
                  <p className="text-slate-500 text-sm mt-2">
                     {activeTab === 'upcoming' 
                        ? "You don't have any visits scheduled." 
                        : "Your appointment history will appear here."}
                  </p>
                  {activeTab === 'upcoming' && (
                     <button className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all">
                        Book New Appointment
                     </button>
                  )}
               </motion.div>
            )}
         </AnimatePresence>
      </div>

    </div>
  );
}