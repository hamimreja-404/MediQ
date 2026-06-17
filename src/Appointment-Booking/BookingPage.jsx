import React, { useState, useEffect } from "react";
import {
  Phone,
  Lock,
  KeyRound,
  User,
  ChevronRight,
  MapPin,
  Calendar,
  Stethoscope,
  FileText,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Ticket,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// --- Configuration ---
const API_URL = import.meta.env.VITE_API_URL;
const OTP_DEFAULT = "8989";

// --- Mock Data for Dropdowns ---
const DOCTOR_TYPES = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Orthopedic",
  "Gynecologist",
];

const LAB_TESTS = [
  "None",
  "Complete Blood Count (CBC)",
  "Blood Sugar (Fasting)",
  "Lipid Profile",
  "Thyroid Function Test",
  "Liver Function Test",
  "Urinalysis",
  "X-Ray Chest",
  "MRI Scan",
];

export default function BookAppointmentV2() {
  // --- State Management ---
  const [step, setStep] = useState("mobile"); // mobile, auth, register, form, success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // URL Params State
  const [bookingInfo, setBookingInfo] = useState({
    doctorName: "Dr. Default",
    date: new Date().toISOString().split("T")[0],
    location: "Main Clinic",
  });

  // User & Form State
  const [mobile, setMobile] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [authInput, setAuthInput] = useState(""); // Password (existing) or OTP (new)
  const [newPassword, setNewPassword] = useState(""); // Used during registration
  const [token, setToken] = useState(null);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    doctorType: "",
    labTests: "",
    notes: "",
  });
  const navigate = useNavigate();
    const location = useLocation();
    const isDemo = new URLSearchParams(location.search).get("demo") === "true";
  // --- Effects ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dName = params.get("doctorName");
    const dDate = params.get("date");
    const dLoc = params.get("location");
    const dId = params.get("doctorId");

    setDoctorId(dId);
    if (dName || dDate || dLoc || dId) {
      setBookingInfo({
        doctorName: dName || "Dr. Assigned",
        date: dDate || new Date().toISOString().split("T")[0],
        location: dLoc || "Hospital Center",
        doctorId: dId || null,
      });
    }
  }, []);
  console.log(isDemo)
  useEffect(() => {
    if (isDemo) {
      setTimeout(() => {
        toast(" Step 3: Add dummy details and book appointment");
      }, 3000);

    }
  }, [isDemo]);
  // --- Handlers ---

  const handleMobileSubmit = async () => {
    if (mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/check-user-exists/${mobile}`,
      );
      const data = await response.json();

      if (data.exists === true) {
        setUserExists(true);
        setName(data.name || "");
      } else {
        setUserExists(false);
      }
      setStep("auth");
    } catch (err) {
      console.error("Network error:", err);
      // Fallback for demo
      setUserExists(mobile.endsWith("0"));
      setStep("auth");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = () => {
    setError("");
    if (!authInput) {
      setError(
        userExists ? "Please enter your password" : "Please enter the OTP",
      );
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      if (!userExists) {
        // New User Flow: Verify OTP then go to Register (Password Setup)
        if (authInput !== OTP_DEFAULT) {
          setError("Invalid OTP. Try 8989.");
          setLoading(false);
          return;
        }
        setLoading(false);
        setStep("register"); // New Step: Set Password
      } else {
        // Existing User Flow: Login with Password
        await handleLogin();
        setLoading(false);
      }
    }, 800);
  };

  const handleRegister = async () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/register-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobile,
          password: newPassword,
          role: "patient",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUserId(data.user.id);
        setStep("form");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: mobile,
          password: authInput,
          role: "patient",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUserId(data.user.id);
        setStep("form");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = async () => {
    if (!formData.fullName || !formData.age) {
      setError("Name and Age are required.");
      return;
    }

    if (!userId) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/appointment/book-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctorId: doctorId,
          patientId: userId,
          age: formData.age,
          doctorType: formData.doctorType,
          labTests: formData.labTests,
          notes: formData.notes,
          date: bookingInfo.date,
          patientName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Booking failed");
        setLoading(false);
        return;
      }

      setToken(`${data.tokenNumber}`);
      setStep("success");
      setLoading(false);
      setTimeout(() => {
        {isDemo ? navigate(`/patient/dashboard/${userId}?demo=true`) :navigate(`/patient/dashboard/${userId}`)}
        
      }, 2500);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4 z-30 shadow-xs">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1A6BCC] shrink-0">
          <Stethoscope size={20} className="stroke-[2]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-[#1A1E26] text-base truncate">
            {bookingInfo.doctorName}
          </h2>
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mt-1">
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
              <Calendar size={11} />
              {new Date(bookingInfo.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
            </span>
            <span className="flex items-center gap-1 truncate">
              <MapPin size={11} className="text-[#1A6BCC]" />
              {bookingInfo.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans text-[#1A1E26] pb-20 pt-18 selection:bg-[#1A6BCC] selection:text-white">
      {renderHeader()}
      {isDemo && (
        <div className="fixed bottom-6 right-6 bg-white shadow-md border border-gray-200 rounded-xl p-4 z-50 w-56 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">📋</span>
            <h4 className="font-bold text-[#1A1E26] text-xs tracking-wide uppercase">
              Demo Guide
            </h4>
          </div>
          
          <ul className="text-xs text-gray-500 space-y-2 font-medium">
            <li className="flex gap-1.5 items-start">
              <span className="text-[#1A6BCC]">•</span>
              <span>Input <strong className="text-[#1A1E26]">dummy details</strong> to schedule.</span>
            </li>
            <li className="flex gap-1.5 items-center">
              <span className="text-[#1A6BCC]">•</span>
              <span>Test OTP:</span>
              <span className="bg-slate-900 text-teal-400 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider text-[10px]">
                8989
              </span>
            </li>
          </ul>
        </div>
      )}

      <Toaster position="top-right" />
      <div className="max-w-md mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: MOBILE NUMBER */}
          {step === "mobile" && (
            <motion.div
              key="step-mobile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-none"
            >
              <div className="w-12 h-12 bg-blue-50 text-[#1A6BCC] rounded-lg flex items-center justify-center mb-5 shrink-0">
                <Phone size={24} className="stroke-[2]" />
              </div>
              <h1 className="text-xl font-bold text-[#1A1E26] mb-1">
                Let's get started
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Enter your mobile number to identify yourself.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-widest">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="9876543210"
                      className="w-full bg-[#F4F5F7] border border-gray-200 focus:border-[#1A6BCC] focus:ring-2 focus:ring-[#1A6BCC]/15 focus:bg-white rounded-lg py-3 pl-14 pr-4 text-base font-bold text-[#1A1E26] outline-none transition-all placeholder:text-gray-300"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-xs font-semibold border border-rose-100">
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleMobileSubmit}
                  disabled={loading || mobile.length < 10}
                  className="w-full bg-[#1A6BCC] hover:bg-[#155baa] text-white h-12 rounded-lg font-bold text-sm shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Next <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AUTH (OTP for New / Password for Old) */}
          {step === "auth" && (
            <motion.div
              key="step-auth"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-none"
            >
              <button
                onClick={() => setStep("mobile")}
                className="text-[#1A6BCC] text-xs font-bold mb-5 hover:underline transition-colors block"
              >
                ← Change Number
              </button>

              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 shrink-0 ${userExists ? "bg-blue-50 text-[#1A6BCC]" : "bg-blue-50 text-[#1A6BCC]"}`}
              >
                {userExists ? <Lock size={24} className="stroke-[2]" /> : <KeyRound size={24} className="stroke-[2]" />}
              </div>

              <h1 className="text-xl font-bold text-[#1A1E26] mb-1">
                {userExists ? `Welcome Back ${name}` : "Verify Number"}
              </h1>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                {userExists
                  ? `Enter password for ${mobile}`
                  : `We sent a code to ${mobile}.`}
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-widest">
                    {userExists ? "Password" : "OTP Code"}
                  </label>
                  <input
                    type={userExists ? "password" : "number"}
                    value={authInput}
                    onChange={(e) => setAuthInput(e.target.value)}
                    placeholder={userExists ? "••••••••" : "8 9 8 9"}
                    className="w-full bg-[#F4F5F7] border border-gray-200 focus:border-[#1A6BCC] focus:ring-2 focus:ring-[#1A6BCC]/15 focus:bg-white rounded-lg p-3 text-lg font-mono font-bold text-[#1A1E26] outline-none transition-all text-center tracking-widest"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-xs font-semibold border border-rose-100">
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAuthSubmit}
                  disabled={loading}
                  className="w-full bg-[#1A6BCC] hover:bg-[#155baa] text-white h-12 rounded-lg font-bold text-sm shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2.5: REGISTER (PASSWORD SETUP FOR NEW USERS) */}
          {step === "register" && (
            <motion.div
              key="step-register"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-none"
            >
              <div className="w-12 h-12 bg-blue-50 text-[#1A6BCC] rounded-lg flex items-center justify-center mb-5 shrink-0">
                <ShieldCheck size={24} className="stroke-[2]" />
              </div>

              <h1 className="text-xl font-bold text-[#1A1E26] mb-1">
                Secure your account
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Create a password to access your bookings later.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-widest">
                    Create Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#F4F5F7] border border-gray-200 focus:border-[#1A6BCC] focus:ring-2 focus:ring-[#1A6BCC]/15 focus:bg-white rounded-lg p-3 text-base font-semibold text-[#1A1E26] outline-none transition-all"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-xs font-semibold border border-rose-100">
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={loading || newPassword.length < 6}
                  className="w-full bg-[#1A6BCC] hover:bg-[#155baa] text-white h-12 rounded-lg font-bold text-sm shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Create Account & Continue"
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: APPOINTMENT FORM */}
          {step === "form" && (
            <motion.div
              key="step-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-100 flex gap-2.5 items-start">
                <CheckCircle2
                  size={16}
                  className="text-emerald-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    Authentication Successful
                  </p>
                  <p className="text-emerald-600 text-xs mt-0.5">
                    Please fill in the patient details below.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-none space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-widest">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder="Patient Name"
                      className="w-full border border-gray-200 p-3 pl-10 rounded-lg text-sm text-[#1A1E26] font-semibold focus:ring-2 focus:ring-[#1A6BCC]/15 focus:border-[#1A6BCC] outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Age & Doctor Type */}
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-widest">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleFormChange}
                      placeholder="25"
                      className="w-full border border-gray-200 p-3 rounded-lg text-sm text-[#1A1E26] font-semibold focus:ring-2 focus:ring-[#1A6BCC]/15 focus:border-[#1A6BCC] outline-none transition-all text-center placeholder:text-gray-300"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-widest">
                      Doctor Type
                    </label>
                    <div className="relative">
                      <select
                        name="doctorType"
                        value={formData.doctorType}
                        onChange={handleFormChange}
                        className="w-full border border-gray-200 p-3 pr-8 rounded-lg text-sm text-[#1A1E26] font-semibold focus:ring-2 focus:ring-[#1A6BCC]/15 focus:border-[#1A6BCC] outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Optional</option>
                        {DOCTOR_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronRight
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                        size={14}
                      />
                    </div>
                  </div>
                </div>

                {/* Lab Tests */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-widest">
                    Lab Tests (Common)
                  </label>
                  <div className="relative">
                    <FlaskConical
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <select
                      name="labTests"
                      value={formData.labTests}
                      onChange={handleFormChange}
                      className="w-full border border-gray-200 p-3 pl-10 pr-8 rounded-lg text-sm text-[#1A1E26] font-semibold focus:ring-2 focus:ring-[#1A6BCC]/15 focus:border-[#1A6BCC] outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select a test (Optional)</option>
                      {LAB_TESTS.map((test) => (
                        <option key={test} value={test}>
                          {test}
                        </option>
                      ))}
                    </select>
                    <ChevronRight
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                      size={14}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <div className="flex justify-between items-end mb-1.5 ml-0.5">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block tracking-widest">
                      Notes
                    </label>
                    <span
                      className={`text-[9px] font-bold ${formData.notes.length > 280 ? "text-rose-500" : "text-gray-300"}`}
                    >
                      {formData.notes.length}/300
                    </span>
                  </div>
                  <div className="relative">
                    <FileText
                      size={15}
                      className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                    />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      maxLength={300}
                      rows={3}
                      placeholder="Describe your symptoms or clinical reason for review..."
                      className="w-full border border-gray-200 p-3 pl-10 rounded-lg text-sm text-[#1A1E26] font-semibold focus:ring-2 focus:ring-[#1A6BCC]/15 focus:border-[#1A6BCC] outline-none transition-all resize-none placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-xs font-semibold border border-rose-100">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleBookAppointment}
                disabled={loading}
                className="w-full py-4 bg-[#1A6BCC] hover:bg-[#155baa] text-white rounded-lg font-bold text-base shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Book Appointment"
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-none text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A6BCC]"></div>

              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} />
              </div>

              <h3 className="text-2xl font-bold text-[#1A1E26] mb-1">
                Booking Confirmed!
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                We have successfully scheduled your appointment with{" "}
                <strong className="text-gray-700">{bookingInfo.doctorName}</strong>.
              </p>

              <div className="bg-slate-50 border border-gray-200 p-6 rounded-xl mb-6 relative">
                <span className="text-gray-400 font-bold uppercase tracking-[0.15em] text-[9px] flex items-center justify-center gap-1 mb-1.5">
                  <Ticket size={11} className="text-[#1A6BCC]" /> Queue Token Number
                </span>
                <div className="text-5xl font-black text-[#1A6BCC] tracking-tighter">
                  {token}
                </div>
              </div>

              <div className="text-xs font-semibold text-gray-400 animate-pulse">
                Redirecting to Patient Dashboard...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
