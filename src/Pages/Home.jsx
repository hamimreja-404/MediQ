
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Stethoscope,
  CalendarCheck,
  ShieldCheck,
  Clock,
  UserPlus,
  Users,
  CheckCircle,
  FileText,
  ArrowRight,
  Activity,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [manualTab, setManualTab] = useState("patient");
  const [totalDoctor, setTotalDoctor] = useState(0);
  const [totalPatient, setTotalPatient] = useState(0);
  const [error, setError] = useState("");

  // Hardcoded English Data for the Manual Section
  const steps_patient = [
    {
      step: "01",
      title: "Find Your Doctor",
      text: "Search by specialty or location. View rich profiles, verified reviews, and available slots in real-time.",
    },
    {
      step: "02",
      title: "Book & Get Token",
      text: "Select your preferred time. Instantly receive a secure digital Token Number directly on your device.",
    },
    {
      step: "03",
      title: "Live Track & Visit",
      text: "Monitor the 'Current Serving Token' live. Arrive at the clinic exactly when it's your turn.",
    },
  ];

  const steps_doctor = [
    {
      step: "01",
      title: "Register Clinic",
      text: "Setup your premium partner account. Configure fees, intelligent scheduling, and daily capacity.",
    },
    {
      step: "02",
      title: "Start the Queue",
      text: "Hit 'Go Live' upon arrival. Your scheduled patients receive instant push notifications.",
    },
    {
      step: "03",
      title: "Digital Practice",
      text: "Manage tokens with one click. Issue e-prescriptions seamlessly saved to cloud history.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/smallDatas/small-data`
        );
        if (!res.ok) throw new Error("Failed to fetch doctor details");
        const data = await res.json();
        setTotalDoctor(data.totalDoctor || 0);
        setTotalPatient(data.totalPatient || 0);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      
      {/* --- CINEMATIC HERO SECTION --- */}
      <header className="relative w-full h-[90vh] min-h-175 flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Image & Overlays */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="https://images.unsplash.com/photo-1516841273335-e39b37888115?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1lZGljYWwlMjBjbGluaWN8ZW58MHx8MHx8fDA%3D" 
            alt="Modern Healthcare" 
            className="w-full h-full object-cover object-center scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-500 via-slate-500/80 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#F8FAFC] via-transparent to-transparent h-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-3xl text-left"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-md text-teal-300 text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              The Future of Healthcare
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] mb-6 text-white tracking-tight">
              Healthcare <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
                Evolved.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed font-light">
              Experience seamless appointment booking, live queue tracking, and secure digital records. Smart healthcare designed for modern clinics and you.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/doctors" className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 text-white rounded-2xl font-bold shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)] transition-all hover:bg-teal-400 hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(20,184,166,0.7)] overflow-hidden">
                <span className="relative z-10">Find a Doctor</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </Link>
              
              <Link to="/pricing" className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-lg text-white rounded-2xl font-bold transition-all hover:scale-105">
                <UserPlus size={20} className="text-blue-400" />
                <span>Partner Clinic</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* --- FLOATING STATS DOCK --- */}
      <section className="relative z-20 -mt-20 px-4 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
          className="bg-white/70 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/60"
        >
          {[
            { label: "Active Doctors", value: totalDoctor || "500+", icon: Stethoscope, color: "text-teal-600", bg: "bg-teal-100" },
            { label: "Happy Patients", value: totalPatient || "10k+", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "Daily Queues", value: "1.5k", icon: Activity, color: "text-purple-600", bg: "bg-purple-100" },
            { label: "User Rating", value: "4.9/5", icon: CheckCircle, color: "text-orange-600", bg: "bg-orange-100" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4 group">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">{stat.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* --- BENTO BOX FEATURES --- */}
      <section className="py-32 relative">
        <div className="absolute top-40 left-0 w-125 h-125 bg-blue-400/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-150 h-150 bg-teal-400/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">Why MediQ</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Intelligent tools for a <br/> flawless experience.
              </h3>
            </div>
            <p className="text-slate-500 text-lg max-w-md pb-2">
              We've redesigned the medical visit from the ground up, eliminating wait times and tedious paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
            
            {/* Feature 1: Large Card (Live Queue) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="md:col-span-8 rounded-4xl bg-slate-900 relative overflow-hidden group shadow-xl"
            >
              <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2832&auto=format&fit=crop" alt="Queue" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-10 z-10">
                <div className="w-14 h-14 bg-teal-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-teal-300 mb-6 border border-teal-500/30">
                  <Clock size={28} />
                </div>
                <h4 className="text-3xl font-bold text-white mb-3">Live Queue Tracking</h4>
                <p className="text-slate-300 text-lg max-w-md">Watch your token progress in real-time. Arrive precisely when your doctor is ready for you.</p>
              </div>

              {/* Mock UI Overlay */}
              <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <div className="text-xs text-teal-300 font-semibold uppercase mb-1">Current Token</div>
                <div className="text-4xl font-black text-white">#42</div>
                <div className="text-xs text-slate-300 mt-2 flex items-center gap-1"><Activity size={12}/> Serving Now</div>
              </div>
            </motion.div>

            {/* Feature 2: Small Card (Instant Booking) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-4 rounded-4xl bg-teal-50 border border-teal-100 p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-teal-500/10 transition-all"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                <CalendarCheck size={28} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">Instant Booking</h4>
              <p className="text-slate-600">Find top specialists and secure your slot instantly with zero phone calls.</p>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-200/50 rounded-full blur-2xl"></div>
            </motion.div>

            {/* Feature 3: Full Width (Digital Records) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-12 rounded-4xl bg-white border border-slate-200 p-0 relative overflow-hidden flex flex-col md:flex-row items-center group shadow-sm hover:shadow-xl transition-all"
            >
              <div className="p-10 md:p-16 flex-1 z-10">
                 <div className="w-14 h-14 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="text-3xl font-bold text-slate-800 mb-4">Secure Digital Records</h4>
                <p className="text-slate-600 text-lg max-w-lg mb-6">Your entire medical history, prescriptions, and lab reports are encrypted and stored safely on the cloud. Access them anytime, anywhere.</p>
                <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Learn more about security <ChevronRight size={18}/>
                </button>
              </div>
              <div className="flex-1 w-full h-full relative min-h-62.5 bg-slate-50 border-l border-slate-100 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop" alt="Records" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" />
                 {/* Floating Document Mockup */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 w-64 border border-slate-100">
                    <div className="h-2 w-1/3 bg-slate-200 rounded mb-4"></div>
                    <div className="h-2 w-full bg-slate-100 rounded mb-2"></div>
                    <div className="h-2 w-5/6 bg-slate-100 rounded mb-2"></div>
                    <div className="h-2 w-4/6 bg-slate-100 rounded"></div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center"><CheckCircle size={12}/></div>
                      <span className="text-xs font-bold text-slate-600">Verified Rx</span>
                    </div>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (USER MANUAL) --- */}
      <section className="py-24 bg-white relative border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
              Seamlessly Designed for <br/> <span className="text-slate-400">Everyone.</span>
            </h2>
            
            {/* Premium iOS Style Segmented Control */}
            <div className="inline-flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner mt-4 relative">
              <button
                onClick={() => setManualTab("patient")}
                className={`relative flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${
                  manualTab === "patient" ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Users size={18} /> Patient Guide
              </button>
              <button
                onClick={() => setManualTab("doctor")}
                className={`relative flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${
                  manualTab === "doctor" ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Stethoscope size={18} /> Doctor Guide
              </button>
              
              {/* Sliding Background Indicator */}
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md border border-slate-200 transition-all duration-500 ease-spring z-0 ${
                  manualTab === "patient" ? "left-1.5" : "left-[calc(50%+1.5px)]"
                }`}
              ></div>
            </div>
          </div>

          <div className="relative">
             {/* Vertical Timeline Line */}
            <div className="absolute left-9.75 top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block"></div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={manualTab}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
                className="space-y-8 md:space-y-12 relative"
              >
                {(manualTab === "patient" ? steps_patient : steps_doctor).map((step, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-12 group">
                    {/* Number Indicator */}
                    <div className="relative z-10 shrink-0">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                        manualTab === "patient" ? "bg-linear-to-br from-teal-400 to-teal-600 text-white shadow-teal-500/30" 
                        : "bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30"
                      }`}>
                        {step.step}
                      </div>
                    </div>
                    
                    {/* Content Card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex-1 group-hover:bg-white group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500">
                      <h3 className="text-2xl font-bold mb-3 text-slate-800">{step.title}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- CINEMATIC CTA SECTION --- */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2940&auto=format&fit=crop" 
              alt="Join MediQ" 
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            {/* Dark/Brand Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/95 to-teal-900/80 backdrop-blur-[2px]"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-200 h-200 bg-teal-500/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

            <div className="relative z-10 px-8 py-20 md:py-32 flex flex-col items-center text-center">
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-teal-300 text-sm font-bold uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10">
                Join The Network
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Ready to transform <br className="hidden md:block" /> your medical practice?
              </h2>
              <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl font-light">
                Connect with thousands of doctors who have digitized their clinics, saving time and dramatically improving patient satisfaction.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <Link to="/pricing" className="px-10 py-5 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(20,184,166,0.6)] transition-all hover:scale-105 flex items-center justify-center gap-2">
                    Start Your Free Trial <ArrowRight size={20}/>
                 </Link>
                 <Link to="/contact" className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center">
                    Talk to Sales
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}