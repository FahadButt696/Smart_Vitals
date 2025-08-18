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
import MobileErrorBoundary from './components/custom/MobileErrorBoundary';

// Dashboard Pages
import Profile from './pages/Dashboard/Profile';
import MealLogger from './pages/Dashboard/MealLoggerEnhanced';
import WaterTracker from './pages/Dashboard/WaterTracker';
import SleepTracker from './pages/Dashboard/SleepTracker';
import WeightTracker from './pages/Dashboard/WeightTracker';
import WorkoutTracker from './pages/Dashboard/WorkoutTracker';
import SymptomChecker from './pages/Dashboard/SymptomChecker';
import AIAssistant from './pages/Dashboard/AIAssistant';
import Analytics from './pages/Dashboard/Analytics';
import Reports from './pages/Dashboard/Reports';
import MentalHealth from './pages/Dashboard/MentalHealth';
import MealPlanGenerator from './pages/Dashboard/MealPlanGenerator';
import CalorieTracker from './pages/Dashboard/CalorieTracker';

function App() {
  const location = useLocation();
  
  // Pages where we don't want navbar and footer
  const authPages = ['/Login', '/Signup','/Dashboard','/onboarding'];
  const isAuthPage = authPages.includes(location.pathname) || location.pathname.startsWith('/Dashboard');

  return (
    <MobileErrorBoundary>
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
          <Route path="/onboarding" element={<Onboarding/>}/>
          
          {/* Dashboard Routes - Nested within Dashboard component */}
          <Route path="/Dashboard" element={<Dashboard />}>
            <Route path="profile" element={<Profile />} />
            <Route path="meals" element={<MealLogger />} />
            <Route path="calorie-tracker" element={<CalorieTracker />} />
            <Route path="water" element={<WaterTracker />} />
            <Route path="sleep" element={<SleepTracker />} />
            <Route path="weight" element={<WeightTracker />} />
            <Route path="workout" element={<WorkoutTracker />} />
            <Route path="symptom-checker" element={<SymptomChecker />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="mental-health" element={<MentalHealth />} />
            <Route path="meal-plan" element={<MealPlanGenerator />} />
          </Route>
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
    </MobileErrorBoundary>
  );
}

export default App;