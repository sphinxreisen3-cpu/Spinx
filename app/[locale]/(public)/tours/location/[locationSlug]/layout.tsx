import type { Metadata } from 'next';
import { getBaseUrl, truncateMetaTitle, truncateMetaDescription } from '@/lib/utils/helpers';
import { getLocationBySlug, LOCATIONS } from '@/config/locations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; locationSlug: string }>;
}): Promise<Metadata> {
  const { locale, locationSlug } = await params;
  const loc = getLocationBySlug(locationSlug);
  if (!loc) return { title: 'Not Found' };

  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}/${locale}/tours/location/${loc.slug}`;
  const isDe = locale === 'de';
  const title =
    loc.seoTitle && loc.seoTitle.trim()
      ? truncateMetaTitle(loc.seoTitle, 60)
      : truncateMetaTitle(
          `${isDe && loc.nameDe ? loc.nameDe : loc.name} Tours | Sphinx Reisen`,
          60
        );
  const description =
    loc.seoDescription && loc.seoDescription.trim()
      ? truncateMetaDescription(loc.seoDescription, 160)
      : truncateMetaDescription(
          `Discover tours in ${isDe && loc.nameDe ? loc.nameDe : loc.name}. Book day trips and experiences with Sphinx Reisen.`,
          160
        );

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: 'website' },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/tours/location/${loc.slug}`,
        de: `${baseUrl}/de/tours/location/${loc.slug}`,
        'x-default': `${baseUrl}/en/tours/location/${loc.slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ locationSlug: loc.slug }));
}

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
