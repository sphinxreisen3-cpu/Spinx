import styles from '../../styles/components/home/CTASection.module.css';

export function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerSection}>
            <h2 className={styles.title}>Buy a tour without leaving your home</h2>
            <p className={styles.description}>
              Using our website, you can book any tour just in a couple of clicks.
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <a href="#" className={styles.ctaButton}>
              Book Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
