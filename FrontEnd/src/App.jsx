import React from "react";
import Background from "./components/custom/Background";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App(){
  return (
    <div>
      <Background/>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Features" element={<Features/>}/>
        <Route path="/About" element={<About/>}/>
        <Route path="/Contact" element={<Contact/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
      </Routes>
    </div>
  )
}

export default App;