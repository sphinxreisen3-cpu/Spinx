import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils/helpers';
import { connectDB } from '@/lib/db/mongoose';
import { Tour } from '@/lib/db/models/tour.model';
import { getLocationSlugs } from '@/config/locations';
import { getCategorySlugs } from '@/config/categories';

const LOCALES = ['en', 'de'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl().replace(/\/$/, '');

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/de`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/en/tours`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/de/tours`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/en/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/de/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/en/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/de/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const locationSlugs = getLocationSlugs();
  const categorySlugs = getCategorySlugs();
  const locationEntries: MetadataRoute.Sitemap = [];
  const categoryEntries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const slug of locationSlugs) {
      locationEntries.push({
        url: `${baseUrl}/${locale}/tours/location/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
    for (const slug of categorySlugs) {
      categoryEntries.push({
        url: `${baseUrl}/${locale}/tours/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  const tourEntries: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const tours = await Tour.find({ isActive: true })
      .select('slug updatedAt')
      .lean();
    for (const locale of LOCALES) {
      for (const tour of tours) {
        tourEntries.push({
          url: `${baseUrl}/${locale}/tours/${tour.slug}`,
          lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // If DB is unavailable (e.g. build time), sitemap still returns static entries
  }

  return [...staticEntries, ...locationEntries, ...categoryEntries, ...tourEntries];
}
