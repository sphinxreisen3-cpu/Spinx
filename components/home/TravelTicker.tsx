'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/components/home/TravelTicker.module.css';

const travelWords = [
  'Egypt Tours',
  'Pyramids of Giza',
  'Red Sea Diving',
  'Nile Cruises',
  'Luxor Temples',
  'Hurghada Resorts',
  'Desert Safaris',
  'Ancient Alexandria',
  'Sinai Mountains',
  'Valley of Kings',
  'Abu Simbel',
  'Red Sea Snorkeling',
  'Luxury Hotels',
  'Cultural Tours',
  'Adventure Travel',
  'Beach Holidays',
  'Historical Sites',
  'Egypt Vacations',
  'Pharaoh Tours',
  'Mediterranean Cruises',
];

export function TravelTicker() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    // Create two copies for seamless scrolling
    setWords([...travelWords, ...travelWords]);
  }, []);

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
