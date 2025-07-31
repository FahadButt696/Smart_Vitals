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

function App() {
  const location = useLocation();
  
  // Pages where we don't want navbar and footer
  const authPages = ['/Login', '/Signup','/Dashboard'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="relative min-h-screen overflow-hidden">
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
        <Route path="/Onboarding"element={<Onboarding/>}/>
      </Routes>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
