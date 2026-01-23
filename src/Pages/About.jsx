import React from 'react';
import {
    Heart, Target, Award, Globe, Linkedin, Twitter, Stethoscope, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import HamimImg from '../assets/DP(1).jpg'
import LabibImg from '../assets/DP(1).jpg'
export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">

            {/* --- HERO SECTION --- */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-50 to-transparent -z-10"></div>

                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mb-6 border border-teal-200">
                            <Target size={14} />
                            <span>Our Mission</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-slate-900">
                            We are building the digital backbone of healthcare.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                            MediQ was born from a simple belief: No one should have to wait hours for a 10-minute consultation. We are bridging the gap between doctors and patients.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- STORY SECTION --- */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Image / Graphic Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/3 group">
                                {/* Placeholder for Team/Office Image */}
                                <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-teal-600 to-blue-600 opacity-90">
                                    <Globe size={64} className="text-white opacity-50" />
                                </div>

                                {/* Floating Stats Card */}
                                <div className="absolute bottom-6 right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">12,000+</div>
                                            <div className="text-xs text-slate-500 uppercase font-bold">Hours Saved</div>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-teal-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Blob */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
                        </motion.div>

                        {/* Text Side */}
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Story Behind MediQ</h2>
                            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                                <p>It started in a crowded clinic waiting room. Our founder watched an elderly patient wait for 3 hours just to show a simple report. The doctor was stressed, the staff was overwhelmed, and the patients were exhausted.</p>
                                <p>We realized the problem wasn't the medical care—it was the management. The technology existed to solve this, but it wasn't being used in local clinics.</p>
                                <p className="font-semibold text-teal-600">So, we built MediQ. Not just to book appointments, but to respect everyone's time.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-10 border-t border-slate-200 pt-8">
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-slate-900">50+</div>
                                    <div className="text-sm text-slate-500">Clinics Digitized</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-slate-900">12k</div>
                                    <div className="text-sm text-slate-500">Hours Saved</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-slate-900">98%</div>
                                    <div className="text-sm text-slate-500">Happy Patients</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- VALUES SECTION --- */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                        <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                                <Heart size={28} fill="currentColor" className="opacity-80" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Patient First</h3>
                            <p className="text-slate-600">Every line of code we write is to make the patient's life easier.</p>
                        </motion.div>

                        {/* Value 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Search size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Transparency</h3>
                            <p className="text-slate-600">No hidden fees, no hidden wait times. Complete clarity.</p>
                        </motion.div>

                        {/* Value 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
                        >
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Award size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Security</h3>
                            <p className="text-slate-600">We treat medical data with the highest level of encryption.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- TEAM SECTION --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
                        <p className="text-slate-600">The minds behind the platform.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: "Hamim Reja", role: "Founder & CEO", color: "bg-orange-200", image: HamimImg },
                            { name: "Labib Hasan", role: "Marketing Head ", color: "bg-blue-200", image: "" },
                        ].map((member, i) => (
                            <div key={i} className="text-center group">
                                <div className={`w-32 h-32 mx-auto rounded-full ${member.color} mb-4 overflow-hidden relative border-4 border-transparent group-hover:border-teal-500 transition-all`}>
                                    {/* Avatar Placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold text-3xl">
                                        <img
                                            src={member.image}
                                            alt={member.name[0]}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-sm text-teal-600 font-medium">{member.role}</p>

                                <div className="flex justify-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Linkedin size={16} className="text-slate-400 hover:text-blue-600 cursor-pointer" />
                                    <Twitter size={16} className="text-slate-400 hover:text-sky-500 cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA --- */}
            <section className="py-16  text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Join our journey.</h2>
                    <button className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-bold transition-transform hover:scale-105 cursor-pointer">
                        View Careers
                    </button>
                </div>
            </section>

        </div>
    );
}