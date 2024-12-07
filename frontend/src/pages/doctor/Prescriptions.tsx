import { useState } from 'react';
import SearchBar from '../../components/doctor/SearchBar';
import PrescriptionForm from '../../components/doctor/PrescriptionForm';
import { FileText, Download, Share2 } from 'lucide-react';
import type { Prescription } from '../../types/doctor/index';

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Doe',
    date: '2024-03-15',
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' }
    ],
    notes: 'Take with food'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Jane Smith',
    date: '2024-03-14',
    medications: [
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '5 days' }
    ],
    notes: 'Take for pain relief'
  }
];

export default function Prescriptions() {
  const [showForm, setShowForm] = useState(false);
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState(mockPrescriptions);

  const handleSearch = (query: string) => {
    const filtered = prescriptions.filter(
      (prescription) =>
        prescription.patientName.toLowerCase().includes(query.toLowerCase()) ||
        prescription.patientId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  };

  const handleCreatePrescription = (data: any) => {
    const newPrescription = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setPrescriptions([newPrescription, ...prescriptions]);
    setFilteredPrescriptions([newPrescription, ...prescriptions]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#0B8FAC] text-white px-4 py-2 rounded-md hover:bg-[#0b8fac7d]"
        >
          New Prescription
        </button>
      </div>

      <PrescriptionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreatePrescription}
      />

      <div className="flex space-x-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by patient name or ID..."
          />
        </div>
        <input
          type="date"
          className="border rounded-md px-3 py-2"
        />
      </div>

      <div className="grid gap-6">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">{prescription.patientName}</h3>
                  <span className="text-sm text-gray-500">({prescription.patientId})</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Prescribed on {prescription.date}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100">
                  <Download size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Medications:</h4>
              <ul className="space-y-2">
                {prescription.medications.map((med, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                  </li>
                ))}
              </ul>
            </div>

            {prescription.notes && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Notes:</h4>
                <p className="text-sm text-gray-600">{prescription.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}