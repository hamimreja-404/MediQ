// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, CreditCard, ShieldCheck, AlertTriangle, 
//   CheckCircle2, Sparkles, Smartphone, Wallet
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// // import confetti from 'canvas-confetti'; // In a real app, use this for confetti

// // --- COMPONENT ---
// export default function PaymentPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Mock data if accessed directly
//   const { doctorName, date, timeSlot, fees } = location.state || {
//     doctorName: "Dr. Sarah Sharma",
//     date: "12 Aug 2026",
//     timeSlot: "10:00 AM",
//     fees: 1200
//   };

//   const bookingFee = 0.00; // Platform fee (Free for V1)
//   const totalPayable = bookingFee;

//   const [paymentMethod, setPaymentMethod] = useState('razorpay');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   // Confetti Effect for Free Booking
//   useEffect(() => {
//     if (totalPayable === 0) {
//       // Logic to trigger confetti would go here
//       // confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
//     }
//   }, [totalPayable]);

//   const handlePayment = () => {
//     setIsProcessing(true);
//     // Simulate Payment Gateway
//     setTimeout(() => {
//       setIsProcessing(false);
//       setShowSuccess(true);
//       // Redirect after success animation
//       setTimeout(() => navigate('/patient/appointments'), 2500);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      
//       {/* --- HEADER --- */}
//       <header className=" sticky top-0 z-30">
//         <div className="container mx-auto px-4 h-16 flex items-center gap-3">

//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-6 max-w-xl space-y-6">

//         {/* --- ORDER SUMMARY --- */}
//         <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
//            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Order Summary</h2>
           
//            <div className="flex justify-between items-center mb-2">
//               <span className="text-slate-600">Consultation Fee</span>
//               <span className="font-bold">₹{fees}</span>
//            </div>
//            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
//               <span className="text-slate-600">Booking Charge</span>
//               <span className="font-bold text-green-600 flex items-center gap-1">
//                  ₹{bookingFee.toFixed(2)} 
//                  {bookingFee === 0 && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded uppercase">Free</span>}
//               </span>
//            </div>
           
//            <div className="flex justify-between items-center text-lg font-bold text-slate-900">
//               <span>Total Payable Now</span>
//               <span>₹{totalPayable.toFixed(2)}</span>
//            </div>
           
//            <p className="text-xs text-slate-400 mt-2">
//               *The consultation fee of ₹{fees} is to be paid directly at the clinic.
//            </p>
//         </section>

//         {/* --- ZERO FEE CELEBRATION (Conditional) --- */}
//         {totalPayable === 0 && (
//            <motion.div 
//              initial={{ scale: 0.9, opacity: 0 }}
//              animate={{ scale: 1, opacity: 1 }}
//              className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center relative overflow-hidden"
//            >
//               <div className="relative z-10">
//                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
//                     <Sparkles size={24} className="text-yellow-300" />
//                  </div>
//                  <h3 className="font-bold text-lg">No Booking Fee!</h3>
//                  <p className="text-indigo-100 text-sm mt-1">
//                     You don't have to pay anything now. Your slot is reserved for free.
//                  </p>
//               </div>
//               {/* Decor */}
//               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
//            </motion.div>
//         )}

//         {/* --- PAYMENT METHODS (Only if amount > 0) --- */}
//         {totalPayable > 0 && (
//            <section>
//               <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">Payment Method</h3>
//               <div className="space-y-3">
//                  <button 
//                    onClick={() => setPaymentMethod('razorpay')}
//                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
//                       paymentMethod === 'razorpay' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-slate-300'
//                    }`}
//                  >
//                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
//                        <CreditCard size={20} />
//                     </div>
//                     <div className="flex-1 text-left">
//                        <div className="font-bold text-sm text-slate-900">Razorpay</div>
//                        <div className="text-xs text-slate-500">Cards, Netbanking, Wallets</div>
//                     </div>
//                     <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
//                        paymentMethod === 'razorpay' ? 'border-blue-500' : 'border-slate-300'
//                     }`}>
//                        {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
//                     </div>
//                  </button>

