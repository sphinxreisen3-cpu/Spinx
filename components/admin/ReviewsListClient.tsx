'use client';

import { useState } from 'react';
import { FaStar, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import type { Review } from '@/types/review.types';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import tableStyles from '@/styles/components/admin/DataTable.module.css';
import formStyles from '@/styles/components/admin/TourForm.module.css';

// Mock data for frontend development
const mockReviews: Review[] = [
  {
    _id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    reviewText:
      'Amazing experience! The tour guide was knowledgeable and the pyramids were breathtaking. Would definitely recommend to anyone visiting Egypt.',
    rating: 5,
    tourId: 'tour1',
    isApproved: true,
    createdAt: '2026-01-15T14:30:00.000Z',
    updatedAt: '2026-01-15T14:30:00.000Z',
  },
  {
    _id: '2',
    name: 'Michael Brown',
    email: 'michael@example.com',
    reviewText: 'Good tour but could have been better organized. The lunch stop was too short.',
    rating: 3,
    tourId: 'tour1',
    isApproved: true,
    createdAt: '2026-01-14T10:15:00.000Z',
    updatedAt: '2026-01-14T10:15:00.000Z',
  },
  {
    _id: '3',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    reviewText:
      'The Nile cruise was absolutely magical! Beautiful scenery, great food, and wonderful service throughout the entire trip.',
    rating: 5,
    tourId: 'tour2',
    isApproved: false,
    createdAt: '2026-01-18T08:45:00.000Z',
    updatedAt: '2026-01-18T08:45:00.000Z',
  },
  {
    _id: '4',
    name: 'Test User',
    email: 'test@spam.com',
    reviewText: 'This is spam content that should be rejected.',
    rating: 1,
    tourId: 'tour3',
    isApproved: false,
    createdAt: '2026-01-17T16:00:00.000Z',
    updatedAt: '2026-01-17T16:00:00.000Z',
  },
];

const approvalOptions = [
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          style={{
            color: star <= rating ? '#facc15' : 'hsl(var(--muted))',
            fontSize: '0.875rem',
          }}
        />
      ))}
    </div>
  );
}

export function ReviewsListClient() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
  const [editModal, setEditModal] = useState<{ open: boolean; review: Review | null }>({
    open: false,
    review: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; review: Review | null }>({
    open: false,
    review: null,
  });
  const [editForm, setEditForm] = useState({ reviewText: '', rating: 5 });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredReviews(reviews);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredReviews(
      reviews.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.email.toLowerCase().includes(lower) ||
          r.reviewText.toLowerCase().includes(lower)
      )
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    if (!value) {
      setFilteredReviews(reviews);
      return;
    }
    if (key === 'approval') {
      if (value === 'approved') {
        setFilteredReviews(reviews.filter((r) => r.isApproved));
      } else {
        setFilteredReviews(reviews.filter((r) => !r.isApproved));
      }
    }
  };

  const handleClear = () => {
    setFilteredReviews(reviews);
  };

  const toggleApproval = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === reviewId ? { ...r, isApproved: !r.isApproved } : r))
    );
    setFilteredReviews((prev) =>
      prev.map((r) => (r._id === reviewId ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  const openEditModal = (review: Review) => {
    setEditForm({ reviewText: review.reviewText, rating: review.rating });
    setEditModal({ open: true, review });
  };

  const saveEdit = () => {
    if (editModal.review) {
      const updated = {
        ...editModal.review,
        reviewText: editForm.reviewText,
        rating: editForm.rating,
      };
      setReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      setFilteredReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    }
    setEditModal({ open: false, review: null });
  };

  const confirmDelete = () => {
    if (deleteModal.review) {
      setReviews((prev) => prev.filter((r) => r._id !== deleteModal.review!._id));
      setFilteredReviews((prev) => prev.filter((r) => r._id !== deleteModal.review!._id));
    }
    setDeleteModal({ open: false, review: null });
  };

  const columns: Column<Review>[] = [
    {
      key: 'name',
      label: 'Reviewer',
      render: (review) => (
        <div>
          <div style={{ fontWeight: 600 }}>{review.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            {review.email}
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (review) => <StarRating rating={review.rating} />,
    },
    {
      key: 'reviewText',
      label: 'Review',
      render: (review) => (
        <div
          style={{
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={review.reviewText}
        >
          {review.reviewText}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (review) => (
        <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          {formatDate(review.createdAt)}
        </span>
      ),
    },
    {
      key: 'isApproved',
      label: 'Status',
      render: (review) => (
        <StatusBadge
          status={review.isApproved ? 'approved' : 'pending'}
          label={review.isApproved ? 'Approved' : 'Pending'}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      className: tableStyles.actionsCell,
      render: (review) => (
        <ActionMenu
          actions={[
            {
              label: review.isApproved ? 'Unapprove' : 'Approve',
              icon: review.isApproved ? <FaTimes /> : <FaCheck />,
              onClick: () => toggleApproval(review._id),
            },
            {
              label: 'Edit',
              icon: <FaEdit />,
              onClick: () => openEditModal(review),
            },
            {
              label: 'Delete',
              icon: <FaTrash />,
              onClick: () => setDeleteModal({ open: true, review }),
              variant: 'danger',
            },
          ]}
        />
      ),
    },
  ];

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Reviews Management</h1>
      </div>

      <SearchFilter
        placeholder="Search reviews..."
        filters={[{ key: 'approval', label: 'Status', options: approvalOptions }]}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      <DataTable<Review>
        columns={columns}
        data={paginatedReviews}
        keyField="_id"
        emptyMessage="No reviews found"
        emptyDescription="Reviews will appear here when customers leave feedback."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredReviews.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Edit Review Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, review: null })}
        title="Edit Review"
        footer={
          <>
            <button
              className={styles.secondaryButton}
              onClick={() => setEditModal({ open: false, review: null })}
            >
              Cancel
            </button>
            <button className={styles.primaryButton} onClick={saveEdit}>
              Save Changes
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={formStyles.formGroup}>
            <label className={formStyles.label}>Rating</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditForm((prev) => ({ ...prev, rating: star }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                  }}
                >
                  <FaStar
                    style={{
                      fontSize: '1.5rem',
                      color: star <= editForm.rating ? '#facc15' : 'hsl(var(--muted))',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className={formStyles.formGroup}>
            <label className={formStyles.label}>Review Text</label>
            <textarea
              className={formStyles.textarea}
              value={editForm.reviewText}
              onChange={(e) => setEditForm((prev) => ({ ...prev, reviewText: e.target.value }))}
              rows={5}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, review: null })}
        title="Delete Review"
        footer={
          <>
            <button
              className={styles.secondaryButton}
              onClick={() => setDeleteModal({ open: false, review: null })}
            >
              Cancel
            </button>
            <button className={styles.dangerButton} onClick={confirmDelete}>
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete the review by <strong>{deleteModal.review?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
