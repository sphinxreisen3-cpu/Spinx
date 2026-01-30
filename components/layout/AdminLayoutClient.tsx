'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { adminNav } from '@/config/navigation';
import { NotificationSystem } from '@/components/admin/NotificationSystem';
import { AuthGuard } from '@/components/admin/AuthGuard';
import styles from '@/styles/components/layout/AdminLayout.module.css';
import { emitAdminAuthChanged } from '@/lib/auth/events';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split('/')[1] || 'en';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/verify', { method: 'DELETE' });
      emitAdminAuthChanged();
      router.push(`/${locale}/admin`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthGuard>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link href={`/${locale}`} className={styles.homeButton} title="Back to Public Site">
              🏠 Home
            </Link>

            <button
              type="button"
              className={styles.menuToggle}
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? 'Close admin menu' : 'Open admin menu'}
              aria-expanded={isMenuOpen}
              aria-controls="admin-nav"
            >
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
            </button>

            <nav
              id="admin-nav"
              className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
              aria-label="Admin navigation"
            >
              {adminNav.map((item) => {
                const target = `/${locale}${item.href}`;
                const isActive = pathname?.startsWith(target);
                return (
                  <Link
                    key={item.href}
                    href={target}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className={styles.headerActions}>
              <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>

        {/* Real-time notification system */}
        <NotificationSystem />
      </div>
    </AuthGuard>
  );
}
