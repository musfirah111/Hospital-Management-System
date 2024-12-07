interface TopDoctorsProps {
  className?: string;
}

export function TopDoctors({ className }: TopDoctorsProps) {
  const doctors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.9,
      patients: 1500,
      availability: 'Available',
      image: 'https://example.com/path/to/sarah.jpg'
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      rating: 4.8,
      patients: 1200,
      availability: 'In Surgery',
      image: 'https://example.com/path/to/michael.jpg'
    },
    {
      name: 'Dr. Emily Williams',
      specialty: 'Dermatology',
      rating: 4.7,
      patients: 1100,
      availability: 'Available',
      image: 'https://example.com/path/to/emily.jpg'
    },
    {
      name: 'Dr. James Wilson',
      specialty: 'Cardiology',
      rating: 4.9,
      patients: 1300,
      availability: 'Available',
      image: 'https://example.com/path/to/james.jpg'
    },
    {
      name: 'Dr. Lisa Anderson',
      specialty: 'Neurology',
      rating: 4.6,
      patients: 950,
      availability: 'Available',
      image: 'https://example.com/path/to/lisa.jpg'
    },
    {
      name: 'Dr. Robert Taylor',
      specialty: 'Dermatology',
      rating: 4.8,
      patients: 1000,
      availability: 'In Surgery',
      image: 'https://example.com/path/to/robert.jpg'
    }
  ];

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-6 text-[#0B8FAC]">Top Rated Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div 
            key={doctor.name} 
            className="relative group overflow-hidden rounded-xl bg-gradient-to-b from-[#7BC1B7] to-[#0B8FAC] p-[2px]"
          >
            <div className="bg-white rounded-[10px] p-4 h-full">
              <div className="relative mb-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[#F89603]">★</span>
                    <span className="font-medium">{doctor.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">{doctor.patients} patients</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 