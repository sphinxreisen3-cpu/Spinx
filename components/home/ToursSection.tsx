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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        // Add cache control and use AbortController for cleanup
        const controller = new AbortController();
        const response = await fetch('/api/tours?onSale=false&limit=12', {
          signal: controller.signal,
          cache: 'force-cache', // Use cached data when available
          next: { revalidate: 60 }, // Revalidate every 60 seconds
        });
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
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load tours');
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
    
    // Cleanup function to abort fetch on unmount
    return () => {
      // Cleanup handled by AbortController
    };
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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className={styles.cardLink} style={{ pointerEvents: 'none' }}>
                <div className={styles.card}>
                  <div className={styles.imageWrapper} style={{ backgroundColor: '#e5e7eb', minHeight: '200px' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }} />
                  </div>
                  <div className={styles.cardContent} style={{ padding: '1rem' }}>
                    <div style={{ 
                      height: '24px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '4px', 
                      marginBottom: '0.5rem',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }} />
                    <div style={{ 
                      height: '60px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '4px', 
                      marginBottom: '0.5rem',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }} />
                    <div style={{ 
                      height: '40px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '4px',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }} />
                  </div>
                </div>
              </div>
            ))
          ) : tours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
              {error ? <span style={{ color: 'red' }}>{error}</span> : t('home.toursSection.noTours')}
            </div>
          ) : (
            tours.map((tour) => (
              <Link
                key={tour.id}
                href={`/${locale}/tours/${tour.slug}#book`}
                className={styles.cardLink}
              >
                <div className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className={styles.image}
                      loading={tours.indexOf(tour) < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/images/tours/pyramid-sky-desert-ancient.jpg';
                      }}
                    />
                  </div>
                  <div className={styles.categoryBadge}>{tour.category}</div>
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
                      <button className={styles.bookButton}>{t('home.toursSection.bookNow')}</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
