'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaMap, FaCalendarAlt, FaStar, FaBars, FaTimes } from 'react-icons/fa';
import { adminNav } from '@/config/navigation';
import styles from '@/styles/components/layout/AdminSidebar.module.css';

const iconMap: Record<string, React.ReactNode> = {
  map: <FaMap className={styles.navIcon} />,
  calendar: <FaCalendarAlt className={styles.navIcon} />,
  star: <FaStar className={styles.navIcon} />,
};

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const locale = pathname?.split('/')[1] || 'en';

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href={`/${locale}/admin`} className={styles.logo}>
            <div className={styles.logoIcon}>S</div>
            <span className={styles.logoText}>Admin</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {adminNav.map((item) => {
              const target = `/${locale}${item.href}`;
              const isActive = pathname.startsWith(target);
              return (
                <li key={item.href} className={styles.navItem}>
                  <Link
                    href={target}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {iconMap[item.icon] || null}
                    <span className={styles.navLabel}>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
