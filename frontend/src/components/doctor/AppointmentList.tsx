import { Calendar, Clock, User, MailIcon } from 'lucide-react';
import { useState } from 'react';

interface Appointment {
  _id: string;
  patient_id: {
    _id: string;
    user_id: {
      _id: string;
      name: string;
      email: string;
      profile_picture: string;
    };
    address: string;
    emergency_contact: {
      name: string;
      phone: string;
      relationship: string;
      _id: string;
    };
  };
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reminder_sent: boolean;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusUpdate: (id: string, status: string) => void;
}

export default function AppointmentList({ appointments, onStatusUpdate }: AppointmentListProps) {
  const [filter, setFilter] = useState('all');
  
  const filteredAppointments = appointments.filter(appointment => 
    filter === 'all' ? true : appointment.status === filter
  );

  const statusCounts = {
    all: appointments.length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    'reschedule-requested': appointments.filter(a => a.status === 'Rescheduled').length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Scheduled: 'bg-green-100 text-green-800',
      'Rescheduled': 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Appointments</h2>
      </div>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setFilter('all')} className={`text-${filter === 'all' ? 'blue' : 'gray'}-600`}>
          All {statusCounts.all}
        </button>
        <button onClick={() => setFilter('Scheduled')} className={`text-${filter === 'Scheduled' ? 'blue' : 'gray'}-600`}>
          Scheduled {statusCounts.scheduled}
        </button>
        <button onClick={() => setFilter('Completed')} className={`text-${filter === 'Completed' ? 'blue' : 'gray'}-600`}>
          Completed {statusCounts.completed}
        </button>
        <button onClick={() => setFilter('Cancelled')} className={`text-${filter === 'Cancelled' ? 'blue' : 'gray'}-600`}>
          Cancelled {statusCounts.cancelled}
        </button>
        <button onClick={() => setFilter('Rescheduled')} className={`text-${filter === 'Rescheduled' ? 'blue' : 'gray'}-600`}>
          Rescheduled {statusCounts['reschedule-requested']}
        </button>
      </div>
      <div className="mb-4">
      </div>
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-full">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{appointment.patient_id?.user_id?.name || 'N/A'}</h3>
                  <div className="space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MailIcon className="w-4 h-4 mr-1" />
                      {appointment.patient_id?.user_id?.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            <div className="flex space-x-4 mt-4 text-md text-gray-500"> {/* Increased font size for date and time */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(appointment.appointment_date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {appointment.appointment_time}
              </div>
            </div>
            {appointment.status === 'Scheduled' && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => onStatusUpdate(appointment._id, 'completed')}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                >
                  Mark as Complete
                </button>
                <button
                  onClick={() => onStatusUpdate(appointment._id, 'rescheduled')}
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