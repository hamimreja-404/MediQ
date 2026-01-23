// src/Pages/HomePage.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search, Stethoscope, CalendarCheck, Activity, ShieldCheck,
  Clock, UserPlus, Users, Lock, Star, Quote, CheckCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [manualTab, setManualTab] = useState('patient');

  // Hardcoded English Data for the Manual Section
  const steps_patient = [
    { step: "01", title: "Find Your Doctor", text: "Search by specialty (e.g., Cardiologist) or location. View doctor profiles, fees, and available slots." },
    { step: "02", title: "Book & Get Token", text: "Select a time slot. You will instantly receive a digital Token Number (e.g., #12) on your phone." },
    { step: "03", title: "Live Track & Visit", text: "Check the app to see the 'Current Serving Token'. Arrive at the clinic only when your turn is near." }
  ];

  const steps_doctor = [
    { step: "01", title: "Register Clinic", text: "Create your partner account. Set your consultation fees, clinic timings, and daily patient capacity." },
    { step: "02", title: "Start the Queue", text: "When you reach the clinic, click 'Go Live'. Your patients get notified that the doctor has arrived." },
    { step: "03", title: "Digital Practice", text: "Call the next token with one click. Write e-prescriptions that are instantly saved to the patient's history." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-teal-100 text-teal-700 text-xs font-bold tracking-wider mb-6 border border-teal-200">
              ✨ The Future of Healthcare
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-slate-900">
              Healthcare without the <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
                Headache.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Book appointments, track live queues, and manage medical records. Smart healthcare for modern clinics and patients.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                <Search size={20} />
                Find a Doctor
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                <UserPlus size={20} />
                 <Link to="/pricing" >Partner with Us</Link>
                
              </button>
            </div>
          </motion.div>

          {/* Floating Mockup */}
          
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Why Choose MediQ?</h2>
            <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Live Queue Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Track your token number in real-time. No more waiting in crowded clinic lobbies.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                <CalendarCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Instant Booking</h3>
              <p className="text-slate-600 leading-relaxed">
                Book appointments in seconds. Select your specialty and preferred doctor effortlessly.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Digital Records</h3>
              <p className="text-slate-600 leading-relaxed">
                Your prescriptions and reports, always accessible on your phone securely.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-teal-100 text-sm font-medium uppercase tracking-wide">Doctors</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">12k+</div>
              <div className="text-teal-100 text-sm font-medium uppercase tracking-wide">Patients</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">1.5k</div>
              <div className="text-teal-100 text-sm font-medium uppercase tracking-wide">Daily Queues</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-teal-100 text-sm font-medium uppercase tracking-wide">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- USER MANUAL --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold mb-4 border border-orange-200">
              <FileText size={14} />
              <span>Guide</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">How to Use MediQ</h2>
            <p className="text-slate-600 text-lg">A simple guide to getting started for everyone.</p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-2">
              <button
                onClick={() => setManualTab('patient')}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${manualTab === 'patient'
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : 'text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <Users size={18} />
                I am a Patient
              </button>
              <button
                onClick={() => setManualTab('doctor')}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${manualTab === 'doctor'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <Stethoscope size={18} />
                I am a Doctor
              </button>
            </div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 hidden md:block z-0"></div>
            <AnimatePresence mode="wait">
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {(manualTab === 'patient' ? steps_patient : steps_doctor).map((step, idx) => (
                  <motion.div
                    key={`${manualTab}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: idx * 0.15 }}
                    className="group"
                  >
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform ${manualTab === 'patient' ? 'bg-teal-100 text-teal-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-800">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{step.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to digitize your clinic?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of doctors managing their practice effortlessly.
            </p>
            <button className="px-10 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-bold text-lg shadow-lg shadow-teal-500/50 transition-all hover:scale-105 relative z-10">
                <Link to="/pricing">Get Started Now</Link>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}