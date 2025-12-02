import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './assets/styles/App.css';
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumDetail from "./pages/AlbumDetail";
import Artists from "./pages/Artists";
import AlertTestPage from "./pages/AlertTestPage";
import Navbar from "./components/header/Navbar";
import Auth from './pages/Auth';
import ArtistDetail from "pages/ArtistDetails";
import HomeLoggedOff from 'pages/HomeLoggedOff';
import EmailAlreadyExists from "./pages/EmailAlreadyExists";
import AdminPanel from './pages/AdminPanel';
import UserManagement from './pages/UserManagement';
import AdminDashboard from './pages/AdminDashboard';
import Events from './pages/Events';
import Footer from "./components/footer/Footer";
import Settings from "pages/Settings";
import UserProfile from './pages/UserProfile';
import LegalNotice from './pages/LegalNotice';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light-bg">
        <Navbar />
        <div className="flex-grow pt-32 pb-20">
          <Routes>
            <Route path="/" element={<HomeLoggedOff />} />
            <Route path="/home" element={<Home />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/albums/:id" element={<AlbumDetail />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/alert" element={<AlertTestPage />} />
            <Route path="/auth" element={<Auth />} /> 
            <Route path="/error-email-already-exists" element={<EmailAlreadyExists />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/legal" element={<LegalNotice />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}