import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Ensure Link is imported
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

// Access ENV variable (Vite uses import.meta.env, CRA uses process.env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const Toast = ({ message, type, isVisible, onClose }) => (
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
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  console.log("API URL:", API_URL); // Debugging line to check if the variable is accessible

  const showToast = (msg, type) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    setIsLoading(true);

    try { 
      const finalURL = `${API_URL}/auth/login`;
      console.log("Login URL:", finalURL); // Debugging line to check the final URL

      const response = await fetch(finalURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
          role: role, // 'patient' or 'doctor'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");

        // Save Token & User Info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on Role
        setTimeout(() => {
          if (role === "patient") navigate("/dashboard");
          else navigate("/doctor-dashboard");
        }, 1500);
      } else {
        showToast(data.message || "Login Failed", "error");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      showToast("Server connection failed. Check Console.", "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans selection:bg-[#1A6BCC] selection:text-white flex items-center justify-center p-4 pt-24 md:pt-32 relative overflow-hidden">
      <Toast
        message={toast.msg}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="flex w-full max-w-5xl bg-white rounded-xl border border-gray-200 overflow-hidden relative z-10 min-h-150 shadow-none">
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1A6BCC] to-[#1455a2] relative flex-col justify-between p-12 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-xs">
                <Stethoscope size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight">MediQ</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                {role === "patient"
                  ? "Skip the waiting room."
                  : "Manage your practice."}
              </h2>
              <p className="text-blue-100 text-lg opacity-90 max-w-sm">
                Login to access your dashboard.
              </p>
            </div>
          </div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#1A1E26] tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 font-medium">Please enter your details.</p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-8 relative border border-gray-200/50">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-xs transition-all duration-300 ease-spring ${role === "doctor" ? "left-[calc(50%+2px)]" : "left-1"}`}
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
                {role === "patient" ? "Mobile Number" : "Mobile / License ID"}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6BCC] transition-colors">
                  {role === "patient" ? (
                    <Smartphone size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200 text-[#1A1E26] rounded-lg py-3.5 pl-11 pr-4 outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all font-medium"
                  placeholder={
                    role === "patient" ? "e.g. 9876543210" : "ID or Mobile"
                  }
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-0.5 mb-1.5 block tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1A6BCC] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white border border-gray-200 text-[#1A1E26] rounded-lg py-3.5 pl-11 pr-11 outline-none focus:border-[#1A6BCC] focus:ring-1 focus:ring-[#1A6BCC] transition-all font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Login Securely <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {role === "patient" ? (
              <>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#1A6BCC] hover:text-[#155baa] hover:underline"
                >
                  New Patient Registration
                </Link>
              </>
            ) : (
              <>
                Want to list your clinic?{" "}
                <Link
                  to="/onboarding"
                  className="font-bold text-[#1A6BCC] hover:text-[#155baa] hover:underline"
                >
                  Join as a Partner Doctor
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
