'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
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
  originalPrice?: string;
  discount?: number;
  isOnSale: boolean;
}

export function LatestTrips() {
  const locale = useLocale();
  const t = useTranslations();
  const [tours, setTours] = useState<TourCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        // Fetch all tours (including discounted ones)
        const response = await fetch('/api/tours?limit=12&isActive=true');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        const apiTours: Tour[] = data.data.tours;

        // Map API tours to TourCard format with bilingual support
        const isGerman = locale === 'de';
        const mappedTours: TourCard[] = apiTours.map((tour: Tour) => {
          const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
          const basePrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
          const currencySymbol = useEUR ? '€' : '$';
          const isOnSale = tour.onSale && tour.discount > 0;
          const discountedPrice = isOnSale
            ? Math.round(basePrice - (basePrice * tour.discount) / 100)
            : basePrice;

          return {
            id: tour._id,
            slug: tour.slug,
            title: isGerman && tour.title_de ? tour.title_de : tour.title,
            image: tour.image1 || '/images/placeholder-tour.jpg',
            category: isGerman && tour.category_de ? tour.category_de : tour.category,
            duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
            rating: 4.8, // Default rating
            price: `${currencySymbol}${discountedPrice}`,
            originalPrice: isOnSale ? `${currencySymbol}${basePrice}` : undefined,
            discount: tour.discount,
            isOnSale,
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

  // Handle window resize for responsive tours per slide
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Calculate tours per slide based on screen size
  const getToursPerSlide = () => {
    if (windowWidth === 0) return 3; // Default before hydration
    if (windowWidth < 768) return 1; // Mobile: 1 card
    if (windowWidth < 1024) return 2; // Tablet: 2 cards
    return 3; // Desktop: 3 cards
  };

  const toursPerSlide = getToursPerSlide();
  const totalSlides = tours.length > 0 ? Math.ceil(tours.length / toursPerSlide) : 0;

  // Reset slide index when tours per slide changes (e.g., on resize)
  useEffect(() => {
    if (totalSlides > 0 && currentIndex >= totalSlides) {
      setCurrentIndex(0);
    }
  }, [toursPerSlide, totalSlides, currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    if (totalSlides === 0) return;
    setIsAutoPlaying(false); // Pause auto-play on manual navigation
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides === 0) return;
    setIsAutoPlaying(false); // Pause auto-play on manual navigation
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setIsAutoPlaying(false); // Pause auto-play on manual navigation
      setCurrentIndex(index);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('home.latestTrips.title')}</h2>
          <div className={styles.titleUnderline}></div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.sliderContainer}>
            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {loading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingIcon}>⏳</div>
                  <p>{t('home.latestTrips.loading')}</p>
                </div>
              ) : error ? (
                <div className={styles.errorState}>
                  <div className={styles.errorIcon}>❌</div>
                  <p>{error}</p>
                </div>
              ) : tours.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🎒</div>
                  <p>{t('home.latestTrips.noTours')}</p>
                </div>
              ) : (
                Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className={styles.slide}>
                    {tours
                      .slice(slideIndex * toursPerSlide, (slideIndex + 1) * toursPerSlide)
                      .map((tour: TourCard) => (
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
                            {tour.isOnSale && tour.discount && (
                              <div className={styles.discountBadge}>
                                {tour.discount}% OFF
                              </div>
                            )}
                            <div className={styles.categoryBadge}>{tour.category}</div>
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
                                <div className={styles.priceContainer}>
                                  {tour.isOnSale && tour.originalPrice && (
                                    <span className={styles.originalPrice}>
                                      {tour.originalPrice}
                                    </span>
                                  )}
                                  <span className={styles.price}>{tour.price}</span>
                                </div>
                                <button className={styles.bookButton}>
                                  {t('home.latestTrips.bookNow')}
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          {tours.length > toursPerSlide && (
            <>
              <button
                onClick={prevSlide}
                className={`${styles.navButton} ${styles.navButtonPrev}`}
                aria-label={t('home.latestTrips.prevAria')}
              >
                <ChevronLeft className={styles.navIcon} />
              </button>

              <button
                onClick={nextSlide}
                className={`${styles.navButton} ${styles.navButtonNext}`}
                aria-label={t('home.latestTrips.nextAria')}
              >
                <ChevronRight className={styles.navIcon} />
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {tours.length > toursPerSlide && totalSlides > 1 && (
            <div className={styles.indicators}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${index === currentIndex ? styles.indicatorActive : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
