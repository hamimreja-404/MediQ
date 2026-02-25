import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  HeartPulse,
  ArrowRight,
  Mail,
  Globe,
  XCircle,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL ;

const Toast = ({ message, type, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 20, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        className={`fixed top-0 left-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl border ${
          type === "success"
            ? "bg-white text-teal-700 border-teal-100"
            : "bg-white text-red-600 border-red-100"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={20} className="text-teal-500" />
        ) : (
          <AlertCircle size={20} className="text-red-500" />
        )}
        <span className="font-semibold text-sm">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function RegisterPatient() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",
    location: "Malda",
    language: "English",
    specialtyInterest: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const districts = [
    "Malda", "Alipurduar", "Bankura", "Birbhum", "Cooch Behar",
    "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri",
    "Jhargram", "Kalimpong", "Kolkata", "Murshidabad", "Nadia",
    "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
    "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas",
    "Uttar Dinajpur",
  ];

  const showToast = (msg, type) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    const p = formData.password;
    setPasswordCriteria({
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      special: /[@$!%*?&]/.test(p),
    });
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full Name is required";
      isValid = false;
    }
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Valid 10-digit mobile required";
      isValid = false;
    }
    if (!formData.dob) {
      tempErrors.dob = "DOB required";
      isValid = false;
    }
    if (!formData.gender) {
      tempErrors.gender = "Gender required";
      isValid = false;
    }
    if (!Object.values(passwordCriteria).every(Boolean)) {
      tempErrors.password = "Password requirements not met";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast("Please fix form errors", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      showToast("Account Created Successfully!", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", "patient");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 pt-24 md:pt-32 relative overflow-hidden">
      <Toast
        message={toast.msg}
        type={toast.type}
        isVisible={toast.show}
      />

      <div className="flex w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative z-10">
        <div className="hidden lg:flex w-5/12 bg-linear-to-br from-teal-600 to-teal-800 flex-col justify-between p-12 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Stethoscope size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight">MediQ</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Your Health,
              <br />
              Digitalized.
            </h2>
          </div>
          <div className="relative z-10 mt-auto pt-8 border-t border-white/20">
            <span className="text-sm font-bold text-teal-100">
              +12k Patients Joined
            </span>
          </div>
        </div>

        <div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-slate-50/50">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Create Patient Account
            </h2>
            <p className="text-slate-500">Fill in your details to get started.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500">
                <User size={20} />
              </div>
              <input
                type="text"
                name="fullName"
                className={`w-full bg-white border ${errors.fullName ? "border-red-500" : "border-slate-200"} text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium`}
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500">
                  <Smartphone size={20} />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  className={`w-full bg-white border ${errors.mobile ? "border-red-500" : "border-slate-200"} text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500`}
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500">
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  name="dob"
                  className={`w-full bg-white border ${errors.dob ? "border-red-500" : "border-slate-200"} rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500 text-slate-500`}
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              <div className="relative group">
                <select
                  name="gender"
                  className={`w-full bg-white border ${errors.gender ? "border-red-500" : "border-slate-200"} text-slate-900 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-teal-500 appearance-none`}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500">
                  <MapPin size={20} />
                </div>
                <select
                  name="location"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  value={formData.location}
                  onChange={handleChange}
                >
                  {districts.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500">
                  <Globe size={20} />
                </div>
                <select
                  name="language"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500">
                <HeartPulse size={20} />
              </div>
              <select
                name="specialtyInterest"
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500 appearance-none text-slate-600"
                value={formData.specialtyInterest}
                onChange={handleChange}
              >
                <option value="">What type of doctor do you need? (Optional)</option>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist (Heart)</option>
                <option value="Dermatologist">Dermatologist (Skin)</option>
                <option value="Pediatrician">Pediatrician (Child)</option>
                <option value="Orthopedic">Orthopedic (Bone)</option>
              </select>
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-500">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full bg-white border ${errors.password ? "border-red-500" : "border-slate-200"} text-slate-900 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-teal-500`}
                placeholder="Create Strong Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <div className="grid grid-cols-2 gap-2 mt-3 ml-1">
                {[
                  { label: "8+ Characters", valid: passwordCriteria.length },
                  { label: "Uppercase (A-Z)", valid: passwordCriteria.upper },
                  { label: "Lowercase (a-z)", valid: passwordCriteria.lower },
                  { label: "Number (0-9)", valid: passwordCriteria.number },
                  { label: "Special (@$!%*?&)", valid: passwordCriteria.special },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${item.valid ? "text-teal-600" : "text-slate-400"}`}
                  >
                    {item.valid ? <Check size={14} className="text-teal-500" /> : <XCircle size={14} className="text-red-300" />}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-lg text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>Register Account <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-teal-600 hover:text-teal-500 hover:underline">
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}