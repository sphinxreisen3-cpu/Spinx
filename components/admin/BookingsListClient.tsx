'use client';

import { useEffect, useState } from 'react';
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaDownload,
} from 'react-icons/fa';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import { BookingTicket } from '@/components/bookings/BookingTicket';
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
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [_isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pageSize = 10;

  const fetchBookings = async (opts?: { status?: string; search?: string }) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('limit', '200');
      params.set('sortBy', 'createdAt');
      params.set('sortOrder', 'desc');
      if (opts?.status) params.set('status', opts.status);
      if (opts?.search) params.set('search', opts.search);

      const response = await fetch(`/api/bookings?${params.toString()}`);
      const result = await response.json();

      if (response.ok && result?.success && result?.data?.bookings) {
        const apiBookings = (result.data.bookings as Array<Record<string, unknown>>).map(
          (b) =>
            ({
              _id: String(b._id || ''),
              name: String(b.name || ''),
              phone: String(b.phone || ''),
              email: String(b.email || ''),
              adults: typeof b.adults === 'number' ? b.adults : Number(b.adults || 0),
              children: typeof b.children === 'number' ? b.children : Number(b.children || 0),
              infants: typeof b.infants === 'number' ? b.infants : Number(b.infants || 0),
              travelDate: String(b.travelDate || ''),
              confirmTrip: String(b.confirmTrip || ''),
              tourTitle: typeof b.tourTitle === 'string' ? b.tourTitle : undefined,
              notes: typeof b.notes === 'string' ? b.notes : undefined,
              pickupLocation: typeof b.pickupLocation === 'string' ? b.pickupLocation : undefined,
              requirements: typeof b.requirements === 'string' ? b.requirements : undefined,
              totalPrice:
                typeof b.totalPrice === 'number' ? b.totalPrice : Number(b.totalPrice || 0),
              currency: (b.currency as Booking['currency']) || 'USD',
              currencySymbol: (b.currencySymbol as Booking['currencySymbol']) || '$',
              status: (b.status as Booking['status']) || 'pending',
              createdAt: String(b.createdAt || ''),
              updatedAt: String(b.updatedAt || ''),
            }) as Booking
        );

        setFilteredBookings(apiBookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchBookings({ status: statusFilter || undefined, search: query || undefined });
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key !== 'status') return;
    setStatusFilter(value);
    setCurrentPage(1);
    fetchBookings({ status: value || undefined, search: searchQuery || undefined });
  };

  const handleClear = () => {
    setStatusFilter('');
    setSearchQuery('');
    setCurrentPage(1);
    fetchBookings();
  };

  const updateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (response.ok && result?.success && result?.data?.booking) {
        await fetchBookings({
          status: statusFilter || undefined,
          search: searchQuery || undefined,
        });
      } else {
        alert(result?.error || 'Failed to update booking');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Error updating booking. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok && result?.success) {
        await fetchBookings({
          status: statusFilter || undefined,
          search: searchQuery || undefined,
        });
      } else {
        alert(result?.error || 'Failed to delete booking');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Error deleting booking. Check console for details.');
    } finally {
      setIsLoading(false);
    }
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
      label: 'Customers',
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
            {
              label: 'Download Ticket',
              icon: <FaDownload />,
              onClick: () => {
                setTicketBooking(booking);
                setShowTicket(true);
              },
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
            {
              label: 'Delete',
              icon: <FaTimes />,
              onClick: () => deleteBooking(booking._id),
              variant: 'danger' as const,
            },
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
                  <strong>Customers:</strong> {selectedBooking.adults} adult
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
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid hsl(var(--border))',
                flexWrap: 'wrap',
              }}
            >
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  setTicketBooking(selectedBooking);
                  setShowTicket(true);
                }}
              >
                <FaDownload /> Download Ticket
              </button>
              {selectedBooking.status === 'pending' && (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Booking Ticket Modal */}
      {showTicket && ticketBooking && (
        <BookingTicket
          booking={ticketBooking}
          onClose={() => {
            setShowTicket(false);
            setTicketBooking(null);
          }}
        />
      )}
    </div>
  );
}
