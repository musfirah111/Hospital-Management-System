import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Clock } from 'lucide-react';
import { doctors } from '../data/doctors';
import { formatDate } from '../utils/date';

export default function PaymentPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === id);
  const appointmentDate = searchParams.get('date');
  const appointmentTime = searchParams.get('slot');

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  if (!doctor || !appointmentDate || !appointmentTime) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Invalid booking details</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#097a93] transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically process the payment
    alert('Payment successful! Appointment confirmed.');
    navigate('/appointments');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-[#0B8FAC]">{doctor.specialization}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(appointmentDate)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{appointmentTime}</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="text-xl font-bold text-[#0B8FAC]">
                  ${doctor.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:outline-none"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({
                    ...paymentDetails,
                    cardNumber: e.target.value
                  })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:outline-none"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({
                    ...paymentDetails,
                    expiryDate: e.target.value
                  })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:outline-none"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({
                    ...paymentDetails,
                    cvv: e.target.value
                  })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:outline-none"
                value={paymentDetails.name}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  name: e.target.value
                })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#097a93] transition-colors"
            >
              Pay ${doctor.price}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}