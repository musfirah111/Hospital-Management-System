import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import DoctorList from './pages/DoctorList';
import DoctorDetails from './pages/DoctorDetails';
import PaymentPage from './pages/PaymentPage';
import AppointmentsPage from './pages/AppointmentsPage';
import LabReportsPage from './pages/LabReportsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage'; // Adjust the path as necessary
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/booking/:id" element={<PaymentPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/lab-reports" element={<LabReportsPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;