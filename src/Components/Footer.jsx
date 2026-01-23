// src/Components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 py-12 border-t border-slate-200 text-slate-800 transition-colors duration-300">
       <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
             <div className="col-span-1 md:col-span-1">
                <Link to="/" className="flex items-center gap-2 mb-4">
                   <div className="bg-teal-500 text-white p-1 rounded">
                      <Stethoscope size={20} />
                   </div>
                   <span className="text-xl font-bold">MediQ</span>
                </Link>
                <p className="text-slate-500 text-sm">Simplifying healthcare access for everyone, everywhere.</p>
             </div>
             
             <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                   <li><Link to="/features" className="hover:text-teal-500 transition-colors">Features</Link></li>
                   <li><Link to="/pricing" className="hover:text-teal-500 transition-colors">Pricing</Link></li>
                   <li><Link to="/faq" className="hover:text-teal-500 transition-colors">FAQ</Link></li>
                </ul>
             </div>
             
             <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                   <li><Link to="/about" className="hover:text-teal-500 transition-colors">About Us</Link></li>
                   <li><Link to="/careers" className="hover:text-teal-500 transition-colors">Careers</Link></li>
                   <li><Link to="/contact" className="hover:text-teal-500 transition-colors">Contact</Link></li>
                </ul>
             </div>
             
             <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                   <li><Link to="/privacy" className="hover:text-teal-500 transition-colors">Privacy Policy</Link></li>
                   <li><Link to="/terms" className="hover:text-teal-500 transition-colors">Terms of Service</Link></li>
                </ul>
             </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-slate-400 text-sm">
             &copy; {currentYear} MediQ Healthcare Systems. All rights reserved.
          </div>
       </div>
    </footer>
  );
}