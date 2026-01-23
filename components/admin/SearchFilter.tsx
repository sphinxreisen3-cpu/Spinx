'use client';

import { useState, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '@/styles/components/admin/SearchFilter.module.css';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface SearchFilterProps {
  placeholder?: string;
  filters?: Filter[];
  onSearch: (query: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function SearchFilter({
  placeholder = 'Search...',
  filters = [],
  onSearch,
  onFilterChange,
  onClear,
}: SearchFilterProps) {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      // Debounce would be applied in parent or via useEffect
      onSearch(value);
    },
    [onSearch]
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      setFilterValues((prev) => ({ ...prev, [key]: value }));
      onFilterChange(key, value);
    },
    [onFilterChange]
  );

  const handleClear = useCallback(() => {
    setSearchValue('');
    setFilterValues({});
    onClear();
  }, [onClear]);

  const hasActiveFilters = searchValue || Object.values(filterValues).some((v) => v);

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {filters.length > 0 && (
        <div className={styles.filterGroup}>
          {filters.map((filter) => (
            <select
              key={filter.key}
              className={styles.select}
              value={filterValues[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              aria-label={filter.label}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}

          {hasActiveFilters && (
            <button className={styles.clearButton} onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
