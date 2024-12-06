import React, { useState } from 'react';
import { FileText, Calendar, User } from 'lucide-react';
import { formatDate } from '../utils/date';
import { doctors } from '../data/doctors';
import SearchBar from '../components/SearchBar';

// Mock lab reports data
const labReports = [
  {
    id: '1',
    doctor_id: '1',
    test_name: 'Complete Blood Count',
    test_date: '2024-03-12',
    result: 'Normal range. No abnormalities detected.'
  },
  {
    id: '2',
    doctor_id: '2',
    test_name: 'Blood Glucose Test',
    test_date: '2024-03-14',
    result: 'Fasting glucose levels within normal range.'
  }
];

export default function LabReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = labReports.filter(report => {
    const doctor = doctors.find(d => d.id === report.doctor_id);
    return doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           report.test_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#D2EBE7] pb-6">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Medical Lab Reports</h1>

        <div className="mb-6">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Search by test name or doctor..."
          />
        </div>

        <div className="space-y-6">
          {filteredReports.map((report) => {
            const doctor = doctors.find(d => d.id === report.doctor_id);
            
            return (
              <div key={report.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[#0B8FAC]">
                    <FileText className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold">{report.test_name}</h3>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(report.test_date)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Requested by: {doctor?.name}</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Results</h4>
                    <p className="text-gray-600">{report.result}</p>
                  </div>

                  <button className="text-[#0B8FAC] hover:text-[#097a93] transition-colors">
                    Download Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}