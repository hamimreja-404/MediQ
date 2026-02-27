// import React from 'react';
// import {
//     Heart, Target, Award, Globe, Linkedin, Twitter, Stethoscope, Search
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import HamimImg from '../assets/DP(1).jpg'
// import LabibImg from '../assets/DP(1).jpg'
// export default function About() {
//     return (
//         <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">

//             {/* --- HERO SECTION --- */}
//             <section className="pt-32 pb-20 relative overflow-hidden">
//                 {/* Abstract Background */}
//                 <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-50 to-transparent -z-10"></div>

//                 <div className="container mx-auto px-4 text-center max-w-4xl">
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6 }}
//                     >
//                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mb-6 border border-teal-200">
//                             <Target size={14} />
//                             <span>Our Mission</span>
//                         </div>
//                         <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-slate-900">
//                             We are building the digital backbone of healthcare.
//                         </h1>
//                         <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
//                             MediQ was born from a simple belief: No one should have to wait hours for a 10-minute consultation. We are bridging the gap between doctors and patients.
//                         </p>
//                     </motion.div>
//                 </div>
//             </section>

//             {/* --- STORY SECTION --- */}
//             <section className="py-20 bg-white border-y border-slate-100">
//                 <div className="container mx-auto px-4">
//                     <div className="flex flex-col lg:flex-row items-center gap-16">
//                         {/* Image / Graphic Side */}
//                         <motion.div
//                             initial={{ opacity: 0, x: -50 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             viewport={{ once: true }}
//                             className="lg:w-1/2 relative"
//                         >
//                             <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/3 group">
//                                 {/* Placeholder for Team/Office Image */}
//                                 <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
//                                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-teal-600 to-blue-600 opacity-90">
//                                     <Globe size={64} className="text-white opacity-50" />
//                                 </div>

//                                 {/* Floating Stats Card */}
//                                 <div className="absolute bottom-6 right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
//                                     <div className="flex items-center gap-4 mb-4">
//                                         <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
//                                             <Award size={24} />
//                                         </div>
//                                         <div>
//                                             <div className="text-2xl font-bold">12,000+</div>
//                                             <div className="text-xs text-slate-500 uppercase font-bold">Hours Saved</div>
//                                         </div>
//                                     </div>
//                                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//                                         <div className="h-full w-3/4 bg-teal-500 rounded-full"></div>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* Decorative Blob */}
//                             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
//                         </motion.div>

//                         {/* Text Side */}
//                         <div className="lg:w-1/2">
//                             <h2 className="text-3xl md:text-4xl font-bold mb-6">The Story Behind MediQ</h2>
//                             <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
//                                 <p>It started in a crowded clinic waiting room. Our founder watched an elderly patient wait for 3 hours just to show a simple report. The doctor was stressed, the staff was overwhelmed, and the patients were exhausted.</p>
//                                 <p>We realized the problem wasn't the medical care—it was the management. The technology existed to solve this, but it wasn't being used in local clinics.</p>
//                                 <p className="font-semibold text-teal-600">So, we built MediQ. Not just to book appointments, but to respect everyone's time.</p>
//                             </div>

//                             <div className="grid grid-cols-3 gap-4 mt-10 border-t border-slate-200 pt-8">
//                                 <div className="text-center lg:text-left">
//                                     <div className="text-3xl font-bold text-slate-900">50+</div>
//                                     <div className="text-sm text-slate-500">Clinics Digitized</div>
//                                 </div>
//                                 <div className="text-center lg:text-left">
//                                     <div className="text-3xl font-bold text-slate-900">12k</div>
//                                     <div className="text-sm text-slate-500">Hours Saved</div>
//                                 </div>
//                                 <div className="text-center lg:text-left">
//                                     <div className="text-3xl font-bold text-slate-900">98%</div>
//                                     <div className="text-sm text-slate-500">Happy Patients</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* --- VALUES SECTION --- */}
//             <section className="py-20 bg-slate-50">
//                 <div className="container mx-auto px-4">
//                     <div className="text-center mb-16">
//                         <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
//                         <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//                     </div>

//                     <div className="grid md:grid-cols-3 gap-8">
//                         {/* Value 1 */}
//                         <motion.div
//                             whileHover={{ y: -10 }}
//                             className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
//                         >
//                             <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
//                                 <Heart size={28} fill="currentColor" className="opacity-80" />
//                             </div>
//                             <h3 className="text-xl font-bold mb-3">Patient First</h3>
//                             <p className="text-slate-600">Every line of code we write is to make the patient's life easier.</p>
//                         </motion.div>

