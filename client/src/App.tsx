// @ts-ignore
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/styles/App.css';
import Home from './pages/Home';
import AlertTestPage from './pages/AlertTestPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alert" element={<AlertTestPage />} />
      </Routes>
    </Router>
  );
}