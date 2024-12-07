import React, { useState } from 'react';
import { User } from '../../types/doctor/user';

const initialUser: User = {
  id: '1',
  name: 'Dr. Smith',
  email: 'dr.smith@example.com',
  age: 45,
  phoneNumber: '+1 (555) 123-4567',
  role: 'Doctor',
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
  specialization: 'Cardiology',
  qualification: 'MD, FACC',
  department: 'Cardiology'
};

export default function Profile() {
  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [password] = useState('');
  const [confirmPassword] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Here you would typically make an API call to update the user profile
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#D2EBE7] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Profile</h1>

        <div className="bg-white rounded-lg p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-8">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-medium">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Personal Information Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-medium">Personal Information</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-md"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={user.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={user.gender || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={user.specialization || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={user.qualification || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={user.department || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-2.5 border border-gray-200 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={user.address || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2.5 border border-gray-200 rounded-md"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0B8FAC] text-white rounded-md hover:bg-[#0A7A9B]"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}