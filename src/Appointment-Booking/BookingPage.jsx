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
import { useNavigate } from "react-router-dom";
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
        navigate(`/patient/dashboard/${userId}`);
      }, 2500);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="bg-white border-b border-slate-100 px-6 py-4 z-30 shadow-sm">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
          <Stethoscope size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-slate-900 text-lg truncate">
            {bookingInfo.doctorName}
          </h2>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
              <Calendar size={10} />
              {new Date(bookingInfo.date).toDateString()}
            </span>
            <span className="flex items-center gap-1 truncate">
              <MapPin size={10} className="text-teal-500" />
              {bookingInfo.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-20 pt-18">
      {renderHeader()}

      <div className="max-w-md mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: MOBILE NUMBER */}
          {step === "mobile" && (
            <motion.div
              key="step-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Phone size={28} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">
                Let's get started
              </h1>
              <p className="text-slate-500 mb-8">
                Enter your mobile number to identify yourself.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-400 ml-1 mb-2 block tracking-widest">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
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
                      className="w-full bg-slate-50 border-2 border-slate-100 focus:border-teal-500 focus:bg-white rounded-2xl py-4 pl-16 pr-4 text-xl font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-sm font-medium">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleMobileSubmit}
                  disabled={loading || mobile.length < 10}
                  className="w-full bg-slate-900 text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Next <ArrowRight size={20} />
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100"
            >
              <button
                onClick={() => setStep("mobile")}
                className="text-slate-400 text-sm font-bold mb-6 hover:text-slate-600 transition-colors"
              >
                ← Change Number
              </button>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${userExists ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-600"}`}
              >
                {userExists ? <Lock size={28} /> : <KeyRound size={28} />}
              </div>

              <h1 className="text-2xl font-black text-slate-900 mb-2">
                {userExists ? `Welcome Back ${name}` : "Verify Number"}
              </h1>
              <p className="text-slate-500 mb-8">
                {userExists
                  ? `Enter password for ${mobile}`
                  : `We sent a code to ${mobile}.`}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-400 ml-1 mb-2 block tracking-widest">
                    {userExists ? "Password" : "OTP Code"}
                  </label>
                  <input
                    type={userExists ? "password" : "number"}
                    value={authInput}
                    onChange={(e) => setAuthInput(e.target.value)}
                    placeholder={userExists ? "••••••••" : "8 9 8 9"}
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-teal-500 focus:bg-white rounded-2xl p-4 text-xl font-bold text-slate-900 outline-none transition-all text-center tracking-widest"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-sm font-medium">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAuthSubmit}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100"
            >
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>

              <h1 className="text-2xl font-black text-slate-900 mb-2">
                Secure your account
              </h1>
              <p className="text-slate-500 mb-8">
                Create a password to access your bookings later.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-400 ml-1 mb-2 block tracking-widest">
                    Create Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-teal-500 focus:bg-white rounded-2xl p-4 text-lg font-bold text-slate-900 outline-none transition-all"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-sm font-medium">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  disabled={loading || newPassword.length < 6}
                  className="w-full bg-slate-900 text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 flex gap-3 items-start">
                <CheckCircle2
                  size={20}
                  className="text-teal-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-teal-800 font-bold text-sm">
                    Authentication Successful
                  </p>
                  <p className="text-teal-600 text-xs mt-0.5">
                    Please fill in the patient details below.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 space-y-5">
                {/* Full Name */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder="Patient Name"
                      className="w-full border border-slate-200 p-4 pl-12 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Age & Doctor Type */}
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleFormChange}
                      placeholder="25"
                      className="w-full border border-slate-200 p-4 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all text-center"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">
                      Doctor Type
                    </label>
                    <div className="relative">
                      <select
                        name="doctorType"
                        value={formData.doctorType}
                        onChange={handleFormChange}
                        className="w-full border border-slate-200 p-4 pr-8 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Optional</option>
                        {DOCTOR_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronRight
                        className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                        size={16}
                      />
                    </div>
                  </div>
                </div>

                {/* Lab Tests */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 mb-1.5 block tracking-widest">
                    Lab Tests (Common)
                  </label>
                  <div className="relative">
                    <FlaskConical
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      name="labTests"
                      value={formData.labTests}
                      onChange={handleFormChange}
                      className="w-full border border-slate-200 p-4 pl-12 pr-8 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select a test (Optional)</option>
                      {LAB_TESTS.map((test) => (
                        <option key={test} value={test}>
                          {test}
                        </option>
                      ))}
                    </select>
                    <ChevronRight
                      className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <div className="flex justify-between items-end mb-1.5 ml-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">
                      Notes
                    </label>
                    <span
                      className={`text-[10px] font-bold ${formData.notes.length > 280 ? "text-red-500" : "text-slate-300"}`}
                    >
                      {formData.notes.length}/300
                    </span>
                  </div>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-slate-400"
                    />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      maxLength={300}
                      rows={3}
                      placeholder="Describe your problem or symptoms..."
                      className="w-full border border-slate-200 p-4 pl-12 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl text-sm font-medium">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={handleBookAppointment}
                disabled={loading}
                className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-teal-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-100 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-teal-400 to-blue-500"></div>

              <div className="w-24 h-24 bg-linear-to-tr from-teal-400 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30">
                <CheckCircle2 size={48} />
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-slate-500 mb-8">
                We have successfully scheduled your appointment with{" "}
                {bookingInfo.doctorName}.
              </p>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl mb-8 relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-slate-200"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-slate-200"></div>

                <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-1 mb-2">
                  <Ticket size={12} /> Token Number
                </span>
                <div className="text-5xl font-black text-slate-900 tracking-tighter">
                  {token}
                </div>
              </div>

              <div className="text-sm font-bold text-slate-400 animate-pulse">
                Redirecting to Dashboard...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
