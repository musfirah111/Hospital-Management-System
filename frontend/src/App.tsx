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

// Admin imports
import { Sidebar } from './components/admin/layout/Sidebar';
import { Header } from './components/admin/layout/Header';
import { DoctorsPage } from './pages/admin/DoctorsPage';
import { PatientsPage } from './pages/admin/PatientsPage';
import { AdminAppointmentsPage } from './pages/admin/AppointmentsPage';
import { DepartmentsPage } from './pages/admin/DepartmentsPage';
import { ReviewsPage } from './pages/admin/ReviewsPage';
import { DashboardPage } from './pages/admin/DashboardPage';

// Doctor imports
import DoctorSidebar from './components/doctor/Sidebar';
import DoctorDashboard from './pages/doctor/Dashboard';
import Appointments from './pages/doctor/Appointments';
import Schedule from './pages/doctor/Schedule';
import Profile from './pages/doctor/Profile';
import Prescriptions from './pages/doctor/Prescriptions';
import MedicalRecords from './pages/doctor/MedicalRecords';
import LabReports from './pages/doctor/LabReports';
import Chat from './pages/doctor/Chat';
import { DoctorHeader } from './components/doctor/layout/Header';

// Protected route component
interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext) as { user: any };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

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
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
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

          {/* Protected Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
            <Route path="/" element={<DoctorDashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/records" element={<MedicalRecords />} />
            <Route path="/lab-reports" element={<LabReports />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/appointments" element={<AdminAppointmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;