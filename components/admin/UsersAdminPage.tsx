'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import modalStyles from '@/styles/components/admin/Modal.module.css';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingUser
        ? `/api/admin/users/${editingUser._id}`
        : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const payload: { name: string; email: string; password?: string } = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(editingUser ? 'User updated successfully' : 'User created successfully');
        fetchUsers();
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('User deleted successfully');
        fetchUsers();
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>👥 Admin Users</h1>
        <button onClick={() => handleOpenModal()} className={styles.primaryButton}>
          + Add New User
        </button>
      </div>

      {error && (
        <div className={styles.card} style={{ background: '#fee2e2', color: '#dc2626', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.card} style={{ background: '#d1fae5', color: '#065f46', marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      <div className={styles.card}>
        {users.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
            No users found. Create your first admin user.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid hsl(var(--border))' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    <td style={{ padding: '1rem' }}>{user.name}</td>
                    <td style={{ padding: '1rem' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenModal(user)}
                        className={styles.secondaryButton}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className={styles.dangerButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={modalStyles.overlay} onClick={handleCloseModal}>
          <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.header}>
              <h2 className={modalStyles.title}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button className={modalStyles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={modalStyles.body}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
              </div>
              {error && (
                <div style={{ color: 'hsl(var(--destructive))', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ color: '#065f46', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {success}
                </div>
              )}
              <div className={modalStyles.footer}>
                <button type="button" onClick={handleCloseModal} className={styles.secondaryButton}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
