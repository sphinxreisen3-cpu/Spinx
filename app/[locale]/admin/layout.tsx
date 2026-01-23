'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNav } from '@/config/navigation';
import styles from '@/styles/components/layout/AdminLayout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  return (
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
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
