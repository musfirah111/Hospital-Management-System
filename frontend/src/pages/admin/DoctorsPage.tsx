import { useState, useEffect } from 'react';
import { SearchInput } from '../../components/admin/shared/SearchInput';
import { Table } from '../../components/admin/shared/Table';
import { Pagination } from '../../components/admin/shared/Pagination';
import { Avatar } from '../../components/admin/shared/Avatar';
import { RegistrationModal } from '../../components/admin/forms/RegistrationModal';
import { DoctorRegistrationForm } from '../../components/admin/forms/DoctorRegistrationForm';
import { Layout } from '../../components/admin/AdminLayout';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

interface Doctor {
  _id: string;
  user_id: {
    name: string;
    email: string;
    profile_picture: string;
  };
  specialization: string;
  qualification: string;
  department_id: {
    name: string;
  };
  phone_number: string;
}

export function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async (page: number, searchQuery: string = '') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:5000/api/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: 10,
          search: searchQuery
        }
      });

      setDoctorData(response.data.doctors);
      setTotalPages(Math.ceil(response.data.totalPages));
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage, search);
  }, [currentPage, search]);

  const handleDoctorAdded = () => {
    fetchDoctors(currentPage, search);
    setIsModalOpen(false);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the doctors list after deletion
      fetchDoctors(currentPage, search);
    } catch (err) {
      console.error('Error deleting doctor:', err);
      alert('Failed to delete doctor. Please try again.');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Doctor Name',
      render: (_: string, row: Doctor) => (
        <div className="flex items-center space-x-3">
          <Avatar
            name={row.user_id?.name || 'Unknown'}
            image={row.user_id?.profile_picture}
          />
          <span>{row.user_id?.name || 'Unknown'}</span>
        </div>
      ),
    },
    {
      key: 'specialization',
      header: 'Specialization',
      render: (_: string, row: Doctor) => row.specialization || 'N/A'
    },
    {
      key: 'qualification',
      header: 'Qualification',
      render: (_: string, row: Doctor) => row.qualification || 'N/A'
    },
    {
      key: 'department',
      header: 'Department',
      render: (_: string, row: Doctor) => row.department_id?.name || 'N/A'
    },
    {
      key: 'phoneNumber',
      header: 'Phone Number',
      render: (_: string, row: Doctor) => row.phone_number || 'N/A'
    },
    {
      key: 'emailId',
      header: 'Email ID',
      render: (_: string, row: Doctor) => row.user_id?.email || 'N/A'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Doctor) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this doctor?')) {
              handleDeleteDoctor(row._id);
            }
          }}
          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="space-y-4 max-w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#0B8FAC]">Doctor Info</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0B8FAC] text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            + New Doctor
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search doctors..."
            />
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <Table
                  columns={columns}
                  data={doctorData}
                  onRowClick={(row) => console.log('Clicked row:', row)}
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DoctorRegistrationForm
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleDoctorAdded}
          />
        </RegistrationModal>
      </div>
    </Layout>
  );
}
