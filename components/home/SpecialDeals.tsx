import styles from '@/styles/components/home/SpecialDeals.module.css';

export function SpecialDeals() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>🔥 Special Deals</h2>
          <p className={styles.subtitle}>Don&apos;t miss out on these amazing discounted tours!</p>
          <div className={styles.titleUnderline}></div>
        </div>

        <div className={styles.content}>
          <div className={styles.iconEmoji}>🏷️</div>
          <h3 className={styles.loadingTitle}>Loading Special Offers...</h3>
          <p className={styles.loadingText}>Amazing deals coming your way</p>
        </div>
      </div>
    </section>
  );
}