//                         {/* Value 2 */}
//                         <motion.div
//                             whileHover={{ y: -10 }}
//                             className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
//                         >
//                             <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
//                                 <Search size={28} />
//                             </div>
//                             <h3 className="text-xl font-bold mb-3">Transparency</h3>
//                             <p className="text-slate-600">No hidden fees, no hidden wait times. Complete clarity.</p>
//                         </motion.div>

//                         {/* Value 3 */}
//                         <motion.div
//                             whileHover={{ y: -10 }}
//                             className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
//                         >
//                             <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
//                                 <Award size={28} />
//                             </div>
//                             <h3 className="text-xl font-bold mb-3">Security</h3>
//                             <p className="text-slate-600">We treat medical data with the highest level of encryption.</p>
//                         </motion.div>
//                     </div>
//                 </div>
//             </section>

//             {/* --- TEAM SECTION --- */}
//             <section className="py-20 bg-white">
//                 <div className="container mx-auto px-4">
//                     <div className="text-center mb-16">
//                         <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
//                         <p className="text-slate-600">The minds behind the platform.</p>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                         {[
//                             { name: "Hamim Reja", role: "Founder & CEO", color: "bg-orange-200", image: HamimImg },
//                             { name: "Labib Hasan", role: "Marketing Head ", color: "bg-blue-200", image: "" },
//                         ].map((member, i) => (
//                             <div key={i} className="text-center group">
//                                 <div className={`w-32 h-32 mx-auto rounded-full ${member.color} mb-4 overflow-hidden relative border-4 border-transparent group-hover:border-teal-500 transition-all`}>
//                                     {/* Avatar Placeholder */}
//                                     <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold text-3xl">
//                                         <img
//                                             src={member.image}
//                                             alt={member.name[0]}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                 </div>
//                                 <h3 className="font-bold text-lg">{member.name}</h3>
//                                 <p className="text-sm text-teal-600 font-medium">{member.role}</p>

//                                 <div className="flex justify-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <Linkedin size={16} className="text-slate-400 hover:text-blue-600 cursor-pointer" />
//                                     <Twitter size={16} className="text-slate-400 hover:text-sky-500 cursor-pointer" />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* --- CTA --- */}
//             <section className="py-16  text-center">
//                 <div className="container mx-auto px-4">
//                     <h2 className="text-3xl font-bold mb-6">Join our journey.</h2>
//                     <button className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-bold transition-transform hover:scale-105 cursor-pointer">
//                         View Careers
//                     </button>
//                 </div>
//             </section>

//         </div>
//     );
// }


