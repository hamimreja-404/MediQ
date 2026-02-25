import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Building2,
  GraduationCap,
  BadgeCheck,
  Clock,
  IndianRupee,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

const Toast = ({ message, type, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 20, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        className={`fixed top-0 left-1/2 z-100 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl border ${
          type === "success"
            ? "bg-white text-blue-700 border-blue-100"
            : "bg-white text-red-600 border-red-100"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={20} className="text-blue-500" />
        ) : (
          <AlertCircle size={20} className="text-red-500" />
        )}
        <span className="font-semibold text-sm">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function RegisterDoctor() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    degree: "",
    college: "",
    licenseNumber: "",
    specialization: "",
    experience: "",
    clinicName: "",
    location: "",
    timing: "",
    fees: "",
    password: "",
  });

  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.mobile || !formData.licenseNumber) {
        showToast("Please fill in all professional details.", "error");
        return;
      }
      setStep(2);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.clinicName || !formData.password || !formData.location) {
      showToast("Please fill in all clinic and password details.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register-doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Partner Account Created Successfully!", "success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", "doctor");
        setTimeout(() => navigate(`/doctor/dashboard/${data.user.id}`), 2000);
      } else {
        showToast(data.message || "Registration Failed", "error");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      showToast("Server Connection Error", "error");
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

      <div className="flex w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative z-10">
        <div className="w-full p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Doctor Registration
            </h2>
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    step >= i ? "w-12 bg-blue-600" : "w-3 bg-slate-200"
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dr. Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Smartphone size={20} />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mobile Number"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <GraduationCap size={20} />
                    </div>
                    <input
                      type="text"
                      name="degree"
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Degrees (e.g. MBBS)"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="text"
                    name="college"
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="College/University"
                    value={formData.college}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <BadgeCheck size={20} />
                    </div>
                    <input
                      type="text"
                      name="specialization"
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="number"
                    name="experience"
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Experience (Years)"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Briefcase size={20} />
                  </div>
                  <input
                    type="text"
                    name="licenseNumber"
                    required
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Medical License Number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-6"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building2 size={20} />
                  </div>
                  <input
                    type="text"
                    name="clinicName"
                    required
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Clinic Name"
                    value={formData.clinicName}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin size={20} />
                  </div>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Clinic Address"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Clock size={20} />
                    </div>
                    <input
                      type="text"
                      name="timing"
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Timing"
                      value={formData.timing}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <IndianRupee size={20} />
                    </div>
                    <input
                      type="number"
                      name="fees"
                      required
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Fee (₹)"
                      value={formData.fees}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Set Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-100 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-lg text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have a partner account?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 hover:underline">
              Partner Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}