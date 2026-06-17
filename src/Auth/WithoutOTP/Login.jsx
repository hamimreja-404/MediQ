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

const API_URL = import.meta.env.VITE_API_URL ;

const Toast = ({ message, type, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -50, x: "-50%" }}
        animate={{ opacity: 1, y: 20, x: "-50%" }}
        exit={{ opacity: 0, y: -50, x: "-50%" }}
        className={`fixed top-0 left-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-lg border ${
          type === "success"
            ? "bg-white text-emerald-700 border-emerald-100"
            : "bg-white text-red-600 border-red-100"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={18} className="text-emerald-500" />
        ) : (
          <AlertCircle size={18} className="text-red-500" />
        )}
        <span className="font-bold text-sm">{message}</span>
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
    <div className="min-h-screen bg-[#F4F5F7] font-sans selection:bg-[#1A6BCC] selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
      <Toast message={toast.msg} type={toast.type} isVisible={toast.show} />

      <div className="flex w-full max-w-5xl bg-white rounded-xl border border-gray-200 overflow-hidden relative z-10 shadow-none">
        {/* Branding Side */}
        <div className="hidden lg:flex w-1/2 p-12 text-white relative flex-col justify-between bg-gradient-to-br from-[#1A6BCC] to-[#1455a2]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-xs">
                <Stethoscope size={28} />
              </div>
              <span className="text-3xl font-bold tracking-tight">MediQ</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              {role === "patient" ? "Fast Access to Healthcare." : "Manage your practice efficiently."}
            </h2>
          </div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Login Form Side */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#1A1E26] tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium mt-1">Sign in to your {role} account.</p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-8 relative border border-gray-200/50">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-xs transition-all duration-300 ${role === "doctor" ? "left-[calc(50%+2px)]" : "left-1"}`}
            ></div>
            <button
              onClick={() => setRole("patient")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold relative z-10 transition-colors ${role === "patient" ? "text-[#1A6BCC]" : "text-gray-500"}`}
            >
              <User size={16} /> Patient
            </button>
            <button
              onClick={() => setRole("doctor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold relative z-10 transition-colors ${role === "doctor" ? "text-[#1A6BCC]" : "text-gray-500"}`}
            >
              <Stethoscope size={16} /> Doctor
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                {role === "patient" ? "Mobile Number" : "Mobile or License Number"}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6BCC] transition-colors">
                  {role === "patient" ? <Smartphone size={20} /> : <User size={20} />}
                </div>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200 text-[#1A1E26] rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all font-medium"
                  placeholder={role === "patient" ? "10-digit mobile" : "License ID or Mobile"}
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6BCC] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white border border-gray-200 text-[#1A1E26] rounded-lg py-3.5 pl-11 pr-11 outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all font-medium"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#1A6BCC] hover:bg-[#155baa] text-white rounded-lg font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-none disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            {role === "patient" ? (
              <p>Don't have an account? <Link to="/register" className="font-bold text-[#1A6BCC] hover:underline">Register</Link></p>
            ) : (
              <p>Want to join our network? <Link to="/onboarding" className="font-bold text-[#1A6BCC] hover:underline">Apply Here</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}