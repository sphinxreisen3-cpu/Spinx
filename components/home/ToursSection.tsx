'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TOUR_CATEGORIES } from '@/config/tours';
import styles from '@/styles/components/home/ToursSection.module.css';
import type { Tour } from '@/types/tour.types';
import type { HomeTourCard } from '@/types/home.types';

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 200;

function mapApiToursToCards(apiTours: Tour[], locale: string): HomeTourCard[] {
  const isGerman = locale === 'de';
  return apiTours.map((tour: Tour) => {
    const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
    const displayPrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
    const currencySymbol = useEUR ? '€' : '$';
    return {
      id: tour._id,
      slug: tour.slug,
      title: isGerman && tour.title_de ? tour.title_de : tour.title,
      category: isGerman && tour.category_de ? tour.category_de : tour.category,
      duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
      rating: 4.8,
      price: `${currencySymbol}${displayPrice}`,
      image: tour.image1 || '/images/placeholder-tour.jpg',
      description: isGerman && tour.description_de ? tour.description_de : tour.description,
    };
  });
}

interface ToursSectionProps {
  initialTours?: HomeTourCard[];
  initialLocale?: string;
}

export function ToursSection({ initialTours, initialLocale }: ToursSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const hasInitial = Array.isArray(initialTours) && initialTours.length > 0;

  const [tours, setTours] = useState<HomeTourCard[]>(initialTours ?? []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    hasInitial ? (initialTours?.length ?? 0) >= PAGE_SIZE : true
  );
  const [loading, setLoading] = useState(!hasInitial);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchForFetch = useRef('');
  const categoryForFetch = useRef('');
  const skipDebounceOnce = useRef(hasInitial);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean, signal?: AbortSignal) => {
      const params = new URLSearchParams();
      params.set('limit', String(PAGE_SIZE));
      params.set('page', String(pageNum));
      params.set('isActive', 'true');
      if (searchForFetch.current.trim()) params.set('search', searchForFetch.current.trim());
      if (categoryForFetch.current) params.set('category', categoryForFetch.current);

      const res = await fetch(`/api/tours?${params.toString()}`, { signal });
      if (!res.ok) throw new Error('Failed to fetch tours');
      const data = await res.json();
      const apiTours: Tour[] = data.data?.tours ?? [];
      const pagination = data.data?.pagination;
      const mapped = mapApiToursToCards(apiTours, locale);
      return {
        tours: mapped,
        hasMore: pagination?.hasMore ?? false,
        append,
      };
    },
    [locale]
  );

  useEffect(() => {
    if (hasInitial && initialLocale === locale) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    searchForFetch.current = '';
    categoryForFetch.current = '';

    fetchPage(1, false, controller.signal)
      .then(({ tours: nextTours, hasMore: more }) => {
        setTours(nextTours);
        setHasMore(more);
        setPage(1);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load tours');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [locale, hasInitial, initialLocale, fetchPage]);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      if (search === searchForFetch.current && category === categoryForFetch.current) return;
      if (skipDebounceOnce.current && !search.trim() && !category) {
        skipDebounceOnce.current = false;
        return;
      }
      searchForFetch.current = search;
      categoryForFetch.current = category;
      setPage(1);
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('limit', String(PAGE_SIZE));
      params.set('page', '1');
      params.set('isActive', 'true');
      if (search.trim()) params.set('search', search.trim());
      if (category) params.set('category', category);

      fetch(`/api/tours?${params.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch tours');
          return res.json();
        })
        .then((data) => {
          const apiTours: Tour[] = data.data?.tours ?? [];
          const pagination = data.data?.pagination;
          setTours(mapApiToursToCards(apiTours, locale));
          setHasMore(pagination?.hasMore ?? false);
          setPage(1);
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load tours'))
        .finally(() => setLoading(false));

      searchDebounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search, category, locale]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    searchForFetch.current = search;
    categoryForFetch.current = category;

    const params = new URLSearchParams();
    params.set('limit', String(PAGE_SIZE));
    params.set('page', String(nextPage));
    params.set('isActive', 'true');
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);

    fetch(`/api/tours?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tours');
        return res.json();
      })
      .then((data) => {
        const apiTours: Tour[] = data.data?.tours ?? [];
        const pagination = data.data?.pagination;
        setTours((prev) => [...prev, ...mapApiToursToCards(apiTours, locale)]);
        setHasMore(pagination?.hasMore ?? false);
        setPage(nextPage);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load tours'))
      .finally(() => setLoadingMore(false));
  };

  const showLoadMore = hasMore && !loading && tours.length > 0;

  return (
    <section className={styles.section} id="tours-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🏖️ {t('home.toursSection.title')}
            <div className={styles.titleUnderline}></div>
          </h2>
        </div>

        {/* Search and category filter — filters list in place (no navigation) */}
        <div className={styles.filterSection}>
          <div className={styles.filterWrapper}>
            <div className={styles.filterRow}>
              <div className={styles.searchWrapper}>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="search"
                    id="tours-search"
                    placeholder={t('home.toursSection.searchPlaceholder')}
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label={t('home.toursSection.searchPlaceholder')}
                  />
                  <span className={styles.searchIcon}>🔍</span>
                </div>
              </div>

              <div className={styles.selectWrapper}>
                <select
                  id="category-filter"
                  className={styles.selectInput}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label={t('home.toursSection.allCategories')}
                >
                  <option value="">{t('home.toursSection.allCategories')}</option>
                  {TOUR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t(`home.toursSection.categories.${cat.toLowerCase()}`) || cat}
                    </option>
                  ))}
                </select>
                <span className={styles.selectIcon}>📂</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        <div className={styles.grid}>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className={styles.cardLink} style={{ pointerEvents: 'none' }}>
                <div className={styles.card}>
                  <div className={styles.imageWrapper} style={{ backgroundColor: '#e5e7eb', minHeight: '200px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  </div>
                  <div className={styles.cardContent} style={{ padding: '1rem' }}>
                    <div
                      style={{
                        height: '24px',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                    <div
                      style={{
                        height: '60px',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                    <div
                      style={{
                        height: '40px',
                        borderRadius: '4px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : tours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
              {error ? <span style={{ color: 'red' }}>{error}</span> : t('home.toursSection.noTours')}
            </div>
          ) : (
            tours.map((tour) => (
              <Link
                key={tour.id}
                href={`/${locale}/tours/${tour.slug}#book`}
                className={styles.cardLink}
                prefetch={false}
              >
                <div className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className={styles.image}
                      loading={tours.indexOf(tour) < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/tours/pyramid-sky-desert-ancient.jpg';
                      }}
                    />
                  </div>
                  <div className={styles.categoryBadge}>{tour.category}</div>
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
                      <button className={styles.bookButton} type="button">
                        {t('home.toursSection.bookNow')}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {showLoadMore && (
          <div style={{ textAlign: 'center', marginTop: '2rem', gridColumn: '1 / -1' }}>
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className={styles.searchButton}
            >
              {loadingMore ? '…' : t('home.toursSection.loadMore')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
