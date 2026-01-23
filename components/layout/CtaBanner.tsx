import Link from 'next/link';
import styles from '../../styles/components/layout/CtaBanner.module.css';

export function CtaBanner() {
  return (
    <section className={styles.ctaBanner}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <span className={styles.pill}>Plan with local experts</span>
            <h3 className={styles.heading}>Buy a tour without leaving your home</h3>
            <p className={styles.description}>
              Using our website, you can book any tour just in a couple of clicks.
            </p>
            <p className={styles.subtext}>
              Secure payments, instant confirmation, and concierge support.
            </p>
          </div>
          <Link className={styles.ctaButton} href="/tours">
            <span>Book Now</span>
            <span className={styles.arrow} aria-hidden>
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
