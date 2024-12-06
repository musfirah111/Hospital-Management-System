import React from 'react';
import { Stethoscope } from 'lucide-react';

const WelcomeCard = ({ patientName = 'Guest' }) => {
  return (
    <div className="bg-[#0B8FAC] rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome back, {patientName}!</h2>
          <p className="text-blue-100">Your health is our priority at Oasis Hospital</p>
        </div>
        <Stethoscope className="w-12 h-12 text-blue-100" />
      </div>
    </div>
  );
};

export default WelcomeCard;