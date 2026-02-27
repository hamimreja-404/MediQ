import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Menu,
  Activity,
  Play,
  CheckCircle2,
  Clock,
  FileText,
  Microscope,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
// --- COMPONENTS ---

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
            <Link
              key={link.name}
              to={`${link.path}/${doctorId || ""}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${active === link.name ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button  onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl w-full transition-colors cursor-pointer">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// --- MAIN PAGE ---
export default function LiveDesk() {
  const { doctorId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPatient, setCurrentPatient] = useState(null);
  const [consulting, setConsulting] = useState(false);
  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Queue Data
  const fetchQueue = async () => {
    if (!doctorId) return;
    try {
      const response = await fetch(
        `${API_URL}/appointment-history/todays-appoi-Hist/${doctorId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setQueue(data.appointments || data || []);
      }
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [doctorId]);

  // Derived State
  const activePatient = queue.find((p) =>
    ["consulting", "in_progress", "ongoing"].includes(p.status?.toLowerCase()),
  );
  const waitingList = queue
    .filter((p) =>
      ["confirmed", "scheduled", "pending"].includes(p.status?.toLowerCase()),
    )
    .sort((a, b) => a.tokenNumber - b.tokenNumber);
  const completedList = queue
    .filter((p) => p.status?.toLowerCase() === "completed")
    .sort((a, b) => b.tokenNumber - a.tokenNumber);

  // --- ACTIONS WITH OPTIMISTIC UPDATES ---

  // 1. Start Consulting / Call Next
  const handleStartConsulting = async () => {
    if (!doctorId) return;

    const firstWaiting = waitingList[0];
    if (!firstWaiting) return;

    const previousQueue = [...queue];

    setQueue((prev) =>
      prev.map((p) =>
        p._id === firstWaiting._id ? { ...p, status: "consulting" } : p,
      ),
    );

    try {
      const response = await fetch(
        `${API_URL}/appointment/start-first-appointment/${doctorId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) throw new Error("Failed to start appointment");

      setTimeout(() => {
        fetchQueue();
      }, 500);
    } catch (error) {
      console.error("Error starting consultation:", error);
      setQueue(previousQueue);
    }
  };

  const handleComplete = async (appointmentId) => {
    const previousQueue = [...queue];

    // OPTIMISTIC UI UPDATE
    setQueue((prev) =>
      prev.map((p) =>
        p._id === appointmentId ? { ...p, status: "completed" } : p,
      ),
    );

    try {
      const response = await fetch(
        `${API_URL}/appointment/completed-appointment/${appointmentId}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } },
      );

      if (!response.ok) throw new Error("Failed to complete appointment");

      setTimeout(() => {
        fetchQueue();
      }, 500);
    } catch (error) {
      console.error("Error completing consultation:", error);
      setQueue(previousQueue); // Rollback on error
    }
  };

  // 3. Finish & Call Next (Seamless transition)
  const handleCompleteAndCallNext = async () => {
    if (!doctorId) return;

    const nextWaiting = waitingList[0];
    const previousQueue = [...queue];

    // OPTIMISTIC UI UPDATE
    setQueue((prev) =>
      prev.map((p) => {
        if (activePatient && p._id === activePatient._id)
          return { ...p, status: "completed" };
        if (nextWaiting && p._id === nextWaiting._id)
          return { ...p, status: "consulting" };
        return p;
      }),
    );

    try {
      const response = await fetch(
        `${API_URL}/appointment/call-next-appointment/${doctorId}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } },
      );

      if (!response.ok) throw new Error("Failed to call next appointment");

      setTimeout(() => {
        fetchQueue();
      }, 500);
    } catch (error) {
      console.error("Error calling next appointment:", error);
      setQueue(previousQueue); // Rollback on error
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        active="Live Desk"
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
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Live Desk{" "}
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-bold text-slate-800">
                {currentTime.toLocaleDateString([], {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md mt-0.5">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden md:block"></div>

            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
              Dr
            </div>
          </div>
        </header>

        {/* Live Desk Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* LEFT COLUMN: Active Session (Takes 7 columns on large screens) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Status Bar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Waiting
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {waitingList.length}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {completedList.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Patient Card */}
              <div className="bg-white rounded-2xl border border-blue-200 shadow-md flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

                {activePatient ? (
                  <>
                    {/* Header for Active Patient */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          IN PROGRESS
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800">
                          {activePatient.patientId?.fullName}
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">
                          Age: {activePatient.age || "N/A"} •{" "}
                          {activePatient.doctorType || "General Consultation"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Token No.
                        </p>
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                          {activePatient.tokenNumber}
                        </div>
                      </div>
                    </div>

                    {/* Body for Active Patient */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="space-y-6 flex-1">
                        {activePatient.labTests && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                            <Microscope className="text-amber-600 shrink-0" />
                            <div>
                              <h4 className="text-sm font-bold text-amber-900 mb-1">
                                Lab Tests Required
                              </h4>
                              <p className="text-sm text-amber-700">
                                {activePatient.labTests}
                              </p>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <FileText size={16} /> Clinical Notes
                          </h4>
                          <textarea
                            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                            placeholder="Type prescription and observation notes here..."
                            defaultValue={activePatient.notes}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-4">
                      <button
                        onClick={() => handleComplete(activePatient._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <CheckCircle2 size={20} /> Finish Consultation
                      </button>
                      {waitingList.length > 0 && (
                        <button
                          onClick={handleCompleteAndCallNext}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <Play size={20} /> Finish & Call Next
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // EMPTY STATE SPLASH SCREEN (Changes based on time of day)
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
                    >
                      <Stethoscope size={48} className="text-blue-600" />
                    </motion.div>

                    {waitingList.length > 0 ? (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                      >
                        {/* If patients have been completed today, we don't ask to "start day" again */}
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
                          {completedList.length === 0
                            ? "Ready to start your day?"
                            : "Ready for the next patient?"}
                        </h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-lg">
                          You have{" "}
                          <span className="font-bold text-slate-700">
                            {waitingList.length} patients
                          </span>{" "}
                          waiting in the queue.
                        </p>

                        <button
                          onClick={handleStartConsulting}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 text-xl mx-auto"
                        >
                          <Play size={24} fill="currentColor" />
                          {completedList.length === 0
                            ? "Start Consulting"
                            : "Call Next Patient"}
                        </button>

                        <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500 font-medium bg-white px-4 py-2 rounded-lg border border-slate-200">
                          <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                          Next in line:{" "}
                          <strong className="text-slate-700">
                            {waitingList[0].patientId?.fullName}
                          </strong>{" "}
                          (Token {waitingList[0].tokenNumber})
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                          No patients waiting
                        </h2>
                        <p className="text-slate-500">
                          Your queue is currently empty.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Queue Management (Takes 5 columns) */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-200 lg:h-auto">
              {/* Waiting List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    Up Next{" "}
                    <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full">
                      {waitingList.length}
                    </span>
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  <AnimatePresence>
                    {waitingList.length === 0 ? (
                      <div className="text-center p-8 text-slate-400 font-medium">
                        No patients waiting.
                      </div>
                    ) : (
                      waitingList.map((patient, index) => (
                        <motion.div
                          key={patient._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className={`p-3 mb-2 rounded-xl border flex items-center justify-between ${
                            index === 0
                              ? "bg-orange-50 border-orange-200"
                              : "bg-white border-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                                index === 0
                                  ? "bg-orange-200 text-orange-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {patient.tokenNumber}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">
                                {patient.patientId?.fullName}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {patient.doctorType || "Consultation"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {index === 0 && !activePatient && (
                              <button
                                onClick={handleStartConsulting}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                              >
                                <Play size={14} /> Call
                              </button>
                            )}
                            <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Completed Today List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-1/3 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/80">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                    Completed Today{" "}
                    <CheckCircle2 size={16} className="text-green-500" />
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {completedList.length === 0 ? (
                    <div className="text-center p-4 text-xs text-slate-400">
                      No patients completed yet.
                    </div>
                  ) : (
                    completedList.map((patient) => (
                      <div
                        key={patient._id}
                        className="p-3 mb-1 flex items-center justify-between border-b border-slate-50 last:border-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-bold text-slate-400 w-6">
                            #{patient.tokenNumber}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-700">
                              {patient.patientId?.fullName}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              Completed at{" "}
                              {new Date(
                                patient.appointmentDate,
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 text-xs font-semibold hover:underline">
                          View
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
