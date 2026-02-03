'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, Calendar, Search } from 'lucide-react';
import styles from '../../styles/components/home/HeroSlider.module.css';
import type { Tour } from '@/types/tour.types';

const HERO_SEARCH_DEBOUNCE_MS = 300;
const HERO_SEARCH_LIMIT = 6;

interface HeroSearchTour {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: string;
  image: string;
}

const slides = [
  {
    id: 1,
    image: '/images/pexels-bassel-zaki-706250525-18614692.webp',
    ctaLink: '/tours',
    stats: { destinations: '500+', experience: '15+', countries: '50+' },
  },
  {
    id: 2,
    image: '/images/pexels-freestockpro-1540108.webp',
    ctaLink: '/tours',
    stats: { happy: '10K+', tours: '250+', awards: '25+' },
  },
  {
    id: 3,
    image: '/images/byramids.webp',
    ctaLink: '/tours',
    stats: { insights: '1000+', guides: '50+', languages: '12+' },
  },
];

function mapApiTourToHeroSearchTour(tour: Tour, locale: string): HeroSearchTour {
  const isGerman = locale === 'de';
  const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
  const displayPrice = useEUR ? (tour.priceEUR ?? tour.price) : tour.price;
  const currencySymbol = useEUR ? '€' : '$';
  return {
    id: tour._id,
    slug: tour.slug,
    title: isGerman && tour.title_de ? tour.title_de : tour.title,
    category: isGerman && tour.category_de ? tour.category_de : tour.category,
    price: `${currencySymbol}${displayPrice}`,
    image: tour.image1 || '/images/tours/pyramid-sky-desert-ancient.jpg',
  };
}

