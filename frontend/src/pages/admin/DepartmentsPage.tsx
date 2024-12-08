import { useState } from 'react';
import { SearchInput } from '../../components/admin/shared/SearchInput';
import { Table } from '../../components/admin/shared/Table';
import { Pagination } from '../../components/admin/shared/Pagination';
import { Trash2 } from 'lucide-react';
import { departments } from '../../data/mockData';
import { DepartmentConfirmationModal } from '../../components/admin/departments/DepartmentConfirmationModal';
import { Department } from '../../types/admin';
import { Layout } from '../../components/admin/AdminLayout';

export function DepartmentsPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentData, setDepartmentData] = useState<Department[]>(departments);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDepartment && !selectedDepartment.isActive) {
      setDepartmentData(prevData =>
        prevData.filter(dept => dept.id !== selectedDepartment.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedDepartment(null);
    }
  };

  const columns = [
    { key: 'name', header: 'Department Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean, row: Department) => {
        let statusClass = '';
        let statusText = '';

        if (row.status === 'Closed') {
          statusClass = 'bg-gray-100 text-gray-600';
          statusText = 'Closed';
        } else if (value) {
          statusClass = 'bg-[#2BA47A]/10 text-[#2BA47A]';
          statusText = 'Active';
        } else {
          statusClass = 'bg-[#F30000]/10 text-[#F30000]';
          statusText = 'Inactive';
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    { key: 'staffCount', header: 'Staff Count' },
    { key: 'headOfDepartment', header: 'Head of Department' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Department) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(row);
          }}
          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
          disabled={row.isActive}
          title={row.isActive ? "Cannot delete active department" : "Delete department"}
        >
          <Trash2 className={`w-5 h-5 ${row.isActive ? 'opacity-50 cursor-not-allowed' : ''}`} />
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#0B8FAC]">Department Info</h2>
          <button className="bg-[#0B8FAC] text-white px-4 py-2 rounded-md hover:opacity-90">
            + New Department
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search departments..."
            />
          </div>

          <Table
            columns={columns}
            data={departmentData}
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

        <DepartmentConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          department={selectedDepartment}
        />
      </div>
    </Layout>
  );
}