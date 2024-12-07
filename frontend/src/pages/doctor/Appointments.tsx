import { useState } from 'react';
import SearchBar from '../../components/doctor/SearchBar';
import AppointmentList from '../../components/doctor/AppointmentList';
import { Layout } from '../../components/doctor/Layout';

const mockAppointments = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Doe',
    date: '2024-03-15',
    time: '09:00 AM',
    status: 'scheduled',
    reason: 'Regular checkup'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Jane Smith',
    date: '2024-03-15',
    time: '10:30 AM',
    status: 'reschedule-requested',
    reason: 'Follow-up consultation'
  },
  {
    id: '3',
    patientId: 'P003',
    patientName: 'Mike Johnson',
    date: '2024-03-15',
    time: '02:00 PM',
    status: 'scheduled',
    reason: 'Vaccination'
  }
] as const;
export default function Appointments() {
  const [filteredAppointments, setFilteredAppointments] = useState<typeof mockAppointments[number][]>([...mockAppointments]);

  const handleSearch = (query: string) => {
    const filtered = mockAppointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.patientId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    console.log('Updating appointment status:', id, status);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by patient name or ID..."
            />
          </div>
          <select className="border rounded-md px-3 py-2">
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="reschedule-requested">Reschedule Requested</option>
          </select>
          <input
            type="date"
            className="border rounded-md px-3 py-2"
          />
        </div>

        <AppointmentList
          appointments={filteredAppointments}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </Layout>
  );
}