export function HeroSlider() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const heroSearchRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [heroSearchResults, setHeroSearchResults] = useState<HeroSearchTour[]>([]);
  const [heroSearchLoading, setHeroSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroSearchQuery.trim();
    setShowSearchDropdown(false);
    if (q) {
      router.push(`/${locale}/tours?search=${encodeURIComponent(q)}`);
    } else {
      router.push(`/${locale}/tours`);
    }
  };

  const fetchHeroSearchResults = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setHeroSearchResults([]);
        return;
      }
      setHeroSearchLoading(true);
      try {
        const params = new URLSearchParams({
          search: query.trim(),
          limit: String(HERO_SEARCH_LIMIT),
          isActive: 'true',
        });
        const res = await fetch(`/api/tours?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        const tours: Tour[] = data.data?.tours ?? [];
        setHeroSearchResults(tours.map((tour) => mapApiTourToHeroSearchTour(tour, locale)));
      } catch {
        setHeroSearchResults([]);
      } finally {
        setHeroSearchLoading(false);
      }
    },
    [locale]
  );

  useEffect(() => {
    const q = heroSearchQuery.trim();
    if (!q) {
      setHeroSearchResults([]);
      setHeroSearchLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      fetchHeroSearchResults(heroSearchQuery);
    }, HERO_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [heroSearchQuery, fetchHeroSearchResults]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (heroSearchRef.current && !heroSearchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onHeroSearchFocus = () => {
    if (heroSearchQuery.trim()) setShowSearchDropdown(true);
  };

  const onHeroSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroSearchQuery(e.target.value);
    if (e.target.value.trim()) setShowSearchDropdown(true);
    else setShowSearchDropdown(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className={styles.heroSlider}>
      {/* Background Images Layer */}
      <div className={styles.sliderContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slideImage} ${index === currentSlide ? styles.slideImageActive : ''}`}
          >
            <div className={styles.slideImageInner}>
              <Image
                src={slide.image}
                alt={t(`home.hero.slides.${slide.id}.title`)}
                fill
                className="object-cover object-center"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                quality={index === 0 ? 90 : 75}
                sizes="100vw"
              />
              {/* Consistent gradient overlay */}
              <div className={styles.gradientOverlay}></div>
            </div>
          </div>
        ))}

        {/* Content Container - Always centered */}
        <div className={styles.contentContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.contentInner}>
              {/* Hero search bar with live results dropdown */}
              <div className={styles.heroSearchRoot} ref={heroSearchRef}>
                <form
                  className={styles.heroSearchForm}
                  onSubmit={handleHeroSearch}
                  role="search"
                  aria-label={t('home.hero.searchAria')}
                >
                  <div className={styles.heroSearchWrapper}>
                    <Search className={styles.heroSearchIcon} aria-hidden />
                    <input
                      type="search"
                      className={styles.heroSearchInput}
                      placeholder={t('home.hero.searchPlaceholder')}
                      value={heroSearchQuery}
                      onChange={onHeroSearchChange}
                      onFocus={onHeroSearchFocus}
                      aria-label={t('home.hero.searchPlaceholder')}
                      autoComplete="off"
                      aria-expanded={
                        showSearchDropdown && (heroSearchLoading || heroSearchResults.length > 0)
                      }
                      aria-haspopup="listbox"
                    />
                    <button type="submit" className={styles.heroSearchButton}>
                      {t('home.hero.searchButton')}
                    </button>
                  </div>
                </form>

                {showSearchDropdown && heroSearchQuery.trim() && (
                  <div
                    className={styles.heroSearchDropdown}
                    role="listbox"
                    aria-label={t('home.hero.searchAria')}
                  >
                    {heroSearchLoading ? (
                      <div className={styles.heroSearchDropdownLoading}>
                        <span className={styles.heroSearchDropdownSpinner} aria-hidden />
                        <span>{t('common.loading')}</span>
                      </div>
                    ) : heroSearchResults.length > 0 ? (
                      <ul className={styles.heroSearchDropdownList}>
                        {heroSearchResults.map((tour) => (
                          <li key={tour.id} className={styles.heroSearchDropdownItem}>
                            <Link
                              href={`/${locale}/tours/${tour.slug}#book`}
                              className={styles.heroSearchCard}
                              onClick={() => setShowSearchDropdown(false)}
                            >
                              <div className={styles.heroSearchCardImage}>
                                <img
                                  src={tour.image}
                                  alt=""
                                  width={72}
                                  height={72}
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      '/images/tours/pyramid-sky-desert-ancient.jpg';
                                  }}
                                />
                              </div>
                              <div className={styles.heroSearchCardBody}>
                                <span className={styles.heroSearchCardTitle}>{tour.title}</span>
                                <span className={styles.heroSearchCardMeta}>
                                  {tour.category} · {tour.price}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={styles.heroSearchDropdownEmpty}>
                        {t('home.toursSection.noTours')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`${styles.slideContent} ${index === currentSlide ? styles.slideContentActive : ''}`}
                >
                  <div className={styles.contentGrid}>
                    {/* Main Content - Left Side */}
                    <div className={styles.mainContent}>
                      {/* Premium Badge */}
                      <div
                        className={`${styles.premiumBadge} ${index === currentSlide ? styles.premiumBadgeActive : ''}`}
                      >
                        <Star className={styles.premiumBadgeIcon} />
                        <span className={styles.premiumBadgeText}>
                          {t('home.hero.premiumBadge')}
                        </span>
                      </div>

                      {/* Title */}
                      <div
                        className={`${styles.titleSection} ${index === currentSlide ? styles.titleSectionActive : ''}`}
                      >
                        <h1 className={styles.mainTitle}>
                          {t(`home.hero.slides.${slide.id}.title`)}
                        </h1>
                        <div className={styles.titleDivider}></div>
                      </div>

                      {/* Subtitle */}
                      <h2
                        className={`${styles.subtitle} ${index === currentSlide ? styles.subtitleActive : ''}`}
                      >
                        {t(`home.hero.slides.${slide.id}.subtitle`)}
                      </h2>

                      {/* Description */}
                      <p
                        className={`${styles.description} ${index === currentSlide ? styles.descriptionActive : ''}`}
                      >
                        {t(`home.hero.slides.${slide.id}.description`)}
                      </p>

                      {/* Highlights */}
                      <div
                        className={`${styles.highlights} ${index === currentSlide ? styles.highlightsActive : ''}`}
                      >
                        {(t.raw(`home.hero.slides.${slide.id}.highlights`) as string[]).map(
                          (highlight, idx) => (
                            <div key={idx} className={styles.highlightItem}>
                              <div className={styles.highlightDot}></div>
                              <span className={styles.highlightText}>{highlight}</span>
                            </div>
                          )
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div
                        className={`${styles.ctaButtons} ${index === currentSlide ? styles.ctaButtonsActive : ''}`}
                      >
                        <Link href={slide.ctaLink} className={styles.primaryCta}>
                          <span className={styles.primaryCtaContent}>
                            <MapPin className={styles.primaryCtaIcon} />
                            {t(`home.hero.slides.${slide.id}.ctaText`)}
                          </span>
                          <div className={styles.primaryCtaOverlay}></div>
                        </Link>

                        <Link href="/tours" className={styles.secondaryCta}>
                          <Calendar className={styles.secondaryCtaIcon} />
                          {t('home.hero.secondaryCta')}
                        </Link>
                      </div>
                    </div>

                    {/* Stats Cards - Right Side */}
                    <div className={styles.statsSection}>
                      <div
                        className={`${styles.statsGrid} ${index === currentSlide ? styles.statsGridActive : ''}`}
                      >
                        {Object.entries(slide.stats).map(([key, value]) => (
                          <div key={key} className={styles.statCard}>
                            <div className={styles.statCardOverlay}></div>
                            <div className={styles.statCardContent}>
                              <div className={styles.statValue}>{value}</div>
                              <div className={styles.statLabel}>{t(`home.hero.stats.${key}`)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`${styles.navArrow} ${styles.navArrowLeft}`}
          aria-label={t('home.hero.prevAria')}
        >
          <ChevronLeft className={styles.navArrowIcon} />
        </button>

        <button
          onClick={nextSlide}
          className={`${styles.navArrow} ${styles.navArrowRight}`}
          aria-label={t('home.hero.nextAria')}
        >
          <ChevronRight className={styles.navArrowIcon} />
        </button>

        {/* Slide Indicators */}
        <div className={styles.indicators}>
          <div className={styles.indicatorsContainer}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <span className="sr-only">Slide {index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          ></div>
        </div>

        {/* Auto-play Toggle */}
        <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className={styles.autoPlayToggle}>
          <div
            className={`${styles.statusIndicator} ${isAutoPlaying ? styles.statusIndicatorActive : styles.statusIndicatorInactive}`}
          ></div>
          <span className={styles.statusText}>
            {isAutoPlaying ? t('home.hero.auto') : t('home.hero.paused')}
          </span>
        </button>
      </div>
    </section>
  );
}
