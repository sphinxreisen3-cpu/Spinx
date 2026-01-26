'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import formStyles from '@/styles/components/admin/TourForm.module.css';

interface TestimonialFull {
  _id: string;
  name: string;
  country?: string;
  role?: string;
  role_de?: string;
  initials: string;
  image: string;
  text: string;
  text_de?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type TestimonialFormState = {
  name: string;
  country: string;
  role: string;
  role_de: string;
  initials: string;
  image: string;
  text: string;
  text_de: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: TestimonialFormState = {
  name: '',
  country: '',
  role: '',
  role_de: '',
  initials: '',
  image: 'blue',
  text: '',
  text_de: '',
  sortOrder: '0',
  isActive: true,
};

export function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<TestimonialFull[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [viewModal, setViewModal] = useState<TestimonialFull | null>(null);
  const [editModal, setEditModal] = useState<TestimonialFull | null>(null);
  const [deleteModal, setDeleteModal] = useState<TestimonialFull | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [form, setForm] = useState<TestimonialFormState>(emptyForm);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/testimonials?isActive=all&limit=500');
      const result = await response.json();

      if (result?.success && result?.data?.testimonials) {
        const apiTestimonials = result.data.testimonials.map((t: Record<string, unknown>) => {
          const sortOrder = typeof t.sortOrder === 'number' ? t.sortOrder : Number(t.sortOrder || 0);
          const isActive = typeof t.isActive === 'boolean' ? t.isActive : Boolean(t.isActive);

          return {
            _id: String((t._id as string) || (t.id as string) || ''),
            name: String(t.name || ''),
            country: t.country ? String(t.country) : undefined,
            role: String(t.role || ''),
            role_de: String(t.role_de || ''),
            initials: String(t.initials || ''),
            image: String(t.image || 'blue'),
            text: String(t.text || ''),
            text_de: String(t.text_de || ''),
            sortOrder,
            isActive,
            createdAt: String(t.createdAt || ''),
            updatedAt: String(t.updatedAt || ''),
          } as TestimonialFull;
        });

        setTestimonials(apiTestimonials);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredTestimonials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return testimonials;
    return testimonials.filter((t) => {
      const haystack = [t.name, t.country || '', t.role || '', t.text].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [testimonials, searchQuery]);

  const openCreateModal = () => {
    setForm(emptyForm);
    setCreateModalOpen(true);
  };

  const openEditModal = (t: TestimonialFull) => {
    setForm({
      name: t.name || '',
      country: t.country || '',
      role: t.role || '',
      role_de: t.role_de || '',
      initials: t.initials || '',
      image: t.image || 'blue',
      text: t.text || '',
      text_de: t.text_de || '',
      sortOrder: String(t.sortOrder ?? 0),
      isActive: Boolean(t.isActive),
    });
    setEditModal(t);
  };

  const saveCreate = async () => {
    try {
      setIsLoading(true);

      const payload = {
        name: form.name,
        country: form.country || undefined,
        role: form.role || undefined,
        role_de: form.role_de || undefined,
        initials: form.initials,
        image: form.image,
        text: form.text,
        text_de: form.text_de || undefined,
        sortOrder: Number(form.sortOrder || 0),
        isActive: form.isActive,
      };

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result?.success && result?.data?.testimonial) {
        setCreateModalOpen(false);
        setForm(emptyForm);
        await fetchTestimonials();
      } else {
        alert('Error: ' + (result?.error || 'Failed to create testimonial'));
      }
    } catch (err) {
      console.error('Error creating testimonial:', err);
      alert('Failed to create testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEdit = async () => {
    if (!editModal) return;

    try {
      setIsLoading(true);

      const payload = {
        name: form.name,
        country: form.country || undefined,
        role: form.role || undefined,
        role_de: form.role_de || undefined,
        initials: form.initials,
        image: form.image,
        text: form.text,
        text_de: form.text_de || undefined,
        sortOrder: Number(form.sortOrder || 0),
        isActive: form.isActive,
      };

      const response = await fetch(`/api/testimonials/${editModal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result?.success && result?.data?.testimonial) {
        setEditModal(null);
        await fetchTestimonials();
      } else {
        alert('Error: ' + (result?.error || 'Failed to update testimonial'));
      }
    } catch (err) {
      console.error('Error updating testimonial:', err);
      alert('Failed to update testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/testimonials/${deleteModal._id}`, { method: 'DELETE' });
      const result = await response.json();

      if (result?.success) {
        setDeleteModal(null);
        await fetchTestimonials();
      } else {
        alert('Error: ' + (result?.error || 'Failed to delete testimonial'));
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert('Failed to delete testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Testimonials Management</h1>
        <button className={styles.primaryButton} onClick={openCreateModal} disabled={isLoading}>
          <FaPlus /> Add Testimonial
        </button>
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
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
              className={formStyles.input}
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Country</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Initials</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Color</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Active</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Order</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.map((t) => (
                <tr key={t._id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                  <td style={{ padding: '0.75rem' }}>{t.name}</td>
                  <td style={{ padding: '0.75rem' }}>{t.country || ''}</td>
                  <td style={{ padding: '0.75rem' }}>{t.initials}</td>
                  <td style={{ padding: '0.75rem' }}>{t.image}</td>
                  <td style={{ padding: '0.75rem' }}>{t.isActive ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '0.75rem' }}>{t.sortOrder}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => setViewModal(t)}
                        style={{
                          padding: '0.5rem',
                          border: 'none',
                          borderRadius: '6px',
                          background: 'hsl(var(--muted))',
                          cursor: 'pointer',
                        }}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openEditModal(t)}
                        style={{
                          padding: '0.5rem',
                          border: 'none',
                          borderRadius: '6px',
                          background: 'hsl(var(--muted))',
                          cursor: 'pointer',
                        }}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteModal(t)}
                        style={{
                          padding: '0.5rem',
                          border: 'none',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTestimonials.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '1rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                    No testimonials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
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
              background: 'hsl(var(--background))',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '700px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Testimonial</h3>
              <button
                onClick={() => setViewModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Name:</strong> {viewModal.name}
              </p>
              {viewModal.country && (
                <p style={{ margin: '0 0 0.5rem' }}>
                  <strong>Country:</strong> {viewModal.country}
                </p>
              )}
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Role:</strong> {viewModal.role || ''}
              </p>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Initials:</strong> {viewModal.initials}
              </p>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Color:</strong> {viewModal.image}
              </p>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Active:</strong> {viewModal.isActive ? 'Yes' : 'No'}
              </p>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>Sort order:</strong> {viewModal.sortOrder}
              </p>
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Text (EN)</h4>
                <p style={{ margin: 0, lineHeight: 1.6 }}>&ldquo;{viewModal.text}&rdquo;</p>
              </div>
              {viewModal.text_de && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Text (DE)</h4>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>&ldquo;{viewModal.text_de}&rdquo;</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
              <button className={styles.secondaryButton} onClick={() => setViewModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {(createModalOpen || editModal) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => {
            setCreateModalOpen(false);
            setEditModal(null);
          }}
        >
          <div
            style={{
              background: 'hsl(var(--background))',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '700px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                {editModal ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button
                onClick={() => {
                  setCreateModalOpen(false);
                  setEditModal(null);
                }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: '1rem' }} className={formStyles.form}>
              <div className={formStyles.formRow}>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Name</label>
                  <input
                    className={formStyles.input}
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Initials</label>
                  <input
                    className={formStyles.input}
                    value={form.initials}
                    onChange={(e) => setForm((p) => ({ ...p, initials: e.target.value }))}
                    placeholder="AM"
                    required
                  />
                </div>
              </div>

              <div className={formStyles.formRow}>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Country</label>
                  <input
                    className={formStyles.input}
                    value={form.country}
                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                    placeholder="Germany"
                  />
                </div>
              </div>

              <div className={formStyles.formRow}>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Role (EN)</label>
                  <input
                    className={formStyles.input}
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    placeholder="Regular Customer"
                  />
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Role (DE)</label>
                  <input
                    className={formStyles.input}
                    value={form.role_de}
                    onChange={(e) => setForm((p) => ({ ...p, role_de: e.target.value }))}
                    placeholder="Stammkunde"
                  />
                </div>
              </div>

              <div className={formStyles.formRow}>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Avatar Color</label>
                  <select
                    className={formStyles.select}
                    value={form.image}
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  >
                    <option value="blue">blue</option>
                    <option value="green">green</option>
                    <option value="purple">purple</option>
                  </select>
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Sort Order</label>
                  <input
                    type="number"
                    className={formStyles.input}
                    value={form.sortOrder}
                    onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                    min={0}
                  />
                </div>
              </div>

              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Text (EN)</label>
                <textarea
                  className={formStyles.textarea}
                  value={form.text}
                  onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                  placeholder="Write the testimonial..."
                  required
                />
              </div>

              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Text (DE)</label>
                <textarea
                  className={formStyles.textarea}
                  value={form.text_de}
                  onChange={(e) => setForm((p) => ({ ...p, text_de: e.target.value }))}
                  placeholder="Schreiben Sie das Testimonial..."
                />
              </div>

              <div className={formStyles.checkboxGroup}>
                <input
                  id="isActive"
                  type="checkbox"
                  className={formStyles.checkbox}
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive" className={formStyles.checkboxLabel}>
                  Active
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  setCreateModalOpen(false);
                  setEditModal(null);
                }}
              >
                Cancel
              </button>
              <button
                className={styles.primaryButton}
                onClick={editModal ? saveEdit : saveCreate}
                disabled={isLoading}
              >
                {editModal ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setDeleteModal(null)}
        >
          <div
            style={{
              background: 'hsl(var(--background))',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Delete Testimonial</h3>
            <p style={{ marginTop: '0.75rem' }}>
              Are you sure you want to delete <strong>{deleteModal.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
              <button className={styles.secondaryButton} onClick={() => setDeleteModal(null)}>
                Cancel
              </button>
              <button className={styles.dangerButton} onClick={handleDelete} disabled={isLoading}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
