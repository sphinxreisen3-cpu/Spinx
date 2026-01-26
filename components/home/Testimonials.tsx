'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/components/home/Testimonials.module.css';

export function Testimonials() {
  const t = useTranslations();
  const locale = useLocale();
  const isGerman = locale === 'de';

  type DisplayTestimonial = {
    id: string;
    name: string;
    country?: string;
    role?: string;
    role_de?: string;
    initials: string;
    image: string;
    text: string;
    text_de?: string;
  };

  const [apiTestimonials, setApiTestimonials] = useState<DisplayTestimonial[]>([]);

  const testimonials = apiTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const manualPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    name: '',
    country: '',
    initials: '',
    text: '',
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pauseAfterInteraction = () => {
    setIsManualPaused(true);
    if (manualPauseTimeoutRef.current) {
      clearTimeout(manualPauseTimeoutRef.current);
    }
    manualPauseTimeoutRef.current = setTimeout(() => {
      setIsManualPaused(false);
    }, 8000);
  };

  const loadTestimonials = async (ignoreRef?: { ignore: boolean }) => {
    try {
      const res = await fetch('/api/testimonials?limit=50');
      const json = await res.json();

      const raw = json?.data?.testimonials;
      if (!res.ok || !json?.success || !Array.isArray(raw)) return;

      const mapped = raw
        .map((x: Record<string, unknown>) => ({
          id: String((x._id as string) || (x.id as string) || ''),
          name: String(x.name || ''),
          country: x.country ? String(x.country) : undefined,
          role: x.role ? String(x.role) : undefined,
          role_de: x.role_de ? String(x.role_de) : undefined,
          initials: String(x.initials || ''),
          image: String(x.image || 'blue'),
          text: String(x.text || ''),
          text_de: x.text_de ? String(x.text_de) : undefined,
        }))
        .filter((x: { id: string; name: string; initials: string; text: string }) =>
          Boolean(x.id && x.name && x.initials && x.text)
        );

      if (!ignoreRef?.ignore) {
        setApiTestimonials(mapped);
      }
    } catch {
      // keep fallback
    }
  };

  useEffect(() => {
    const ignoreRef = { ignore: false };
    loadTestimonials(ignoreRef);
    return () => {
      ignoreRef.ignore = true;
    };
  }, []);

  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    if (isHoverPaused || isManualPaused) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6500);

    return () => {
      clearInterval(intervalId);
    };
  }, [testimonials.length, isHoverPaused, isManualPaused]);

  useEffect(() => {
    return () => {
      if (manualPauseTimeoutRef.current) {
        clearTimeout(manualPauseTimeoutRef.current);
      }
    };
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    pauseAfterInteraction();
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    pauseAfterInteraction();
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

  function openSubmit() {
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitForm({ name: '', country: '', initials: '', text: '' });
    setIsSubmitOpen(true);
    pauseAfterInteraction();
  }

  function closeSubmit() {
    setIsSubmitOpen(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }

  async function handleSubmit() {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      const name = submitForm.name.trim();
      const country = submitForm.country.trim();
      const initials = submitForm.initials.trim().toUpperCase();
      const text = submitForm.text.trim();

      if (name.length < 2) {
        setSubmitError(t('home.testimonials.submit.errors.name'));
        return;
      }
      if (country.length < 2) {
        setSubmitError(t('home.testimonials.submit.errors.country'));
        return;
      }
      if (initials.length < 1 || initials.length > 3) {
        setSubmitError(t('home.testimonials.submit.errors.initials'));
        return;
      }
      if (text.length < 10) {
        setSubmitError(t('home.testimonials.submit.errors.text'));
        return;
      }

      setIsSubmitting(true);
      const res = await fetch('/api/testimonials/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, initials, text }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        setSubmitError(String(json?.error || t('common.error')));
        return;
      }

      setSubmitSuccess(true);
      await loadTestimonials();
      setCurrentIndex(0);

      setTimeout(() => {
        closeSubmit();
      }, 900);
    } catch {
      setSubmitError(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('home.testimonials.title')}</h2>
        <div className={styles.titleUnderline}></div>

        <div className={styles.actionsRow}>
          <button className={styles.addButton} onClick={openSubmit} type="button">
            {t('home.testimonials.submit.button')}
          </button>
        </div>

        <div
          className={styles.wrapper}
          onMouseEnter={() => setIsHoverPaused(true)}
          onMouseLeave={() => setIsHoverPaused(false)}
          onFocus={() => setIsHoverPaused(true)}
          onBlur={() => setIsHoverPaused(false)}
        >
          {isMounted && currentTestimonial && (
            <>
              <article key={currentTestimonial.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.avatarWrapper}>
                    <div className={`${styles.avatar} ${getAvatarClass(currentTestimonial.image)}`}>
                      {currentTestimonial.initials}
                    </div>
                  </div>

                  <div className={styles.contentWrapper}>
                    <blockquote className={styles.quote}>
                      &ldquo;
                      {isGerman && currentTestimonial.text_de ? currentTestimonial.text_de : currentTestimonial.text}
                      &rdquo;
                    </blockquote>

                    <div className={styles.authorSection}>
                      <cite className={styles.authorName}>{currentTestimonial.name}</cite>
                      <span className={styles.authorRole}>
                        {isGerman
                          ? currentTestimonial.role_de || currentTestimonial.role || t('home.testimonials.role')
                          : currentTestimonial.role || t('home.testimonials.role')}
                      </span>
                      {currentTestimonial.country && (
                        <span className={styles.authorMeta}>{currentTestimonial.country}</span>
                      )}
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
                    onClick={() => {
                      pauseAfterInteraction();
                      setCurrentIndex(index);
                    }}
                    className={`${styles.paginationDot} ${
                      index === currentIndex ? styles.paginationDotActive : styles.paginationDotInactive
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {isSubmitOpen && (
          <div className={styles.modalOverlay} onClick={closeSubmit}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>{t('home.testimonials.submit.title')}</h3>
                <button className={styles.modalClose} onClick={closeSubmit} type="button" aria-label="Close">
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t('home.testimonials.submit.fields.name')}</label>
                    <input
                      className={styles.input}
                      value={submitForm.name}
                      onChange={(e) => setSubmitForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder={t('home.testimonials.submit.placeholders.name')}
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t('home.testimonials.submit.fields.country')}</label>
                    <input
                      className={styles.input}
                      value={submitForm.country}
                      onChange={(e) => setSubmitForm((p) => ({ ...p, country: e.target.value }))}
                      placeholder={t('home.testimonials.submit.placeholders.country')}
                      autoComplete="country-name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t('home.testimonials.submit.fields.initials')}</label>
                    <input
                      className={styles.input}
                      value={submitForm.initials}
                      onChange={(e) => setSubmitForm((p) => ({ ...p, initials: e.target.value }))}
                      placeholder={t('home.testimonials.submit.placeholders.initials')}
                      maxLength={3}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>{t('home.testimonials.submit.fields.text')}</label>
                    <textarea
                      className={styles.textarea}
                      value={submitForm.text}
                      onChange={(e) => setSubmitForm((p) => ({ ...p, text: e.target.value }))}
                      placeholder={t('home.testimonials.submit.placeholders.text')}
                    />
                  </div>
                </div>

                {submitError && <div className={styles.formError}>{submitError}</div>}
                {submitSuccess && <div className={styles.formSuccess}>{t('home.testimonials.submit.success')}</div>}

                <div className={styles.modalFooter}>
                  <button className={styles.secondaryButton} onClick={closeSubmit} type="button">
                    {t('common.cancel')}
                  </button>
                  <button
                    className={styles.primaryButton}
                    onClick={handleSubmit}
                    type="button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('home.testimonials.submit.submitting') : t('home.testimonials.submit.submit')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
