import React from 'react';
import Background from './components/custom/Background';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Footer from './components/custom/Footer';
import CustomNavbar from './components/custom/Navbar';
import { RedirectToSignIn,RedirectToSignUp } from '@clerk/clerk-react';
import Onboarding from './pages/Onboarding';
import { Toaster } from 'react-hot-toast';

// Dashboard Pages
import Profile from './pages/Dashboard/Profile';
import MealLogger from './pages/Dashboard/MealLogger';
import CalorieTracker from './pages/Dashboard/CalorieTracker';
import WorkoutLogger from './pages/Dashboard/WorkoutLogger';
import WeightProgress from './pages/Dashboard/WeightProgress';
import WaterIntake from './pages/Dashboard/WaterIntake';
import SleepTracker from './pages/Dashboard/SleepTracker';
import MentalHealth from './pages/Dashboard/MentalHealth';
import SymptomChecker from './pages/Dashboard/SymptomChecker';
import MealPlanGenerator from './pages/Dashboard/MealPlanGenerator';
import HealthReports from './pages/Dashboard/HealthReports';
import Analytics from './pages/Dashboard/Analytics';
import Reminders from './pages/Dashboard/Reminders';
import VoiceAssistant from './pages/Dashboard/VoiceAssistant';
import Settings from './pages/Dashboard/Settings';

function App() {
  const location = useLocation();
  
  // Pages where we don't want navbar and footer
  const authPages = ['/Login', '/Signup','/Dashboard','/Onboarding'];
  const isAuthPage = authPages.includes(location.pathname) || location.pathname.startsWith('/Dashboard');

  return (
    <div className="relative min-h-screen overflow-hidden font-['Inter',sans-serif] onboarding-bg-effect">
      <Background />
      {!isAuthPage && <CustomNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Features" element={<Features />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Onboarding" element={<Onboarding/>}/>
        
        {/* Dashboard Routes */}
        <Route path="/Dashboard/profile" element={<Profile />} />
        <Route path="/Dashboard/meals" element={<MealLogger />} />
        <Route path="/Dashboard/calories" element={<CalorieTracker />} />
        <Route path="/Dashboard/workout" element={<WorkoutLogger />} />
        <Route path="/Dashboard/weight" element={<WeightProgress />} />
        <Route path="/Dashboard/water" element={<WaterIntake />} />
        <Route path="/Dashboard/sleep" element={<SleepTracker />} />
        <Route path="/Dashboard/mental-health" element={<MentalHealth />} />
        <Route path="/Dashboard/symptom-checker" element={<SymptomChecker />} />
        <Route path="/Dashboard/meal-plan" element={<MealPlanGenerator />} />
        <Route path="/Dashboard/reports" element={<HealthReports />} />
        <Route path="/Dashboard/analytics" element={<Analytics />} />
        <Route path="/Dashboard/reminders" element={<Reminders />} />
        <Route path="/Dashboard/voice-assistant" element={<VoiceAssistant />} />
        <Route path="/Dashboard/settings" element={<Settings />} />
      </Routes>
      {!isAuthPage && <Footer />}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  );
}

export default App;
