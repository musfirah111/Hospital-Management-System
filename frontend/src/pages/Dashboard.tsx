import WelcomeCard from '../components/WelcomeCard';
import HospitalInfoCards from '../components/HospitalInfoCard';
import DoctorCard from '../components/DoctorCardDashboard';
import AppointmentCard from '../components/AppointmentCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';

interface DoctorResponse {
  [key: string]: {
    department_name: string;
    top_rated: Array<{
      doctor_name: string;
      department: string;
      averageRating: number;
    }>;
  };
}

interface AppointmentResponse {
  doctor_id: {
    user_id: {
      name: string;
    };
    department_id: {
      name: string;
    };
  };
  appointment_date: string;
  appointment_time: string;
}

interface Doctor {
  name: string;
  specialty: string;
  rating: number;
  image: string;
}

interface Appointment {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
}

function Dashboard() {
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Assuming you have the patient ID stored in localStorage or context

        // Fetch top rated doctors across all departments
        const doctorsResponse = await axios.get<DoctorResponse>('/api/statistics/top-rated-doctors');

        // Fetch patient's appointments
        const appointmentsResponse = await axios.get<AppointmentResponse[]>('/api/appointments/patient/${ patientId }');

        // Transform doctors data to match the component's format
        const formattedDoctors = Object.values(doctorsResponse.data)
          .flatMap(dept => dept.top_rated)
          .map(doctor => ({
            name: doctor.doctor_name,
            specialty: doctor.department,
            rating: doctor.averageRating,
            // You might want to add a default image or fetch from user profile
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
          }))
          .slice(0, 3); // Keep only top 3 doctors

        // Transform appointments data
        const formattedAppointments = appointmentsResponse.data.map(apt => ({
          doctorName: apt.doctor_id.user_id.name,
          specialty: apt.doctor_id.department_id.name,
          date: new Date(apt.appointment_date).toLocaleDateString(),
          time: apt.appointment_time
        }));

        setTopDoctors(formattedDoctors);
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // You might want to add error handling UI here
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#D2EBE7] flex items-center justify-center">
      <div>Loading...</div>
    </div>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#D2EBE7]">
        <div className="container mx-auto px-16 py-8">
          <WelcomeCard />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About Oasis Hospital</h2>
            <div className="overflow-x-auto pb-4">
              <HospitalInfoCards />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Top Rated Doctors</h2>
              <div className="space-y-4">
                {topDoctors.map((doctor, index) => (
                  <DoctorCard
                    key={index}
                    name={doctor.name}
                    specialty={doctor.specialty}
                    rating={doctor.rating}
                    image={doctor.image}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
              {appointments.map((appointment, index) => (
                <AppointmentCard key={index} {...appointment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
