import React, { useState } from 'react';
import { Calendar, Clock, Star } from 'lucide-react';
import { doctors } from '../data/doctors';
import { formatDate } from '../utils/date';
import type { Doctor } from '../types/medical';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

// Mock appointments data
const appointments = [
  {
    id: '1',
    doctor_id: '1',
    appointment_date: '2024-03-20',
    appointment_time: '10:00',
    status: 'Scheduled'
  },
  {
    id: '2',
    doctor_id: '2',
    appointment_date: '2024-03-25',
    appointment_time: '14:00',
    status: 'Completed'
  }
];

type AppointmentStatus = 'All' | 'Scheduled' | 'Completed' | 'Requested' | 'Rescheduled';

export default function AppointmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<AppointmentStatus>('All');
  const navigate = useNavigate();

  const handleAddReview = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleSubmitReview = () => {
    // Handle review submission logic here
    setIsModalOpen(false);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const doctor = doctors.find(d => d.id === appointment.doctor_id);
    const matchesSearch = doctor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor?.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === 'All' || appointment.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = appointments.reduce((acc, appointment) => {
    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="min-h-screen bg-[#D2EBE7] pb-6">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search appointments by doctor name or specialization..."
            />
          </div>

          <div className="flex space-x-4 mb-8">
            {['All', 'Scheduled', 'Completed', 'Requested', 'Rescheduled'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status as AppointmentStatus)}
                className={`px-4 py-2 font-medium ${activeStatus === status
                  ? 'text-[#0B8FAC] border-b-2 border-[#0B8FAC]'
                  : 'text-gray-500'
                  }`}
              >
                {status}
                {status !== 'All' && (
                  <span className={`ml-2 text-sm font-semibold ${activeStatus === status ? 'text-[#0B8FAC]' : 'text-gray-500'
                    }`}>
                    {statusCounts[status] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const doctor = doctors.find(d => d.id === appointment.doctor_id);

              return (
                <div key={appointment.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={doctor?.image}
                      alt={doctor?.name}
                      className="w-20 h-20 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{doctor?.name}</h3>
                          <p className="text-[#0B8FAC] font-medium">{doctor?.specialization}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${appointment.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : appointment.status === 'Requested'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                          <Calendar className="w-5 h-5 mr-3 text-[#0B8FAC]" />
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{formatDate(appointment.appointment_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                          <Clock className="w-5 h-5 mr-3 text-[#0B8FAC]" />
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{appointment.appointment_time}</p>
                          </div>
                        </div>
                      </div>

                      {appointment.status === 'Scheduled' && doctor && (
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => navigate(`/doctor/${doctor.id}`)}
                            className="px-5 py-2.5 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#097a93] transition-all duration-200 font-medium"
                          >
                            <span>Reschedule Appointment</span>
                          </button>
                        </div>
                      )}

                      {appointment.status === 'Completed' && doctor && (
                        <div className="mt-6 flex items-center border-t pt-6">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Share your experience with Dr. {doctor.name.split(' ')[0]}</p>
                          </div>
                          <button
                            onClick={() => handleAddReview(doctor)}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#097a93] transition-all duration-200 font-medium"
                          >
                            <span>Add Review</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Review {selectedDoctor?.name}</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with the doctor..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!rating}
                    className={`px-6 py-2 rounded-lg text-white ${rating
                      ? 'bg-[#0B8FAC] hover:bg-[#097a93]'
                      : 'bg-gray-300 cursor-not-allowed'
                      }`}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}