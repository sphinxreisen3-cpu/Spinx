'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Tour } from '@/types/tour.types';
import styles from '@/styles/components/home/SpecialDeals.module.css';

interface SaleTourCard {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  originalPrice: string;
  discountedPrice: string;
  discount: number;
  image: string;
  description: string;
}

export function SpecialDeals() {
  const locale = useLocale();
  const t = useTranslations();
  const [saleTours, setSaleTours] = useState<SaleTourCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaleTours = async () => {
      try {
        const response = await fetch('/api/tours?onSale=true&limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch sale tours');
        }
        const data = await response.json();
        const apiTours: Tour[] = data.data.tours;

        // Map API tours to SaleTourCard format
        const isGerman = locale === 'de';
        const mappedTours: SaleTourCard[] = apiTours.map((tour: Tour) => {
          const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
          const basePrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
          const currencySymbol = useEUR ? '€' : '$';
          const discountedPrice = Math.round(basePrice - (basePrice * tour.discount) / 100);
          return {
            id: tour._id,
            slug: tour.slug,
            title: isGerman && tour.title_de ? tour.title_de : tour.title,
            category: isGerman && tour.category_de ? tour.category_de : tour.category,
            duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
            originalPrice: `${currencySymbol}${basePrice}`,
            discountedPrice: `${currencySymbol}${discountedPrice}`,
            discount: tour.discount,
            image: tour.image1 || '/images/placeholder-tour.jpg',
            description: isGerman && tour.description_de ? tour.description_de : tour.description,
          };
        });

        setSaleTours(mappedTours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sale tours');
        console.error('Error fetching sale tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleTours();
  }, [locale]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🔥 {t('home.specialDeals.title')}
          </h2>
          <p className={styles.subtitle}>
            {t('home.specialDeals.subtitle')}
          </p>
          <div className={styles.titleUnderline}></div>
        </div>

        {loading ? (
          <div className={styles.content}>
            <div className={styles.iconEmoji}>🏷️</div>
            <h3 className={styles.loadingTitle}>
              {t('home.specialDeals.loadingTitle')}
            </h3>
            <p className={styles.loadingText}>
              {t('home.specialDeals.loadingDesc')}
            </p>
          </div>
        ) : error ? (
          <div className={styles.content}>
            <div className={styles.iconEmoji}>❌</div>
            <h3 className={styles.loadingTitle}>
              {t('home.specialDeals.errorTitle')}
            </h3>
            <p className={styles.loadingText}>
              {error}
            </p>
          </div>
        ) : saleTours.length === 0 ? (
          <div className={styles.content}>
            <div className={styles.iconEmoji}>🎉</div>
            <h3 className={styles.loadingTitle}>
              {t('home.specialDeals.noDealsTitle')}
            </h3>
            <p className={styles.loadingText}>
              {t('home.specialDeals.noDealsDesc')}
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {saleTours.map((tour) => (
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
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/images/tours/pyramid-sky-desert-ancient.jpg';
                      }}
                    />
                  </div>
                  <div className={styles.discountBadge}>
                    {tour.discount}% OFF
                  </div>
                  <div className={styles.categoryBadge}>
                    {tour.category}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {tour.title}
                    </h3>
                    <p className={styles.cardDescription}>
                      {tour.description}
                    </p>
                    <div className={styles.priceSection}>
                      <div className={styles.priceContainer}>
                        <span className={styles.originalPrice}>
                          {tour.originalPrice}
                        </span>
                        <span className={styles.discountedPrice}>
                          {tour.discountedPrice}
                        </span>
                      </div>
                      <button className={styles.bookButton}>
                        {t('home.specialDeals.bookNow')}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
