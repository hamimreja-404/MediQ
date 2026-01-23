import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  UploadCloud, 
  Download, 
  Share2, 
  Filter, 
  MoreVertical,
  FlaskConical,
  Plus,
  X,
  File,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const RECORDS = [
  {
    id: 1,
    type: "Prescription",
    doctor: "Dr. Anjali Sharma",
    specialty: "Cardiologist",
    clinic: "Heart Beat Clinic",
    date: "12 Oct, 2023",
    diagnosis: "Hypertension & Mild Fever",
    fileSize: "1.2 MB",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    type: "Lab Report",
    title: "Complete Blood Count (CBC)",
    lab: "City Path Labs",
    date: "10 Oct, 2023",
    tags: ["Blood", "Routine"],
    fileSize: "2.4 MB",
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: 3,
    type: "Prescription",
    doctor: "Dr. Rajesh K.",
    specialty: "Dentist",
    clinic: "Smile Care",
    date: "05 Sep, 2023",
    diagnosis: "Root Canal Treatment",
    fileSize: "850 KB",
    color: "bg-teal-100 text-teal-600"
  },
  {
    id: 4,
    type: "Lab Report",
    title: "X-Ray (Chest PA View)",
    lab: "Apollo Diagnostics",
    date: "01 Sep, 2023",
    tags: ["Radiology", "Chest"],
    fileSize: "5.1 MB",
    color: "bg-orange-100 text-orange-600"
  }
];

// --- COMPONENTS ---

const UploadModal = ({ isOpen, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsDone(true);
      setTimeout(onClose, 1500); // Close after success
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
           />
           <motion.div 
             initial={{ scale: 0.9, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.9, opacity: 0, y: 20 }}
             className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
           >
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-900">Upload Report</h3>
                 <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>

              {!isDone ? (
                <>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                     <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} />
                     </div>
                     <p className="font-bold text-slate-700">Tap to Browse</p>
                     <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 10MB)</p>
                  </div>
                  
                  <div className="mt-6">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Document Name</label>
                     <input type="text" placeholder="e.g. Blood Test - Oct 23" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500" />
                  </div>

                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full mt-6 bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isUploading ? "Uploading..." : "Save Record"}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={40} />
                   </div>
                   <h3 className="font-bold text-xl text-slate-900">Upload Successful!</h3>
                   <p className="text-slate-500 text-sm mt-2">Your report has been added to your records.</p>
                </div>
              )}
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---
export default function PatientRecords() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filter Logic
  const filteredRecords = RECORDS.filter(record => {
     const matchesTab = activeTab === 'All' || 
                        (activeTab === 'Prescriptions' && record.type === 'Prescription') ||
                        (activeTab === 'Reports' && record.type === 'Lab Report');
     const matchesSearch = (record.doctor || record.title || record.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase());
     return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white sticky top-0 z-30 border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                <ArrowLeft size={24} />
             </button>
             <h1 className="font-bold text-lg text-slate-800">My Medical Records</h1>
           </div>
           <button 
             onClick={() => setIsUploadOpen(true)}
             className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
           >
              <Plus size={20} />
           </button>
        </div>

        {/* --- SEARCH & TABS --- */}
        <div className="px-4 pb-4">
           {/* Search Bar */}
           <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by doctor, diagnosis..." 
                className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           {/* Tabs */}
           <div className="flex gap-2">
              {['All', 'Prescriptions', 'Reports'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      activeTab === tab 
                      ? 'bg-teal-600 text-white border-teal-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                   }`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* --- RECORDS LIST --- */}
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
         <AnimatePresence>
            {filteredRecords.length > 0 ? (
               filteredRecords.map(record => (
                  <motion.div 
                    key={record.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                     <div className="flex gap-4">
                        {/* Icon Box */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${record.color}`}>
                           {record.type === 'Prescription' ? <FileText size={24}/> : <FlaskConical size={24}/>}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start">
                              <h3 className="font-bold text-slate-900 truncate pr-2">
                                 {record.type === 'Prescription' ? record.diagnosis : record.title}
                              </h3>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{record.date}</span>
                           </div>
                           
                           <p className="text-xs text-slate-500 mt-1 truncate">
                              {record.type === 'Prescription' 
                                 ? `${record.doctor} • ${record.clinic}`
                                 : `${record.lab} • ${record.tags.join(', ')}`
                              }
                           </p>

                           <div className="flex items-center gap-4 mt-4">
                              <button className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
                                 <Download size={14} /> Download PDF
                              </button>
                              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                 <Share2 size={14} /> Share
                              </button>
                              <span className="text-[10px] text-slate-300 ml-auto font-medium">{record.fileSize}</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))
            ) : (
               <div className="text-center py-20 opacity-60">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                     <File size={32} className="text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-500">No records found.</p>
               </div>
            )}
         </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

    </div>
  );
}