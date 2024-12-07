import { useState } from 'react';
import { SearchInput } from '../../components/admin/shared/SearchInput';
import { Table } from '../../components/admin/shared/Table';
import { Pagination } from '../../components/admin/shared/Pagination';
import { Avatar } from '../../components/admin/shared/Avatar';
import { Trash2 } from 'lucide-react';
import { patients } from '../../data/mockData';
import { RegistrationModal } from '../../components/admin/forms/RegistrationModal';
import { PatientRegistrationForm } from '../../components/admin/forms/PatientRegistrationForm';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';

export function PatientsPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientData, setPatientData] = useState(patients);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handleDeleteClick = (patient: any) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setPatientData(prevData => 
      prevData.filter(pat => pat.id !== selectedPatient.id)
    );
  };

  const columns = [
    {
      key: 'name',
      header: 'Patient Name',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <Avatar name={value} image={row.image} />
          <span>{value}</span>
        </div>
      ),
    },
    { key: 'age', header: 'Age' },
    { key: 'gender', header: 'Gender' },
    { key: 'bloodGroup', header: 'Blood Group' },
    { key: 'phoneNumber', header: 'Phone Number' },
    { key: 'emailId', header: 'Email ID' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(row);
          }}
          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#0B8FAC]">Patient Info</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0B8FAC] text-white px-4 py-2 rounded-md hover:opacity-90"
        >
          + New Patient
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search patients..."
          />
        </div>

        <Table
          columns={columns}
          data={patientData}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />

        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PatientRegistrationForm onClose={() => setIsModalOpen(false)} />
      </RegistrationModal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This action cannot be undone."
        confirmButtonText="Delete Patient"
      />
    </div>
  );
}