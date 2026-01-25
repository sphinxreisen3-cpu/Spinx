'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import styles from '../../styles/components/home/TravelTicker.module.css';

export function TravelTicker() {
  const [words, setWords] = useState<string[]>([]);
  const t = useTranslations();

  useEffect(() => {
    // Create two copies for seamless scrolling
    const travelWords = t.raw('home.ticker.words') as string[];
    setWords([...travelWords, ...travelWords]);
  }, [t]);

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
