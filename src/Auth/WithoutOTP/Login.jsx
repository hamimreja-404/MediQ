import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

export default function Login() {
  const [role, setRole] = useState("patient"); // 'patient' or 'doctor'
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", role);

        setTimeout(() => {
          if (role === "patient") navigate(`/patient/dashboard/${data.user.id}`);
          else navigate(`/doctor/dashboard/${data.user.id}`);
        }, 1500);
      } else {
        showToast(data.message || "Login Failed", "error");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      showToast("Server connection failed.", "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      <Toast message={toast.msg} type={toast.type} isVisible={toast.show} />

      <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative z-10">
        {/* Branding Side */}
        <div className={`hidden lg:flex w-1/2 p-12 text-white relative flex-col justify-between transition-colors duration-500 ${role === 'patient' ? 'bg-teal-600' : 'bg-blue-700'}`}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Stethoscope size={28} />
              <span className="text-3xl font-bold">MediQ</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              {role === "patient" ? "Fast Access to Healthcare." : "Manage your practice efficiently."}
            </h2>
          </div>
        </div>

        {/* Login Form Side */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your {role} account.</p>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-xl mb-8 relative">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${role === "doctor" ? "left-[calc(50%+3px)]" : "left-1.5"}`}
            ></div>
            <button
              onClick={() => setRole("patient")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${role === "patient" ? "text-teal-600" : "text-slate-500"}`}
            >
              <User size={18} /> Patient
            </button>
            <button
              onClick={() => setRole("doctor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${role === "doctor" ? "text-blue-600" : "text-slate-500"}`}
            >
              <Stethoscope size={18} /> Doctor
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {role === "patient" ? "Mobile Number" : "Mobile or License Number"}
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${role === 'patient' ? 'text-teal-500' : 'text-blue-500'}`}>
                  {role === "patient" ? <Smartphone size={20} /> : <User size={20} />}
                </div>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder={role === "patient" ? "10-digit mobile" : "License ID or Mobile"}
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${role === 'patient' ? 'text-teal-500' : 'text-blue-500'}`}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${role === "patient" ? "bg-teal-600 hover:bg-teal-500 shadow-teal-500/30" : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/30"}`}
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            {role === "patient" ? (
              <p>Don't have an account? <Link to="/register" className="font-bold text-teal-600 hover:underline">Register</Link></p>
            ) : (
              <p>Want to join our network? <Link to="/onboarding" className="font-bold text-blue-600 hover:underline">Apply Here</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}