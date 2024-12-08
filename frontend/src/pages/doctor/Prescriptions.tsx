import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../components/doctor/SearchBar';
import PrescriptionForm from '../../components/doctor/PrescriptionForm';
import { FileText, Download, Share2 } from 'lucide-react';
import { Layout } from '../../components/doctor/Layout';

interface Prescription {
  _id: string;
  patient_id: {
    user_id: {
      name: string;
      profile_picture?: string;
    };
    _id: string;
  } | string;
  doctor_id: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  instructions: string;
  tests: string[];
  status: string;
  date_issued: string;
}

// Helper function to get patient name
const getPatientName = (prescription: Prescription) => {
  if (typeof prescription.patient_id === 'string') {
    return 'Patient ID: ' + prescription.patient_id;
  }
  return prescription.patient_id.user_id.name;
};

// Helper function to get patient ID
const getPatientId = (prescription: Prescription) => {
  if (typeof prescription.patient_id === 'string') {
    return prescription.patient_id;
  }
  return prescription.patient_id._id;
};

export default function Prescriptions() {
  const [showForm, setShowForm] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      console.log('Fetching with userId:', userId);

      if (!userId || !token) {
        throw new Error('Authentication information missing');
      }

      // First get the doctor's ID using the user ID
      const doctorResponse = await axios.get(
        `http://localhost:5000/api/doctors/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Doctor response:', doctorResponse.data);

      if (!doctorResponse.data || !doctorResponse.data._id) {
        throw new Error('Doctor information not found');
      }

      const doctorId = doctorResponse.data._id;
      console.log('Found doctorId:', doctorId);

      // Then fetch the prescriptions for this doctor
      const prescriptionsResponse = await axios.get(
        `http://localhost:5000/api/prescriptions/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Prescriptions response:', prescriptionsResponse.data);

      if (!prescriptionsResponse.data) {
        throw new Error('No prescriptions found');
      }

      setPrescriptions(prescriptionsResponse.data);
      setFilteredPrescriptions(prescriptionsResponse.data);
    } catch (err: any) {
      console.error('Error fetching prescriptions:', err);
      console.error('Error response:', err.response?.data);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch prescriptions. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = prescriptions.filter(
      (prescription) =>
        getPatientName(prescription).toLowerCase().includes(query.toLowerCase()) ||
        getPatientId(prescription).toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  };

  const handleCreatePrescription = async (data: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:5000/api/prescriptions',
        {
          ...data,
          patient_id: patientId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPrescriptions([response.data, ...prescriptions]);
      setFilteredPrescriptions([response.data, ...prescriptions]);
    } catch (err) {
      console.error('Error creating prescription:', err);
      setError('Failed to create prescription. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="space-y-6">
 
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#0B8FAC] text-white px-4 py-2 rounded-md hover:bg-[#0b8fac7d]"
          >
            + New Prescription
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
        </div>

        {filteredPrescriptions.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            No prescriptions found
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPrescriptions.map((prescription) => {
              console.log('Rendering prescription:', prescription);
              return (
                <div key={prescription._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">
                          {getPatientName(prescription)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({getPatientId(prescription)})
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Prescribed on {new Date(prescription.date_issued).toLocaleDateString()}
                      </p>
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

                  {prescription.instructions && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Instructions:</h4>
                      <p className="text-sm text-gray-600">{prescription.instructions}</p>
                    </div>
                  )}

                  {prescription.tests && prescription.tests.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Tests:</h4>
                      <ul className="space-y-1">
                        {prescription.tests.map((test, index) => (
                          <li key={index} className="text-sm text-gray-600">{test}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}