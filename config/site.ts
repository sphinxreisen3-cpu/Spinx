import { normalizeBaseUrl } from '@/lib/utils/helpers';

// Site configuration
export const siteConfig = {
  name: 'Sphinx Reisen',
  description: 'Your trusted travel partner for unforgettable adventures',
  url: normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  ogImage: '/images/og-image.jpg',
  links: {
    facebook: 'https://facebook.com/sphinxreisen',
    instagram: 'https://instagram.com/sphinxreisen',
    whatsapp: 'https://wa.me/1234567890',
  },
  contact: {
    email: 'info@sphinxreisen.com',
    phone: '+49 123 456 7890',
    address: 'Your Address Here',
  },
};

export type SiteConfig = typeof siteConfig;
