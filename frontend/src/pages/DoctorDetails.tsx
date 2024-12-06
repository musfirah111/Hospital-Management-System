import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, Star, ArrowLeft } from 'lucide-react';
import { doctors } from '../data/doctors';
import { reviews } from '../data/reviews';
import { formatDate, getAvailableSlots } from '../utils/date';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === id);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Doctor not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#097a93] transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const availableSlots = selectedDate ? getAvailableSlots(doctor.workingHours, selectedDate) : [];

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select both date and time slot');
      return;
    }
    navigate(`/booking/${id}?date=${selectedDate}&slot=${selectedSlot}`);
  };

  const doctorReviews = reviews.filter(review => review.doctor_id === id);

  return (
    <div className="min-h-screen bg-[#D2EBE7] pb-6">
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[#0B8FAC] mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-start space-x-6 mb-6">
            <img 
              src={doctor.image} 
              alt={doctor.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-[#0B8FAC] font-medium">{doctor.specialization}</p>
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">{doctor.rating} Rating</span>
              </div>
              <p className="mt-2 text-gray-600">{doctor.experience} experience</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">About Doctor</h2>
            <p className="text-gray-600">{doctor.description}</p>
          </div>
        </div>

        {doctorReviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Patient Reviews</h2>
            <div className="space-y-4">
              {doctorReviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Book Appointment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot('');
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:outline-none"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              {selectedDate && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {formatDate(selectedDate)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Available Slots</label>
              {selectedDate ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg text-center ${
                        selectedSlot === slot
                          ? 'bg-[#0B8FAC] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Please select a date first</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div>
              <span className="text-gray-600">Consultation Fee</span>
              <p className="text-2xl font-bold text-[#0B8FAC]">${doctor.price}</p>
            </div>
            <button
              onClick={handleBooking}
              className="px-8 py-3 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#097a93] transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}