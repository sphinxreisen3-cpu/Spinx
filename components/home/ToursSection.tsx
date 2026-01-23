'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
        const mappedTours: TourCard[] = apiTours.map((tour: Tour) => ({
          id: tour._id,
          slug: tour.slug,
          title: tour.title,
          category: tour.category,
          duration: tour.travelType,
          rating: 4.8, // Default rating since not in API
          price: `$${tour.price}`,
          image: tour.image1 || '/images/placeholder-tour.jpg', // Use uploaded image or placeholder
          description: tour.description,
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
  return (
    <section className={styles.section} id="tours-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🏖️ Amazing Destinations
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
                    placeholder="Search tours by destination, activity, or description..."
                    className={styles.searchInput}
                  />
                  <span className={styles.searchIcon}>🔍</span>
                </div>
              </div>

              <div className={styles.selectWrapper}>
                <select id="category-filter" className={styles.selectInput}>
                  <option value="">All Categories</option>
                  <option value="Ancient Wonders">Ancient Wonders</option>
                  <option value="Water Sports">Water Sports</option>
                  <option value="Beach Resort">Beach Resort</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Historical">Historical</option>
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
              {error ? <span style={{ color: 'red' }}>{error}</span> : 'No tours available.'}
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
                    <Link href={`/tours/${tour.slug}`}>
                      <button className={styles.bookButton}>Book Now</button>
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
