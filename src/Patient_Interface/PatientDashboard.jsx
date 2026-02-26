// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   User,
//   Calendar,
//   Clock,
//   MapPin,
//   Mail,
//   Phone,
//   AlertCircle,
//   CheckCircle2,

//   CalendarDays,
//   Edit3,
//   TrendingUp,
//   Activity,
//   X,
//   Loader2,
//   Trash2,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useParams } from "react-router-dom";

// // Note: Replaced import.meta.env to avoid environment compatibility issues
// const API_URL = import.meta.env.VITE_API_URL;

// export default function PatientDashboardV2() {
//   const { patientId } = useParams();
//   const [user, setUser] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentToken, setCurrentToken] = useState(1);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobile: "",
//     email: "",
//     dob: "",
//     gender: "",
//     location: "",
//     language: "",
//     specialtyInterest: "",
//   });

//   // --- Logic for custom Patient ID ---
//   // Format: MediQ + Age + AlphabetCode (A=01, B=02...)


//   // --- Profile Calculation Logic ---
//   const profileFields = [
//     "fullName",
//     "mobile",
//     "email",
//     "dob",
//     "gender",
//     "location",
//     "language",
//     "specialtyInterest",
//   ];

//   const calculateCompleteness = (userData) => {
//     if (!userData) return 0;
//     const completedFields = profileFields.filter(
//       (field) => userData[field] && userData[field].toString().trim() !== "",
//     );
//     return (completedFields.length / profileFields.length) * 100;
//   };

//   // --- Time Estimation Logic ---
//   const estimateAppointmentTime = (tokenNumber) => {
//     const startHour = 11;
//     const minsPerPatient = 30;
//     let totalMinutes = (tokenNumber - 1) * minsPerPatient;
//     let currentHour = startHour + Math.floor(totalMinutes / 60);
//     let currentMinute = totalMinutes % 60;
//     if (currentHour > 13 || (currentHour === 13 && currentMinute >= 30)) {
//       currentHour += 1;
//     }
//     const period = currentHour >= 12 ? "PM" : "AM";
//     const displayHour = currentHour > 12 ? currentHour - 12 : currentHour;
//     return `${displayHour}:${currentMinute.toString().padStart(2, "0")} ${period}`;
//   };

//   useEffect(() => {
//     if (patientId) {
//       fetchDashboardData();
//     }
//   }, [patientId]);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       const userRes = await axios.get(`${API_URL}/auth/patient/${patientId}`);
//       const userData = userRes.data.user;
//       setUser(userData);

//       setFormData({
//         fullName: userData.fullName || "",
//         mobile: userData.mobile || "",
//         email: userData.email || "",
//         dob: userData.dob
//           ? new Date(userData.dob).toISOString().split("T")[0]
//           : "",
//         gender: userData.gender || "",
//         location: userData.location || "",
//         language: userData.language || "",
//         specialtyInterest: userData.specialtyInterest || "",
//       });

//       const appRes = await axios.get(
//         `${API_URL}/appointment-history/patient/${patientId}`,
//       );
//       setAppointments(appRes.data.appointments || []);
//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);
//     try {
//       const response = await axios.put(
//         `${API_URL}/auth/update-patient/${patientId}`,
//         formData,
//       );
//       if (response.data.success || response.status === 200) {
//         setUser(response.data.user || { ...user, ...formData });
//         setIsUpdateModalOpen(false);
//       }
//     } catch (err) {
//       console.error("Update failed:", err);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleCancelAppointment = async (appointmentId) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?"))
//       return;
//     try {
//       const token = localStorage.getItem("token");
//       console.log(token);
//       console.log("Attempting to cancel appointment with ID:", appointmentId);
//       const res = await axios.put(
//         `${API_URL}/appointment/cancel-appointment/${appointmentId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       console.log("Cancellation response:", res.data);
//       if (res.status === 200) {
//         // Refresh local state to move it to history
//         setAppointments((prev) =>
//           prev.map((app) =>
//             app._id === appointmentId ? { ...app, status: "cancelled" } : app,
//           ),
//         );
//       }
//     } catch (err) {
//       console.error("Cancellation failed:", err);
//       // Fallback message box instead of alert
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen font-bold text-slate-600">
//         Loading your health records...
//       </div>
//     );
//   if (!user)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         User not found. Please login again.
//       </div>
//     );

