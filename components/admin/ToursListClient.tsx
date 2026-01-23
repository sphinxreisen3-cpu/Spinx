'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/admin/Modal';
import type { Tour } from '@/types/tour.types';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import tableStyles from '@/styles/components/admin/DataTable.module.css';

// Mock data for frontend development
const mockTours: Tour[] = [
  {
    _id: '1',
    title: 'Egyptian Pyramids Tour',
    title_de: 'Ägyptische Pyramiden Tour',
    price: 299,
    travelType: '1 day',
    category: 'Cultural',
    description: 'Visit the great pyramids of Giza',
    slug: 'egyptian-pyramids-tour',
    sortOrder: 1,
    isActive: true,
    onSale: false,
    discount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Nile River Cruise',
    title_de: 'Nilkreuzfahrt',
    price: 599,
    travelType: '3 days',
    category: 'Adventure',
    description: 'Cruise along the beautiful Nile River',
    slug: 'nile-river-cruise',
    sortOrder: 2,
    isActive: true,
    onSale: true,
    discount: 15,
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-14T00:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Luxor Temple Visit',
    title_de: 'Luxor-Tempel Besuch',
    price: 199,
    travelType: '1 day',
    category: 'Historical',
    description: 'Explore the ancient Luxor Temple',
    slug: 'luxor-temple-visit',
    sortOrder: 3,
    isActive: false,
    onSale: false,
    discount: 0,
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-13T00:00:00.000Z',
  },
];

const categoryOptions = [
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Historical', label: 'Historical' },
  { value: 'Beach', label: 'Beach' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'sale', label: 'On Sale' },
];

export function ToursListClient() {
  const [tours, setTours] = useState<Tour[]>(mockTours);
  const [filteredTours, setFilteredTours] = useState<Tour[]>(mockTours);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; tour: Tour | null }>({
    open: false,
    tour: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredTours(tours);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredTours(
      tours.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower) ||
          t.slug.toLowerCase().includes(lower)
      )
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    if (!value) {
      setFilteredTours(tours);
      return;
    }

    if (key === 'category') {
      setFilteredTours(tours.filter((t) => t.category === value));
    } else if (key === 'status') {
      if (value === 'active') {
        setFilteredTours(tours.filter((t) => t.isActive));
      } else if (value === 'inactive') {
        setFilteredTours(tours.filter((t) => !t.isActive));
      } else if (value === 'sale') {
        setFilteredTours(tours.filter((t) => t.onSale));
      }
    }
  };

  const handleClear = () => {
    setFilteredTours(tours);
  };

  const handleDelete = (tour: Tour) => {
    setDeleteModal({ open: true, tour });
  };

  const confirmDelete = () => {
    if (deleteModal.tour) {
      // TODO: Call API to delete
      setTours((prev) => prev.filter((t) => t._id !== deleteModal.tour!._id));
      setFilteredTours((prev) => prev.filter((t) => t._id !== deleteModal.tour!._id));
    }
    setDeleteModal({ open: false, tour: null });
  };

  const columns: Column<Tour>[] = [
    {
      key: 'title',
      label: 'Title',
      className: tableStyles.titleCell,
      render: (tour) => (
        <div>
          <div className={tableStyles.titleCell}>{tour.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            {tour.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'price',
      label: 'Price',
      className: tableStyles.priceCell,
      render: (tour) => (
        <span className={tableStyles.priceCell}>
          ${tour.price}
          {tour.discount > 0 && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'hsl(var(--muted-foreground))',
                marginLeft: '0.5rem',
              }}
            >
              (-{tour.discount}%)
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'travelType',
      label: 'Duration',
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (tour) => (
        <div className={tableStyles.badgeGroup}>
          <StatusBadge status={tour.isActive ? 'active' : 'inactive'} />
          {tour.onSale && <StatusBadge status="sale" label="Sale" />}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: tableStyles.actionsCell,
      render: (tour) => (
        <ActionMenu
          actions={[
            {
              label: 'Edit',
              icon: <FaEdit />,
              onClick: () => {
                window.location.href = `/admin/tours/${tour._id}/edit`;
              },
            },
            {
              label: 'Delete',
              icon: <FaTrash />,
              onClick: () => handleDelete(tour),
              variant: 'danger',
            },
          ]}
        />
      ),
    },
  ];

  const totalPages = Math.ceil(filteredTours.length / pageSize);
  const paginatedTours = filteredTours.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Tours Management</h1>
        <Link href="/admin/tours/new" className={styles.primaryButton}>
          <FaPlus /> Add Tour
        </Link>
      </div>

      <SearchFilter
        placeholder="Search tours..."
        filters={[
          { key: 'category', label: 'Category', options: categoryOptions },
          { key: 'status', label: 'Status', options: statusOptions },
        ]}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      <DataTable<Tour>
        columns={columns}
        data={paginatedTours}
        keyField="_id"
        emptyMessage="No tours found"
        emptyDescription="Create your first tour to get started."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTours.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, tour: null })}
        title="Delete Tour"
        footer={
          <>
            <button
              className={styles.secondaryButton}
              onClick={() => setDeleteModal({ open: false, tour: null })}
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
          Are you sure you want to delete <strong>{deleteModal.tour?.title}</strong>? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
