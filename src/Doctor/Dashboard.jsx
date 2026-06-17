import React, { useState, useEffect, useMemo } from "react";
import { useParams,useNavigate , Link, useLocation} from "react-router-dom";

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
  Activity,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

// --- CONSTANTS ---
// Replace this with the dynamically authenticated doctor's ID if needed

const API_URL = import.meta.env.VITE_API_URL;
// --- COMPONENTS ---

// 1. Sidebar
const Sidebar = ({ active, isMobileOpen, closeMobile }) => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  // Add this function:
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent any default button behavior
    try {
      // Clear storage
      localStorage.removeItem("token"); 
      localStorage.removeItem("doctorInfo"); 

      // Navigate
      navigate("/login");
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  };
  const links = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/doctor/dashboard?demo=true",
    },
    {
      name: "Live Desk",
      icon: <Activity size={18} />,
      path: "/doctor/live-desk",
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-[#1A1E26]/40 backdrop-blur-xs z-40 lg:hidden"
        ></div>
      )}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 text-[#1A1E26] flex flex-col transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-blue-50 text-[#1A6BCC] border border-blue-100/50 p-2 rounded-lg">
            <Stethoscope size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight block leading-none text-[#1A1E26]">MediQ</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-1">
              Doctor Panel
            </span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.name}
              to={`${link.path}/${doctorId}?demo=true`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${active === link.name ? "bg-blue-50 text-[#1A6BCC] font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A6BCC]"}`}
            >
              {link.icon}
              <span className="text-sm">{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors cursor-pointer font-bold text-sm">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// 2. Stat Card
const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-white p-5 rounded-xl border border-gray-200 shadow-none"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-lg border ${stat.borderLight} ${stat.bgLight} ${stat.textColor}`}>
        {React.cloneElement(stat.icon, { className: stat.textColor, size: 20 })}
      </div>
      {stat.change && (
        <div
          className={`flex items-center gap-0.5 text-[10px] font-bold px-2.5 py-0.5 rounded-md ${stat.isPositive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
        >
          {stat.isPositive ? (
            <ArrowUpRight size={12} className="stroke-[2.5]" />
          ) : (
            <ArrowDownRight size={12} className="stroke-[2.5]" />
          )}
          {stat.change}
        </div>
      )}
    </div>
    <div className="text-3xl font-black text-[#1A1E26] mb-1">{stat.value}</div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
  </motion.div>
);

// --- MAIN PAGE ---
export default function DoctorDashboard() {
  const { doctorId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const location = useLocation();
const isDemo = new URLSearchParams(location.search).get("demo") === "true";
  // Fetch Data from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Using dynamic doctorId from constants
        const response = await fetch(
          ` ${API_URL}/appointment-history/doctor/${doctorId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if (data.success) {
          setAppointments(data.appointments);
        } else {
          throw new Error("API returned an error");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  const getStatusClasses = (status) => {
    const currentStatus = (status || "confirmed").toLowerCase();

    switch (currentStatus) {
      case "cancelled":
        return "bg-red-50 text-red-600 border border-red-100";
      case "completed":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "consulting":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "confirmed":
      default:
        return "bg-blue-50 text-[#1A6BCC] border border-blue-100";
    }
  };
  // --- DATA PROCESSING & STATS CALCULATION ---
  const {
    todayCount,
    todayRevenue,
    monthCount,
    monthRevenue,
    todaySchedule,
    history,
  } = useMemo(() => {
    let tCount = 0;
    let tRev = 0;
    let mCount = 0;
    let mRev = 0;
    const tSched = [];

    // Sort all appointments latest first for history
    const hist = [...appointments].sort(
      (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
    );

    const today = new Date();

    appointments.forEach((app) => {
      const appDate = new Date(app.appointmentDate);
      const fee = app.doctorId?.fees || 0;

      const isToday =
        appDate.getDate() === today.getDate() &&
        appDate.getMonth() === today.getMonth() &&
        appDate.getFullYear() === today.getFullYear();

      const isThisMonth =
        appDate.getMonth() === today.getMonth() &&
        appDate.getFullYear() === today.getFullYear();

      if (isThisMonth) {
        mCount++;
        mRev += fee;
      }

      if (isToday) {
        tCount++;
        tRev += fee;
        tSched.push(app);
      }
    });

    // Sort today's schedule by time (earliest first)
    tSched.sort(
      (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
    );

    return {
      todayCount: tCount,
      todayRevenue: tRev,
      monthCount: mCount,
      monthRevenue: mRev,
      todaySchedule: tSched,
      history: hist,
    };
  }, [appointments]);

  // Derived dynamic stats
  const STATS = [
    {
      label: "Today's Appointments",
      value: todayCount.toString(),
      isPositive: true,
      icon: <Users2 />,
      bgLight: "bg-blue-50",
      borderLight: "border-blue-100/50",
      textColor: "text-[#1A6BCC]",
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      isPositive: true,
      icon: <IndianRupee />,
      bgLight: "bg-emerald-50",
      borderLight: "border-emerald-100/50",
      textColor: "text-emerald-600",
    },
    {
      label: "This Month Appointments",
      value: monthCount.toString(),
      isPositive: true,
      icon: <Calendar />,
      bgLight: "bg-purple-50",
      borderLight: "border-purple-100/50",
      textColor: "text-purple-600",
    },
    {
      label: "This Month Revenue",
      value: `₹${monthRevenue.toLocaleString()}`,
      isPositive: true,
      icon: <TrendingUp />,
      bgLight: "bg-amber-50",
      borderLight: "border-amber-100/50",
      textColor: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans selection:bg-[#1A6BCC] selection:text-white">
      <Sidebar
        active="Dashboard"
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />
      {isDemo && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-xl p-5 z-50 w-80 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-50 text-[#1A6BCC] border border-blue-100/50 rounded-lg flex items-center justify-center">
              <Briefcase size={14} className="stroke-[2.5]" />
            </div>
            <h4 className="font-bold text-[#1A1E26] text-xs tracking-wider uppercase">
              Recruiter Quick Tour
            </h4>
          </div>

          <p className="text-xs text-gray-500 mb-4 leading-relaxed font-medium">
            Welcome! To experience the full-stack capabilities of this application, try these steps:
          </p>

          <ul className="text-xs text-gray-600 space-y-3 font-medium">
            <li className="flex gap-2.5 items-start">
              <span className="bg-gray-100 text-gray-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                1
              </span>
              <span>
                <strong className="text-[#1A1E26]">Split Screen:</strong> Keep both the Doctor and Patient windows visible side-by-side.
              </span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="bg-gray-100 text-gray-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                2
              </span>
              <span>
                <strong className="text-[#1A1E26]">Live Desk:</strong> Navigate to the Live Desk tab and start calling patients from the queue.
              </span>
            </li>
            <li className="flex gap-2.5 items-start border-t border-gray-100 pt-3 mt-2">
              <span className="bg-blue-50 text-[#1A6BCC] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold animate-pulse">
                3
              </span>
              <span>
                <strong className="text-[#1A6BCC]">The Magic:</strong> Watch the patient's wait time and token progress update instantly via WebSockets!
              </span>
            </li>
          </ul>
        </div>
      )}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg text-[#1A1E26]"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-black text-[#1A1E26] tracking-tight">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-[#1A6BCC] font-bold border border-blue-100/50 shadow-none">
              Dr
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100 text-sm">
              ⚠️ Error loading data: {error}. Make sure the backend server is running on localhost:5000.
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500 font-medium">
              <Activity
                className="animate-pulse mr-3 text-[#1A6BCC]"
                size={24}
              />
              Loading dashboard data...
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {STATS.map((stat, i) => (
                  <StatCard key={i} stat={stat} index={i} />
                ))}
              </div>

              {/* Today's Schedule */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-none mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[#1A1E26] text-base">
                    Today's Schedule
                  </h3>
                </div>

                {todaySchedule.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl text-sm">
                    No Upcoming appointments scheduled for today yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {todaySchedule.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-2 items-start relative p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors bg-white"
                      >
                        <div className="absolute -left-px top-3 bottom-3 w-1 rounded-r-lg bg-[#1A6BCC]"></div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            {new Date(item.appointmentDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="font-black text-[#1A1E26] text-base">
                            {item.patientId?.fullName || "Unknown Patient"}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            <span className="text-[10px] font-bold text-[#1A6BCC] bg-blue-50 px-2 py-0.5 rounded border border-blue-100/30">
                              Token: {item.tokenNumber}
                            </span>
                            <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200/50">
                              {item.doctorType || "Consultation"}
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getStatusClasses(item.status)}`}
                            >
                              {item.status || "Confirmed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Patients / History Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-none overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-[#1A1E26] text-base">
                    Appointment History
                  </h3>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1A6BCC] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-all">
                    <Filter size={14} /> Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/80 text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3.5">Patient Name</th>
                        <th className="px-6 py-3.5">Date & Time</th>
                        <th className="px-6 py-3.5">Type / Tests</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5">Amount</th>
                        <th className="px-6 py-3.5 text-right pr-8">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {history.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-8 text-center text-gray-500 text-sm"
                          >
                            No appointment history found.
                          </td>
                        </tr>
                      ) : (
                        history.map((appointment) => {
                          const dateObj = new Date(appointment.appointmentDate);
                          const formattedDate = dateObj.toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });

                          return (
                            <tr
                              key={appointment._id}
                              className="hover:bg-[#F4F5F7]/30 transition-colors"
                            >
                              <td className="px-6 py-4 font-black text-sm text-[#1A1E26]">
                                {appointment.patientId?.fullName || "Unknown"}
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                  Token: {appointment.tokenNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                <div className="font-semibold text-gray-700">
                                  {formattedDate}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-[#1A6BCC] border border-blue-100/30">
                                  {appointment.doctorType || "Consultation"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                                    appointment.status === "completed"
                                      ? "text-emerald-600"
                                      : appointment.status === "cancelled"
                                        ? "text-red-600"
                                        : appointment.status === "consulting"
                                          ? "text-amber-600"
                                          : "text-[#1A6BCC]"
                                  }`}
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      appointment.status === "completed"
                                        ? "bg-emerald-500"
                                        : appointment.status === "cancelled"
                                          ? "bg-red-500"
                                          : appointment.status === "consulting"
                                            ? "bg-amber-500"
                                            : "bg-[#1A6BCC]"
                                    }`}
                                  ></div>
                                  {appointment.status || "Pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-black text-sm text-[#1A1E26]">
                                ₹{(appointment.doctorId?.fees || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-right pr-8">
                                <button className="p-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg text-gray-400 hover:text-[#1A6BCC] transition-all">
                                  <MoreHorizontal size={18} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
