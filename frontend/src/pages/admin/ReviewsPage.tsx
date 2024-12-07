import { useState } from 'react';
import { SearchInput } from '../../components/admin/shared/SearchInput';
import { Table } from '../../components/admin/shared/Table';
import { Pagination } from '../../components/admin/shared/Pagination';
import { Star, Trash2 } from 'lucide-react';
import { reviews } from '../../data/mockData';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { Review } from '../../types/admin';

export function ReviewsPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewData, setReviewData] = useState<Review[]>(reviews);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleDeleteClick = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedReview) {
      setReviewData(reviewData.filter(review => review.id !== selectedReview.id));
    }
  };

  const columns = [
    { key: 'doctorName', header: 'Doctor Name' },
    { key: 'department', header: 'Department' },
    {
      key: 'rating',
      header: 'Rating',
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      ),
    },
    { key: 'review', header: 'Review' },
    { key: 'date', header: 'Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: ( row: Review) => (
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
        <h2 className="text-2xl font-semibold text-[#0B8FAC]">Reviews</h2>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search reviews..."
          />
        </div>

        <Table
          columns={columns}
          data={reviewData}
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmButtonText="Delete Review"
      />
    </div>
  );
}