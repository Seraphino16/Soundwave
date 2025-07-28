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
import AdminPanel from './pages/AdminPanel';
import UserManagement from './pages/UserManagement';

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
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}