//   const completeness = calculateCompleteness(user);

//   // DATE FILTERING LOGIC
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Upcoming: Confirmed AND Date is Today
//   const upcomingAppointments = appointments.filter((app) => {
//     const appDate = new Date(app.appointmentDate);
//     appDate.setHours(0, 0, 0, 0);
//     return app.status === "confirmed" && appDate.getTime() === today.getTime();
//   });

//   // History: Status is Cancelled OR Date is before Today
//   const historyAppointments = appointments.filter((app) => {
//     const appDate = new Date(app.appointmentDate);
//     appDate.setHours(0, 0, 0, 0);
//     return app.status === "cancelled" || appDate.getTime() < today.getTime();
//   });

//   return (
//     <div className="min-h-screen bg-slate-50/50 pb-12">
//       <div className="max-w-7xl mx-auto px-6 pt-16">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//               Patient Dashboard
//             </h1>
//             <p className="text-slate-500 font-medium">
//               Welcome back, {user.fullName?.split(" ")[0]}!
//             </p>
//           </div>
//           <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
//             <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center overflow-hidden">
//               <img
//                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
//                 alt="User"
//               />
//             </div>
//             <div>
//               <p className="text-sm font-bold text-slate-900">
//                 {user.fullName}
//               </p>

//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-8 space-y-6">
//             <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 px-2">
//               <Clock size={18} className="text-teal-500" /> Today's Schedule
//             </h3>

//             {upcomingAppointments.length > 0 ? (
//               <div className="space-y-4">
//                 {upcomingAppointments.map((upcoming) => (
//                   <motion.div
//                     key={upcoming._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden"
//                   >
//                     {/* Top Right: Status Badge */}
//                     <div className="absolute top-6 right-6">
//                       <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
//                         <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />{" "}
//                         LIVE
//                       </div>
//                     </div>

//                     {/* Main Layout: Flex-col for mobile (stacked), Flex-row for desktop */}
//                     <div className="flex flex-col md:flex-row gap-8 items-start">
//                       {/* Left Column: Doctor Info & Date Grid */}
//                       <div className="flex-1 w-full">
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
//                             <CalendarDays size={20} />
//                           </div>
//                           <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">
//                             Next Appointment
//                           </p>
//                         </div>

//                         <h2 className="text-3xl font-black text-slate-900 mb-2">
//                           {upcoming.doctorId.fullName}
//                         </h2>
//                         <p className="text-md text-slate-500 font-medium mb-6">
//                           {upcoming.doctorId.specialization} •{" "}
//                           {upcoming.doctorId.location}
//                         </p>

//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="bg-slate-50 p-4 rounded-2xl">
//                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
//                               Date
//                             </p>
//                             <p className="font-bold text-slate-900">
//                               {new Date(
//                                 upcoming.appointmentDate,
//                               ).toLocaleDateString("en-GB")}
//                             </p>
//                           </div>
//                           <div className="bg-slate-50 p-4 rounded-2xl">
//                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
//                               Est. Time
//                             </p>
//                             <p className="font-bold text-teal-600">
//                               {estimateAppointmentTime(upcoming.tokenNumber)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Right Column: Token Progress & Cancel Button */}
//                       <div className="w-full md:w-64 flex flex-col gap-4">
//                         {/* Token Card */}
//                         <div className="bg-slate-900 rounded-3xl p-6 text-white">
//                           <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">
//                             Token Progress
//                           </p>
//                           <div className="flex items-baseline gap-2 mb-1">
//                             <span className="text-5xl font-black">
//                               {upcoming.tokenNumber}
//                             </span>
//                             <span className="text-slate-500 font-bold">
//                               Your Token
//                             </span>
//                           </div>
//                           <div className="mt-8 pt-6 border-t border-slate-800">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-xs text-slate-400">
//                                 Current:
//                               </span>
//                               <span className="text-sm font-black text-teal-400">
//                                 #{currentToken}
//                               </span>
//                             </div>
//                             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
//                               <div
//                                 className="h-full bg-teal-500"
//                                 style={{
//                                   width: `${Math.min((currentToken / upcoming.tokenNumber) * 100, 100)}%`,
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>

