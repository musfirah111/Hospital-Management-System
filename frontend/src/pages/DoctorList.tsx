import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { Layout } from '../components/Layout';
import axios from 'axios';
import { Doctor } from '../types/index';
import DoctorCard from '../components/DoctorCard';

const doctorImages = {
  male: {
    default: [
      'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg',
      'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg'
    ],
    jaffar: 'https://img.freepik.com/free-photo/young-handsome-physician-medical-robe-with-stethoscope_1303-17818.jpg',
    ahmed: 'https://img.freepik.com/free-photo/medical-workers-covid-19-vaccination-concept-confident-professional-doctor-male-nurse-blue-scrubs-stethoscope-cross-arms-chest-ready-help-patients_1258-57360.jpg'
  },
  female: {
    default: [
      'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
      'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg'
    ],
    sarah: 'https://img.freepik.com/free-photo/female-doctor-hospital_23-2148827775.jpg',
    rizma:  'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg'
  }
};

export default function DoctorList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get<{ doctors: Doctor[] }>('http://localhost:5000/api/doctors', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // The response now includes pagination data
        const doctorsData = response.data.doctors; // Access the doctors array
        
        const transformedDoctors = doctorsData.map((doctor: any, index: number) => {
          const name = doctor.user_id.name.toLowerCase();
          let doctorImage;

          // Check for specific doctors first
          if (name.includes('jaffar')) {
            doctorImage = doctorImages.male.jaffar;
          } else if (name.includes('ahmed')) {
            doctorImage = doctorImages.male.ahmed;
          } else if (name.includes('sarah')) {
            doctorImage = doctorImages.female.sarah;
          } else if (name.includes('rizma')) {
            doctorImage = doctorImages.female.rizma;
          } else {
            // Default gender-based images
            const gender = name.includes('dr.') ? 'male' : 'female';
            const defaultImages = doctorImages[gender].default;
            doctorImage = defaultImages[index % defaultImages.length];
          }

          return {
            id: doctor._id,
            name: doctor.user_id.name,
            department: doctor.department_id?.name || 'General',
            specialization: doctor.specialization || 'General',
            experience: doctor.experience || '0',
            rating: doctor.rating || 4.5,
            image: doctor.user_id.profile_image || doctorImage,
            description: doctor.description || '',
            price: doctor.consultation_fee || 0,
            workingHours: doctor.working_hours || '9 AM - 5 PM'
          };
        });

        setDoctors(transformedDoctors);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching doctors:', err);
        setError(err.response?.data?.message || 'Failed to fetch doctors');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDoctorClick = (doctorId: string) => {
    navigate(`/doctors/${doctorId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#D2EBE7] pb-6">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
          <p className="text-gray-600 mb-6">Book appointments with the best doctors</p>

          <div className="mb-8">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor as Doctor}
                onClick={() => handleDoctorClick(doctor.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

