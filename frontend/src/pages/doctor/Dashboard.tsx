import DashboardStats from '../../components/doctor/DashboardStats';
import AppointmentList from '../../components/doctor/AppointmentList';
import { Layout } from '../../components/doctor/Layout';

const mockAppointments = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Doe',
    date: '2024-03-15',
    time: '09:00 AM',
    status: 'scheduled' as const,
    reason: 'Regular checkup'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Jane Smith',
    date: '2024-03-15',
    time: '10:30 AM',
    status: 'reschedule-requested' as const,
    reason: 'Follow-up consultation'
  }
];

export default function DoctorDashboard() {
  const handleAppointmentStatusUpdate = (id: string, status: string) => {
    console.log('Updating appointment status:', id, status);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentList
            appointments={mockAppointments}
            onStatusUpdate={handleAppointmentStatusUpdate}
          />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Prescription created for John Doe</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Lab report reviewed for Jane Smith</p>
                  <p className="text-xs text-gray-400">4 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}