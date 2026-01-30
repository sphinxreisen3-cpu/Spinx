import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { TOUR_CATEGORIES } from '@/config/tours';
import styles from '../../styles/components/home/TravelTicker.module.css';

interface TravelTickerProps {
  locale: string;
}

export async function TravelTicker({ locale }: TravelTickerProps) {
  const t = await getTranslations();
  const items = TOUR_CATEGORIES.map((cat) => ({
    label: t(`home.toursSection.categories.${cat.toLowerCase()}`),
    category: cat,
  }));
  const itemsDuplicated = [...items, ...items];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tickerContainer}>
          <div className={styles.tickerWrapper}>
            {itemsDuplicated.map((item, index) => (
              <Link
                key={`${item.category}-${index}`}
                href={`/${locale}/tours?category=${encodeURIComponent(item.category)}`}
                className={styles.wordItem}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
