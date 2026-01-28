import { getTranslations } from 'next-intl/server';
import styles from '../../styles/components/home/TravelTicker.module.css';

export async function TravelTicker() {
  const t = await getTranslations();
  const travelWords = t.raw('home.ticker.words') as string[];
  const words = Array.isArray(travelWords) ? [...travelWords, ...travelWords] : [];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tickerContainer}>
          <div className={styles.tickerWrapper}>
            {words.map((word, index) => (
              <span key={index} className={styles.wordItem}>
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