//                         {/* Cancel Button - Positioned here ensures it's on the right (desktop) and bottom (mobile) */}
//                         <button
//                           onClick={() => handleCancelAppointment(upcoming._id)}
//                           className="w-full bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-all border border-rose-100"
//                         >
//                           <Trash2 size={16} /> CANCEL APPOINTMENT
//                         </button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
//                 <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
//                 <h3 className="text-xl font-bold text-slate-900">
//                   No Appointments Today
//                 </h3>
//                 <p className="text-slate-400 mb-6">
//                   You're all clear! Stay healthy.
//                 </p>
//                 <button className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-teal-700 transition-colors">
//                   Book New
//                 </button>
//               </div>
//             )}

//             {/* History */}
//             <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
//               <div className="flex items-center justify-between mb-6 px-2">
//                 <h3 className="text-xl font-black text-slate-900">
//                   Medical History
//                 </h3>
//                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
//                   Past & Cancelled
//                 </span>
//               </div>
//               <div className="space-y-4">
//                 {historyAppointments.length > 0 ? (
//                   historyAppointments.map((app) => (
//                     <div
//                       key={app._id}
//                       className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/80 transition-all"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`w-12 h-12 rounded-xl flex items-center justify-center ${app.status === "cancelled" ? "bg-rose-50 text-rose-400" : "bg-slate-100 text-slate-400"}`}
//                         >
//                           {app.status === "cancelled" ? (
//                             <X size={24} />
//                           ) : (
//                             <CheckCircle2 size={24} />
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-bold text-slate-900">
//                             {app.doctorId.fullName}
//                           </p>
//                           <p className="text-xs font-medium text-slate-500">
//                             {app.doctorId.specialization} •{" "}
//                             {new Date(app.appointmentDate).toDateString()}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <span
//                           className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight ${
//                             app.status === "cancelled"
//                               ? "bg-rose-100 text-rose-600"
//                               : "bg-teal-50 text-teal-600"
//                           }`}
//                         >
//                           {app.status}
//                         </span>

//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-slate-400 text-sm py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
//                     No medical history records found.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-4 space-y-6">
//             <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
//               <h3 className="text-lg font-black text-slate-900 mb-6">
//                 Profile Strength
//               </h3>
//               <div className="relative w-40 h-40 mx-auto mb-6">
//                 <svg className="w-full h-full transform -rotate-90">
//                   <circle
//                     cx="80"
//                     cy="80"
//                     r="70"
//                     stroke="currentColor"
//                     strokeWidth="12"
//                     fill="transparent"
//                     className="text-slate-100"
//                   />
//                   <motion.circle
//                     initial={{ strokeDasharray: "0 440" }}
//                     animate={{
//                       strokeDasharray: `${(completeness / 100) * 440} 440`,
//                     }}
//                     transition={{ duration: 1.5 }}
//                     cx="80"
//                     cy="80"
//                     r="70"
//                     stroke="currentColor"
//                     strokeWidth="12"
//                     fill="transparent"
//                     strokeLinecap="round"
//                     className="text-teal-500"
//                   />
//                 </svg>
//                 <div className="absolute inset-0 flex flex-col items-center justify-center">
//                   <span className="text-3xl font-black text-slate-900">
//                     {Math.round(completeness)}%
//                   </span>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsUpdateModalOpen(true)}
//                 className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
//               >
//                 <Edit3 size={18} /> Update Info
//               </button>
//             </div>

