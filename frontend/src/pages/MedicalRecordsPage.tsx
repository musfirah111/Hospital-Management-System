import React from 'react';
import { Calendar} from 'lucide-react';
import { formatDate } from '../utils/date';
import { doctors } from '../data/doctors';

// Mock medical records data
const medicalRecords = [
  {
    id: '1',
    doctor_id: '1',
    diagnosis: 'Upper Respiratory Tract Infection',
    treatment: ['1'], // Reference to prescription IDs
    date: '2024-03-10'
  }
];

export default function MedicalRecordsPage() {
  return (
    <div className="min-h-screen bg-[#D2EBE7] pb-6">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Medical Records</h1>

        <div className="space-y-6">
          {medicalRecords.map((record) => {
            const doctor = doctors.find(d => d.id === record.doctor_id);
            
            return (
              <div key={record.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor?.image}
                    alt={doctor?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{doctor?.name}</h3>
                        <p className="text-[#0B8FAC]">{doctor?.specialization}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(record.date)}
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Diagnosis</h4>
                        <p className="text-gray-600">{record.diagnosis}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Treatment</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600">
                            Prescribed medications can be viewed in the Prescriptions section.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}