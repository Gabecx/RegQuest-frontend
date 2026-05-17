import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';
import HomePage from './pages/HomePage';
import RequestDocument from './pages/RequestDocument';
import TrackStatus from './pages/TrackStatus';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const { user } = useAuth();
  
  // mockup fallback
  const currentUser = user || {
    name: "System User",
    first_name: "User",
    last_name: "",
    email: "user@system.com",
    role: "Student",
    studentId: "N/A",
    year_level: "N/A",
    program: "N/A",
    notifications: 0
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/home" element={<HomePage currentUser={currentUser} />} />
        <Route path="/request-document" element={<RequestDocument currentUser={currentUser} />} />
        <Route path="/track-status" element={<TrackStatus currentUser={currentUser} />} />
        <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;