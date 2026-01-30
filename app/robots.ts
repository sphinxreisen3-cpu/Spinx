import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils/helpers';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/*/admin', '/login', '/*/login', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
