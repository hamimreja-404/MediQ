// src/Components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  
  // Light Mode Colors: Active = Teal-600, Inactive = Slate-600
  const linkClass = (path) => `transition-colors ${isActive(path) ? 'text-teal-600 font-bold' : 'hover:text-teal-600 text-slate-600'}`;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-teal-500 text-white p-1.5 rounded-lg shadow-lg group-hover:rotate-12 transition-transform">
            <Stethoscope size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            MediQ
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 ring-teal-500 w-1/3 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search doctors..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/features" className={linkClass('/features')}>Features</Link>
          <Link to="/pricing" className={linkClass('/pricing')}>Pricing</Link>
          <Link to="/about" className={linkClass('/about')}>About</Link>
          <Link to="/faq" className={linkClass('/faq')}>FAQ</Link>
        </div>

        {/* Actions (Login Only) */}
        <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
              <Link to="/login" >Login</Link>
              
            </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-lg"
          >
            <div className="p-4 space-y-4 text-center font-medium text-slate-700">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-slate-50 rounded">Home</Link>
              <Link to="/features" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-slate-50 rounded">Features</Link>
              <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-slate-50 rounded">Pricing</Link>
              <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-slate-50 rounded">FAQ</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}