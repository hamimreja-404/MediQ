import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Edit2, 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Camera,
  Droplet,
  Globe,
  Moon,
  Sun,
  HelpCircle,
  X,
  CheckCircle2,
  QrCode,
  Copy,
  Lock,
  Smartphone,
  MessageSquare,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const INITIAL_USER = {
  name: "Arjun Kumar",
  age: 28,
  gender: "Male",
  bloodGroup: "O+",
  mobile: "+91 98765 43210",
  email: "arjun.kumar@example.com",
  location: "Indiranagar, Bangalore",
  healthId: "MediQ-2023-8899",
  avatar: "bg-gradient-to-br from-teal-400 to-blue-500"
};

// --- COMPONENTS ---

// 1. Toast Notification
const Toast = ({ message, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl z-70 flex items-center gap-2 whitespace-nowrap"
      >
        <CheckCircle2 size={18} className="text-teal-400" />
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// 2. Digital Health Card
const HealthCard = ({ user, onClick }) => (
  <div 
    onClick={onClick}
    className="w-full aspect-[1.586/1] bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-6 relative overflow-hidden text-white shadow-2xl shadow-slate-900/20 group cursor-pointer transition-transform hover:scale-[1.02]"
  >
    {/* Background Patterns */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
    
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
             <div className="w-4 h-4 bg-teal-500 rounded-sm"></div>
           </div>
           <span className="font-bold tracking-wider text-lg">MediQ ID</span>
        </div>
        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
          <QrCode className="opacity-90" size={24} />
        </div>
      </div>

      <div className="flex gap-6 items-end">
         <div className="flex-1">
            <div className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Health ID</div>
            <div className="font-mono text-xl md:text-2xl tracking-widest text-teal-400 shadow-black drop-shadow-sm truncate">{user.healthId}</div>
            
            <div className="flex gap-8 mt-4">
               <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Name</div>
                  <div className="font-medium text-sm truncate">{user.name}</div>
               </div>
               <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">DOB</div>
                  <div className="font-medium text-sm">12/05/1995</div>
               </div>
               <div>
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Blood</div>
                  <div className="font-medium text-sm text-red-400">{user.bloodGroup}</div>
               </div>
            </div>
         </div>
         {/* Photo */}
         <div className="w-20 h-24 bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-600/50 hidden sm:block">
             <div className={`w-full h-full ${user.avatar} flex items-center justify-center text-3xl font-bold`}>
                {user.name[0]}
             </div>
         </div>
      </div>
    </div>
  </div>
);

// 3. Settings Row
const SettingsItem = ({ icon, label, subLabel, onClick, isDestructive, darkMode }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 border-b last:border-0 transition-colors group cursor-pointer active:scale-[0.99] ${
       darkMode 
       ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 active:bg-slate-700' 
       : 'bg-white hover:bg-slate-50 border-slate-100 active:bg-slate-100'
    }`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
       isDestructive 
       ? 'bg-red-50 text-red-500 group-hover:bg-red-100' 
       : darkMode ? 'bg-slate-700 text-slate-300 group-hover:bg-slate-600 group-hover:text-teal-400' : 'bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600'
    }`}>
       {icon}
    </div>
    <div className="flex-1 text-left">
       <div className={`font-semibold ${isDestructive ? 'text-red-600' : darkMode ? 'text-white' : 'text-slate-800'}`}>{label}</div>
       {subLabel && <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subLabel}</div>}
    </div>
    <ChevronRight size={18} className={`${darkMode ? 'text-slate-600' : 'text-slate-300'} group-hover:text-teal-500 transition-colors`} />
  </button>
);

// 4. Edit Modal
const EditProfileModal = ({ isOpen, onClose, user, onSave, darkMode }) => {
   const [formData, setFormData] = useState(user);

   const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
               />
               <motion.div 
                 initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                 className={`w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
               >
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-lg">Edit Profile</h3>
                     <button onClick={onClose} className={`cursor-pointer p-2 rounded-full ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}><X size={20} /></button>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Full Name</label>
                           <input 
                              name="name" 
                              value={formData.name} 
                              onChange={handleChange} 
                              className={`w-full border rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-teal-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} 
                           />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-400 uppercase mb-1 block items-center gap-1">Blood Group <Shield size={10}/></label>
                           <input 
                              name="bloodGroup" 
                              value={formData.bloodGroup} 
                              disabled 
                              className={`w-full border rounded-xl px-3 py-2 text-sm font-medium outline-none cursor-not-allowed ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
                              title="Blood Group cannot be changed without medical verification"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Email</label>
                        <input 
                           name="email" 
                           value={formData.email} 
                           onChange={handleChange} 
                           className={`w-full border rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-teal-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Location</label>
                        <input 
                           name="location" 
                           value={formData.location} 
                           onChange={handleChange} 
                           className={`w-full border rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-teal-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        />
                     </div>
                  </div>

                  <button 
                     onClick={() => { onSave(formData); onClose(); }}
                     className="w-full mt-6 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 cursor-pointer shadow-lg shadow-teal-500/30"
                  >
                     Save Changes
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
};

// 5. QR Code Modal (With API)
const QrModal = ({ isOpen, onClose, user, darkMode }) => {
   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${user.healthId}`;

   return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-3xl p-8 relative z-10 shadow-2xl w-full max-w-sm text-center ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
            >
              <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}>
                <X size={20} className={darkMode ? 'text-slate-300' : 'text-slate-500'} />
              </button>
   
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-100 text-teal-600'}`}>
                 <QrCode size={32} />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Scan at Reception</h3>
              <p className={`text-sm mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Show this QR code to the clinic staff to instantly share your profile.</p>
   
              <div className="bg-white p-4 rounded-3xl inline-block shadow-xl mb-6">
                 {/* Real QR Code using API */}
                 <img src={qrUrl} alt="User QR Code" className="w-48 h-48 rounded-lg" />
              </div>
   
              <div className={`p-4 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                 <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">MediQ ID</div>
                    <div className="text-lg font-mono font-bold">{user.healthId}</div>
                 </div>
                 <button className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? 'text-teal-400 hover:bg-slate-800' : 'text-teal-600 hover:bg-teal-50'}`}>
                    <Copy size={20} />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
   );
};

// 6. Security Modal (New)
const SecurityModal = ({ isOpen, onClose, showToast, darkMode }) => {
   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className={`w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
               >
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-lg flex items-center gap-2"><Shield size={20} className="text-teal-500"/> Privacy & Security</h3>
                     <button onClick={onClose}><X size={20} className="text-slate-400"/></button>
                  </div>
                  
                  <div className="space-y-4">
                     <div className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                           <Lock size={20} className="text-slate-400"/>
                           <div>
                              <div className="font-bold text-sm">Two-Factor Authentication</div>
                              <div className="text-xs text-slate-500">Secure your account with OTP</div>
                           </div>
                        </div>
                        <input type="checkbox" className="accent-teal-500 w-5 h-5 cursor-pointer" defaultChecked />
                     </div>

                     <div className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                           <Smartphone size={20} className="text-slate-400"/>
                           <div>
                              <div className="font-bold text-sm">Biometric Login</div>
                              <div className="text-xs text-slate-500">FaceID / Fingerprint</div>
                           </div>
                        </div>
                        <input type="checkbox" className="accent-teal-500 w-5 h-5 cursor-pointer" />
                     </div>

                     <div className="pt-4">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Change Password</label>
                        <input type="password" placeholder="Current Password" className={`w-full mb-3 border rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                        <input type="password" placeholder="New Password" className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
                     </div>
                  </div>

                  <button 
                     onClick={() => { showToast("Security settings updated"); onClose(); }}
                     className="w-full mt-6 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 cursor-pointer shadow-lg shadow-teal-500/30"
                  >
                     Save Changes
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
};

// 7. Support Modal (New)
const SupportModal = ({ isOpen, onClose, showToast, darkMode }) => {
   return (
      <AnimatePresence>
         {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className={`w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
               >
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-lg flex items-center gap-2"><HelpCircle size={20} className="text-blue-500"/> Help & Support</h3>
                     <button onClick={onClose}><X size={20} className="text-slate-400"/></button>
                  </div>
                  
                  <div className="space-y-4">
                     <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>How can we help you today?</p>
                     
                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <button className={`p-4 rounded-xl border flex flex-col items-center gap-2 hover:border-teal-500 transition-colors ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                           <MessageSquare size={24} className="text-teal-500"/>
                           <span className="text-xs font-bold">Live Chat</span>
                        </button>
                        <button className={`p-4 rounded-xl border flex flex-col items-center gap-2 hover:border-blue-500 transition-colors ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                           <FileText size={24} className="text-blue-500"/>
                           <span className="text-xs font-bold">Read FAQs</span>
                        </button>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Describe your issue</label>
                        <textarea 
                           rows="4" 
                           placeholder="Type your message here..." 
                           className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                        ></textarea>
                     </div>
                  </div>

                  <button 
                     onClick={() => { showToast("Support ticket created #9988"); onClose(); }}
                     className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-500/30"
                  >
                     Submit Ticket
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
   );
};


// --- MAIN PAGE ---
export default function PatientProfile() {
  const [user, setUser] = useState(INITIAL_USER);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  // Settings States
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // Toast State
  const [toast, setToast] = useState({ show: false, msg: '' });

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} font-sans pb-12 transition-colors duration-300`}>
      
      <Toast message={toast.msg} isVisible={toast.show} />

      {/* --- HEADER --- */}
      <div className={`sticky top-0 z-30 border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <div className="container mx-auto px-4 h-16 flex items-center gap-3">
            <button className={`p-2 -ml-2 rounded-full cursor-pointer ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
               <ArrowLeft size={24} />
            </button>
            <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>My Profile</h1>
            <div className="ml-auto">
               <button 
                  onClick={() => setIsEditOpen(true)}
                  className="text-teal-600 text-sm font-bold bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
               >
                  Edit
               </button>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-xl space-y-6">
         
         {/* Profile Summary */}
         <div className="flex items-center gap-4 px-2">
            <div className={`w-20 h-20 rounded-full ${user.avatar} flex items-center justify-center text-3xl font-bold text-white shadow-lg relative`}>
               {user.name[0]}
               <button 
                 className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-full border-2 border-white hover:bg-teal-500 transition-colors cursor-pointer"
                 onClick={() => showToast("Profile photo update feature coming soon")}
               >
                  <Camera size={12} />
               </button>
            </div>
            <div>
               <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h2>
               <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {user.location}
               </div>
               <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <Phone size={12} /> {user.mobile}
               </div>
            </div>
         </div>

         {/* Digital Health Card */}
         <HealthCard user={user} onClick={() => setIsQrOpen(true)} />

         {/* Personal Details Grid */}
         <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
               <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <Droplet size={14} className="text-red-500" /> Blood Group
               </div>
               <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.bloodGroup}</div>
            </div>
            <div className={`p-4 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
               <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <User size={14} className="text-blue-500" /> Age / Gender
               </div>
               <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.age} <span className="text-sm text-slate-400 font-medium">/ {user.gender}</span></div>
            </div>
         </div>

         {/* Settings Sections */}
         <div className="space-y-4">
            <h3 className={`font-bold px-2 text-sm uppercase tracking-wide opacity-50 ${darkMode ? 'text-slate-400' : 'text-slate-900'}`}>App Settings</h3>
            <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
               
               <SettingsItem 
                  icon={<Bell size={20}/>} 
                  label="Notifications" 
                  subLabel={notifications ? "On" : "Off"} 
                  onClick={() => {
                    setNotifications(!notifications);
                    showToast(notifications ? "Notifications disabled" : "Notifications enabled");
                  }}
                  darkMode={darkMode}
               />
               
               <SettingsItem 
                  icon={<Globe size={20}/>} 
                  label="Language" 
                  subLabel={language} 
                  onClick={() => {
                    const newLang = language === "English" ? "Bengali" : "English";
                    setLanguage(newLang);
                    showToast(`Language changed to ${newLang}`);
                  }}
                  darkMode={darkMode}
               />
               
               <SettingsItem 
                  icon={darkMode ? <Sun size={20}/> : <Moon size={20}/>} 
                  label="Appearance" 
                  subLabel={darkMode ? "Dark Mode" : "Light Mode"} 
                  onClick={() => {
                    setDarkMode(!darkMode);
                    showToast(`Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`);
                  }}
                  darkMode={darkMode}
               />
            </div>

            <h3 className={`font-bold px-2 text-sm uppercase tracking-wide opacity-50 ${darkMode ? 'text-slate-400' : 'text-slate-900'}`}>Support & Security</h3>
            <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
               <SettingsItem 
                  icon={<Shield size={20}/>} 
                  label="Privacy & Security" 
                  onClick={() => setIsSecurityOpen(true)}
                  darkMode={darkMode}
               />
               <SettingsItem 
                  icon={<HelpCircle size={20}/>} 
                  label="Help & Support" 
                  onClick={() => setIsSupportOpen(true)}
                  darkMode={darkMode}
               />
               <SettingsItem 
                  icon={<LogOut size={20}/>} 
                  label="Logout" 
                  isDestructive 
                  onClick={() => {
                    if(window.confirm("Are you sure you want to logout?")) {
                      showToast("Logged out successfully");
                    }
                  }}
                  darkMode={darkMode}
               />
            </div>
         </div>

         <div className="text-center text-xs text-slate-300 py-4 font-medium">
            Version 1.2.0 • Build 4522
         </div>

      </div>

      <EditProfileModal 
         isOpen={isEditOpen} 
         onClose={() => setIsEditOpen(false)} 
         user={user} 
         onSave={(newData) => {
            setUser(newData);
            showToast("Profile updated successfully");
         }} 
         darkMode={darkMode}
      />

      <QrModal 
         isOpen={isQrOpen} 
         onClose={() => setIsQrOpen(false)} 
         user={user} 
         darkMode={darkMode}
      />

      <SecurityModal 
         isOpen={isSecurityOpen} 
         onClose={() => setIsSecurityOpen(false)} 
         showToast={showToast} 
         darkMode={darkMode}
      />

      <SupportModal 
         isOpen={isSupportOpen} 
         onClose={() => setIsSupportOpen(false)} 
         showToast={showToast} 
         darkMode={darkMode}
      />

    </div>
  );
}