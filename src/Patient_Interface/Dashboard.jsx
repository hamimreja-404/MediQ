import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  FileText, 
  User, 
  Bell, 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Stethoscope, 
  ArrowRight,
  Activity,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const USER = {
  name: "Arjun",
  image: "bg-blue-100 text-blue-600", // Placeholder
  upcomingAppointments: [
    {
      id: 101,
      doctor: "Dr. Anjali Sharma",
      specialty: "Cardiologist",
      clinic: "Heart Beat Clinic",
      date: "Today",
      time: "04:30 PM",
      token: 12,
      currentToken: 8,
      status: "Live", // Live, Scheduled, Completed
      estimatedWait: "15 mins"
    },
    {
      id: 102,
      doctor: "Dr. Rajesh K.",
      specialty: "Dentist",
      clinic: "Smile Care",
      date: "Tomorrow",
      time: "10:00 AM",
      token: 4,
      currentToken: 0,
      status: "Scheduled",
      estimatedWait: "---"
    }
  ],
  recentHistory: [
    {
      id: 99,
      doctor: "Dr. Sunita W.",
      date: "12 Oct, 2023",
      diagnosis: "Viral Fever"
    }
  ]
};

// --- COMPONENTS ---

// 1. Live Queue Widget (The "Hero" Component)
const LiveQueueWidget = ({ appointment }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-linear-to-br from-teal-500 to-teal-700 rounded-3xl p-6 text-white shadow-xl shadow-teal-500/30 relative overflow-hidden"
  >
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold animate-pulse">LIVE TRACKING</span>
          <span className="text-teal-100 text-xs">{appointment.time}</span>
        </div>
        <h3 className="font-bold text-lg leading-tight">{appointment.doctor}</h3>
        <p className="text-teal-100 text-sm opacity-90">{appointment.clinic}</p>
      </div>
      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
        <Stethoscope size={24} className="text-white" />
      </div>
    </div>

    {/* Token Visualizer */}
    <div className="flex items-end justify-between relative z-10">
      <div className="text-center">
        <div className="text-teal-200 text-xs font-medium uppercase mb-1">Current Serving</div>
        <div className="text-4xl font-bold">{appointment.currentToken}</div>
      </div>

      {/* Progress Bar Visual */}
      <div className="flex-1 mx-4 pb-2">
         <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(appointment.currentToken / appointment.token) * 100}%` }}
              className="h-full bg-white rounded-full"
            ></motion.div>
         </div>
         <div className="text-center text-xs text-teal-100 mt-2 font-medium">
           Est. Wait: {appointment.estimatedWait}
         </div>
      </div>

      <div className="text-center">
        <div className="text-teal-200 text-xs font-medium uppercase mb-1">Your Token</div>
        <div className="text-4xl font-bold text-white bg-white/20 rounded-lg px-2 min-w-12">
          {appointment.token}
        </div>
      </div>
    </div>
  </motion.div>
);

// 2. Simple Appointment Card
const ScheduledCard = ({ appointment }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
        {appointment.date.split(' ')[0].substring(0, 3)}
      </div>
      <div>
        <h4 className="font-bold text-slate-800">{appointment.doctor}</h4>
        <p className="text-xs text-slate-500">{appointment.specialty}</p>
        <div className="flex items-center gap-2 mt-1">
           <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{appointment.time}</span>
           <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Token #{appointment.token}</span>
        </div>
      </div>
    </div>
    <ChevronRight size={20} className="text-slate-300" />
  </div>
);

// --- MAIN DASHBOARD ---
export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* --- TOP HEADER --- */}
      <header className="bg-white sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-full ${USER.image} flex items-center justify-center font-bold`}>
              {USER.name[0]}
           </div>
           <div>
              <p className="text-xs text-slate-500">Good Morning,</p>
              <h1 className="text-lg font-bold text-slate-900">{USER.name}</h1>
           </div>
        </div>
        <button className="relative p-2 hover:bg-slate-50 rounded-full transition-colors">
           <Bell size={22} className="text-slate-600" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="px-4 py-6 space-y-8 max-w-lg mx-auto md:max-w-4xl">
        
        {/* Section: Live Queue (Conditional) */}
        {USER.upcomingAppointments.some(a => a.status === 'Live') && (
           <section>
              <div className="flex justify-between items-end mb-4">
                 <h2 className="font-bold text-lg text-slate-800">Live Appointment</h2>
                 <button className="text-teal-600 text-xs font-bold flex items-center gap-1">
                    <RefreshCw size={12} /> Refresh
                 </button>
              </div>
              <LiveQueueWidget appointment={USER.upcomingAppointments.find(a => a.status === 'Live')} />
           </section>
        )}

        {/* Section: Quick Actions */}
        <section>
           <h2 className="font-bold text-lg text-slate-800 mb-4">Quick Actions</h2>
           <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Book New", icon: <Plus size={24} />, color: "bg-blue-500", link: "/search" },
                { label: "Records", icon: <FileText size={24} />, color: "bg-orange-500", link: "/records" },
                { label: "History", icon: <Clock size={24} />, color: "bg-purple-500", link: "/history" },
                { label: "Find Clinic", icon: <MapPin size={24} />, color: "bg-pink-500", link: "/search" },
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center gap-2 group">
                   <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 group-active:scale-95 transition-transform`}>
                      {action.icon}
                   </div>
                   <span className="text-xs font-medium text-slate-600">{action.label}</span>
                </button>
              ))}
           </div>
        </section>

        {/* Section: Upcoming */}
        <section>
           <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800">Upcoming Visits</h2>
              <button className="text-teal-600 text-sm font-bold">See All</button>
           </div>
           <div className="space-y-3">
              {USER.upcomingAppointments.filter(a => a.status !== 'Live').map(appt => (
                 <ScheduledCard key={appt.id} appointment={appt} />
              ))}
              {USER.upcomingAppointments.filter(a => a.status !== 'Live').length === 0 && (
                 <div className="text-center py-8 bg-white rounded-2xl border border-slate-100 border-dashed">
                    <p className="text-slate-400 text-sm">No upcoming appointments.</p>
                    <button className="mt-2 text-teal-600 font-bold text-sm">Book Now</button>
                 </div>
              )}
           </div>
        </section>

        {/* Section: Promo / Health Tip */}
        <section>
           <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden flex items-center justify-between">
              <div className="relative z-10 max-w-[70%]">
                 <h3 className="font-bold text-lg mb-1">Flu Season Alert!</h3>
                 <p className="text-indigo-200 text-xs mb-3">Get your annual flu shot to stay protected this winter.</p>
                 <button className="bg-white text-indigo-900 px-3 py-1.5 rounded-lg text-xs font-bold">Find Specialists</button>
              </div>
              <div className="relative z-10">
                 <Activity size={48} className="text-indigo-400 opacity-50" />
              </div>
              {/* Decor */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-2xl"></div>
           </div>
        </section>

      </main>

      {/* --- BOTTOM NAVIGATION (Mobile) --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 md:hidden z-40">
         <div className="flex justify-between items-center">
            {[
              { id: 'home', icon: <Home size={24} />, label: 'Home' },
              { id: 'search', icon: <Search size={24} />, label: 'Search' },
              { id: 'records', icon: <FileText size={24} />, label: 'Records' },
              { id: 'profile', icon: <User size={24} />, label: 'Profile' },
            ].map(item => (
               <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.label}</span>
               </button>
            ))}
         </div>
      </div>

    </div>
  );
}