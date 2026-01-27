'use client';

import { useEffect, useState, useCallback } from 'react';
import { LoginForm } from './LoginForm';
import styles from '@/styles/components/admin/AuthGuard.module.css';
import { ADMIN_AUTH_EVENT } from '@/lib/auth/events';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsInit, setNeedsInit] = useState(false);
  const [initData, setInitData] = useState({ name: 'Admin', email: 'admin@mail.com', password: 'admin123' });
  const [initError, setInitError] = useState('');
  const [initSuccess, setInitSuccess] = useState('');

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      const data = await response.json();
      const authenticated = data.authenticated || false;
      setIsAuthenticated(authenticated);

      if (authenticated) {
        setNeedsInit(false);
        return;
      }

      // Check if we need to initialize (no users exist)
      try {
        const usersResponse = await fetch('/api/admin/users');
        const usersData = await usersResponse.json();
        if (usersData.success && usersData.data.users.length === 0) {
          setNeedsInit(true);
        } else {
          setNeedsInit(false);
        }
      } catch {
        // If we can't check, assume we need init
        setNeedsInit(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      // Try to check if init is needed
      try {
        const usersResponse = await fetch('/api/admin/users');
        const usersData = await usersResponse.json();
        if (usersData.success && usersData.data.users.length === 0) {
          setNeedsInit(true);
        } else {
          setNeedsInit(false);
        }
      } catch {
        setNeedsInit(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleAuthChanged = () => {
      void checkAuth();
    };

    void checkAuth();
    if (typeof window !== 'undefined') {
      window.addEventListener(ADMIN_AUTH_EVENT, handleAuthChanged);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(ADMIN_AUTH_EVENT, handleAuthChanged);
      }
    };
  }, [checkAuth]);

  const handleInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInitError('');
    setInitSuccess('');

    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setInitSuccess('Admin user created! Redirecting to login...');
        setTimeout(() => {
          setNeedsInit(false);
          window.location.reload();
        }, 1500);
      } else {
        setInitError(data.error || 'Failed to create admin user');
      }
    } catch (error) {
      setInitError('An error occurred. Please try again.');
      console.error('Init error:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (needsInit) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>🚀 Setup Admin Account</h1>
            <p className={styles.loginSubtitle}>Create your first admin user to get started</p>
          </div>
          <form onSubmit={handleInit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.875rem' }}>
                Name
              </label>
              <input
                type="text"
                value={initData.name}
                onChange={(e) => setInitData({ ...initData, name: e.target.value })}
                required
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.875rem' }}>
                Email
              </label>
              <input
                type="email"
                value={initData.email}
                onChange={(e) => setInitData({ ...initData, email: e.target.value })}
                required
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.875rem' }}>
                Password
              </label>
              <input
                type="password"
                value={initData.password}
                onChange={(e) => setInitData({ ...initData, password: e.target.value })}
                required
                minLength={6}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '1rem',
                }}
              />
            </div>
            {initError && (
              <div style={{ padding: '0.75rem', borderRadius: '0.375rem', background: '#fee2e2', color: '#dc2626', fontSize: '0.875rem' }}>
                {initError}
              </div>
            )}
            {initSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: '0.375rem', background: '#d1fae5', color: '#065f46', fontSize: '0.875rem' }}>
                {initSuccess}
              </div>
            )}
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                background: 'linear-gradient(135deg, #fc914a 0%, #ebc519 100%)',
                color: '#000',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(252, 145, 74, 0.3)',
              }}
            >
              Create Admin Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>🔐 Admin Login</h1>
            <p className={styles.loginSubtitle}>Please sign in to access the admin panel</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
