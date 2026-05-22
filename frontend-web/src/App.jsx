import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';
import HomePage from './pages/HomePage';
import RequestDocument from './pages/RequestDocument';
import TrackStatus from './pages/TrackStatus';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/home" replace /> : <RegisterPage />} />
        <Route path="/success" element={<SuccessPage />} />
               
        <Route path="/home" element={
          <ProtectedRoute>
          <HomePage currentUser={user} />
          </ProtectedRoute>
        } />
         
        <Route path="/request-document" element={
            <ProtectedRoute allowedRoles={['student']}>
                <RequestDocument currentUser={user} />
            </ProtectedRoute>
        } />
        
        <Route path="/track-status" element={
            <ProtectedRoute allowedRoles={['student']}>
                <TrackStatus currentUser={user} />
            </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
            <ProtectedRoute>
                <ProfilePage currentUser={user} />
            </ProtectedRoute>
        } />
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