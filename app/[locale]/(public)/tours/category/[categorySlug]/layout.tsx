import type { Metadata } from 'next';
import { getBaseUrl, truncateMetaTitle, truncateMetaDescription } from '@/lib/utils/helpers';
import { getCategorySeoBySlug, CATEGORY_SEO } from '@/config/categories';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const cat = getCategorySeoBySlug(categorySlug);
  if (!cat) return { title: 'Not Found' };

  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}/${locale}/tours/category/${cat.slug}`;
  const isDe = locale === 'de';
  const title =
    cat.seoTitle && cat.seoTitle.trim()
      ? truncateMetaTitle(cat.seoTitle, 60)
      : truncateMetaTitle(
          `${isDe && cat.nameDe ? cat.nameDe : cat.name} | Sphinx Reisen`,
          60
        );
  const description =
    cat.seoDescription && cat.seoDescription.trim()
      ? truncateMetaDescription(cat.seoDescription, 160)
      : truncateMetaDescription(
          `Discover ${isDe && cat.nameDe ? cat.nameDe : cat.name} tours in Egypt. Book with Sphinx Reisen.`,
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
        en: `${baseUrl}/en/tours/category/${cat.slug}`,
        de: `${baseUrl}/de/tours/category/${cat.slug}`,
        'x-default': `${baseUrl}/en/tours/category/${cat.slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  return CATEGORY_SEO.map((c) => ({ categorySlug: c.slug }));
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