//             {/* Account Details */}
//             <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
//               <div className="flex items-center justify-between mb-6">
//                 <p className="font-bold">Contact Info</p>
                
//               </div>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Phone size={14} className="text-slate-400" />
//                   <p className="text-sm">{user.mobile || "Not Set"}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Mail size={14} className="text-slate-400" />
//                   <p className="text-sm truncate">{user.email || "No Email"}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <MapPin size={14} className="text-slate-400" />
//                   <p className="text-sm">
//                     {user.location || "No Location Set"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Update Info Modal */}
//       <AnimatePresence>
//         {isUpdateModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsUpdateModalOpen(false)}
//               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
//             >
//               <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
//                 <div>
//                   <h2 className="text-2xl font-black text-slate-900">
//                     Update Profile
//                   </h2>
//                   <p className="text-slate-500 text-sm font-medium">
//                     Keep your records up to date for better care
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setIsUpdateModalOpen(false)}
//                   className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <form
//                 onSubmit={handleUpdateProfile}
//                 className="flex-1 overflow-y-auto p-8 pt-6"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Full Name */}
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">
//                       Full Name
//                     </label>
//                     <div className="relative">
//                       <User
//                         className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                         size={16}
//                       />
//                       <input
//                         type="text"
//                         value={formData.fullName}
//                         onChange={(e) =>
//                           setFormData({ ...formData, fullName: e.target.value })
//                         }
//                         className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                         placeholder="Your full name"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Mobile */}
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <Phone
//                         className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                         size={16}
//                       />
//                       <input
//                         type="tel"
//                         value={formData.mobile}
//                         onChange={(e) =>
//                           setFormData({ ...formData, mobile: e.target.value })
//                         }
//                         className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                         placeholder="Phone number"
//                       />
//                     </div>
//                   </div>

//                   {/* Email */}
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail
//                         className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                         size={16}
//                       />
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) =>
//                           setFormData({ ...formData, email: e.target.value })
//                         }
//                         className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                         placeholder="email@example.com"
//                       />
//                     </div>
//                   </div>

