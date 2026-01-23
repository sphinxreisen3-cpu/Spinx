'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  FaCheck,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaSync,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import formStyles from '@/styles/components/admin/TourForm.module.css';

interface BookingFull {
  _id: string;
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  infants: number;
  travelDate: string;
  confirmTrip: string;
  pickupLocation: string;
  pickupLocationOutside: string;
  totalPrice: number;
  currency: string;
  currencySymbol: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  message: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const initialBookings: BookingFull[] = [
  {
    _id: 'BK001ABC',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    adults: 2,
    children: 1,
    infants: 0,
    travelDate: '2026-02-15T00:00:00.000Z',
    confirmTrip: 'Paris Adventure - 7 Days Cultural Tour',
    pickupLocation: 'Hotel Marriott, Cairo',
    pickupLocationOutside: '',
    totalPrice: 3897,
    currency: 'USD',
    currencySymbol: '$',
    status: 'pending',
    message: 'Looking forward to our Paris adventure! Please confirm the hotel details.',
    createdAt: '2026-01-18T10:30:00.000Z',
    updatedAt: '2026-01-18T10:30:00.000Z',
  },
  {
    _id: 'BK002DEF',
    name: 'Emily Johnson',
    email: 'emily.j@email.com',
    phone: '+1 (555) 987-6543',
    adults: 4,
    children: 2,
    infants: 1,
    travelDate: '2026-03-01T00:00:00.000Z',
    confirmTrip: 'Safari Experience - Wildlife Adventure in Africa',
    pickupLocation: 'Nairobi Airport',
    pickupLocationOutside: 'Safari Lodge Gate',
    totalPrice: 14994,
    currency: 'USD',
    currencySymbol: '$',
    status: 'confirmed',
    message: 'Family safari trip - need vegetarian meal options for 2 adults',
    createdAt: '2026-01-15T14:20:00.000Z',
    updatedAt: '2026-01-16T09:00:00.000Z',
  },
  {
    _id: 'BK003GHI',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+201009059295',
    adults: 1,
    children: 0,
    infants: 0,
    travelDate: '2026-01-25T00:00:00.000Z',
    confirmTrip: 'Egyptian Pyramids Tour - 3 Days Historical',
    pickupLocation: 'Cairo Hotel',
    pickupLocationOutside: '',
    totalPrice: 599,
    currency: 'USD',
    currencySymbol: '$',
    status: 'cancelled',
    message: 'Need wheelchair access throughout the tour',
    createdAt: '2026-01-10T08:45:00.000Z',
    updatedAt: '2026-01-12T11:30:00.000Z',
  },
  {
    _id: 'BK004JKL',
    name: 'Maria Garcia',
    email: 'maria.garcia@gmail.com',
    phone: '+49 170 1234567',
    adults: 2,
    children: 0,
    infants: 0,
    travelDate: '2026-04-10T00:00:00.000Z',
    confirmTrip: 'Nile River Cruise - Luxury Experience',
    pickupLocation: 'Luxor Airport',
    pickupLocationOutside: 'Cruise Terminal',
    totalPrice: 4998,
    currency: 'EUR',
    currencySymbol: '€',
    status: 'pending',
    message: 'Honeymoon trip, any special arrangements would be appreciated!',
    createdAt: '2026-01-19T16:45:00.000Z',
    updatedAt: '2026-01-19T16:45:00.000Z',
  },
  {
    _id: 'BK005MNO',
    name: 'Hans Müller',
    email: 'hans.mueller@web.de',
    phone: '+49 30 12345678',
    adults: 3,
    children: 2,
    infants: 0,
    travelDate: '2026-05-20T00:00:00.000Z',
    confirmTrip: 'Desert Safari - Adventure in the Sahara',
    pickupLocation: 'Marrakech Hotel',
    pickupLocationOutside: 'Desert Camp Meeting Point',
    totalPrice: 2495,
    currency: 'EUR',
    currencySymbol: '€',
    status: 'confirmed',
    message: 'Children are 8 and 12 years old. Any kid-friendly activities?',
    createdAt: '2026-01-17T11:00:00.000Z',
    updatedAt: '2026-01-18T09:30:00.000Z',
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function truncate(str: string, len: number) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function getStatusColor(status: BookingFull['status']) {
  switch (status) {
    case 'pending':
      return { bg: '#fef3c7', color: '#92400e' };
    case 'confirmed':
      return { bg: '#d1fae5', color: '#065f46' };
    case 'cancelled':
      return { bg: '#fee2e2', color: '#991b1b' };
    default:
      return { bg: '#f3f4f6', color: '#374151' };
  }
}

export function BookingsAdminPage() {
  const [bookings, setBookings] = useState<BookingFull[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'travelDate' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewModal, setViewModal] = useState<BookingFull | null>(null);
  const [deleteModal, setDeleteModal] = useState<BookingFull | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(lower) ||
          b.email.toLowerCase().includes(lower) ||
          b.confirmTrip.toLowerCase().includes(lower)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt' || sortBy === 'travelDate') {
        comparison = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [bookings, debouncedSearch, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusChange = (bookingId: string, newStatus: BookingFull['status']) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b
      )
    );
  };

  const handleDelete = () => {
    if (deleteModal) {
      setBookings((prev) => prev.filter((b) => b._id !== deleteModal._id));
      setDeleteModal(null);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getSortIcon = (column: typeof sortBy) => {
    if (sortBy !== column) return <FaSort style={{ opacity: 0.3 }} />;
    return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
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
          Customer Bookings Management
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

      {/* Bookings Table Card */}
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
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Customer Bookings</h2>
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className={formStyles.select}
              style={{ width: 150 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort By */}
            <select
              className={formStyles.select}
              style={{ width: 150 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="createdAt">Date Created</option>
              <option value="travelDate">Travel Date</option>
              <option value="name">Name</option>
            </select>

            {/* Sort Order */}
            <select
              className={formStyles.select}
              style={{ width: 140 }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

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
              minWidth: 1200,
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid hsl(var(--border))' }}>
                <th
                  style={{ padding: '0.75rem', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => toggleSort('name')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Name {getSortIcon('name')}
                  </div>
                </th>
                <th
                  style={{ padding: '0.75rem', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => toggleSort('travelDate')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Date {getSortIcon('travelDate')}
                  </div>
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Adult</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Child</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Infant</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Confirm Trip</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Pickup Location</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Pickup Outside</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Message</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={14} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
                    <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                      No bookings found matching your criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => {
                  const statusStyle = getStatusColor(booking.status);
                  return (
                    <tr
                      key={booking._id}
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
                          <strong>{booking.name}</strong>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'hsl(var(--muted-foreground))',
                            }}
                          >
                            ID: #{booking._id.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(booking.travelDate)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
                        {booking.adults}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
                        {booking.children}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
                        {booking.infants}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                        {booking.currencySymbol}
                        {booking.totalPrice.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{booking.email}</td>
                      <td style={{ padding: '0.75rem' }}>{booking.phone}</td>
                      <td style={{ padding: '0.75rem', maxWidth: 150 }} title={booking.confirmTrip}>
                        {truncate(booking.confirmTrip, 30)}
                      </td>
                      <td
                        style={{ padding: '0.75rem', maxWidth: 120 }}
                        title={booking.pickupLocation}
                      >
                        {truncate(booking.pickupLocation, 30)}
                      </td>
                      <td
                        style={{ padding: '0.75rem', maxWidth: 120 }}
                        title={booking.pickupLocationOutside}
                      >
                        {truncate(booking.pickupLocationOutside, 30) || '-'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(booking._id, e.target.value as BookingFull['status'])
                          }
                          style={{
                            padding: '0.375rem 0.5rem',
                            borderRadius: '4px',
                            border: `1px solid ${statusStyle.color}`,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td
                        style={{
                          padding: '0.75rem',
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={booking.message}
                      >
                        {truncate(booking.message, 50)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setViewModal(booking)}
                            style={{
                              padding: '0.5rem',
                              border: 'none',
                              borderRadius: '4px',
                              background: 'hsl(var(--muted))',
                              cursor: 'pointer',
                            }}
                            title="View Details"
                          >
                            👁
                          </button>
                          <button
                            onClick={() => setDeleteModal(booking)}
                            style={{
                              padding: '0.5rem',
                              border: 'none',
                              borderRadius: '4px',
                              background: '#fee2e2',
                              cursor: 'pointer',
                            }}
                            title="Delete Booking"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              {Math.min(currentPage * pageSize, filteredBookings.length)} of{' '}
              {filteredBookings.length} bookings
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

      {/* View Booking Modal */}
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
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Booking Details</h3>
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
                <span
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: getStatusColor(viewModal.status).bg,
                    color: getStatusColor(viewModal.status).color,
                    textTransform: 'capitalize',
                  }}
                >
                  {viewModal.status}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                  Booked on {formatDate(viewModal.createdAt)}
                </span>
              </div>

              {/* Customer Info */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Customer Information</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUsers style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <span style={{ fontWeight: 500 }}>{viewModal.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaEnvelope style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <a href={`mailto:${viewModal.email}`} style={{ color: 'hsl(var(--primary))' }}>
                      {viewModal.email}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaPhone style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <a href={`tel:${viewModal.phone}`} style={{ color: 'hsl(var(--primary))' }}>
                      {viewModal.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Tour Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Tour Details</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div>
                    <strong>Tour:</strong> {viewModal.confirmTrip}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCalendarAlt style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <span>{formatDate(viewModal.travelDate)}</span>
                  </div>
                  <div>
                    <strong>Travelers:</strong> {viewModal.adults} adult
                    {viewModal.adults > 1 ? 's' : ''}
                    {viewModal.children > 0 &&
                      `, ${viewModal.children} child${viewModal.children > 1 ? 'ren' : ''}`}
                    {viewModal.infants > 0 &&
                      `, ${viewModal.infants} infant${viewModal.infants > 1 ? 's' : ''}`}
                  </div>
                  {viewModal.pickupLocation && (
                    <div>
                      <strong>Pickup:</strong> {viewModal.pickupLocation}
                    </div>
                  )}
                  {viewModal.pickupLocationOutside && (
                    <div>
                      <strong>Pickup Outside:</strong> {viewModal.pickupLocationOutside}
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div
                style={{
                  padding: '1rem',
                  background: 'hsl(var(--muted) / 0.3)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 600 }}>Total Price</span>
                  <span
                    style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--primary))' }}
                  >
                    {viewModal.currencySymbol}
                    {viewModal.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message */}
              {viewModal.message && (
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Customer Message</h4>
                  <p
                    style={{
                      margin: 0,
                      padding: '0.75rem',
                      background: 'hsl(var(--muted) / 0.3)',
                      borderRadius: '6px',
                      lineHeight: 1.6,
                    }}
                  >
                    {viewModal.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              {viewModal.status === 'pending' && (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem',
                    borderTop: '1px solid hsl(var(--border))',
                  }}
                >
                  <button
                    className={styles.primaryButton}
                    onClick={() => {
                      handleStatusChange(viewModal._id, 'confirmed');
                      setViewModal(null);
                    }}
                  >
                    <FaCheck /> Confirm Booking
                  </button>
                  <button
                    className={styles.dangerButton}
                    onClick={() => {
                      handleStatusChange(viewModal._id, 'cancelled');
                      setViewModal(null);
                    }}
                  >
                    <FaTimes /> Cancel Booking
                  </button>
                </div>
              )}
            </div>
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid hsl(var(--border))',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button className={styles.secondaryButton} onClick={() => setViewModal(null)}>
                Close
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
            <h3 style={{ margin: '0 0 1rem' }}>Delete Booking</h3>
            <p>
              Are you sure you want to delete the booking for <strong>{deleteModal.name}</strong>?
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
    </div>
  );
}
