import { useContext, useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../utils/date';
import { doctors } from '../data/doctors';
import { Layout } from '../components/Layout';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface MedicalRecord {
  id: string;
  doctor_id: string;
  diagnosis: string;
  date: string;
}

interface PatientResponse {
  id: string;
}

export default function MedicalRecordsPage() {
  const { user } = useContext(AuthContext);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('User object in MedicalRecordsPage:', user);
    const fetchMedicalRecords = async () => {
      if (!user || !user.id) {
        console.error('User ID is null, cannot fetch medical records.');
        setLoading(false);
        return;
      }

      try {
        const userId = localStorage.getItem('userId');
        console.log('---------------------------Dashboard mounted, userId:', userId);
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

        const recordsResponse = await axios.get<MedicalRecord[]>(
          `http://localhost:5000/api/medical-records/patient/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Fetched medical records:', recordsResponse.data);
        setMedicalRecords(recordsResponse.data);
        console.log('Medical records state updated:', medicalRecords);
      }
      catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching medical records:', error.response?.data || error.message);
        }
        else {
          console.error('Unexpected error:', error);
        }
      }
      finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  useEffect(() => {
    console.log('Medical records state updated:', medicalRecords);
  }, [medicalRecords]);

  return (
    <Layout>
      <div className="min-h-screen bg-[#D2EBE7] pb-6">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Medical Records</h1>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-6">
              {Array.isArray(medicalRecords) && medicalRecords.length === 0 ? (
                <p>No medical records found.</p>
              ) : (
                Array.isArray(medicalRecords) && medicalRecords.map((record) => {
                  const doctor = doctors.find(d => d.id === record.doctor_id);
                  if (!doctor) {
                    console.error(`Doctor not found for ID: ${record.doctor_id}`);
                    //return null;
                  }

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
                })
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}