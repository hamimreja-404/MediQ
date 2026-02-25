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

import DoctorsList from './DoctorSearch/DoctorList.jsx'
import DoctorProfile from './DoctorSearch/DoctorDetails.jsx'


import BookAppointmentV2 from './Appointment-Booking/BookingPage.jsx'
import ProtectedRoute from '../ProtectedRoute.jsx'

//=== WITHOUT OTP AUTH FILES ===//
import RegisterDoctor from './Auth/WithoutOTP/Onboarding.jsx'
import RegisterPatient from './Auth/WithoutOTP/Register.jsx'
import Login from './Auth/WithoutOTP/Login.jsx'
import PatientDashboardV2 from './Patient_Interface/PatientDashboard.jsx'
import DoctorDashboard from './Doctor/Dashboard.jsx'
import LiveDesk from './Doctor/liveDesk.jsx'

function App() {
  return (
    // LIGHT MODE DEFAULT: No "dark" class. 
    // Set base background to slate-50 (very light grey) and text to slate-900 (dark grey)
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <Routes>
        <Route element={<MainLayout />} className="mt-10">
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />


          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />

          <Route path="/onboarding" element={<RegisterDoctor />} />
          <Route path="/register" element={<RegisterPatient />} />

          <Route path="/book-appointment" element={<BookAppointmentV2 />} />

        </Route>
          <Route path="/patient/dashboard/:patientId" element={<PatientDashboardV2 />} />
          <Route path="/doctor/dashboard/:doctorId" element={<DoctorDashboard />} />
          <Route path="/doctor/live-desk/:doctorId" element={<LiveDesk />} />
      </Routes>
    </div>
  )
}

export default App