import React from 'react';
import {
    Heart, Target, Award, Globe, Linkedin, Twitter, Stethoscope, Search, ShieldCheck, ArrowRight, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

// Replaced local imports with external URLs for the preview environment
const HamimImg = 'https://res.cloudinary.com/dm01lhkax/image/upload/v1772214480/Photo_Hamim_byjk9z.png';
const LabibImg = 'https://res.cloudinary.com/dm01lhkax/image/upload/v1772214567/DP_ksdcxq.jpg';

export default function About() {
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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">

            {/* --- CINEMATIC HERO SECTION --- */}
            <section className="relative w-full pt-40 pb-32 md:pt-56 md:pb-40 flex items-center justify-center overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1495658013006-a2069f54d3d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yJTIwd2FpdGluZyUyMHJvb218ZW58MHx8MHx8fDA%3D" 
                        alt="Medical Tech" 
                        className="w-full h-full object-cover object-top scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
                    />
                    <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-linear-to-t from-[#F8FAFC] via-[#F8FAFC]/10 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <motion.div
                        initial="hidden" animate="visible" variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-md text-teal-300 text-xs font-bold tracking-widest uppercase mb-6">
                            <Target size={14} />
                            <span>Our Mission</span>
                        </motion.div>
                        
                        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] text-white tracking-tight">
                            Building the <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-blue-500">
                                digital backbone
                            </span> of healthcare.
                        </motion.h1>
                        
                        <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
                            MediQ was born from a simple belief: No one should have to wait hours for a 10-minute consultation. We are intelligently bridging the gap between doctors and patients.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* --- EDITORIAL STORY SECTION --- */}
            <section className="py-24 relative bg-[#F8FAFC]">
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-125 h-125 bg-teal-400/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Text Side (Origin) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="lg:w-1/2"
                        >
                            <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">The Origin</h2>
                            <h3 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">
                                Because your time is <span className="italic text-slate-400">invaluable.</span>
                            </h3>
                            
                            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
                                <p>It started in a crowded clinic waiting room. Our founder watched an elderly patient wait for 3 hours just to show a simple report. The doctor was stressed, the staff was overwhelmed, and the patients were exhausted.</p>
                                <p>We realized the problem wasn't the medical care—it was the management. The technology existed to solve this, but it remained locked out of local, everyday clinics.</p>
                                <div className="p-6 bg-white border-l-4 border-teal-500 rounded-r-2xl shadow-sm my-8">
                                    <p className="font-semibold text-slate-800 text-xl">
                                        "So, we built MediQ. Not just to book appointments, but to fundamentally respect everyone's time."
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Image / Stats Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="lg:w-1/2 relative w-full"
                        >
                            <div className="relative rounded-4xl overflow-hidden shadow-2xl aspect-4/5 md:aspect-square group">
                                <img 
                                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2832&auto=format&fit=crop" 
                                    alt="Clinic Waiting Room" 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-tr from-teal-900/60 to-blue-900/20 mix-blend-multiply"></div>
                                
                                {/* Overlay Logo/Icon */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                        <Activity size={40} className="text-teal-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Glass Stats Card */}
                            <div className="absolute -bottom-10 -left-6 md:-left-12 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white max-w-[90%] md:max-w-sm">
                                <div className="grid grid-cols-2 gap-6 divide-x divide-slate-200">
                                    <div>
                                        <div className="text-4xl font-black text-slate-900 mb-1">50+</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Clinics Digitized</div>
                                    </div>
                                    <div className="pl-6">
                                        <div className="text-4xl font-black text-teal-600 mb-1">12k</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Hours Saved</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- PREMIUM VALUES SECTION --- */}
            <section className="py-32 relative bg-white border-y border-slate-100 mt-16 md:mt-0">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-20">
                        <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">Our Core Tenets</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900">What Drives Us</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <motion.div
                            whileHover={{ y: -10 }} transition={{ duration: 0.3 }}
                            className="bg-slate-50 hover:bg-white p-10 rounded-4xl border border-slate-100 hover:shadow-2xl hover:shadow-red-500/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full blur-3xl group-hover:bg-red-400/20 transition-all"></div>
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-800">Patient First</h3>
                            <p className="text-slate-600 leading-relaxed text-lg font-light">
                                Every single line of code we write is dedicated to making the patient's healthcare journey smoother and completely stress-free.
                            </p>
                        </motion.div>

                        {/* Value 2 */}
                        <motion.div
                            whileHover={{ y: -10 }} transition={{ duration: 0.3 }}
                            className="bg-slate-50 hover:bg-white p-10 rounded-4xl border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all"></div>
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                                <Search size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-800">Absolute Transparency</h3>
                            <p className="text-slate-600 leading-relaxed text-lg font-light">
                                No hidden fees. No deceptive wait times. We believe complete clarity is the foundation of trust in medical care.
                            </p>
                        </motion.div>

                        {/* Value 3 */}
                        <motion.div
                            whileHover={{ y: -10 }} transition={{ duration: 0.3 }}
                            className="bg-slate-50 hover:bg-white p-10 rounded-4xl border border-slate-100 hover:shadow-2xl hover:shadow-teal-500/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl group-hover:bg-teal-400/20 transition-all"></div>
                            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-800">Bank-Grade Security</h3>
                            <p className="text-slate-600 leading-relaxed text-lg font-light">
                                Your health data is sacred. We treat all medical records and prescriptions with the highest level of modern encryption.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- THE TEAM SECTION --- */}
            <section className="py-32 bg-[#F8FAFC]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900">Meet the Minds Behind MediQ</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">A small, dedicated team combining medical insight with world-class engineering.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                        {[
                            { name: "Hamim Reja", role: "Founder & CEO", color: "from-orange-400 to-rose-500", image: HamimImg },
                            { name: "Labib Hasan", role: "Marketing Head", color: "from-blue-400 to-teal-500", image: LabibImg },
                        ].map((member, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                                className="text-center group w-64"
                            >
                                <div className="relative mb-6 mx-auto w-40 h-40">
                                    {/* Animated Gradient Border Ring */}
                                    <div className={`absolute inset-0 rounded-full bg-linear-to-tr ${member.color} animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-[1.05] blur-[2px]`}></div>
                                    
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200 z-10">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <Globe size={40} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Floating Social Icons (Hover Reveal) */}
                                    
                                </div>
                                
                                <h3 className="font-extrabold text-2xl text-slate-900 mb-1">{member.name}</h3>
                                <p className="text-sm uppercase tracking-widest text-teal-600 font-bold">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CINEMATIC CTA SECTION --- */}
            <section className="py-24 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden">
                        {/* Lighting Effects */}
                        <div className="absolute top-0 right-0 w-125 h-125 bg-teal-500/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                                Want to be part of the change?
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
                                We are always looking for passionate engineers, designers, and medical professionals to join our journey.
                            </p>
                            <button className="group px-10 py-5 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(20,184,166,0.6)] transition-all hover:scale-105 flex items-center gap-3">
                                View Open Positions <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}