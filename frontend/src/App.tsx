import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DoctorList from './pages/DoctorList';
import DoctorDetails from './pages/DoctorDetails';
import PaymentPage from './pages/PaymentPage';
import AppointmentsPage from './pages/AppointmentsPage';
import LabReportsPage from './pages/LabReportsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import Dashboard from './pages/Dashboard';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Protected route component
interface ProtectedRouteProps {
  allowedRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const { user } = useContext(AuthContext) as { user: any };

  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // If user is not a patient, redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the outlet (child routes) if authorized
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute allowedRole="Patient" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<DoctorList />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="/booking/:id" element={<PaymentPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/lab-reports" element={<LabReportsPage />} />
            <Route path="/medical-records" element={<MedicalRecordsPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