//                  <button 
//                    onClick={() => setPaymentMethod('upi')}
//                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
//                       paymentMethod === 'upi' ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' : 'bg-white border-slate-200 hover:border-slate-300'
//                    }`}
//                  >
//                     <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
//                        <Smartphone size={20} />
//                     </div>
//                     <div className="flex-1 text-left">
//                        <div className="font-bold text-sm text-slate-900">UPI</div>
//                        <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</div>
//                     </div>
//                     <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
//                        paymentMethod === 'upi' ? 'border-teal-500' : 'border-slate-300'
//                     }`}>
//                        {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-teal-500 rounded-full"></div>}
//                     </div>
//                  </button>
//               </div>
//            </section>
//         )}

//         {/* --- STRICT POLICY WARNING --- */}
//         <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 items-start">
//            <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
//            <div>
//               <h4 className="font-bold text-red-700 text-sm mb-1">Important Cancellation Policy</h4>
//               <p className="text-xs text-red-600 leading-relaxed">
//                  To ensure fairness for all patients, if you miss your appointment without cancelling <strong>3 times</strong>, your MediQ account will be <strong>permanently blocked</strong>. Please cancel at least 2 hours in advance if you cannot make it.
//               </p>
//            </div>
//         </div>

//       </div>

//       {/* --- FOOTER ACTION --- */}
//       <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-40">
//          <div className="container mx-auto max-w-xl">
//             <button 
//                onClick={handlePayment}
//                disabled={isProcessing}
//                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
//             >
//                {isProcessing ? (
//                   <>Processing...</>
//                ) : (
//                   <>
//                      {totalPayable === 0 ? "Confirm for Free" : `Pay ₹${totalPayable}`} 
//                      <ShieldCheck size={18} />
//                   </>
//                )}
//             </button>
//          </div>
//       </div>

