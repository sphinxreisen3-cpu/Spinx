'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TOUR_CATEGORIES } from '@/config/tours';
import styles from '@/styles/components/tours/TourFilters.module.css';

const SEARCH_DEBOUNCE_MS = 200;

export function TourFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('home.toursSection');

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [onSale, setOnSale] = useState(searchParams.get('onSale') ?? '');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
    setCategory(searchParams.get('category') ?? '');
    setOnSale(searchParams.get('onSale') ?? '');
  }, [searchParams]);

  const updateUrl = useCallback(
    (updates: { search?: string; category?: string; onSale?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.search !== undefined) {
        if (updates.search.trim()) params.set('search', updates.search.trim());
        else params.delete('search');
      }
      if (updates.category !== undefined) {
        if (updates.category) params.set('category', updates.category);
        else params.delete('category');
      }
      if (updates.onSale !== undefined) {
        if (updates.onSale === 'true') params.set('onSale', 'true');
        else params.delete('onSale');
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      updateUrl({ search: value });
      searchDebounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    updateUrl({ category: value });
  };

  const handleSaleToggle = () => {
    const value = onSale === 'true' ? '' : 'true';
    setOnSale(value);
    updateUrl({ onSale: value });
  };

  return (
    <div className={styles.filters}>
      <input
        type="search"
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={handleSearchChange}
        className={styles.searchInput}
        aria-label={t('searchPlaceholder')}
      />
      <select
        value={category}
        onChange={handleCategoryChange}
        className={styles.categorySelect}
        aria-label={t('allCategories')}
      >
        <option value="">{t('allCategories')}</option>
        {TOUR_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {t(`categories.${cat.toLowerCase()}`) || cat}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSaleToggle}
        className={onSale === 'true' ? styles.saleActive : styles.saleButton}
      >
        {t('onSale') || 'On Sale'}
      </button>
    </div>
  );
}
