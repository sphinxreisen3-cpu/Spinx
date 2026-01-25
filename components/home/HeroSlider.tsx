'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, Calendar } from 'lucide-react';
import styles from '../../styles/components/home/HeroSlider.module.css';

const slides = [
  {
    id: 1,
    image: '/images/pexels-bassel-zaki-706250525-18614692.webp',
    ctaLink: '#tours-section',
    stats: { destinations: '500+', experience: '15+', countries: '50+' },
  },
  {
    id: 2,
    image: '/images/pexels-freestockpro-1540108.webp',
    ctaLink: '#tours-section',
    stats: { happy: '10K+', tours: '250+', awards: '25+' },
  },
  {
    id: 3,
    image: '/images/byramids.webp',
    ctaLink: '#tours-section',
    stats: { insights: '1000+', guides: '50+', languages: '12+' },
  },
];

export function HeroSlider() {
  const t = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
                        <span className={styles.premiumBadgeText}>{t('home.hero.premiumBadge')}</span>
                      </div>

                      {/* Title */}
                      <div
                        className={`${styles.titleSection} ${index === currentSlide ? styles.titleSectionActive : ''}`}
                      >
                        <h1 className={styles.mainTitle}>{t(`home.hero.slides.${slide.id}.title`)}</h1>
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
                        {(t.raw(`home.hero.slides.${slide.id}.highlights`) as string[]).map((highlight, idx) => (
                          <div key={idx} className={styles.highlightItem}>
                            <div className={styles.highlightDot}></div>
                            <span className={styles.highlightText}>{highlight}</span>
                          </div>
                        ))}
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

                        <button
                          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
                          className={styles.secondaryCta}
                        >
                          <Calendar className={styles.secondaryCtaIcon} />
                          {t('home.hero.secondaryCta')}
                        </button>
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
                              <div className={styles.statLabel}>
                                {t(`home.hero.stats.${key}`)}
                              </div>
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
