'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminNav } from '@/config/navigation';
import { NotificationSystem } from '@/components/admin/NotificationSystem';
import { AuthGuard } from '@/components/admin/AuthGuard';
import styles from '@/styles/components/layout/AdminLayout.module.css';
import { emitAdminAuthChanged } from '@/lib/auth/events';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split('/')[1] || 'en';

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

            <nav className={styles.nav} aria-label="Admin navigation">
              {adminNav.map((item) => {
                const target = `/${locale}${item.href}`;
                const isActive = pathname?.startsWith(target);
                return (
                  <Link
                    key={item.href}
                    href={target}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
              🚪 Logout
            </button>
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
