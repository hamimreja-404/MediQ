// src/App.jsx
import { Routes, Route } from 'react-router-dom'

// Import Layout
import MainLayout from './Layout.jsx'

// Import Pages
import HomePage from './Pages/Home.jsx'
import Features from './Pages/Features.jsx'
import Pricing from './Pages/Pricing_1.jsx'
import AboutPage from './Pages/About.jsx'
import FAQ from './Pages/FAQ_1.jsx'
import Login from './Auth/Login.jsx'
import RegisterDoctor from './Auth/Onboarding.jsx'
import RegisterPatient from './Auth/Register.jsx'
function App() {
  return (
    // LIGHT MODE DEFAULT: No "dark" class. 
    // Set base background to slate-50 (very light grey) and text to slate-900 (dark grey)
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<RegisterDoctor />} />
          <Route path="/register" element={<RegisterPatient />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App