import styles from '@/styles/components/tours/TourCard.module.css';

export function TourCard() {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}></div>
      <div className={styles.content}>
        <h3 className={styles.title}>Tour Title</h3>
        <p className={styles.description}>Tour description...</p>
      </div>
    </div>
  );
}
