'use client';

import { useState } from 'react';
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
} from 'react-icons/fa';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import type { Booking } from '@/types/booking.types';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import tableStyles from '@/styles/components/admin/DataTable.module.css';

// Mock data for frontend development
const mockBookings: Booking[] = [
  {
    _id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john@example.com',
    adults: 2,
    children: 1,
    infants: 0,
    travelDate: '2026-02-15T00:00:00.000Z',
    confirmTrip: 'Egyptian Pyramids Tour',
    tourTitle: 'Egyptian Pyramids Tour',
    notes: 'Vegetarian meals please',
    pickupLocation: 'Cairo Marriott Hotel',
    totalPrice: 897,
    currency: 'USD',
    currencySymbol: '$',
    status: 'pending',
    createdAt: '2026-01-18T10:30:00.000Z',
    updatedAt: '2026-01-18T10:30:00.000Z',
  },
  {
    _id: '2',
    name: 'Maria Garcia',
    phone: '+49123456789',
    email: 'maria@example.de',
    adults: 4,
    children: 0,
    infants: 0,
    travelDate: '2026-03-01T00:00:00.000Z',
    confirmTrip: 'Nile River Cruise',
    tourTitle: 'Nile River Cruise',
    totalPrice: 2396,
    currency: 'EUR',
    currencySymbol: '€',
    status: 'confirmed',
    createdAt: '2026-01-15T14:20:00.000Z',
    updatedAt: '2026-01-16T09:00:00.000Z',
  },
  {
    _id: '3',
    name: 'Ahmed Hassan',
    phone: '+201009059295',
    email: 'ahmed@example.com',
    adults: 1,
    children: 0,
    infants: 0,
    travelDate: '2026-01-25T00:00:00.000Z',
    confirmTrip: 'Luxor Temple Visit',
    tourTitle: 'Luxor Temple Visit',
    notes: 'Need wheelchair access',
    totalPrice: 199,
    currency: 'USD',
    currencySymbol: '$',
    status: 'cancelled',
    createdAt: '2026-01-10T08:45:00.000Z',
    updatedAt: '2026-01-12T11:30:00.000Z',
  },
];

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BookingsListClient() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredBookings(bookings);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredBookings(
      bookings.filter(
        (b) =>
          b.name.toLowerCase().includes(lower) ||
          b.email.toLowerCase().includes(lower) ||
          b.tourTitle?.toLowerCase().includes(lower)
      )
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    if (!value) {
      setFilteredBookings(bookings);
      return;
    }
    if (key === 'status') {
      setFilteredBookings(bookings.filter((b) => b.status === value));
    }
  };

  const handleClear = () => {
    setFilteredBookings(bookings);
  };

  const updateStatus = (bookingId: string, newStatus: Booking['status']) => {
    // TODO: Call API to update status
    setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)));
    setFilteredBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const columns: Column<Booking>[] = [
    {
      key: 'name',
      label: 'Customer',
      render: (booking) => (
        <div>
          <div style={{ fontWeight: 600 }}>{booking.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            {booking.email}
          </div>
        </div>
      ),
    },
    {
      key: 'tourTitle',
      label: 'Tour',
      render: (booking) => (
        <div>
          <div style={{ fontWeight: 500 }}>{booking.tourTitle || booking.confirmTrip}</div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            {formatDate(booking.travelDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'adults',
      label: 'Travelers',
      render: (booking) => (
        <span>
          {booking.adults} adult{booking.adults > 1 ? 's' : ''}
          {booking.children > 0 && `, ${booking.children} child`}
          {booking.infants > 0 && `, ${booking.infants} infant`}
        </span>
      ),
    },
    {
      key: 'totalPrice',
      label: 'Total',
      className: tableStyles.priceCell,
      render: (booking) => (
        <span className={tableStyles.priceCell}>
          {booking.currencySymbol}
          {booking.totalPrice}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (booking) => <StatusBadge status={booking.status} />,
    },
    {
      key: 'actions',
      label: '',
      className: tableStyles.actionsCell,
      render: (booking) => (
        <ActionMenu
          actions={[
            {
              label: 'View Details',
              icon: <FaEye />,
              onClick: () => setSelectedBooking(booking),
            },
            ...(booking.status === 'pending'
              ? [
                  {
                    label: 'Confirm',
                    icon: <FaCheck />,
                    onClick: () => updateStatus(booking._id, 'confirmed'),
                  },
                  {
                    label: 'Cancel',
                    icon: <FaTimes />,
                    onClick: () => updateStatus(booking._id, 'cancelled'),
                    variant: 'danger' as const,
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Bookings Management</h1>
      </div>

      <SearchFilter
        placeholder="Search by name, email, or tour..."
        filters={[{ key: 'status', label: 'Status', options: statusOptions }]}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      <DataTable<Booking>
        columns={columns}
        data={paginatedBookings}
        keyField="_id"
        emptyMessage="No bookings found"
        emptyDescription="Bookings will appear here when customers make reservations."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredBookings.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Booking Details Modal */}
      <Modal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        size="large"
      >
        {selectedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusBadge status={selectedBooking.status} />
              <span style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                Booked on {formatDate(selectedBooking.createdAt)}
              </span>
            </div>

            {/* Customer Info */}
            <div>
              <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Customer Information</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaUsers style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <span>{selectedBooking.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaEnvelope style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <a
                    href={`mailto:${selectedBooking.email}`}
                    style={{ color: 'hsl(var(--primary))' }}
                  >
                    {selectedBooking.email}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaPhone style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <a href={`tel:${selectedBooking.phone}`} style={{ color: 'hsl(var(--primary))' }}>
                    {selectedBooking.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Tour Info */}
            <div>
              <h4 style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Tour Details</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div>
                  <strong>Tour:</strong> {selectedBooking.tourTitle || selectedBooking.confirmTrip}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCalendarAlt style={{ color: 'hsl(var(--muted-foreground))' }} />
                  <span>{formatDate(selectedBooking.travelDate)}</span>
                </div>
                <div>
                  <strong>Travelers:</strong> {selectedBooking.adults} adult
                  {selectedBooking.adults > 1 ? 's' : ''}
                  {selectedBooking.children > 0 &&
                    `, ${selectedBooking.children} child${selectedBooking.children > 1 ? 'ren' : ''}`}
                  {selectedBooking.infants > 0 &&
                    `, ${selectedBooking.infants} infant${selectedBooking.infants > 1 ? 's' : ''}`}
                </div>
                {selectedBooking.pickupLocation && (
                  <div>
                    <strong>Pickup:</strong> {selectedBooking.pickupLocation}
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
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontWeight: 600 }}>Total Price</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                  {selectedBooking.currencySymbol}
                  {selectedBooking.totalPrice}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Notes</h4>
                <p
                  style={{
                    margin: 0,
                    padding: '0.75rem',
                    background: 'hsl(var(--muted) / 0.3)',
                    borderRadius: '6px',
                  }}
                >
                  {selectedBooking.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            {selectedBooking.status === 'pending' && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid hsl(var(--border))',
                }}
              >
                <button
                  className={styles.primaryButton}
                  onClick={() => {
                    updateStatus(selectedBooking._id, 'confirmed');
                    setSelectedBooking(null);
                  }}
                >
                  <FaCheck /> Confirm Booking
                </button>
                <button
                  className={styles.dangerButton}
                  onClick={() => {
                    updateStatus(selectedBooking._id, 'cancelled');
                    setSelectedBooking(null);
                  }}
                >
                  <FaTimes /> Cancel Booking
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
