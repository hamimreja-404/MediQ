import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // 👉 Added socket.io-client
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  CalendarDays,
  Edit3,
  X,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

export default function PatientDashboardV2() {
  const { patientId } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentToken, setCurrentToken] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const [hasSeenDemo, setHasSeenDemo] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",
    location: "",
    language: "",
    specialtyInterest: "",
  });

  const profileFields = [
    "fullName",
    "mobile",
    "email",
    "dob",
    "gender",
    "location",
    "language",
    "specialtyInterest",
  ];
  const isDemo = new URLSearchParams(location.search).get("demo") === "true";
  const calculateCompleteness = (userData) => {
    if (!userData) return 0;
    const completedFields = profileFields.filter(
      (field) => userData[field] && userData[field].toString().trim() !== "",
    );
    return (completedFields.length / profileFields.length) * 100;
  };

  // 👉 NEW: Dynamic Wait Time Calculation
  const calculateWaitTime = (myToken, liveToken) => {
    if (myToken < liveToken) return "Turn Passed";
    if (myToken === liveToken) return "It's your turn! 🚨";

    const tokensAhead = myToken - liveToken;
    const avgMinsPerPatient = 15; // Set the average consultation time here
    const totalWaitMins = tokensAhead * avgMinsPerPatient;

    if (totalWaitMins >= 60) {
      const hours = Math.floor(totalWaitMins / 60);
      const mins = totalWaitMins % 60;
      return `${hours} hr ${mins} min wait`;
    }
    return `${totalWaitMins} min wait`;
  };

  useEffect(() => {
    if (patientId) {
      fetchDashboardData();
    }
  }, [patientId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get(`${API_URL}/auth/patient/${patientId}`);
      const userData = userRes.data.user;
      setUser(userData);

      setFormData({
        fullName: userData.fullName || "",
        mobile: userData.mobile || "",
        email: userData.email || "",
        dob: userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : "",
        gender: userData.gender || "",
        location: userData.location || "",
        language: userData.language || "",
        specialtyInterest: userData.specialtyInterest || "",
      });

      const appRes = await axios.get(
        `${API_URL}/appointment-history/patient/${patientId}`,
      );
      setAppointments(appRes.data.appointments || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${API_URL}/auth/update-patient/${patientId}`,
        formData,
      );
      if (response.data.success || response.status === 200) {
        setUser(response.data.user || { ...user, ...formData });
        setIsUpdateModalOpen(false);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/appointment/cancel-appointment/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.status === 200) {
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: "cancelled" } : app,
          ),
        );
      }
    } catch (err) {
      console.error("Cancellation failed:", err);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    appDate.setHours(0, 0, 0, 0);
    return app.status === "confirmed" && appDate.getTime() === today.getTime();
  });

  const historyAppointments = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    appDate.setHours(0, 0, 0, 0);
    return (
      app.status === "cancelled" ||
      appDate.getTime() < today.getTime() ||
      app.status === "completed"
    );
  });

  // 👉 NEW: Socket.io Connection & Listening
  useEffect(() => {
    if (upcomingAppointments.length === 0) return;

    // Connect to server (removing /api from the URL)
    const socketUrl = API_URL.replace(/\/api\/?$/, "");
    const socket = io(socketUrl, { transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      console.log("Connected to Live Queue server");
      // Join the doctor's room for the first upcoming appointment
      const firstUpcoming = upcomingAppointments[0];
      const doctorId = firstUpcoming.doctorId._id || firstUpcoming.doctorId;

      socket.emit("join_doctor_room", doctorId);
    });
    // Listen for queue updates
    socket.on("queue_updated", (data) => {
      console.log("Live queue update received:", data);
      setCurrentToken(data.currentLiveToken);
    });

    return () => {
      socket.disconnect();
    };
  }, [upcomingAppointments.length]);

  useEffect(() => {
    if (isDemo && upcomingAppointments.length > 0 && !hasSeenDemo) {
      toast("Ready to open Doctor Dashboard...");
      setShowDemoPopup(true);
      setHasSeenDemo(true);
    }
  }, [isDemo, hasSeenDemo, upcomingAppointments]);
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-[#1A6BCC] border-t-transparent rounded-full"></div>
          <p className="text-gray-500 font-semibold">
            Loading your health records...
          </p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] p-6 text-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-sm w-full">
          <AlertCircle size={48} className="text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-[#1A1E26] mb-2">Oops!</h2>
          <p className="text-gray-500 text-sm mb-6">User not found. Please login again.</p>
        </div>
      </div>
    );

  const completeness = calculateCompleteness(user);

  return (
    <div className="min-h-screen bg-[#F4F5F7] pb-12 font-sans selection:bg-[#1A6BCC] selection:text-white">
      {showDemoPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <Toaster position="top-right" />

          {/* Background Blur */}
          <div className="absolute inset-0 bg-[#1A1E26]/40 backdrop-blur-xs"></div>

          {/* Popup */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-xl border border-gray-200 p-8 w-[90%] max-w-md text-center shadow-none animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 text-[#1A6BCC] border border-blue-100/50 rounded-xl flex items-center justify-center">
              <CalendarDays size={28} />
            </div>

            {/* Text */}
            <h2 className="text-xl font-bold text-[#1A1E26] mb-2">
              Demo Mode Active
            </h2>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Click below to open the{" "}
              <span className="font-bold text-[#1A6BCC]">Doctor Dashboard</span>{" "}
              in a new window so you can watch the live queue sync in real-time.
            </p>

            {/* Button */}
            <button
              onClick={() => {
                const doctorId =
                  upcomingAppointments[0]?.doctorId?._id ||
                  upcomingAppointments[0]?.doctorId;

                // 1. Open the new tab
                window.open(
                  `/doctor/dashboard/${doctorId}?demo=true`,
                  "_blank",
                );

                // 2. Hide this popup on the Patient side
                setShowDemoPopup(false);
              }}
              className="w-full bg-[#1A6BCC] hover:bg-[#155baa] text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-none"
            >
              Open Doctor Window
            </button>

            <button
              onClick={() => setShowDemoPopup(false)}
              className="w-full mt-3 py-2 text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {isDemo && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-xl p-5 z-50 w-80 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-50 text-[#1A6BCC] border border-blue-100/50 rounded-lg flex items-center justify-center">
              <span className="text-sm">📱</span>
            </div>
            <h4 className="font-bold text-[#1A1E26] text-xs tracking-wider uppercase">
              Patient Experience
            </h4>
          </div>

          <p className="text-xs text-gray-500 mb-4 leading-relaxed font-medium">
            This is the receiving end of the WebSockets connection. Watch how this screen reacts:
          </p>

          <ul className="text-xs text-gray-600 space-y-3 font-medium">
            <li className="flex gap-2.5 items-start">
              <span className="bg-gray-100 text-gray-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                1
              </span>
              <span>
                <strong className="text-[#1A1E26]">Live Token Sync:</strong> When the Doctor calls the next patient, watch the token progress bar fill up instantly.
              </span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="bg-gray-100 text-gray-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                2
              </span>
              <span>
                <strong className="text-[#1A1E26]">Dynamic Wait Time:</strong> See the estimated wait time recalculate automatically as the queue moves.
              </span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="bg-gray-100 text-gray-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                3
              </span>
              <span>
                <strong className="text-[#1A1E26]">All-in-One Hub:</strong> Patients can view appointment details, history, and update their profile strength.
              </span>
            </li>
          </ul>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1A1E26] tracking-tight">
              Patient Dashboard
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Welcome back, {user.fullName?.split(" ")[0]}!
            </p>
          </div>
          <div className="flex items-center gap-3.5 bg-white p-2.5 pr-6 rounded-xl border border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                alt="User"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A1E26]">
                {user.fullName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider flex items-center gap-2 px-1">
              <Clock size={15} className="text-[#1A6BCC]" /> Today's Schedule
            </h3>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((upcoming) => (
                  <motion.div
                    key={upcoming._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-none relative"
                  >
                    <div className="absolute top-6 right-6">
                      <div className="bg-blue-50 text-[#1A6BCC] border border-blue-100/80 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#1A6BCC] rounded-full animate-pulse" />{" "}
                        LIVE
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-3.5">
                          <div className="w-8 h-8 bg-blue-50 text-[#1A6BCC] rounded-lg flex items-center justify-center">
                            <CalendarDays size={16} />
                          </div>
                          <p className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">
                            Next Appointment
                          </p>
                        </div>

                        <h2 className="text-2xl font-black text-[#1A1E26] mb-1">
                          {upcoming.doctorId.fullName}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mb-6">
                          {upcoming.doctorId.specialization} •{" "}
                          {upcoming.doctorId.location}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 border border-gray-200/50 p-4 rounded-lg">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">
                              Date
                            </p>
                            <p className="font-bold text-[#1A1E26] text-sm">
                              {new Date(
                                upcoming.appointmentDate,
                              ).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                          <div className="bg-gray-50 border border-gray-200/50 p-4 rounded-lg">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">
                              Live Wait Time
                            </p>
                            <p
                              className={`font-bold text-sm ${upcoming.tokenNumber === currentToken ? "text-red-500 animate-pulse" : "text-[#1A6BCC]"}`}
                            >
                              {calculateWaitTime(
                                upcoming.tokenNumber,
                                currentToken,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-64 flex flex-col gap-4">
                        <div className="bg-[#1A1E26] rounded-xl p-5 text-white">
                          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mb-4">
                            Token Progress
                          </p>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-black text-[#1A6BCC]">
                              {upcoming.tokenNumber}
                            </span>
                            <span className="text-gray-400 text-xs font-semibold">
                              Your Token
                            </span>
                          </div>
                          <div className="mt-6 pt-5 border-t border-slate-700/60">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-400">
                                Current:
                              </span>
                              <span className="text-sm font-black text-[#1A6BCC]">
                                #{currentToken}
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1A6BCC] transition-all duration-500"
                                style={{
                                  width: `${Math.min((currentToken / upcoming.tokenNumber) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCancelAppointment(upcoming._id)}
                          className="w-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100/50 rounded-lg py-3 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                        >
                          <Trash2 size={14} /> CANCEL APPOINTMENT
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
                <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-[#1A1E26] mb-1">
                  No Appointments Today
                </h3>
                <p className="text-gray-400 text-sm">
                  You're all clear! Stay healthy.
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-none">
              <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-lg font-bold text-[#1A1E26]">
                  Medical History
                </h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Past & Cancelled
                </span>
              </div>
              <div className="space-y-3">
                {historyAppointments.length > 0 ? (
                  historyAppointments.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-[#F4F5F7]/40 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.status === "cancelled" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}
                        >
                          {app.status === "cancelled" ? (
                            <X size={18} />
                          ) : (
                            <CheckCircle2 size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1A1E26]">
                            {app.doctorId.fullName}
                          </p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">
                            {app.doctorId.specialization} •{" "}
                            {new Date(app.appointmentDate).toDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border ${
                            app.status === "cancelled"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    No medical history records found.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-none text-center">
              <h3 className="text-base font-bold text-[#1A1E26] mb-6">
                Profile Strength
              </h3>
              <div className="relative w-36 h-36 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <motion.circle
                    initial={{ strokeDasharray: "0 390" }}
                    animate={{
                      strokeDasharray: `${(completeness / 100) * 390} 390`,
                    }}
                    transition={{ duration: 1.2 }}
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                    className="text-[#1A6BCC]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#1A1E26]">
                    {Math.round(completeness)}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="w-full py-3 bg-[#1A6BCC] hover:bg-[#155baa] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Edit3 size={16} /> Update Info
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-[#1A1E26] shadow-none">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-sm uppercase tracking-wider text-gray-400">Contact Info</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-[#1A6BCC]" />
                  <p className="text-sm font-medium text-gray-700">{user.mobile || "Not Set"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-[#1A6BCC]" />
                  <p className="text-sm font-medium text-gray-700 truncate">{user.email || "No Email"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-[#1A6BCC]" />
                  <p className="text-sm font-medium text-gray-700">
                    {user.location || "No Location Set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-[#1A1E26]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white w-full max-w-2xl rounded-xl border border-gray-200 relative overflow-hidden flex flex-col max-h-[90vh] shadow-none"
            >
              <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1E26]">
                    Update Profile
                  </h2>
                </div>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={handleUpdateProfile}
                className="flex-1 overflow-y-auto p-6 pt-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                      />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-[#1A1E26] font-medium outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                      />
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-[#1A1E26] font-medium outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-[#1A1E26] font-medium outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                      />
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-[#1A1E26] font-medium outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-[#1A1E26] font-medium outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-[#1A1E26] font-medium outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="flex-1 py-3 bg-white border border-gray-200 text-[#1A1E26] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-[#1A6BCC] text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#155baa] transition-all disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />{" "}
                        Updating...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
