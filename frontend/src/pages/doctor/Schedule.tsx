import { useState } from 'react';
import { DaySelector } from '../../components/doctor/schedule/DaySelector';
import { TimeSlotCard } from '../../components/doctor/schedule/TimeSlotCard';
import type { TimeSlot } from '../../types/doctor/schedule';

// Mock data - replace with actual data fetching
const mockTimeSlots: TimeSlot[] = [
  {
    time: '09:00 AM',
    appointments: [
      {
        id: '1',
        patientName: 'John Doe',
        time: '09:00 AM',
        duration: 30,
        type: 'Check-up',
        status: 'scheduled'
      }
    ]
  },
  {
    time: '10:00 AM',
    appointments: [
      {
        id: '2',
        patientName: 'Jane Smith',
        time: '10:00 AM',
        duration: 45,
        type: 'Consultation',
        status: 'completed'
      }
    ]
  },
  {
    time: '11:00 AM',
    appointments: []
  }
];

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600">Manage your daily appointments</p>
      </div>

      <DaySelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="space-y-4">
        {mockTimeSlots.map((slot) => (
          <TimeSlotCard key={slot.time} slot={slot} />
        ))}
      </div>
    </div>
  );
}