//       {/* --- SUCCESS OVERLAY --- */}
//       <AnimatePresence>
//          {showSuccess && (
//             <motion.div 
//                initial={{ opacity: 0 }}
//                animate={{ opacity: 1 }}
//                exit={{ opacity: 0 }}
//                className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center p-6 text-center"
//             >
//                <motion.div 
//                   initial={{ scale: 0.5, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ type: "spring", stiffness: 200, damping: 20 }}
//                   className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
//                >
//                   <CheckCircle2 size={48} />
//                </motion.div>
//                <h2 className="text-3xl font-black text-slate-900 mb-2">Success!</h2>
//                <p className="text-slate-500 max-w-xs mx-auto mb-8">
//                   Your appointment with {doctorName} has been confirmed.
//                </p>
//                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 w-full max-w-sm">
//                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</div>
//                   <div className="text-xl font-bold text-slate-800">{date} • {timeSlot}</div>
//                </div>
//             </motion.div>
//          )}
//       </AnimatePresence>

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, ShieldCheck, AlertTriangle, 
  CheckCircle2, Sparkles, Smartphone, ArrowRight,
  Ticket, Calendar, User, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data passed from BookAppointment
  const { doctorName, date, fees, patientDetails } = location.state || {
    doctorName: "Specialist",
    date: new Date().toLocaleDateString(),
    fees: 500,
    patientDetails: { name: "Guest" }
  };

  const bookingFee = 0.00; 
  const totalPayable = bookingFee;

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tokenNumber, setTokenNumber] = useState(null);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Confirmation and Token Generation
    setTimeout(() => {
      const generatedToken = Math.floor(Math.random() * 50) + 1; // Simulated Token #
      setTokenNumber(generatedToken);
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Navigate to appointments after viewing token
      setTimeout(() => navigate('/patient/appointments'), 4500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-center">
           <h1 className="text-lg font-black text-slate-900 uppercase tracking-widest">Final Step</h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        {/* Order Summary */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Ticket size={80} />
           </div>
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Booking Details</h2>
           
           <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-lg font-black text-slate-900">{doctorName}</p>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar size={12} /> {date}
                       </span>
                       <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <User size={12} /> {patientDetails.name}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-dashed border-slate-200">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 font-medium">Consultation Fee</span>
                    <span className="font-bold text-slate-700">₹{fees}</span>
                 </div>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 font-medium">Platform Service Charge</span>
                    <span className="font-bold text-teal-600 flex items-center gap-2">
                       ₹{bookingFee.toFixed(2)} 
                       <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-black uppercase">Free</span>
                    </span>
                 </div>
                 
                 <div className="flex justify-between items-center text-2xl font-black text-slate-900 pt-2">
                    <span>Payable Now</span>
                    <span>₹{totalPayable.toFixed(2)}</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                 *Consultation fee (₹{fees}) is to be paid directly to the clinic reception upon arrival.
              </p>
           </div>
        </section>

        {/* Free Offer Banner */}
        <motion.div 
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="bg-linear-to-r from-teal-600 to-sky-700 rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-lg shadow-teal-200"
        >
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                 <Sparkles size={24} className="text-yellow-300" />
              </div>
              <h3 className="font-black text-xl mb-1">Queue Access Free!</h3>
              <p className="text-teal-50 text-sm font-medium opacity-90">
                 Your digital token will be generated instantly for ₹0.00.
              </p>
           </div>
           <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Cancellation Warning */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-4 items-start">
           <div className="p-2 bg-red-100 rounded-xl text-red-600 shrink-0">
              <AlertTriangle size={20} />
           </div>
           <div>
              <h4 className="font-black text-red-700 text-xs uppercase tracking-wider mb-1">No-Show Policy</h4>
              <p className="text-xs text-red-600/80 font-medium leading-relaxed">
                 Patients with 3 consecutive missed appointments (without cancellation) will be restricted from the platform.
              </p>
           </div>
        </div>
      </div>

      {/* Fixed Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 z-40">
         <div className="max-w-xl mx-auto">
            <button 
               onClick={handlePayment}
               disabled={isProcessing}
               className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
            >
               {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                    Securing Token...
                  </div>
               ) : (
                  <>Confirm & Generate Token <ShieldCheck size={20} /></>
               )}
            </button>
         </div>
      </div>

      {/* SUCCESS OVERLAY WITH TOKEN */}
      <AnimatePresence>
         {showSuccess && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center p-6 text-center"
            >
               <motion.div 
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="w-full max-w-sm"
               >
                  <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-inner">
                     <CheckCircle2 size={48} />
                  </div>
                  
                  <h2 className="text-4xl font-black text-slate-900 mb-2 italic">CONFIRMED!</h2>
                  <p className="text-slate-500 font-medium mb-8">
                     Your spot in the queue has been reserved.
                  </p>

                  <div className="bg-slate-50 rounded-[40px] p-10 border-4 border-white shadow-2xl relative overflow-hidden group">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 left-0 w-full h-2 bg-teal-500"></div>
                     <div className="absolute top-4 right-4 text-teal-100 group-hover:text-teal-200 transition-colors">
                        <Ticket size={40} />
                     </div>
                     
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Patient Token</div>
                     <div className="text-7xl font-black text-teal-600 tabular-nums">
                        #{tokenNumber < 10 ? `0${tokenNumber}` : tokenNumber}
                     </div>
                     
                     <div className="mt-8 pt-8 border-t border-slate-200/60 grid grid-cols-2 gap-4">
                        <div className="text-left">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                           <p className="text-sm font-bold text-slate-800 line-clamp-1">{doctorName}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                           <p className="text-sm font-bold text-slate-800">{date}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-12 flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                     <Clock size={14} /> Redirecting to Appointments...
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}