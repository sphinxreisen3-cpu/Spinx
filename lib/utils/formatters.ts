// Date formatting utilities
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Currency formatting utilities
const EXCHANGE_RATE = 0.92; // 1 USD = 0.92 EUR (should be fetched from API in production)

export function formatPrice(
  price: number,
  currency: 'USD' | 'EUR' = 'USD',
  locale: string = 'en'
): string {
  const convertedPrice = currency === 'EUR' ? price * EXCHANGE_RATE : price;
  const localeCode = locale === 'de' ? 'de-DE' : 'en-US';
  const currencyCode = currency;

  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency: currencyCode,
  }).format(convertedPrice);
}

export function convertCurrency(price: number, from: 'USD' | 'EUR', to: 'USD' | 'EUR'): number {
  if (from === to) return price;
  if (from === 'USD' && to === 'EUR') return price * EXCHANGE_RATE;
  if (from === 'EUR' && to === 'USD') return price / EXCHANGE_RATE;
  return price;
}

// String utilities
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
