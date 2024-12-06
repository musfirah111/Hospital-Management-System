import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../utils/date';
import { doctors } from '../data/doctors';
import SearchBar from '../components/SearchBar';
import { Layout } from '../components/Layout';

// Mock prescriptions data
const prescriptions = [
  {
    id: '1',
    doctor_id: '1',
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days'
      },
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed',
        duration: '5 days'
      }
    ],
    instructions: 'Take with food. Complete the full course of antibiotics.',
    date: '2024-03-15'
  }
];

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const doctor = doctors.find(d => d.id === prescription.doctor_id);
    const medications = prescription.medications.map(m => m.name.toLowerCase());
    return doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medications.some(med => med.includes(searchQuery.toLowerCase()));
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Current Prescriptions</h1>

        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by doctor name or medication..."
          />
        </div>

        <div className="space-y-6">
          {filteredPrescriptions.map((prescription) => {
            const doctor = doctors.find(d => d.id === prescription.doctor_id);

            return (
              <div key={prescription.id} className="bg-white rounded-xl shadow-lg p-6">
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
                        {formatDate(prescription.date)}
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {prescription.medications.map((medication, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Dosage:</span>
                              <p className="font-medium">{medication.dosage}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Frequency:</span>
                              <p className="font-medium">{medication.frequency}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <p className="font-medium">{medication.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {prescription.instructions && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Instructions</h4>
                          <p className="text-blue-800">{prescription.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}