'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/components/home/LatestTrips.module.css';

const featuredTours = [
  {
    id: 1,
    slug: 'pyramids-of-giza-tour',
    title: 'Pyramids of Giza Tour',
    image: '/images/tours/08.webp',
    category: 'Ancient Wonders',
    duration: '1 Day',
    rating: 4.8,
    price: '$299',
  },
  {
    id: 2,
    slug: 'red-sea-diving-adventure',
    title: 'Red Sea Diving Adventure',
    image: '/images/tours/istockphoto-1085592710-612x612.webp',
    category: 'Water Sports',
    duration: '2 Days',
    rating: 4.9,
    price: '$499',
  },
  {
    id: 3,
    slug: 'luxury-resort-stay',
    title: 'Luxury Resort Stay',
    image: '/images/tours/iStock-508838512-1-scaled.webp',
    category: 'Beach Resort',
    duration: '3 Days',
    rating: 4.7,
    price: '$699',
  },
];

export function LatestTrips() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(featuredTours.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.ceil(featuredTours.length / 3) - 1 : prev - 1));
  };

  const visibleTours = featuredTours.slice(currentIndex * 3, (currentIndex + 1) * 3);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Latest Trips</h2>
          <div className={styles.titleUnderline}></div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.grid}>
            {visibleTours.map((tour) => (
              <div key={tour.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className={styles.image}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            ))}
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
