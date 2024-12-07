import { useState } from 'react';
import SearchBar from '../../components/doctor/SearchBar';
import MedicalRecordForm from '../../components/doctor/MedicalRecordForm';
import { FileText, Download, Share2 } from 'lucide-react';
import type { MedicalRecord } from '../../types/doctor/index';

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Doe',
    date: '2024-03-15',
    diagnosis: 'Upper respiratory infection',
    treatment: 'Prescribed antibiotics and rest',
    notes: 'Follow up in 1 week if symptoms persist'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Jane Smith',
    date: '2024-03-14',
    diagnosis: 'Migraine',
    treatment: 'Prescribed pain medication',
    notes: 'Recommended lifestyle changes and stress management'
  }
];

export default function MedicalRecords() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState(mockRecords);
  const [filteredRecords, setFilteredRecords] = useState(mockRecords);

  const handleSearch = (query: string) => {
    const filtered = records.filter(
      (record) =>
        record.patientName.toLowerCase().includes(query.toLowerCase()) ||
        record.patientId.toLowerCase().includes(query.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecords(filtered);
  };

  const handleCreateRecord = (data: any) => {
    const newRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setRecords([newRecord, ...records]);
    setFilteredRecords([newRecord, ...records]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#0B8FAC] text-white px-4 py-2 rounded-md hover:bg-[#0b8fac7a]"
        >
          New Record
        </button>
      </div>

      <MedicalRecordForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateRecord}
      />

      <div className="flex space-x-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by patient name, ID, or diagnosis..."
          />
        </div>
        <input
          type="date"
          className="border rounded-md px-3 py-2"
        />
      </div>

      <div className="grid gap-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">{record.patientName}</h3>
                  <span className="text-sm text-gray-500">({record.patientId})</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Record date: {record.date}</p>
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

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Diagnosis:</h4>
                <p className="text-sm text-gray-600">{record.diagnosis}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Treatment:</h4>
                <p className="text-sm text-gray-600">{record.treatment}</p>
              </div>
              {record.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes:</h4>
                  <p className="text-sm text-gray-600">{record.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}