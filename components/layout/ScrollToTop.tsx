'use client';

import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from '@/styles/components/layout/ScrollToTop.module.css';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${isVisible ? styles.buttonVisible : styles.buttonHidden}`}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <span className={styles.icon}>
        <FaArrowUp aria-hidden />
      </span>
      <span className={styles.label}>Top</span>
    </button>
  );
}
