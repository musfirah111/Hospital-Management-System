import { Calendar, Clock, User } from 'lucide-react';
import { useState } from 'react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
  reason: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusUpdate: (id: string, status: 'completed' | 'rescheduled') => void;
}

export default function AppointmentList({ appointments, onStatusUpdate }: AppointmentListProps) {
  const [filter, setFilter] = useState('all');

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const statusCounts = {
    all: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    'reschedule-requested': appointments.filter(a => a.status === 'reschedule-requested').length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-green-100 text-green-800',
      'reschedule-requested': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Appointments</h2>
      </div>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setFilter('all')} className="text-blue-600">
          All {statusCounts.all}
        </button>
        <button onClick={() => setFilter('scheduled')} className="text-gray-600">
          Scheduled {statusCounts.scheduled}
        </button>
        <button onClick={() => setFilter('completed')} className="text-gray-600">
          Completed {statusCounts.completed}
        </button>
        {/* Add more status buttons as needed */}
      </div>
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">{appointment.patientName}</h3>
                  <p className="text-sm text-gray-500">#{appointment.patientId}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            <div className="flex space-x-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {appointment.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {appointment.time}
              </div>
            </div>
            {appointment.status === 'scheduled' && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => onStatusUpdate(appointment.id, 'completed')}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                >
                  Mark as Complete
                </button>
                <button
                  onClick={() => onStatusUpdate(appointment.id, 'rescheduled')}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                >
                  Reschedule
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}