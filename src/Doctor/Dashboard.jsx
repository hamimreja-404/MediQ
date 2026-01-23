import React, { useState } from 'react';
import { 
  Stethoscope, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  TrendingUp, 
  Users2, 
  Clock, 
  IndianRupee, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- MOCK DATA ---
const STATS = [
  { label: "Total Patients", value: "42", change: "+12%", isPositive: true, icon: <Users2 size={24} />, color: "bg-blue-500" },
  { label: "Revenue", value: "₹24,500", change: "+8%", isPositive: true, icon: <IndianRupee size={24} />, color: "bg-green-500" },
  { label: "Avg. Wait Time", value: "14 min", change: "-2 min", isPositive: true, icon: <Clock size={24} />, color: "bg-orange-500" },
  { label: "Appointments", value: "18", change: "-5%", isPositive: false, icon: <Calendar size={24} />, color: "bg-purple-500" },
];

const RECENT_PATIENTS = [
  { id: 1, name: "Sneha Gupta", time: "10:30 AM", type: "Walk-in", status: "Completed", amount: "₹800" },
  { id: 2, name: "Arjun Kumar", time: "11:00 AM", type: "Online", status: "In Progress", amount: "₹500" },
  { id: 3, name: "Rahul Roy", time: "11:15 AM", type: "Online", status: "Waiting", amount: "₹800" },
  { id: 4, name: "Priya Singh", time: "11:45 AM", type: "Online", status: "Scheduled", amount: "₹800" },
];

const SCHEDULE = [
  { time: "12:00 PM", patient: "Amit Shah", type: "Follow-up" },
  { time: "12:30 PM", patient: "Lunch Break", type: "Break" },
  { time: "01:30 PM", patient: "Kavita R.", type: "New Visit" },
  { time: "02:00 PM", patient: "John Doe", type: "Report Review" },
];

// --- COMPONENTS ---

// 1. Sidebar (Reused)
const Sidebar = ({ active, isMobileOpen, closeMobile }) => {
  const links = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/doctor/dashboard" },
    { name: "Live Desk", icon: <TrendingUp size={20} />, path: "/doctor/live-desk" }, // Changed icon slightly for variety
    { name: "Appointments", icon: <Calendar size={20} />, path: "/doctor/schedule" },
    { name: "Patients", icon: <Users size={20} />, path: "/doctor/patients" },
    { name: "Settings", icon: <Settings size={20} />, path: "/doctor/settings" },
  ];

  return (
    <>
      {isMobileOpen && <div onClick={closeMobile} className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"></div>}
      <aside className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
           <div className="bg-blue-600 p-2 rounded-lg"><Stethoscope size={24} /></div>
           <span className="text-xl font-bold tracking-tight">MediQ <span className="text-xs font-normal opacity-50 block">Doctor Panel</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
           {links.map((link) => (
             <a key={link.name} href={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${active === link.name ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               {link.icon}
               <span>{link.name}</span>
             </a>
           ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl w-full transition-colors cursor-pointer">
              <LogOut size={20} /><span>Logout</span>
           </button>
        </div>
      </aside>
    </>
  );
};

// 2. Stat Card
const StatCard = ({ stat, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
        {React.cloneElement(stat.icon, { className: `text-${stat.color.split('-')[1]}-600` })}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {stat.change}
      </div>
    </div>
    <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
    <div className="text-sm text-slate-500">{stat.label}</div>
  </motion.div>
);

// 3. Simple Chart (CSS Bar Chart)
const WeeklyChart = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-slate-800 text-lg">Patient Flow</h3>
      <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none">
        <option>This Week</option>
        <option>Last Week</option>
      </select>
    </div>
    
    <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-2">
      {[
        { d: "Mon", h: "60%" }, { d: "Tue", h: "80%" }, { d: "Wed", h: "45%" }, 
        { d: "Thu", h: "90%" }, { d: "Fri", h: "75%" }, { d: "Sat", h: "50%" }, { d: "Sun", h: "30%" }
      ].map((bar, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
          <div className="w-full bg-slate-100 rounded-t-xl relative h-48 overflow-hidden">
             <motion.div 
               initial={{ height: 0 }}
               animate={{ height: bar.h }}
               transition={{ duration: 1, delay: i * 0.1 }}
               className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity"
             />
          </div>
          <span className="text-xs font-bold text-slate-400">{bar.d}</span>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function DoctorDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar active="Dashboard" isMobileOpen={isMobileMenuOpen} closeMobile={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 sticky top-0">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                 <Menu size={20} />
              </button>
              <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="text" placeholder="Search patients..." className="bg-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 w-64" />
              </div>
              <button className="p-2 relative hover:bg-slate-100 rounded-full text-slate-600">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">Dr</div>
           </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
           
           {/* Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {STATS.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
           </div>

           {/* Charts & Schedule Section */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main Chart */}
              <div className="lg:col-span-2 h-80">
                 <WeeklyChart />
              </div>
              
              {/* Today's Schedule Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-80">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Today's Schedule</h3>
                    <a href="/doctor/schedule" className="text-blue-600 text-sm font-bold hover:underline">View All</a>
                 </div>
                 <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {SCHEDULE.map((item, i) => (
                       <div key={i} className="flex gap-4 items-start relative pl-4 border-l-2 border-slate-100 last:border-0">
                          <div className={`absolute -left-1.25 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${item.type === 'Break' ? 'bg-orange-400' : 'bg-blue-500'}`}></div>
                          <div>
                             <div className="text-xs font-bold text-slate-400 mb-0.5">{item.time}</div>
                             <div className="font-bold text-slate-800">{item.patient}</div>
                             <div className="text-xs text-slate-500 bg-slate-50 inline-block px-2 py-0.5 rounded mt-1">{item.type}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Recent Patients Table */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 text-lg">Recent Appointments</h3>
                 <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800">
                    <Filter size={16} /> Filter
                 </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                       <tr>
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Time</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {RECENT_PATIENTS.map((patient) => (
                          <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4 font-bold text-slate-800">{patient.name}</td>
                             <td className="px-6 py-4 text-sm text-slate-600">{patient.time}</td>
                             <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${patient.type === 'Walk-in' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                   {patient.type}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`flex items-center gap-1.5 text-sm font-medium ${
                                   patient.status === 'Completed' ? 'text-green-600' : 
                                   patient.status === 'In Progress' ? 'text-blue-600' : 'text-slate-500'
                                }`}>
                                   <div className={`w-1.5 h-1.5 rounded-full ${
                                      patient.status === 'Completed' ? 'bg-green-600' : 
                                      patient.status === 'In Progress' ? 'bg-blue-600' : 'bg-slate-400'
                                   }`}></div>
                                   {patient.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 font-bold text-slate-800">{patient.amount}</td>
                             <td className="px-6 py-4">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                                   <MoreHorizontal size={18} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </main>
      </div>
    </div>
  );
}