//                   {/* DOB */}
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">
//                       Date of Birth
//                     </label>
//                     <div className="relative">
//                       <Calendar
//                         className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                         size={16}
//                       />
//                       <input
//                         type="date"
//                         value={formData.dob}
//                         onChange={(e) =>
//                           setFormData({ ...formData, dob: e.target.value })
//                         }
//                         className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Gender */}
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">
//                       Gender
//                     </label>
//                     <select
//                       value={formData.gender}
//                       onChange={(e) =>
//                         setFormData({ ...formData, gender: e.target.value })
//                       }
//                       className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none"
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   {/* Location */}
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">
//                       Location
//                     </label>
//                     <div className="relative">
//                       <MapPin
//                         className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                         size={16}
//                       />
//                       <input
//                         type="text"
//                         value={formData.location}
//                         onChange={(e) =>
//                           setFormData({ ...formData, location: e.target.value })
//                         }
//                         className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
//                         placeholder="City, Country"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-10 flex items-center gap-4">
//                   <button
//                     type="button"
//                     onClick={() => setIsUpdateModalOpen(false)}
//                     className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isUpdating}
//                     className="flex-2 py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all disabled:opacity-50"
//                   >
//                     {isUpdating ? (
//                       <>
//                         <Loader2 className="animate-spin" size={20} />{" "}
//                         Updating...
//                       </>
//                     ) : (
//                       <>Save Changes</>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // 👉 Added socket.io-client
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  CalendarDays,
  Edit3,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function PatientDashboardV2() {
  const { patientId } = useParams();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentToken, setCurrentToken] = useState(1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",
    location: "",
    language: "",
    specialtyInterest: "",
  });

  const profileFields = [
    "fullName",
    "mobile",
    "email",
    "dob",
    "gender",
    "location",
    "language",
    "specialtyInterest",
  ];

  const calculateCompleteness = (userData) => {
    if (!userData) return 0;
    const completedFields = profileFields.filter(
      (field) => userData[field] && userData[field].toString().trim() !== "",
    );
    return (completedFields.length / profileFields.length) * 100;
  };

  // 👉 NEW: Dynamic Wait Time Calculation
  const calculateWaitTime = (myToken, liveToken) => {
    if (myToken < liveToken) return "Turn Passed";
    if (myToken === liveToken) return "It's your turn! 🚨";
    
    const tokensAhead = myToken - liveToken;
    const avgMinsPerPatient = 15; // Set the average consultation time here
    const totalWaitMins = tokensAhead * avgMinsPerPatient;
    
    if (totalWaitMins >= 60) {
      const hours = Math.floor(totalWaitMins / 60);
      const mins = totalWaitMins % 60;
      return `${hours} hr ${mins} min wait`;
    }
    return `${totalWaitMins} min wait`;
  };

  useEffect(() => {
    if (patientId) {
      fetchDashboardData();
    }
  }, [patientId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get(`${API_URL}/auth/patient/${patientId}`);
      const userData = userRes.data.user;
      setUser(userData);

      setFormData({
        fullName: userData.fullName || "",
        mobile: userData.mobile || "",
        email: userData.email || "",
        dob: userData.dob ? new Date(userData.dob).toISOString().split("T")[0] : "",
        gender: userData.gender || "",
        location: userData.location || "",
        language: userData.language || "",
        specialtyInterest: userData.specialtyInterest || "",
      });

      const appRes = await axios.get(
        `${API_URL}/appointment-history/patient/${patientId}`,
      );
      setAppointments(appRes.data.appointments || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${API_URL}/auth/update-patient/${patientId}`,
        formData,
      );
      if (response.data.success || response.status === 200) {
        setUser(response.data.user || { ...user, ...formData });
        setIsUpdateModalOpen(false);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/appointment/cancel-appointment/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.status === 200) {
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: "cancelled" } : app,
          ),
        );
      }
    } catch (err) {
      console.error("Cancellation failed:", err);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    appDate.setHours(0, 0, 0, 0);
    return app.status === "confirmed" && appDate.getTime() === today.getTime();
  });

  const historyAppointments = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    appDate.setHours(0, 0, 0, 0);
    return app.status === "cancelled" || appDate.getTime() < today.getTime() || app.status === "completed";
  });

  // 👉 NEW: Socket.io Connection & Listening
  useEffect(() => {
    if (upcomingAppointments.length === 0) return;

    // Connect to server (removing /api from the URL)
    const socketUrl = API_URL.replace(/\/api\/?$/, "");
    const socket = io(socketUrl, { transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      console.log("Connected to Live Queue server");
      // Join the doctor's room for the first upcoming appointment
      const firstUpcoming = upcomingAppointments[0];
      const doctorId = firstUpcoming.doctorId._id || firstUpcoming.doctorId;
      
      socket.emit("join_doctor_room", doctorId);
    });

    // Listen for queue updates
    socket.on("queue_updated", (data) => {
      console.log("Live queue update received:", data);
      setCurrentToken(data.currentLiveToken);
    });

    return () => {
      socket.disconnect();
    };
  }, [upcomingAppointments.length]); 


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-bold text-slate-600">
        Loading your health records...
      </div>
    );
    
  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        User not found. Please login again.
      </div>
    );

  const completeness = calculateCompleteness(user);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Patient Dashboard
            </h1>
            <p className="text-slate-500 font-medium">
              Welcome back, {user.fullName?.split(" ")[0]}!
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                alt="User"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {user.fullName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 px-2">
              <Clock size={18} className="text-teal-500" /> Today's Schedule
            </h3>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((upcoming) => (
                  <motion.div
                    key={upcoming._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute top-6 right-6">
                      <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />{" "}
                        LIVE
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <CalendarDays size={20} />
                          </div>
                          <p className="font-bold text-slate-400 text-sm uppercase tracking-widest">
                            Next Appointment
                          </p>
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 mb-2">
                          {upcoming.doctorId.fullName}
                        </h2>
                        <p className="text-md text-slate-500 font-medium mb-6">
                          {upcoming.doctorId.specialization} •{" "}
                          {upcoming.doctorId.location}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                              Date
                            </p>
                            <p className="font-bold text-slate-900">
                              {new Date(upcoming.appointmentDate).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                          {/* 👉 UPDATED: Using dynamic calculateWaitTime */}
                          <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                              Live Wait Time
                            </p>
                            <p className={`font-bold ${upcoming.tokenNumber === currentToken ? 'text-rose-600 animate-pulse' : 'text-teal-600'}`}>
                              {calculateWaitTime(upcoming.tokenNumber, currentToken)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-64 flex flex-col gap-4">
                        <div className="bg-slate-900 rounded-3xl p-6 text-white">
                          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">
                            Token Progress
                          </p>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-5xl font-black">
                              {upcoming.tokenNumber}
                            </span>
                            <span className="text-slate-500 font-bold">
                              Your Token
                            </span>
                          </div>
                          <div className="mt-8 pt-6 border-t border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-slate-400">
                                Current:
                              </span>
                              <span className="text-sm font-black text-teal-400">
                                #{currentToken}
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 transition-all duration-500"
                                style={{
                                  width: `${Math.min((currentToken / upcoming.tokenNumber) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCancelAppointment(upcoming._id)}
                          className="w-full bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-all border border-rose-100"
                        >
                          <Trash2 size={16} /> CANCEL APPOINTMENT
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">
                  No Appointments Today
                </h3>
                <p className="text-slate-400 mb-6">
                  You're all clear! Stay healthy.
                </p>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-xl font-black text-slate-900">
                  Medical History
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Past & Cancelled
                </span>
              </div>
              <div className="space-y-4">
                {historyAppointments.length > 0 ? (
                  historyAppointments.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/80 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${app.status === "cancelled" ? "bg-rose-50 text-rose-400" : "bg-slate-100 text-slate-400"}`}
                        >
                          {app.status === "cancelled" ? (
                            <X size={24} />
                          ) : (
                            <CheckCircle2 size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {app.doctorId.fullName}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {app.doctorId.specialization} •{" "}
                            {new Date(app.appointmentDate).toDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight ${
                            app.status === "cancelled"
                              ? "bg-rose-100 text-rose-600"
                              : "bg-teal-50 text-teal-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                    No medical history records found.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <h3 className="text-lg font-black text-slate-900 mb-6">
                Profile Strength
              </h3>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <motion.circle
                    initial={{ strokeDasharray: "0 440" }}
                    animate={{
                      strokeDasharray: `${(completeness / 100) * 440} 440`,
                    }}
                    transition={{ duration: 1.5 }}
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeLinecap="round"
                    className="text-teal-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">
                    {Math.round(completeness)}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
              >
                <Edit3 size={18} /> Update Info
              </button>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <p className="font-bold">Contact Info</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-slate-400" />
                  <p className="text-sm">{user.mobile || "Not Set"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-slate-400" />
                  <p className="text-sm truncate">{user.email || "No Email"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={14} className="text-slate-400" />
                  <p className="text-sm">
                    {user.location || "No Location Set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Update Profile
                  </h2>
                </div>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleUpdateProfile}
                className="flex-1 overflow-y-auto p-8 pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-2 py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> Updating...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}