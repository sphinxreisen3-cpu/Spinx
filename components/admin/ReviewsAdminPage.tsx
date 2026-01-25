'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaStar, FaCheck, FaTimes, FaEdit, FaTrash, FaSearch, FaSync, FaEye } from 'react-icons/fa';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import formStyles from '@/styles/components/admin/TourForm.module.css';

interface ReviewFull {
  _id: string;
  name: string;
  email: string;
  reviewText: string;
  rating: number;
  tourId: string;
  tourTitle: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const initialReviews: ReviewFull[] = [
  {
    _id: 'REV001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    reviewText:
      'Amazing experience! The tour guide was incredibly knowledgeable and the pyramids were absolutely breathtaking. Would definitely recommend to anyone visiting Egypt. The organization was perfect from start to finish.',
    rating: 5,
    tourId: 'tour3',
    tourTitle: 'Egyptian Pyramids Tour',
    isApproved: true,
    createdAt: '2026-01-15T14:30:00.000Z',
    updatedAt: '2026-01-15T14:30:00.000Z',
  },
  {
    _id: 'REV002',
    name: 'Michael Brown',
    email: 'michael.brown@gmail.com',
    reviewText:
      'Good tour but could have been better organized. The lunch stop was too short and we felt rushed. Otherwise, the guide was friendly and informative.',
    rating: 3,
    tourId: 'tour1',
    tourTitle: 'Paris Adventure',
    isApproved: true,
    createdAt: '2026-01-14T10:15:00.000Z',
    updatedAt: '2026-01-14T10:15:00.000Z',
  },
  {
    _id: 'REV003',
    name: 'Emma Wilson',
    email: 'emma.wilson@outlook.com',
    reviewText:
      'The Nile cruise was absolutely magical! Beautiful scenery, great food, and wonderful service throughout the entire trip. The crew went above and beyond to make our honeymoon special.',
    rating: 5,
    tourId: 'tour2',
    tourTitle: 'Safari Experience',
    isApproved: false,
    createdAt: '2026-01-18T08:45:00.000Z',
    updatedAt: '2026-01-18T08:45:00.000Z',
  },
  {
    _id: 'REV004',
    name: 'Hans Müller',
    email: 'hans.mueller@web.de',
    reviewText:
      'Sehr gute Tour! Unser Guide war professionell und hat uns viele interessante Geschichten erzählt. Die Unterkünfte waren erstklassig. Würde auf jeden Fall wieder buchen.',
    rating: 4,
    tourId: 'tour1',
    tourTitle: 'Paris Adventure',
    isApproved: true,
    createdAt: '2026-01-16T12:00:00.000Z',
    updatedAt: '2026-01-16T12:00:00.000Z',
  },
  {
    _id: 'REV005',
    name: 'Test User',
    email: 'test@spam.com',
    reviewText: 'This is spam content that should be rejected. Buy cheap products at www.spam.com!',
    rating: 1,
    tourId: 'tour3',
    tourTitle: 'Egyptian Pyramids Tour',
    isApproved: false,
    createdAt: '2026-01-17T16:00:00.000Z',
    updatedAt: '2026-01-17T16:00:00.000Z',
  },
  {
    _id: 'REV006',
    name: 'Lisa Chen',
    email: 'lisa.chen@yahoo.com',
    reviewText:
      'Perfect family vacation! The kids loved the safari animals and we have so many incredible photos. The guides made sure the children were engaged and learning.',
    rating: 5,
    tourId: 'tour2',
    tourTitle: 'Safari Experience',
    isApproved: true,
    createdAt: '2026-01-13T09:30:00.000Z',
    updatedAt: '2026-01-13T09:30:00.000Z',
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function StarRating({
  rating,
  editable = false,
  onChange,
}: {
  rating: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => onChange?.(star)}
          style={{
            background: 'none',
            border: 'none',
            padding: editable ? '0.25rem' : 0,
            cursor: editable ? 'pointer' : 'default',
          }}
        >
          <FaStar
            style={{
              color: star <= rating ? '#facc15' : 'hsl(var(--muted))',
              fontSize: editable ? '1.5rem' : '0.875rem',
              transition: 'color 0.2s',
            }}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<ReviewFull[]>([]);
  const [tours, setTours] = useState<Array<{ _id: string; title: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewModal, setViewModal] = useState<ReviewFull | null>(null);
  const [editModal, setEditModal] = useState<ReviewFull | null>(null);
  const [deleteModal, setDeleteModal] = useState<ReviewFull | null>(null);
  const [editForm, setEditForm] = useState({ reviewText: '', rating: 5 });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    reviewText: '',
    rating: 5,
    tourId: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchTours = async () => {
    try {
      const response = await fetch('/api/tours?isActive=false&limit=200');
      const result = await response.json();
      if (result?.success && result?.data?.tours) {
        const apiTours = result.data.tours.map((t: Record<string, unknown>) => ({
          _id: (t._id as string) || (t.id as string),
          title: (t.title as string) || 'Untitled',
        }));
        setTours(apiTours);
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/reviews?isApproved=all&limit=200');
      const result = await response.json();
      if (result?.success && result?.data?.reviews) {
        const apiReviews = result.data.reviews.map((r: Record<string, unknown>) => {
          const _id = String((r._id as string) || (r.id as string) || '');
          const rating = typeof r.rating === 'number' ? r.rating : Number(r.rating || 0);
          const isApproved = typeof r.isApproved === 'boolean' ? r.isApproved : Boolean(r.isApproved);

          return {
            _id,
            name: String(r.name || ''),
            email: String(r.email || ''),
            reviewText: String(r.reviewText || ''),
            rating,
            tourId: String(r.tourId || ''),
            tourTitle: String(r.tourTitle || ''),
            isApproved,
            createdAt: String(r.createdAt || ''),
            updatedAt: String(r.updatedAt || ''),
          } as ReviewFull;
        });
        setReviews(apiReviews);
      } else {
        setReviews(initialReviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews(initialReviews);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTours();
    fetchReviews();
  }, []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Search filter
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.email.toLowerCase().includes(lower) ||
          r.reviewText.toLowerCase().includes(lower) ||
          r.tourTitle.toLowerCase().includes(lower)
      );
    }

    // Approval filter
    if (approvalFilter) {
      if (approvalFilter === 'approved') {
        result = result.filter((r) => r.isApproved);
      } else if (approvalFilter === 'pending') {
        result = result.filter((r) => !r.isApproved);
      }
    }

    // Rating filter
    if (ratingFilter) {
      result = result.filter((r) => r.rating === parseInt(ratingFilter));
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [reviews, debouncedSearch, approvalFilter, ratingFilter]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter((r) => r.isApproved).length;
    const pending = reviews.filter((r) => !r.isApproved).length;
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';
    return { total, approved, pending, avgRating };
  }, [reviews]);

  const toggleApproval = async (reviewId: string) => {
    const review = reviews.find((r) => r._id === reviewId);
    if (!review) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !review.isApproved }),
      });
      const result = await response.json();
      if (result?.success && result?.data?.review) {
        const updated = result.data.review as ReviewFull;
        setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, ...updated } : r)));
      } else {
        alert('Error: ' + (result?.error || 'Failed to update review'));
      }
    } catch (err) {
      console.error('Error updating review approval:', err);
      alert('Error updating review. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (review: ReviewFull) => {
    setEditForm({ reviewText: review.reviewText, rating: review.rating });
    setEditModal(review);
  };

  const saveEdit = async () => {
    if (!editModal) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews/${editModal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText: editForm.reviewText, rating: editForm.rating }),
      });
      const result = await response.json();
      if (result?.success && result?.data?.review) {
        const updated = result.data.review as ReviewFull;
        setReviews((prev) =>
          prev.map((r) => (r._id === editModal._id ? { ...r, ...updated } : r))
        );
        setEditModal(null);
      } else {
        alert('Error: ' + (result?.error || 'Failed to update review'));
      }
    } catch (err) {
      console.error('Error editing review:', err);
      alert('Error editing review. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews/${deleteModal._id}`, { method: 'DELETE' });
      const result = await response.json();

      if (result?.success) {
        setReviews((prev) => prev.filter((r) => r._id !== deleteModal._id));
        setDeleteModal(null);
      } else {
        alert('Error: ' + (result?.error || 'Failed to delete review'));
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Error deleting review. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchReviews();
  };

  const approveAll = async () => {
    const toApprove = reviews.filter((r) => !r.isApproved);
    if (toApprove.length === 0) return;

    try {
      setIsLoading(true);
      await Promise.all(
        toApprove.map((r) =>
          fetch(`/api/reviews/${r._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isApproved: true }),
          })
        )
      );
      await fetchReviews();
    } catch (err) {
      console.error('Error approving all reviews:', err);
      alert('Error approving reviews. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const createReview = async () => {
    if (!createForm.name || !createForm.email || !createForm.reviewText || !createForm.tourId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name,
          email: createForm.email,
          reviewText: createForm.reviewText,
          rating: createForm.rating,
          tourId: createForm.tourId,
        }),
      });
      const result = await response.json();
      if (result?.success) {
        setCreateModalOpen(false);
        setCreateForm({ name: '', email: '', reviewText: '', rating: 5, tourId: '' });
        await fetchReviews();
      } else {
        alert('Error: ' + (result?.error || 'Failed to create review'));
      }
    } catch (err) {
      console.error('Error creating review:', err);
      alert('Error creating review. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0',
          marginBottom: '1.5rem',
          borderBottom: '1px solid hsl(var(--border))',
        }}
      >
        <h1 className={styles.title} style={{ margin: 0 }}>
          Reviews Management
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className={styles.secondaryButton}>
            <span>🔔</span> Notifications
          </button>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fc914a 0%, #ebc519 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#000',
            }}
          >
            AD
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className={styles.card} style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</div>
          <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
            Total Reviews
          </div>
        </div>
        <div className={styles.card} style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>
            {stats.approved}
          </div>
          <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
            Approved
          </div>
        </div>
        <div className={styles.card} style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</div>
          <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>Pending</div>
        </div>
        <div className={styles.card} style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {stats.avgRating} <FaStar style={{ color: '#facc15', fontSize: '1.5rem' }} />
          </div>
          <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
            Average Rating
          </div>
        </div>
      </div>

      {/* Reviews Table Card */}
      <div className={styles.card}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>All Reviews</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <FaSearch
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--muted-foreground))',
                }}
              />
              <input
                type="text"
                className={formStyles.input}
                style={{ paddingLeft: '2.25rem', width: 250 }}
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Approval Filter */}
            <select
              className={formStyles.select}
              style={{ width: 140 }}
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>

            {/* Rating Filter */}
            <select
              className={formStyles.select}
              style={{ width: 130 }}
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            {/* Approve All */}
            <button className={styles.primaryButton} onClick={approveAll}>
              <FaCheck /> Approve All
            </button>

            <button
              className={styles.primaryButton}
              onClick={() => setCreateModalOpen(true)}
              disabled={isLoading}
            >
              Add Review
            </button>

            {/* Refresh */}
            <button
              className={styles.secondaryButton}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <FaSync className={isRefreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid hsl(var(--border))' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Reviewer</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Tour</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Rating</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Review</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</div>
                    <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                      No reviews found matching your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((review) => (
                  <tr
                    key={review._id}
                    style={{
                      borderBottom: '1px solid hsl(var(--border))',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'hsl(var(--muted) / 0.3)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.75rem' }}>
                      <div>
                        <strong>{review.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                          {review.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          background: 'hsl(var(--muted))',
                          fontSize: '0.75rem',
                        }}
                      >
                        {review.tourTitle}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <StarRating rating={review.rating} />
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div
                        style={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={review.reviewText}
                      >
                        {review.reviewText}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        color: 'hsl(var(--muted-foreground))',
                      }}
                    >
                      {formatDate(review.createdAt)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {review.isApproved ? (
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            background: '#d1fae5',
                            color: '#065f46',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          ✓ Approved
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            background: '#fef3c7',
                            color: '#92400e',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => setViewModal(review)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: 'hsl(var(--muted))',
                            cursor: 'pointer',
                          }}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => toggleApproval(review._id)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: review.isApproved ? '#fee2e2' : '#d1fae5',
                            cursor: 'pointer',
                          }}
                          title={review.isApproved ? 'Unapprove' : 'Approve'}
                        >
                          {review.isApproved ? <FaTimes /> : <FaCheck />}
                        </button>
                        <button
                          onClick={() => openEditModal(review)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: 'hsl(var(--muted))',
                            cursor: 'pointer',
                          }}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeleteModal(review)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: '#fee2e2',
                            cursor: 'pointer',
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid hsl(var(--border))',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredReviews.length)} of {filteredReviews.length}{' '}
              reviews
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={styles.secondaryButton}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    borderRadius: '4px',
                    background:
                      page === currentPage
                        ? 'linear-gradient(135deg, #fc914a 0%, #ebc519 100%)'
                        : 'hsl(var(--muted))',
                    color: page === currentPage ? '#000' : 'inherit',
                    fontWeight: page === currentPage ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                className={styles.secondaryButton}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Review Modal */}
      {viewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setViewModal(null)}
        >
          <div
            style={{
              background: 'hsl(var(--card))',
              borderRadius: '12px',
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: '1px solid hsl(var(--border))',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Review Details</h3>
              <button
                onClick={() => setViewModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {/* Status Badge */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                {viewModal.isApproved ? (
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      background: '#d1fae5',
                      color: '#065f46',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Approved
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 600,
                    }}
                  >
                    ⏳ Pending Approval
                  </span>
                )}
                <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                  {formatDate(viewModal.createdAt)}
                </span>
              </div>

              {/* Reviewer Info */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Reviewer</h4>
                <p style={{ margin: 0 }}>
                  <strong>{viewModal.name}</strong>
                  <br />
                  <a href={`mailto:${viewModal.email}`} style={{ color: 'hsl(var(--primary))' }}>
                    {viewModal.email}
                  </a>
                </p>
              </div>

              {/* Tour */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Tour</h4>
                <span
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    background: 'hsl(var(--muted))',
                  }}
                >
                  {viewModal.tourTitle}
                </span>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Rating</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StarRating rating={viewModal.rating} />
                  <span style={{ fontWeight: 600 }}>{viewModal.rating}/5</span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Review</h4>
                <p
                  style={{
                    margin: 0,
                    padding: '1rem',
                    background: 'hsl(var(--muted) / 0.3)',
                    borderRadius: '8px',
                    lineHeight: 1.7,
                  }}
                >
                  &ldquo;{viewModal.reviewText}&rdquo;
                </p>
              </div>
            </div>
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid hsl(var(--border))',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  toggleApproval(viewModal._id);
                  setViewModal(null);
                }}
              >
                {viewModal.isApproved ? <FaTimes /> : <FaCheck />}
                {viewModal.isApproved ? 'Unapprove' : 'Approve'}
              </button>
              <button className={styles.secondaryButton} onClick={() => setViewModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setEditModal(null)}
        >
          <div
            style={{
              background: 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: 500,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1.5rem' }}>Edit Review</h3>
            <div className={formStyles.formGroup} style={{ marginBottom: '1rem' }}>
              <label className={formStyles.label}>Rating</label>
              <StarRating
                rating={editForm.rating}
                editable
                onChange={(rating) => setEditForm((prev) => ({ ...prev, rating }))}
              />
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
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <button className={styles.secondaryButton} onClick={() => setEditModal(null)}>
                Cancel
              </button>
              <button className={styles.primaryButton} onClick={saveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setDeleteModal(null)}
        >
          <div
            style={{
              background: 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: 400,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem' }}>Delete Review</h3>
            <p>
              Are you sure you want to delete the review by <strong>{deleteModal.name}</strong>?
              This action cannot be undone.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <button className={styles.secondaryButton} onClick={() => setDeleteModal(null)}>
                Cancel
              </button>
              <button className={styles.dangerButton} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Review Modal */}
      {createModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            style={{
              background: 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: 520,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1.5rem' }}>Add Review</h3>

            <div className={formStyles.formGroup} style={{ marginBottom: '1rem' }}>
              <label className={formStyles.label}>Tour *</label>
              {tours.length > 0 ? (
                <select
                  className={formStyles.select}
                  value={createForm.tourId}
                  onChange={(e) => setCreateForm((p) => ({ ...p, tourId: e.target.value }))}
                >
                  <option value="">Select tour</option>
                  {tours.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={formStyles.input}
                  value={createForm.tourId}
                  onChange={(e) => setCreateForm((p) => ({ ...p, tourId: e.target.value }))}
                  placeholder="Tour ID"
                />
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Name *</label>
                <input
                  className={formStyles.input}
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Email *</label>
                <input
                  className={formStyles.input}
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>

            <div className={formStyles.formGroup} style={{ marginBottom: '1rem' }}>
              <label className={formStyles.label}>Rating</label>
              <StarRating
                rating={createForm.rating}
                editable
                onChange={(rating) => setCreateForm((p) => ({ ...p, rating }))}
              />
            </div>

            <div className={formStyles.formGroup}>
              <label className={formStyles.label}>Review Text *</label>
              <textarea
                className={formStyles.textarea}
                value={createForm.reviewText}
                onChange={(e) => setCreateForm((p) => ({ ...p, reviewText: e.target.value }))}
                rows={5}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <button className={styles.secondaryButton} onClick={() => setCreateModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.primaryButton} onClick={createReview} disabled={isLoading}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
