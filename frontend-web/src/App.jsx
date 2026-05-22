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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminRoles from './pages/admin/AdminRoles';

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          user ? (
            <Navigate to={user.role === 'admin' ? "/admin/dashboard" : "/home"} replace />
          ) : (
            <LoginPage />
          )
        } />
        <Route path="/register" element={
          user ? (
            user.role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <RegisterPage />
          )
        } />
        <Route path="/success" element={<SuccessPage />} />
               
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage currentUser={user} />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/calendar" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCalendar />
          </ProtectedRoute>
        } />
        <Route path="/admin/roles" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoles />
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