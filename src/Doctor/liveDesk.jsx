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
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
// --- COMPONENTS ---

const Sidebar = ({ active, isMobileOpen, closeMobile }) => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

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
      path: "/doctor/dashboard",
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
              to={`${link.path}/${doctorId || ""}?demo=true`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${active === link.name ? "bg-blue-50 text-[#1A6BCC] font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A6BCC]"}`}
            >
              {link.icon}
              <span className="text-sm">{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button  onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors cursor-pointer font-bold text-sm">
            <LogOut size={18} />
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
    const navigate = useNavigate();
  const isDemo = new URLSearchParams(location.search).get("demo") === "true";
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
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans selection:bg-[#1A6BCC] selection:text-white">
      <Sidebar
        active="Live Desk"
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
                <strong className="text-[#1A1E26]">Live Desk:</strong> Navigate to the Live Desk tab and start calling patients from the queue.
              </span>
            </li>
            <li className="flex gap-2.5 items-start border-t border-gray-100 pt-3 mt-2">
              <span className="bg-blue-50 text-[#1A6BCC] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold animate-pulse">
                2
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
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-black text-[#1A1E26] tracking-tight flex items-center gap-2">
                Live Desk
              </h1>
              <span className="flex h-2 w-2 relative mt-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-bold text-[#1A1E26]">
                {currentTime.toLocaleDateString([], {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-[10px] text-[#1A6BCC] font-bold bg-blue-50 border border-blue-100/30 px-2 py-0.5 rounded-md mt-0.5">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-[#1A6BCC] font-bold border border-blue-100/50 shadow-none">
              Dr
            </div>
          </div>
        </header>

        {/* Live Desk Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* LEFT COLUMN: Active Session */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Status Bar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-none flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100/50 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Waiting
                    </p>
                    <p className="text-2xl font-black text-[#1A1E26]">
                      {waitingList.length}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-none flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Completed
                    </p>
                    <p className="text-2xl font-black text-[#1A1E26]">
                      {completedList.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Patient Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-none flex-1 flex flex-col overflow-hidden relative min-h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1A6BCC]"></div>

                {activePatient ? (
                  <>
                    {/* Header for Active Patient */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-[#1A6BCC] border border-blue-100/30 text-[10px] font-bold tracking-wider mb-3 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1A6BCC]"></div>
                          IN PROGRESS
                        </div>
                        <h2 className="text-2xl font-black text-[#1A1E26]">
                          {activePatient.patientId?.fullName}
                        </h2>
                        <p className="text-gray-500 text-xs font-semibold mt-1">
                          Age: {activePatient.age || "N/A"} •{" "}
                          {activePatient.doctorType || "General Consultation"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Token No.
                        </p>
                        <div className="w-12 h-12 rounded-lg bg-[#1A1E26] text-white flex items-center justify-center text-2xl font-black">
                          {activePatient.tokenNumber}
                        </div>
                      </div>
                    </div>

                    {/* Body for Active Patient */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="space-y-6 flex-1">
                        {activePatient.labTests && (
                          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3">
                            <Microscope className="text-amber-600 shrink-0" size={18} />
                            <div>
                              <h4 className="text-xs font-bold text-amber-900 mb-1">
                                Lab Tests Required
                              </h4>
                              <p className="text-xs text-amber-700">
                                {activePatient.labTests}
                              </p>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="text-xs font-bold text-[#1A1E26] mb-3 flex items-center gap-2">
                            <FileText size={15} /> Clinical Notes
                          </h4>
                          <textarea
                            className="w-full h-32 bg-white border border-gray-200 rounded-lg p-4 text-sm focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] outline-none transition-all resize-none text-[#1A1E26]"
                            placeholder="Type prescription and observation notes here..."
                            defaultValue={activePatient.notes}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                      <button
                        onClick={() => handleComplete(activePatient._id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-none"
                      >
                        <CheckCircle2 size={16} /> Finish Consultation
                      </button>
                      {waitingList.length > 0 && (
                        <button
                          onClick={handleCompleteAndCallNext}
                          className="flex-1 bg-[#1A6BCC] hover:bg-[#155baa] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-none"
                        >
                          <Play size={16} /> Finish & Call Next
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  /* EMPTY STATE SPLASH SCREEN */
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/30">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 bg-blue-50 border border-blue-100/50 text-[#1A6BCC] rounded-full flex items-center justify-center mb-6"
                    >
                      <Stethoscope size={40} className="stroke-[2]" />
                    </motion.div>

                    {waitingList.length > 0 ? (
                      <motion.div
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                      >
                        <h2 className="text-2xl font-black text-[#1A1E26] mb-1">
                          {completedList.length === 0
                            ? "Ready to start your day?"
                            : "Ready for the next patient?"}
                        </h2>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                          You have{" "}
                          <span className="font-bold text-[#1A6BCC]">
                            {waitingList.length} patients
                          </span>{" "}
                          waiting in the queue.
                        </p>

                        <button
                          onClick={handleStartConsulting}
                          className="bg-[#1A6BCC] hover:bg-[#155baa] text-white px-8 py-3.5 rounded-lg font-bold flex items-center gap-2.5 transition-all text-base shadow-none mx-auto"
                        >
                          <Play size={18} fill="currentColor" />
                          {completedList.length === 0
                            ? "Start Consulting"
                            : "Call Next Patient"}
                        </button>

                        <div className="mt-6 inline-flex items-center gap-2 text-xs text-gray-500 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Next in line:{" "}
                          <strong className="text-[#1A1E26]">
                            {waitingList[0].patientId?.fullName}
                          </strong>{" "}
                          (Token {waitingList[0].tokenNumber})
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <h2 className="text-xl font-bold text-[#1A1E26] mb-1">
                          No patients waiting
                        </h2>
                        <p className="text-gray-500 text-sm">
                          Your queue is currently empty.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Queue Management */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-200 lg:h-auto">
              {/* Waiting List */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-none flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
                  <h3 className="font-bold text-[#1A1E26] flex items-center gap-2 text-sm">
                    Up Next{" "}
                    <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full font-bold">
                      {waitingList.length}
                    </span>
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  <AnimatePresence>
                    {waitingList.length === 0 ? (
                      <div className="text-center p-8 text-gray-400 text-sm font-semibold">
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
                          className={`p-3 mb-2 rounded-lg border flex items-center justify-between transition-all ${
                            index === 0
                              ? "bg-amber-50/40 border-amber-200/60"
                              : "bg-white border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-9 h-9 rounded-md flex items-center justify-center font-black text-base ${
                                index === 0
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {patient.tokenNumber}
                            </div>
                            <div>
                              <h4 className="font-black text-sm text-[#1A1E26]">
                                {patient.patientId?.fullName}
                              </h4>
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                {patient.doctorType || "Consultation"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {index === 0 && !activePatient && (
                              <button
                                onClick={handleStartConsulting}
                                className="bg-[#1A6BCC] hover:bg-[#155baa] text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                              >
                                <Play size={12} fill="currentColor" /> Call
                              </button>
                            )}
                            <button className="p-1.5 text-gray-400 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg transition-all">
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
              <div className="bg-white rounded-xl border border-gray-200 shadow-none h-1/3 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/80">
                  <h3 className="font-bold text-[#1A1E26] flex items-center gap-2 text-sm">
                    Completed Today{" "}
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {completedList.length === 0 ? (
                    <div className="text-center p-4 text-xs text-gray-400">
                      No patients completed yet.
                    </div>
                  ) : (
                    completedList.map((patient) => (
                      <div
                        key={patient._id}
                        className="p-3 mb-1 flex items-center justify-between border-b border-gray-50 last:border-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xs font-bold text-gray-400 w-6">
                            #{patient.tokenNumber}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-700">
                              {patient.patientId?.fullName}
                            </h4>
                            <p className="text-[10px] text-gray-400">
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
                        <button className="text-[#1A6BCC] text-xs font-bold hover:underline">
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
