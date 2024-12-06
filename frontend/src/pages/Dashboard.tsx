import React from 'react';
import WelcomeCard from '../components/WelcomeCard';
import HospitalInfoCards from '../components/HospitalInfoCard';
import DoctorCard from '../components/DoctorCardDashboard';
import AppointmentCard from '../components/AppointmentCard';

function Dashboard() {
  const topDoctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      rating: 5,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Dr. Emily Williams",
      specialty: "Pediatrician",
      rating: 4,
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300"
    }
  ];

  const appointments = [
    {
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "March 15, 2024",
      time: "10:30 AM"
    },
    {
      doctorName: "Dr. Michael Chen",
      specialty: "Neurologist",
      date: "March 20, 2024",
      time: "2:15 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-[#D2EBE7]">
      <div className="container mx-auto px-16 py-8">
        <WelcomeCard patientName="John Doe" />
        
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
  );
}

export default Dashboard;