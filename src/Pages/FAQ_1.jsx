import React, { useState } from 'react';
import { 
  Search, ChevronDown, ChevronUp, 
  MessageCircle, Mail, Phone,
  HelpCircle, FileQuestion
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FAQ ITEM COMPONENT ---
const AccordionItem = ({ q, a, isOpen, onClick }) => {
  return (
    <motion.div 
      initial={false}
      className="border-b border-slate-200 overflow-hidden"
    >
      <button 
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-teal-600' : 'text-slate-800 group-hover:text-teal-500'}`}>
          {q}
        </span>
        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-6 text-slate-600 leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' | 'doctor'
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  // Hardcoded Questions
  const questions = {
    patients: [
      {
        q: "Is there a fee to book an appointment?",
        a: "Yes, there is a nominal platform fee of ₹5 per application/booking. This ensures your slot is secured and helps us maintain the server infrastructure."
      },
      {
        q: "How does the Live Queue work?",
        a: "Once you book, you get a Token Number (e.g., #12). On the appointment day, open the app to see the 'Current Serving Token'. If the doctor is seeing #8, you know you have some time before you need to leave home."
      },
      {
        q: "Can I cancel my appointment?",
        a: "Yes, you can cancel up to 1 hour before the scheduled time. However, the ₹5 platform fee is non-refundable."
      },
      {
        q: "Do I need to download an app?",
        a: "No! MediQ works perfectly on your phone's browser (Chrome, Safari). However, downloading the app gives you better notifications."
      },
      {
        q: "Where can I see my prescription?",
        a: "After your visit, the doctor will upload your prescription. You can find it in the 'My Records' section of your dashboard and download it as a PDF."
      }
    ],
    doctors: [
      {
        q: "What are the subscription charges?",
        a: "We have three tiers: Starter (₹0/mo), Professional (₹499/mo), and Multi-Clinic (₹999/mo). You can start for free and upgrade when you need more features."
      },
      {
        q: "Do I need special hardware?",
        a: "No. You can run the MediQ dashboard on any laptop, tablet, or even a smartphone. A reliable internet connection is recommended for the Live Queue to sync instantly."
      },
      {
        q: "Can I manage walk-in patients?",
        a: "Absolutely. The 'Walk-In Manager' allows you to add patients who come directly to the clinic. They will be assigned a token number and slotted into the existing queue automatically."
      },
      {
        q: "Is patient data secure?",
        a: "Yes. We use 256-bit encryption and comply with healthcare data standards. Your patient data is yours; we do not sell or share it with third parties."
      }
    ]
  };

  // Filter Logic
  const currentQuestions = activeTab === 'patient' ? questions.patients : questions.doctors;
  const filteredQuestions = currentQuestions.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOpenIndex(null); // Close all when switching tabs
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* --- HEADER --- */}
      <section className="pt-32 pb-16 bg-white px-4">
         <div className="container mx-auto text-center max-w-3xl">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mb-6 border border-teal-200">
                <HelpCircle size={14} />
                <span>Help Center</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-slate-900">How can we help you?</h1>
             
             {/* Search Bar */}
             <div className="relative max-w-xl mx-auto mb-10 group">
               <div className="absolute inset-0 bg-teal-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
               <div className="relative bg-white rounded-full shadow-lg flex items-center px-6 py-4 border border-slate-200 focus-within:ring-2 ring-teal-500 transition-all">
                 <Search className="text-slate-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Search for answers (e.g., 'refund', 'queue')..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-transparent border-none outline-none ml-4 text-slate-700 placeholder:text-slate-400"
                 />
               </div>
             </div>
           </motion.div>
         </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-12 px-4 bg-slate-50">
         <div className="container mx-auto max-w-3xl">
           
           {/* Tabs */}
           <div className="flex justify-center mb-12">
             <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm inline-flex">
               <button 
                 onClick={() => handleTabChange('patient')}
                 className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'patient' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 For Patients
               </button>
               <button 
                 onClick={() => handleTabChange('doctor')}
                 className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'doctor' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 For Doctors
               </button>
             </div>
           </div>

           {/* Questions List */}
           <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 min-h-100">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((item, index) => (
                  <AccordionItem 
                    key={index}
                    q={item.q}
                    a={item.a}
                    isOpen={openIndex === index}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  />
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <FileQuestion size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No matching questions found</h3>
                  <p className="text-slate-500">Try searching for something else or contact support.</p>
                </div>
              )}
           </div>
         </div>
      </section>

      {/* --- CONTACT CTA --- */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4 text-center">
           <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-10 md:p-16 border border-slate-200">
             <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <MessageCircle size={32} />
             </div>
             <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h2>
             <p className="text-slate-600 mb-8 max-w-lg mx-auto">Can't find the answer you're looking for? Please chat to our friendly team.</p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="flex items-center justify-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20">
                 <Mail size={18} /> Contact Support
               </button>
               <button className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all">
                 <Phone size={18} /> +91 98765 43210
               </button>
             </div>
           </div>
         </div>
      </section>

    </div>
  );
}