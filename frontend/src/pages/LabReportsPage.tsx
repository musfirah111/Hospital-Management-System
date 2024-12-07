import { useState, useEffect } from 'react';
import { FileText, Calendar, User } from 'lucide-react';
import { formatDate } from '../utils/date';
import { doctors } from '../data/doctors';
import SearchBar from '../components/SearchBar';
import { Layout } from '../components/Layout';
import axios from 'axios';

// Remove mock data and add interface
interface LabReport {
  _id: string;
  doctor_id: string;
  doctor_name: string;
  test_name: string;
  test_date: string;
  result: string;
  patient_id: string;
}

interface PatientResponse {
  id: string;
}

export default function LabReportsPage() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLoading] = useState(true);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('Dashboard mounted, userId:', userId); 
        const token = localStorage.getItem('authToken');

        if (!userId || !token) {
          console.error('User ID or token not found in localStorage');
          return;
        }

        const patientResponse = await axios.get<PatientResponse>(
          `http://localhost:5000/api/patients/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Patient response:', patientResponse.data);
        const patientId = patientResponse.data.id;

        const response = await axios.get<LabReport[]>(`http://localhost:5000/api/lab-reports/patient/${patientId}/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('API response:', response.data);
        
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch lab reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Handle download
  const handleDownload = async (reportId: string) => {
    try {
      const response = await axios.get(`/api/lab-reports/download/${reportId}`, {
        responseType: 'blob'
      });
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  // Update filtered reports to use real data
  const filteredReports = Array.isArray(reports) ? reports.filter(report => {
    const doctor = doctors.find(d => d.id === report.doctor_id);
    return doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.test_name.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  return (
    <Layout>
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
                <div key={report._id} className="bg-white rounded-xl shadow-lg p-6">
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
                      <span>Requested by: {report.doctor_name}</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Results</h4>
                      <p className="text-gray-600">{report.result}</p>
                    </div>

                    <button 
                      onClick={() => handleDownload(report._id)}
                      className="text-[#0B8FAC] hover:text-[#097a93] transition-colors"
                    >
                      Download Report
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}