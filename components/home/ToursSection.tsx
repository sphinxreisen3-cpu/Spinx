'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from '@/styles/components/home/ToursSection.module.css';
import type { Tour } from '@/types/tour.types';

interface TourCard {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  rating: number;
  price: string;
  image: string;
  description: string;
}

export function ToursSection() {
  const locale = useLocale();
  const t = useTranslations();
  const [tours, setTours] = useState<TourCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours?onSale=false&limit=12');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        const apiTours: Tour[] = data.data.tours;

        // Map API tours to TourCard format
        const isGerman = locale === 'de';
        const mappedTours: TourCard[] = apiTours.map((tour: Tour) => {
          const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
          const displayPrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
          const currencySymbol = useEUR ? '€' : '$';
          return {
            id: tour._id,
            slug: tour.slug,
            title: isGerman && tour.title_de ? tour.title_de : tour.title,
            category: isGerman && tour.category_de ? tour.category_de : tour.category,
            duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
            rating: 4.8, // Default rating since not in API
            price: `${currencySymbol}${displayPrice}`,
            image: tour.image1 || '/images/placeholder-tour.jpg', // Use uploaded image or placeholder
            description: isGerman && tour.description_de ? tour.description_de : tour.description,
          };
        });

        setTours(mappedTours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tours');
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [locale]);
  return (
    <section className={styles.section} id="tours-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🏖️ {t('home.toursSection.title')}
            <div className={styles.titleUnderline}></div>
          </h2>
        </div>

        {/* Search and Filter */}
        <div className={styles.filterSection}>
          <div className={styles.filterWrapper}>
            <div className={styles.filterRow}>
              <div className={styles.searchWrapper}>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    id="tours-search"
                    placeholder={t('home.toursSection.searchPlaceholder')}
                    className={styles.searchInput}
                  />
                  <span className={styles.searchIcon}>🔍</span>
                </div>
              </div>

              <div className={styles.selectWrapper}>
                <select id="category-filter" className={styles.selectInput}>
                  <option value="">{t('home.toursSection.allCategories')}</option>
                  <option value="Ancient Wonders">{t('home.toursSection.categories.ancientWonders')}</option>
                  <option value="Water Sports">{t('home.toursSection.categories.waterSports')}</option>
                  <option value="Beach Resort">{t('home.toursSection.categories.beachResort')}</option>
                  <option value="Cultural">{t('home.toursSection.categories.cultural')}</option>
                  <option value="Adventure">{t('home.toursSection.categories.adventure')}</option>
                  <option value="Historical">{t('home.toursSection.categories.historical')}</option>
                </select>
                <span className={styles.selectIcon}>📂</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        <div className={styles.grid}>
          {tours.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
              {error ? <span style={{ color: 'red' }}>{error}</span> : t('home.toursSection.noTours')}
            </div>
          ) : (
            tours.map((tour) => (
              <div key={tour.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className={styles.image}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/tours/pyramid-sky-desert-ancient.jpg';
                    }}
                  />
                  <div className={styles.categoryBadge}>{tour.category}</div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{tour.title}</h3>

                  <p className={styles.cardDescription}>{tour.description}</p>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>⏱️</span>
                      {tour.duration}
                    </span>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>⭐</span>
                      {tour.rating}
                    </span>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{tour.price}</span>
                    <Link href={`/${locale}/tours/${tour.slug}#book`}>
                      <button className={styles.bookButton}>{t('home.toursSection.bookNow')}</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
