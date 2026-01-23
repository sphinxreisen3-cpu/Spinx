'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/components/home/LatestTrips.module.css';
import type { Tour } from '@/types/tour.types';

interface TourCard {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  duration: string;
  rating: number;
  price: string;
}

export function LatestTrips() {
  const [tours, setTours] = useState<TourCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours?onSale=false&limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        const apiTours: Tour[] = data.data.tours;

        // Map API tours to TourCard format
        const mappedTours: TourCard[] = apiTours.map((tour: Tour) => ({
          id: tour._id,
          slug: tour.slug,
          title: tour.title,
          image: tour.image1 || '/images/placeholder-tour.jpg',
          category: tour.category,
          duration: tour.travelType,
          rating: 4.8, // Default rating
          price: `$${tour.price}`,
        }));

        setTours(mappedTours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tours');
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(tours.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.ceil(tours.length / 3) - 1 : prev - 1));
  };

  const visibleTours = tours.slice(currentIndex * 3, (currentIndex + 1) * 3);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Latest Trips</h2>
          <div className={styles.titleUnderline}></div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.grid}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                Loading tours...
              </div>
            ) : error ? (
              <div
                style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1', color: 'red' }}
              >
                {error}
              </div>
            ) : tours.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                No tours available.
              </div>
            ) : (
              visibleTours.map((tour: TourCard) => (
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
                      <Link href={`/tours/${tour.slug}`}>
                        <button className={styles.bookButton}>Book Now</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            aria-label="Previous tours"
          >
            <ChevronLeft className={styles.navIcon} />
          </button>

          <button
            onClick={nextSlide}
            className={`${styles.navButton} ${styles.navButtonNext}`}
            aria-label="Next tours"
          >
            <ChevronRight className={styles.navIcon} />
          </button>
        </div>
      </div>
    </section>
  );
}
