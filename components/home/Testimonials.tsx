'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/components/home/Testimonials.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Ann McMillan',
    role: 'Regular Customer',
    initials: 'AM',
    image: 'blue',
    text: "My experience traveling to Egypt with Sealine Travel was absolutely unforgettable! The pyramids of Giza were breathtaking up close, and walking among these ancient wonders took me back thousands of years. Our expert guide made the history come alive, explaining the construction techniques and daily life of the pharaohs. The accommodations in Cairo were luxurious and comfortable. I'll never forget riding a camel at sunset against the desert backdrop - it was pure magic!",
  },
  {
    id: 2,
    name: 'Debra Ortega',
    role: 'Regular Customer',
    initials: 'DO',
    image: 'green',
    text: "Visiting the Nile Valley and Alexandria with Sealine Travel was a dream come true! Sailing on a traditional felucca at sunset while watching the sun set behind ancient temples was pure magic. Our guide's stories about Cleopatra and the pharaohs brought the ancient world to life. The temples of Luxor and Karnak were absolutely magnificent - walking through courtyards built thousands of years ago gave me chills. The hospitality, food, and attention to detail in every aspect of the tour made this an unforgettable journey through Egypt's rich history.",
  },
  {
    id: 3,
    name: 'Samantha Smith',
    role: 'Regular Customer',
    initials: 'SS',
    image: 'purple',
    text: "Exploring the Sinai Peninsula with Sealine Travel was absolutely incredible! The Red Sea diving experience was world-class with crystal clear waters and vibrant coral reefs teeming with marine life. Visiting Saint Catherine's Monastery, one of the world's oldest Christian monasteries, was a profound spiritual experience. The Mount Sinai sunrise was absolutely breathtaking - watching the sun rise over the desert was a moment I'll treasure forever. The Bedouin hospitality and authentic experiences made this journey truly special and unforgettable!",
  },
];

export function Testimonials() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  const getAvatarClass = (image: string) => {
    switch (image) {
      case 'blue':
        return styles.avatarBlue;
      case 'green':
        return styles.avatarGreen;
      case 'purple':
        return styles.avatarPurple;
      default:
        return styles.avatarBlue;
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('home.testimonials.title')}</h2>
        <div className={styles.titleUnderline}></div>

        <div className={styles.wrapper}>
          <article className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.avatarWrapper}>
                <div className={`${styles.avatar} ${getAvatarClass(currentTestimonial.image)}`}>
                  {currentTestimonial.initials}
                </div>
              </div>

              <div className={styles.contentWrapper}>
                <blockquote className={styles.quote}>
                  &ldquo;{t(`home.testimonials.items.${currentTestimonial.id}.text`)}&rdquo;
                </blockquote>

                <div className={styles.authorSection}>
                  <cite className={styles.authorName}>{currentTestimonial.name}</cite>
                  <span className={styles.authorRole}>{t('home.testimonials.role')}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            aria-label={t('home.testimonials.prevAria')}
          >
            <ChevronLeft className={styles.navIcon} />
          </button>

          <button
            onClick={nextTestimonial}
            className={`${styles.navButton} ${styles.navButtonNext}`}
            aria-label={t('home.testimonials.nextAria')}
          >
            <ChevronRight className={styles.navIcon} />
          </button>

          {/* Pagination Dots */}
          <div className={styles.pagination}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`${styles.paginationDot} ${
                  index === currentIndex ? styles.paginationDotActive : styles.paginationDotInactive
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
