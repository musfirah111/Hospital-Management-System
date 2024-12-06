import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import { doctors } from '../data/doctors';

export default function DoctorList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
      <p className="text-gray-600 mb-6">Book appointments with the best doctors</p>
      
      <div className="mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredDoctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}