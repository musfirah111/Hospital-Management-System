import React, { useState } from 'react';
import { Avatar } from '../components/Avatar';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 30,
    gender: 'Male',
    phone_number: '03001234567',
    role: 'Patient',
    profile_picture: '/path/to/profile-image.jpg',
    address: '123 Main Street, City, Country',
    emergency_contact: {
      name: 'Jane Doe',
      phone: '03009876543',
      relationship: 'Spouse'
    },
    date_created: new Date('2024-01-01')
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedUser(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: e.target.value
        }
      }));
    } else {
      setEditedUser(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset the edited user to the original values
    setEditedUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 30,
      gender: 'Male',
      phone_number: '03001234567',
      role: 'Patient',
      profile_picture: '/path/to/profile-image.jpg',
      address: '123 Main Street, City, Country',
      emergency_contact: {
        name: 'Jane Doe',
        phone: '03009876543',
        relationship: 'Spouse'
      },
      date_created: new Date('2024-01-01')
    });
    setIsEditing(false);
  };

    return (
      <div className="min-h-screen bg-[#D2EBE7] pb-6">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
  
          <div className="bg-white rounded-xl shadow-lg p-8">  {/* Increased padding */}
            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-8 border-b pb-6">  {/* Added border and spacing */}
              <Avatar name={editedUser.name} image={editedUser.profile_picture} size="lg" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{editedUser.name}</h2>
                <p className="text-gray-500">{editedUser.email}</p>
              </div>
            </div>
  
            <div className="space-y-8">  {/* Increased section spacing */}
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                  <span>Personal Information</span>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="ml-auto text-sm px-4 py-2 text-[#0B8FAC] hover:bg-[#0B8FAC] hover:text-white rounded-lg border border-[#0B8FAC] transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  {/* Increased gap */}
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editedUser.name} 
                      onChange={(e) => handleInputChange(e, 'name')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Email</label>
                    <input 
                      type="email" 
                      value={editedUser.email} 
                      className="w-full p-3 border rounded-lg bg-gray-50" 
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Age</label>
                    <input 
                      type="number" 
                      value={editedUser.age} 
                      onChange={(e) => handleInputChange(e, 'age')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Gender</label>
                    <input 
                      type="text" 
                      value={editedUser.gender} 
                      onChange={(e) => handleInputChange(e, 'gender')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      value={editedUser.phone_number} 
                      onChange={(e) => handleInputChange(e, 'phone_number')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm mb-2">Address</label>
                    <input 
                      type="text" 
                      value={editedUser.address} 
                      onChange={(e) => handleInputChange(e, 'address')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                </div>
              </div>
  
              {/* Emergency Contact */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Contact Name</label>
                    <input 
                      type="text" 
                      value={editedUser.emergency_contact.name} 
                      onChange={(e) => handleInputChange(e, 'emergency_contact.name')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Contact Phone</label>
                    <input 
                      type="text" 
                      value={editedUser.emergency_contact.phone} 
                      onChange={(e) => handleInputChange(e, 'emergency_contact.phone')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Relationship</label>
                    <input 
                      type="text" 
                      value={editedUser.emergency_contact.relationship} 
                      onChange={(e) => handleInputChange(e, 'emergency_contact.relationship')}
                      className={`w-full p-3 border rounded-lg ${
                        isEditing 
                          ? 'bg-white border-[#0B8FAC] focus:ring-2 focus:ring-[#0B8FAC] focus:border-transparent' 
                          : 'bg-gray-50'
                      }`}
                      readOnly={!isEditing} 
                    />
                  </div>
                </div>
              </div>
  
              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="pt-6 border-t flex justify-end space-x-4">
                  <button 
                    onClick={handleCancel}
                    className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#097a93] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}