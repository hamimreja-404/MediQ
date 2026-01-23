import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Activity, 
  Repeat, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
// import { api } from './api'; // Uncomment in real app

// --- MOCK API FOR PREVIEW (Replace with real API call) ---
const mockApi = {
  getStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalVisitors: 1245,
          uniqueVisitors: 890,
          repeatedVisitors: 355,
          todayTotalTimeSpentSeconds: 45000,
          avgTimeSpentPerUserSeconds: 320 // ~5 mins
        });
      }, 800);
    });
  }
};

// --- COMPONENTS ---

// 1. Stat Card
const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {React.cloneElement(icon, { className: `text-${color.split('-')[1]}-600` })}
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
          trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend > 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
    <div className="text-sm text-slate-500 font-medium">{title}</div>
  </motion.div>
);

// 2. Simple Bar Chart (CSS)
const TrafficChart = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
        <BarChart3 size={20} className="text-blue-500"/> User Traffic
      </h3>
      <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-slate-100">
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
      </select>
    </div>
    
    <div className="flex-1 flex items-end justify-between gap-2 md:gap-6 px-2 h-64">
      {[
        { d: "Mon", h: "45%", v: 120 }, 
        { d: "Tue", h: "60%", v: 150 }, 
        { d: "Wed", h: "35%", v: 90 }, 
        { d: "Thu", h: "75%", v: 180 }, 
        { d: "Fri", h: "85%", v: 210 }, 
        { d: "Sat", h: "55%", v: 140 }, 
        { d: "Sun", h: "40%", v: 100 }
      ].map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-3 flex-1 group relative">
          {/* Tooltip */}
          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none">
            {bar.v} Users
          </div>
          
          <div className="w-full bg-slate-100 rounded-t-xl relative h-full overflow-hidden">
             <motion.div 
               initial={{ height: 0 }}
               animate={{ height: bar.h }}
               transition={{ duration: 1, delay: i * 0.1 }}
               className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity"
             />
          </div>
          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{bar.d}</span>
        </div>
      ))}
    </div>
  </div>
);

// --- HELPER: Format Seconds to Time ---
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

// --- MAIN PAGE ---
export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Use mockApi for preview, replace with api.analytics.getStats()
      const data = await mockApi.getStats(); 
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="text-teal-500" /> Platform Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time usage insights for MediQ SaaS.</p>
        </div>
        
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
              <Calendar size={16} /> Today
           </button>
           <button 
             onClick={fetchData}
             disabled={loading}
             className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-70"
           >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Visitors" 
          value={loading ? "..." : stats?.totalVisitors} 
          icon={<Users size={24}/>} 
          color="bg-blue-500"
          trend={12}
        />
        <StatCard 
          title="Unique Users" 
          value={loading ? "..." : stats?.uniqueVisitors} 
          icon={<UserCheck size={24}/>} 
          color="bg-purple-500"
          trend={8}
        />
        <StatCard 
          title="Returning Users" 
          value={loading ? "..." : stats?.repeatedVisitors} 
          icon={<Repeat size={24}/>} 
          color="bg-orange-500"
          trend={-2}
        />
        <StatCard 
          title="Avg. Time Spent" 
          value={loading ? "..." : formatTime(stats?.avgTimeSpentPerUserSeconds)} 
          icon={<Clock size={24}/>} 
          color="bg-green-500"
          trend={5}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Main Traffic Chart */}
         <div className="lg:col-span-2 h-96">
            <TrafficChart />
         </div>

         {/* Secondary Breakdown */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-96">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 text-lg">User Type</h3>
               <button className="text-slate-400 hover:text-slate-600"><Filter size={18}/></button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center relative">
               {/* Simple Donut Chart CSS */}
               <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="180 251" strokeLinecap="round" /> {/* 70% */}
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="16" strokeDasharray="70 251" strokeDashoffset="-180" strokeLinecap="round" /> {/* 30% */}
                  </svg>
                  <div className="text-center">
                     <div className="text-2xl font-bold text-slate-800">70%</div>
                     <div className="text-xs text-slate-400 font-bold uppercase">Unique</div>
                  </div>
               </div>
            </div>

            <div className="flex justify-center gap-6 mt-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-bold text-slate-600">New (70%)</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-bold text-slate-600">Returning (30%)</span>
               </div>
            </div>
         </div>

      </div>

    </div>
  );
}