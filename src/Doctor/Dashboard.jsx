import React, { useState, useEffect, useMemo } from "react";
import { useParams,useNavigate } from "react-router-dom";

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
      icon: <LayoutDashboard size={20} />,
      path: "/doctor/dashboard",
    },
    {
      name: "Live Desk",
      icon: <Activity size={20} />,
      path: "/doctor/live-desk",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/doctor/settings",
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
        ></div>
      )}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Stethoscope size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            MediQ{" "}
            <span className="text-xs font-normal opacity-50 block">
              Doctor Panel
            </span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <a
              key={link.name}
              href={`${link.path}/${doctorId}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${active === link.name ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl w-full transition-colors cursor-pointer">
            <LogOut size={20} />
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${stat.bgLight} ${stat.textColor}`}>
        {React.cloneElement(stat.icon, { className: stat.textColor })}
      </div>
      {stat.change && (
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {stat.isPositive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {stat.change}
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
    <div className="text-sm text-slate-500">{stat.label}</div>
  </motion.div>
);

// --- MAIN PAGE ---
export default function DoctorDashboard() {
  const { doctorId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Convert to lowercase to ensure matching works regardless of casing
    const currentStatus = (status || "confirmed").toLowerCase();

    switch (currentStatus) {
      case "cancelled":
        return "bg-red-100 text-red-700"; // Red
      case "completed":
        return "bg-green-100 text-green-700"; // Green
      case "consulting":
        return "bg-amber-100 text-amber-700"; // Yellow/Orange
      case "confirmed":
      default:
        return "bg-blue-100 text-blue-700"; // Light Blue
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
      icon: <Users2 size={24} />,
      bgLight: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      isPositive: true,
      icon: <IndianRupee size={24} />,
      bgLight: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      label: "This Month Appointments",
      value: monthCount.toString(),
      isPositive: true,
      icon: <Calendar size={24} />,
      bgLight: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      label: "This Month Revenue",
      value: `₹${monthRevenue.toLocaleString()}`,
      isPositive: true,
      icon: <TrendingUp size={24} />,
      bgLight: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans ">
      <Sidebar
        active="Dashboard"
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
              Dr
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100">
              ⚠️ Error loading data: {error}. Make sure the backend server is
              running on localhost:5000.
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500 font-medium">
              <Activity
                className="animate-pulse mr-3 text-blue-500"
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

              {/* Today's Schedule (Full Width instead of aside chart) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Today's Schedule
                  </h3>
                </div>

                {todaySchedule.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">
                    No Upcoming appointments scheduled for today yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {todaySchedule.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-2 items-start relative p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="absolute -left-px top-4 bottom-4 w-1 rounded-r-lg bg-blue-500"></div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-500 mb-1">
                            {new Date(item.appointmentDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="font-bold text-slate-800 text-lg">
                            {item.patientId?.fullName || "Unknown Patient"}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                              Token: {item.tokenNumber}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {item.doctorType || "Consultation"}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${getStatusClasses(item.status)}`}
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
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-lg">
                    Appointment History
                  </h3>
                  <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800">
                    <Filter size={16} /> Filter
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                      <tr>
                        <th className="px-6 py-4">Patient Name</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Type / Tests</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-8 text-center text-slate-500"
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
                          const formattedTime = dateObj.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <tr
                              key={appointment._id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-6 py-4 font-bold text-slate-800">
                                {appointment.patientId?.fullName || "Unknown"}
                                <div className="text-xs text-slate-400 font-normal">
                                  Token: {appointment.tokenNumber}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                <div className="font-semibold">
                                  {formattedDate}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700">
                                  {appointment.doctorType || "Consultation"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`flex items-center gap-1.5 text-sm font-medium capitalize ${
                                    appointment.status === "confirmed"
                                      ? "text-green-600"
                                      : appointment.status === "completed"
                                        ? "text-blue-600"
                                        : appointment.status === "cancelled"
                                          ? "text-red-600"
                                          : "text-orange-500"
                                  }`}
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      appointment.status === "confirmed"
                                        ? "bg-green-600"
                                        : appointment.status === "completed"
                                          ? "bg-blue-600"
                                          : appointment.status === "cancelled"
                                            ? "bg-red-600"
                                            : "bg-orange-500"
                                    }`}
                                  ></div>
                                  {appointment.status || "Pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-800">
                                ₹{appointment.doctorId?.fees || 0}
                              </td>
                              <td className="px-6 py-4">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
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
