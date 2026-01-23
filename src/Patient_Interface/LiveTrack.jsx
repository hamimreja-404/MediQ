import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  RefreshCw, 
  Navigation,
  User,
  CheckCircle2,
  AlertCircle,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const INITIAL_DATA = {
  id: 101,
  doctor: "Dr. Anjali Sharma",
  specialty: "Cardiologist",
  clinic: "Heart Beat Clinic",
  address: "Indiranagar, Bangalore",
  date: "Today",
  time: "04:30 PM",
  myToken: 12,
  currentToken: 8,
  avgTimePerPatient: 10, // minutes
  status: "waiting", // waiting, next, serving, completed
};

// --- COMPONENTS ---

// 1. Status Header
const StatusBanner = ({ peopleAhead }) => {
  let bg = "bg-blue-600";
  let text = "Relax, you have time.";
  let sub = `${peopleAhead} people ahead of you`;

  if (peopleAhead === 0) {
    bg = "bg-green-600 animate-pulse";
    text = "It's your turn!";
    sub = "Please proceed to Room 4";
  } else if (peopleAhead <= 2) {
    bg = "bg-orange-500";
    text = "Get Ready!";
    sub = "You are up shortly. Please stay near the clinic.";
  }

  return (
    <motion.div 
      layout
      className={`${bg} text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative z-10 transition-colors duration-500`}
    >
      <div className="flex justify-between items-start mb-4">
        <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <ArrowLeft size={20} />
        </a>
        <div className="flex gap-3">
           <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
             <RefreshCw size={20} />
           </button>
           <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
             <Bell size={20} />
           </button>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <motion.h1 
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-1"
        >
          {text}
        </motion.h1>
        <motion.p 
          key={sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/80 font-medium"
        >
          {sub}
        </motion.p>
      </div>
    </motion.div>
  );
};

// 2. Token Visualizer Card
const TokenCard = ({ myToken, currentToken, estimatedWait }) => {
  const progress = Math.min(100, Math.max(0, (currentToken / myToken) * 100));

  return (
    <div className="mx-4 -mt-8 relative z-20 bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
      <div className="flex justify-between items-center text-center divide-x divide-slate-100">
        <div className="flex-1 px-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current</div>
          <motion.div 
            key={currentToken}
            initial={{ scale: 1.5, color: '#0d9488' }}
            animate={{ scale: 1, color: '#1e293b' }}
            className="text-4xl font-black text-slate-800"
          >
            {currentToken}
          </motion.div>
        </div>
        <div className="flex-1 px-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Token</div>
          <div className="text-4xl font-black text-teal-600">
            {myToken}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 mb-2">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-teal-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl text-sm font-bold">
        <Clock size={16} /> Est. Wait Time: {estimatedWait} mins
      </div>
    </div>
  );
};

// 3. Queue Visualizer (Avatars)
const QueueVisuals = ({ peopleAhead }) => {
  // Show max 5 circles
  const circles = Math.min(5, peopleAhead);
  
  return (
    <div className="py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3 h-12">
         <AnimatePresence mode="popLayout">
           {/* Current Patient (Being Served) */}
           <motion.div 
             layout
             className="w-12 h-12 rounded-full border-4 border-white shadow-lg bg-green-100 text-green-700 flex items-center justify-center font-bold relative z-10"
           >
              <CheckCircle2 size={20} />
              <div className="absolute -bottom-6 text-[10px] font-bold text-green-600 whitespace-nowrap">Inside</div>
           </motion.div>

           {/* Waiting Patients */}
           {[...Array(circles)].map((_, i) => (
             <motion.div
               key={`wait-${i}`}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0, opacity: 0, width: 0 }}
               transition={{ delay: i * 0.1 }}
               className="w-10 h-10 rounded-full border-2 border-white shadow bg-slate-200 flex items-center justify-center text-slate-400"
             >
               <User size={16} />
             </motion.div>
           ))}
           
           {peopleAhead > 5 && (
              <div className="text-xs font-bold text-slate-400">+{peopleAhead - 5}</div>
           )}

           {/* Self */}
           <motion.div layout className="w-12 h-12 rounded-full border-4 border-white shadow-lg bg-teal-500 text-white flex items-center justify-center font-bold z-10 relative">
              Me
              <div className="absolute -bottom-6 text-[10px] font-bold text-teal-600 whitespace-nowrap">You</div>
           </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function LiveTrack() {
  const [data, setData] = useState(INITIAL_DATA);
  
  // SIMULATION: Simulate Queue Moving Forward
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        if (prev.currentToken < prev.myToken) {
           return { ...prev, currentToken: prev.currentToken + 1 };
        }
        return prev;
      });
    }, 5000); // Updates every 5 seconds for demo
    return () => clearInterval(interval);
  }, []);

  const peopleAhead = data.myToken - data.currentToken;
  const estimatedWait = peopleAhead * data.avgTimePerPatient;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      
      {/* Banner & Header */}
      <StatusBanner peopleAhead={peopleAhead} />

      {/* Main Card */}
      <TokenCard 
        myToken={data.myToken} 
        currentToken={data.currentToken}
        estimatedWait={estimatedWait}
      />

      {/* Queue Avatars */}
      <QueueVisuals peopleAhead={peopleAhead} />

      {/* Doctor & Location Info */}
      <div className="mx-4 mt-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
         <h3 className="font-bold text-slate-900 mb-4">Appointment Details</h3>
         
         <div className="flex gap-4 items-start mb-6">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-bold text-xl">
               {data.doctor.split(" ")[1][0]}
            </div>
            <div>
               <div className="font-bold text-slate-900">{data.doctor}</div>
               <div className="text-sm text-slate-500">{data.specialty}</div>
               <div className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block mt-1">
                  {data.time} • Token #{data.myToken}
               </div>
            </div>
         </div>

         <div className="flex items-start gap-3 pt-6 border-t border-slate-100">
            <MapPin className="text-slate-400 mt-0.5" size={20} />
            <div className="flex-1">
               <div className="font-bold text-slate-800">{data.clinic}</div>
               <div className="text-sm text-slate-500 leading-snug">{data.address}</div>
            </div>
            <button className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-colors">
               <Navigation size={20} />
            </button>
         </div>
      </div>

      {/* Tips / Instructions */}
      <div className="mx-4 mt-6">
         <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="text-orange-500 shrink-0" size={20} />
            <div className="text-sm text-orange-800">
               <span className="font-bold">Pro Tip:</span> Please arrive at the clinic when there are 3 people ahead of you to verify documents.
            </div>
         </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
         <button className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2">
            <Phone size={18} /> Call Support
         </button>
      </div>

    </div>
  );
}