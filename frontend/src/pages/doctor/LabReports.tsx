import { useState } from 'react';
import SearchBar from '../../components/doctor/SearchBar';
import LabReportForm from '../../components/doctor/LabReportForm';
import { FileText, Download, Share2, Upload } from 'lucide-react';
import type { LabReport } from '../../types/doctor/index';
import { Layout } from '../../components/doctor/Layout';

const mockReports: LabReport[] = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Doe',
    date: '2024-03-15',
    testType: 'Blood Test',
    results: 'Normal blood count, slightly elevated cholesterol',
    status: 'completed',
    reportUrl: 'https://example.com/report1.pdf'
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Jane Smith',
    date: '2024-03-14',
    testType: 'X-Ray',
    results: 'No abnormalities detected',
    status: 'completed',
    reportUrl: 'https://example.com/report2.pdf'
  }
];

export default function LabReports() {
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState(mockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports);

  const handleSearch = (query: string) => {
    const filtered = reports.filter(
      (report) =>
        report.patientName.toLowerCase().includes(query.toLowerCase()) ||
        report.patientId.toLowerCase().includes(query.toLowerCase()) ||
        report.testType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleCreateReport = (data: any) => {
    const newReport = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setReports([newReport, ...reports]);
    setFilteredReports([newReport, ...reports]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Lab Reports</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0B8FAC] text-white px-4 py-2 rounded-md hover:bg-[#0b8fac9a]"
          >
            New Lab Report
          </button>
        </div>

        <LabReportForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateReport}
        />

        <div className="flex space-x-4">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by patient name, ID, or test type..."
            />
          </div>
          <select className="border rounded-md px-3 py-2">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            className="border rounded-md px-3 py-2"
          />
        </div>

        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">{report.patientName}</h3>
                    <span className="text-sm text-gray-500">({report.patientId})</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${report.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Test date: {report.date}</p>
                </div>
                {report.status === 'completed' && (
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100">
                      <Download size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100">
                      <Share2 size={20} />
                    </button>
                  </div>
                )}
                {report.status === 'pending' && (
                  <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md">
                    <Upload size={20} />
                    <span>Upload Results</span>
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Test Type:</h4>
                  <p className="text-sm text-gray-600">{report.testType}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Results:</h4>
                  <p className="text-sm text-gray-600">{report.results}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}