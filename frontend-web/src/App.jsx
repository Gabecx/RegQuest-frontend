import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';

import HomePage from './pages/student/HomePage';
import RequestDocument from './pages/student/RequestDocument';
import TrackStatus from './pages/student/TrackStatus';
import ProfilePage from './pages/student/ProfilePage';

import StaffDashboard from './pages/staff/Dashboard';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (user?.role === 'student') return '/student/home';
    if (user?.role === 'staff') return '/staff/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={getDashboardRoute()} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={getDashboardRoute()} replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        <Route path="/success" element={<SuccessPage />} />

        {/* Student Routes */}
        <Route
          path="/student/home"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <HomePage currentUser={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/request-document"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <RequestDocument currentUser={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/track-status"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <TrackStatus currentUser={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProfilePage currentUser={user} />
            </ProtectedRoute>
          }
        />

        {/* Staff Route */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard currentUser={user} />
            </ProtectedRoute>
          }
        />
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