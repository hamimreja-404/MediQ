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
const API_URL = import.meta.env.VITE_API_URL;

const Toast = ({ message, type, isVisible, onClose }) => (
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
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

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
      console.log("Sending to:", `${API_URL}/login`); // Debug URL

      const response = await fetch(`${API_URL}/login`, {
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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-500 selection:text-white flex items-center justify-center p-4 pt-24 md:pt-32 relative overflow-hidden">
      <Toast
        message={toast.msg}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative z-10 min-h-150">
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-linear-to-br from-teal-600 to-blue-700 relative flex-col justify-between p-12 text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
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
              <p className="text-teal-100 text-lg opacity-90 max-w-sm">
                Login to access your dashboard.
              </p>
            </div>
          </div>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500">Please enter your details.</p>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1.5 bg-slate-100 rounded-xl mb-8 relative">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-spring ${role === "doctor" ? "left-[calc(50%+3px)]" : "left-1.5"}`}
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
              <label className="text-sm font-semibold text-slate-700 ml-1">
                {role === "patient" ? "Mobile Number" : "Mobile / License ID"}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  {role === "patient" ? (
                    <Smartphone size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
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
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
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
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${role === "patient" ? "bg-teal-600 hover:bg-teal-500" : "bg-blue-600 hover:bg-blue-500"}`}
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

          <div className="mt-8 text-center text-sm text-slate-500">
            {role === "patient" ? (
              <>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-teal-600 hover:text-teal-500 hover:underline"
                >
                  New Patient Registration
                </Link>
              </>
            ) : (
              <>
                Want to list your clinic?{" "}
                <Link
                  to="/onboarding"
                  className="font-bold text-blue-600 hover:text-blue-500 hover:underline"
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
