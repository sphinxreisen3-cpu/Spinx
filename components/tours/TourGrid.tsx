'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import styles from '@/styles/components/tours/TourGrid.module.css';
import type { Tour } from '@/types/tour.types';

interface TourCard {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  isOnSale: boolean;
  currencySymbol?: string;
}

export function TourGrid() {
  const locale = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [tours, setTours] = useState<TourCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = searchParams.get('category') ?? '';
  const search = searchParams.get('search') ?? '';
  const onSale = searchParams.get('onSale') ?? '';

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('limit', '24');
        params.append('isActive', 'true');
        if (category) params.append('category', category);
        if (search.trim()) params.append('search', search.trim());
        if (onSale === 'true') params.append('onSale', 'true');

        const response = await fetch(`/api/tours?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        const apiTours: Tour[] = data.data.tours;

        const isGerman = locale === 'de';
        const mappedTours: TourCard[] = apiTours.map((tour: Tour) => {
          const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
          const basePrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
          const isOnSale = tour.onSale && tour.discount > 0;
          const discountedPrice = isOnSale
            ? Math.round(basePrice - (basePrice * tour.discount) / 100)
            : basePrice;

          return {
            id: tour._id,
            slug: tour.slug,
            title: isGerman && tour.title_de ? tour.title_de : tour.title,
            category: isGerman && tour.category_de ? tour.category_de : tour.category,
            duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
            price: discountedPrice,
            originalPrice: isOnSale ? basePrice : undefined,
            discount: tour.discount,
            image: tour.image1 || '/images/tours/pyramid-sky-desert-ancient.jpg',
            description: isGerman && tour.description_de ? tour.description_de : tour.description,
            isOnSale,
            currencySymbol: useEUR ? '€' : '$',
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
  }, [category, search, onSale, locale]);

  if (loading) {
    return (
      <div className={styles.grid}>
        <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.grid}>
        <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1', color: 'red' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className={styles.grid}>
        <div style={{ textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
          <p>{t('home.toursSection.noTours')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
        {tours.map((tour) => (
          <Link key={tour.id} href={`/${locale}/tours/${tour.slug}#book`} className={styles.cardLink}>
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={tour.image}
                  alt={tour.title}
                  className={styles.image}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/tours/pyramid-sky-desert-ancient.jpg';
                  }}
                />
                {tour.isOnSale && tour.discount && (
                  <div className={styles.saleBadge}>{tour.discount}% OFF</div>
                )}
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
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.priceContainer}>
                    {tour.isOnSale && tour.originalPrice && (
                      <span className={styles.originalPrice}>
                        {tour.currencySymbol || '$'}
                        {tour.originalPrice}
                      </span>
                    )}
                    <span className={styles.price}>
                      {tour.currencySymbol || '$'}
                      {tour.price}
                    </span>
                  </div>
                  <button className={styles.bookButton}>{t('home.toursSection.bookNow')}</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
