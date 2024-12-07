import { useState } from 'react';
import { SearchInput } from '../../components/admin/shared/SearchInput';
import { Table } from '../../components/admin/shared/Table';
import { Pagination } from '../../components/admin/shared/Pagination';
import { appointments } from '../../data/mockData';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import React from 'react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export function AdminAppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'rescheduled'>('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const baseColumns = [
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time' },
    { key: 'doctor', header: 'Doctor' },
    { key: 'patient', header: 'Patient' },
    { key: 'age', header: 'Age' },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (value: 'Paid' | 'UnPaid') => (
        <span
          className={`px-3 py-1 rounded-lg text-xs ${
            value === 'Paid' ? 'bg-[#DCFCE7] text-[#129820]' : 'bg-[#FEF3C7] text-[#F89603]'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const statusAndActionsColumns = [
    {
      key: 'status',
      header: 'Status',
      render: (value: 'Confirmed' | 'Pending' | 'Rescheduled' | 'Cancelled') => (
        <span
          className={`px-3 py-1 rounded-md text-xs ${
            value === 'Confirmed'
              ? 'bg-[#DCFCE7] text-[#129820]'
              : value === 'Pending'
              ? 'bg-[#FEF3C7] text-[#F89603]'
              : value === 'Rescheduled'
              ? 'bg-[#FEF3C7] text-[#F89603]'
              : 'bg-[#FEE2E2] text-[#F30000]'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApprovalClick(row);
            }}
            className="px-3 py-1 rounded-md bg-[#DCFCE7] text-[#129820] hover:opacity-90"
          >
            Approve
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelClick(row);
            }}
            className="px-3 py-1 rounded-md bg-[#FEE2E2] text-[#F30000] hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  const columns = activeTab === 'all' ? [...baseColumns, ...statusAndActionsColumns] : baseColumns;

  const handleCancelClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsCancelModalVisible(true);
  };

  const handleApprovalClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsApprovalModalVisible(true);
  };

  const confirmCancellation = () => {
    setFilteredAppointments(prevData =>
      prevData.map(appointment =>
        appointment.id === selectedAppointment.id ? { ...appointment, status: 'Cancelled' } : appointment
      )
    );
    setIsCancelModalVisible(false);
    setSelectedAppointment(null);
  };

  const confirmApproval = () => {
    setFilteredAppointments(prevData =>
      prevData.map(appointment =>
        appointment.id === selectedAppointment.id ? { ...appointment, status: 'Confirmed' } : appointment
      )
    );
    setIsApprovalModalVisible(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#0B8FAC]">Appointments</h2>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4 border-b border-gray-200 w-full">
          {['all', 'confirmed', 'pending', 'cancelled', 'rescheduled'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium ${
                activeTab === tab ? 'text-[#0B8FAC] border-b-2 border-[#0B8FAC]' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button className="bg-[#0B8FAC] text-white px-6 py-3 rounded-md hover:opacity-90 flex-shrink-0">
          + Add Appointment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search appointments"
          />
          <button
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarTodayIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <Table
          columns={columns}
          data={paginatedAppointments}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmationModal
        isOpen={isCancelModalVisible}
        onClose={() => {
          setIsCancelModalVisible(false);
          setSelectedAppointment(null);
        }}
        onConfirm={confirmCancellation}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmButtonText="Cancel Appointment"
      />

      <ApprovalModal
        isOpen={isApprovalModalVisible}
        onClose={() => setIsApprovalModalVisible(false)}
        onConfirm={confirmApproval}
        title="Approve Appointment"
        message="Are you sure you want to approve this appointment?"
      />
    </div>
  );
}