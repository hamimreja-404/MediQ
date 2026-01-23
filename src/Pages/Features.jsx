import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, Clock, FileText, BarChart3, MessageCircle, Users, Shield, Wifi, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  // Hardcoded Data
  const deepDive = [
    {
      id: 1,
      title: "The Intelligent Live Queue",
      desc: "Stop shouting names in the waiting room. Our algorithm calculates estimated wait times based on the doctor's average speed. Patients track their status on their phone and arrive just in time.",
      points: ["Real-time token updates", "Walk-in & Online sync", "Automatic 'Next Patient' alerts"],
      icon: <Clock size={32} />
    },
    {
      id: 2,
      title: "1-Click E-Prescriptions",
      desc: "Doctors spend 40% of their time writing the same meds. With MediQ, create templates for common diagnoses (e.g., 'Viral Fever') and generate a professional PDF prescription in seconds.",
      points: ["Custom Letterhead Support", "Save Favorite Medicines", "Instant Patient History access"],
      icon: <FileText size={32} />
    },
    {
      id: 3,
      title: "Clinic Analytics & Growth",
      desc: "Run your clinic like a business. Visualize your peak hours, track daily revenue, and understand patient retention rates through simple, beautiful charts.",
      points: ["Daily Revenue Reports", "Patient Demographics", "Peak Hour Heatmaps"],
      icon: <BarChart3 size={32} />
    }
  ];

  const gridItems = [
    { title: "WhatsApp Alerts", desc: "Send booking confirmations and 'You are Next' alerts directly to WhatsApp.", icon: <MessageCircle /> },
    { title: "Walk-in Manager", desc: "Seamlessly slot in emergency patients between online bookings.", icon: <Users /> },
    { title: "Bank-Grade Security", desc: "256-bit encryption ensures patient data never leaks.", icon: <Shield /> },
    { title: "Offline Mode", desc: "Works even if internet drops. Syncs when back online.", icon: <Wifi /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* --- HEADER --- */}
      <section className="pt-32 pb-20 text-center px-4 relative overflow-hidden">
           {/* Background Gradients */}
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
           </div>

           <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
           >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-6 border border-slate-200">
                  <Zap size={14} className="text-yellow-500" />
                  <span>Platform Capabilities</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">
                  Everything you need to run a modern clinic.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                  From booking to billing, MediQ automates the chaos so you can focus on the cure.
              </p>
           </motion.div>
      </section>

      {/* --- DEEP DIVE (Alternating Layout) --- */}
      <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl space-y-24">
              {deepDive.map((feature, index) => (
                  <motion.div 
                      key={feature.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                  >
                      {/* Text Content */}
                      <div className="flex-1">
                          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                              {feature.icon}
                          </div>
                          <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                              {feature.desc}
                          </p>
                          <ul className="space-y-4">
                              {feature.points.map((point, i) => (
                                  <li key={i} className="flex items-center gap-3 font-medium text-slate-700">
                                      <CheckCircle2 size={20} className="text-teal-500 shrink-0" />
                                      {point}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      {/* Visual Representation */}
                      <div className="flex-1 w-full">
                          <div className="bg-slate-100 rounded-3xl aspect-4/3 relative overflow-hidden shadow-2xl border border-slate-200 group">
                              {/* Abstract UI Placeholder */}
                              <div className="absolute inset-4 bg-white rounded-2xl shadow-inner overflow-hidden">
                                  <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                  </div>
                                  <div className="p-6">
                                      {/* Dynamic Placeholder based on Index */}
                                      {index === 0 && (
                                          <div className="flex flex-col gap-3">
                                              <div className="flex justify-between items-center bg-teal-50 p-3 rounded-lg border border-teal-100">
                                                  <span className="font-bold text-teal-700">Current Token</span>
                                                  <span className="text-2xl font-black text-teal-600">#12</span>
                                              </div>
                                              <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse"></div>
                                              <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                                          </div>
                                      )}
                                      {index === 1 && (
                                          <div className="space-y-3">
                                               <div className="h-8 w-1/3 bg-slate-200 rounded mb-4"></div>
                                               <div className="p-3 border border-dashed border-slate-300 rounded-lg flex items-center gap-2 text-slate-400">
                                                  <FileText size={16}/> <span>Rx Template: Fever</span>
                                               </div>
                                               <div className="flex gap-2 mt-4">
                                                  <div className="h-8 w-20 bg-teal-500 rounded-md"></div>
                                                  <div className="h-8 w-20 bg-slate-200 rounded-md"></div>
                                               </div>
                                          </div>
                                      )}
                                      {index === 2 && (
                                          <div className="flex items-end gap-2 h-32 mt-8 px-4 pb-0 border-b border-slate-200">
                                              <div className="w-full bg-blue-300 h-[40%] rounded-t"></div>
                                              <div className="w-full bg-blue-400 h-[70%] rounded-t"></div>
                                              <div className="w-full bg-teal-500 h-[90%] rounded-t relative group-hover:scale-y-105 transition-transform origin-bottom"></div>
                                              <div className="w-full bg-blue-300 h-[50%] rounded-t"></div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      </section>

      {/* --- GRID FEATURES --- */}
      <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">More Powerful Features</h2>
                  <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gridItems.map((item, i) => (
                      <motion.div 
                          key={i}
                          whileHover={{ y: -5 }}
                          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                      >
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 mb-4">
                              {item.icon}
                          </div>
                          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                          <p className="text-sm text-slate-500">
                              {item.desc}
                          </p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-teal-500 to-blue-600 rounded-[2rem] p-12 text-white shadow-2xl shadow-teal-500/20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-8">Start your free trial today.</h2>
                  <button className="bg-white text-teal-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all">
                     <Link to="/pricing" >Get Started</Link>
                      
                  </button>
              </div>
          </div>
      </section>

    </div>
  );
}