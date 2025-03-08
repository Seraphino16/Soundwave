// @ts-ignore
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/styles/App.css';
import Home from './pages/Home';
import AlertTestPage from './pages/AlertTestPage';
import Navbar from './components/header/Navbar';
import Footer from './components/footer/Footer';
import Albums from 'pages/Albums';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light-bg">
        <Navbar />
        <div className="flex-grow pt-32 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/alert" element={<AlertTestPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}