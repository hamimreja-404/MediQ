import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, HelpCircle, CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  // Hardcoded Data for English Only
  const plans = {
    starter: {
      name: "Starter",
      price_m: "499",
      price_y: "4,999",
      desc: "Perfect for solo doctors just getting started.",
      btn: "Start for Free"
    },
    pro: {
      name: "Professional",
      price_m: "999",
      price_y: "9,999",
      desc: "For busy clinics that need automation & speed.",
      badge: "Most Popular",
      btn: "Get Professional"
    },
    clinic: {
      name: "Multi-Clinic",
      price_m: "4,999",
      price_y: "14,999",
      desc: "Advanced control for hospitals & chains.",
      btn: "Contact Sales"
    }
  };

  const features = {
    doctors: "Doctor Profiles",
    appts: "Monthly Appointments",
    queue: "Live Queue System",
    rx: "E-Prescriptions",
    sms: "SMS/WhatsApp Alerts",
    analytics: "Advanced Analytics",
    support: "Priority Support",
    custom: "Custom Branding"
  };

  // Price Calculation Helper
  const getPrice = (planKey) => billingCycle === 'monthly' ? plans[planKey].price_m : plans[planKey].price_y;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* --- HEADER & TOGGLE --- */}
      <section className="pt-32 pb-16 text-center px-4">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 border border-blue-200">
              <CreditCard size={14} />
              <span>Flexible Plans</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight">Transparent pricing for practices of all sizes.</h1>
           <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">No hidden fees. No credit card required for the free tier.</p>
           
           {/* Billing Toggle */}
           <div className="flex items-center justify-center gap-4 mb-8">
             <span className={`text-sm font-bold ₹{billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
             <button 
               onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
               className="w-16 h-8 bg-slate-200 rounded-full relative p-1 transition-colors cursor-pointer"
             >
               <motion.div 
                 layout 
                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
                 className={`w-6 h-6 bg-teal-500 rounded-full shadow-md ${billingCycle === 'yearly' ? 'ml-8' : 'ml-0'}`}
               />
             </button>
             <span className={`text-sm font-bold ₹{billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>Yearly</span>
             <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide animate-pulse">
               Save 20%
             </span>
           </div>
         </motion.div>
      </section>

      {/* --- PRICING CARDS --- */}
      <section className="pb-20 px-4">
         <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-8">
           
           {/* Starter Plan */}
           <motion.div 
             whileHover={{ y: -10 }} 
             className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg flex flex-col"
           >
             <div className="mb-6">
               <h3 className="text-xl font-bold text-slate-900">{plans.starter.name}</h3>
               <p className="text-sm text-slate-500 mt-2">{plans.starter.desc}</p>
             </div>
             <div className="text-5xl font-extrabold mb-6 text-slate-900">
               ₹{getPrice('starter')}
               <span className="text-lg font-medium text-slate-500">/mo</span>
             </div>
             <button className="w-full py-3 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-50 transition-colors mb-8">
               {plans.starter.btn}
             </button>
             <ul className="space-y-4 flex-1">
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> 1 Doctor Profile</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> 100 Appointments/mo</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> Basic Live Queue</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> SMS Notifications</li>
               
             </ul>
           </motion.div>

           {/* Pro Plan (Highlighted) */}
           <motion.div 
             whileHover={{ y: -10 }} 
             className="bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col relative transform md:-translate-y-6 md:h-[110%]"
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
               {plans.pro.badge}
             </div>
             <div className="mb-6">
               <h3 className="text-xl font-bold text-white">{plans.pro.name}</h3>
               <p className="text-sm text-slate-400 mt-2">{plans.pro.desc}</p>
             </div>
             <div className="text-5xl font-extrabold mb-6 text-white">
               ₹{getPrice('pro')}
               <span className="text-lg font-medium text-slate-400">/mo</span>
             </div>
             <button className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold transition-colors mb-8 shadow-lg shadow-teal-500/30">
               {plans.pro.btn}
             </button>
             <ul className="space-y-4 flex-1 text-white">
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-400 shrink-0" size={18}/> 5 Doctor Profiles</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-400 shrink-0" size={18}/> Unlimited Appointments</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-400 shrink-0" size={18}/> PDF E-Prescriptions</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-400 shrink-0" size={18}/> SMS Notifications</li>
             </ul>
           </motion.div>

           {/* Multi-Clinic Plan */}
           <motion.div 
             whileHover={{ y: -10 }} 
             className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg flex flex-col"
           >
             <div className="mb-6">
               <h3 className="text-xl font-bold text-slate-900">{plans.clinic.name}</h3>
               <p className="text-sm text-slate-500 mt-2">{plans.clinic.desc}</p>
             </div>
             <div className="text-5xl font-extrabold mb-6 text-slate-900">
               ₹{getPrice('clinic')}
               <span className="text-lg font-medium text-slate-500">/mo</span>
             </div>
             <button className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold hover:bg-slate-50 transition-colors mb-8">
               {plans.clinic.btn}
             </button>
             <ul className="space-y-4 flex-1">
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> Unlimited Doctors</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> Advanced Analytics</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> 24/7 Priority Support</li>
               <li className="flex gap-3 text-sm font-medium"><CheckCircle2 className="text-teal-500 shrink-0" size={18}/> Top Listing</li>
             </ul>
           </motion.div>
         </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section className="py-20 bg-slate-50">
         <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-10">Compare Plans</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-100">
                        <th className="p-4 md:p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Features</th>
                        <th className="p-4 md:p-6 font-bold text-slate-900 text-center">{plans.starter.name}</th>
                        <th className="p-4 md:p-6 font-bold text-teal-600 text-center">{plans.pro.name}</th>
                        <th className="p-4 md:p-6 font-bold text-slate-900 text-center">{plans.clinic.name}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm md:text-base">
                     {[
                       { name: features.doctors, s: "1", p: "5", c: "Unlimited" },
                       { name: features.appts, s: "100", p: "Unlimited", c: "Unlimited" },
                       { name: features.queue, s: "Basic", p: "Advanced", c: "Advanced" },
                       { name: features.rx, s: false, p: true, c: true },
                       { name: features.sms, s: false, p: true, c: true },
                       { name: features.analytics, s: false, p: "Basic", c: "Advanced" },
                       { name: features.support, s: "Email", p: "Email + Chat", c: "24/7 Priority" },
                     ].map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 md:p-6 font-medium text-slate-700">{row.name}</td>
                          <td className="p-4 md:p-6 text-center text-slate-600">
                            {typeof row.s === 'boolean' ? (row.s ? <CheckCircle2 className="mx-auto text-teal-500" size={20}/> : <XCircle className="mx-auto text-slate-300" size={20}/>) : row.s}
                          </td>
                          <td className="p-4 md:p-6 text-center font-bold text-slate-800">
                            {typeof row.p === 'boolean' ? (row.p ? <CheckCircle2 className="mx-auto text-teal-500" size={20}/> : <XCircle className="mx-auto text-slate-300" size={20}/>) : row.p}
                          </td>
                          <td className="p-4 md:p-6 text-center text-slate-600">
                            {typeof row.c === 'boolean' ? (row.c ? <CheckCircle2 className="mx-auto text-teal-500" size={20}/> : <XCircle className="mx-auto text-slate-300" size={20}/>) : row.c}
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 px-4">
         <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid gap-6">
              {[
                { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Prorated charges will apply." },
                { q: "Is there a setup fee?", a: "No. All our plans include free onboarding resources. For Enterprise, we offer managed setup." },
                { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard), PayPal, and mobile banking." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                     <HelpCircle size={18} className="text-teal-500"/>
                     {item.q}
                   </h3>
                   <p className="text-slate-600 ml-6">{item.a}</p>
                </div>
              ))}
            </div>
         </div>
      </section>

    </div>
  );
}