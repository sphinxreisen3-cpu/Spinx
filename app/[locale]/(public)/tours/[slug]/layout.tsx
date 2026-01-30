import React, { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getBaseUrl, truncateMetaTitle, truncateMetaDescription } from '@/lib/utils/helpers';
import { connectDB } from '@/lib/db/mongoose';
import { Tour } from '@/lib/db/models/tour.model';
import './tour-details.css';

const LOCALES = ['en', 'de'] as const;
const BRAND = 'Sphinx Reisen';
const DEFAULT_LOCATION = 'Egypt';

type TourLean = {
  slug: string;
  title: string;
  title_de?: string;
  description: string;
  description_de?: string;
  image1?: string;
  price: number;
  priceEUR?: number;
  onSale?: boolean;
  discount?: number;
  updatedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  seoNoindex?: boolean;
  ogImage?: string;
  canonicalUrl?: string;
  primaryLocation?: string;
};

const SEO_SELECT =
  'slug title title_de description description_de image1 price priceEUR onSale discount updatedAt seoTitle seoDescription seoNoindex ogImage canonicalUrl primaryLocation';

async function getTourBySlug(slug: string): Promise<TourLean | null> {
  await connectDB();
  const tour = await Tour.findOne({ slug, isActive: true })
    .select(SEO_SELECT)
    .lean();
  return tour as TourLean | null;
}

async function getTourByPreviousSlug(previousSlug: string): Promise<{ currentSlug: string } | null> {
  await connectDB();
  const tour = await Tour.findOne({
    isActive: true,
    previousSlugs: previousSlug,
  })
    .select('slug')
    .lean();
  return tour ? { currentSlug: tour.slug } : null;
}

const getCachedTour = cache(getTourBySlug);
const getCachedTourRedirect = cache(getTourByPreviousSlug);

function buildAutoTitle(tour: TourLean, locale: string): string {
  const isDe = locale === 'de';
  const name = isDe && tour.title_de ? tour.title_de : tour.title;
  const location = tour.primaryLocation || DEFAULT_LOCATION;
  const suffix = isDe ? ' Touren' : ' Tours';
  const raw = `${name} | ${location}${suffix} | ${BRAND}`;
  return truncateMetaTitle(raw, 60);
}

function buildAutoDescription(tour: TourLean, locale: string): string {
  const isDe = locale === 'de';
  const desc = isDe && tour.description_de ? tour.description_de : tour.description;
  return truncateMetaDescription(desc, 158);
}

function resolveOgImage(tour: TourLean, baseUrl: string): string | undefined {
  const src = tour.ogImage && tour.ogImage.trim() ? tour.ogImage : tour.image1;
  if (!src) return undefined;
  if (src.startsWith('http')) return src;
  return `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const tour = await getCachedTour(slug);

  if (!tour) {
    const redirectTarget = await getCachedTourRedirect(slug);
    if (redirectTarget) {
      return {};
    }
    return {
      title: 'Tour Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title =
    tour.seoTitle && tour.seoTitle.trim()
      ? truncateMetaTitle(tour.seoTitle, 60)
      : buildAutoTitle(tour, locale);
  const description =
    tour.seoDescription && tour.seoDescription.trim()
      ? truncateMetaDescription(tour.seoDescription, 160)
      : buildAutoDescription(tour, locale);
  const canonicalUrl =
    tour.canonicalUrl && tour.canonicalUrl.trim()
      ? tour.canonicalUrl
      : `${baseUrl}/${locale}/tours/${tour.slug}`;
  const noindex = tour.seoNoindex === true;
  const ogImage = resolveOgImage(tour, baseUrl);

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${baseUrl}/${loc}/tours/${tour.slug}`;
  }
  languages['x-default'] = `${baseUrl}/en/tours/${tour.slug}`;

  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      ...(ogImage && { images: [{ url: ogImage, alt: title }] }),
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

export default async function TourDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const tour = await getCachedTour(slug);

  if (!tour) {
    const redirectTarget = await getCachedTourRedirect(slug);
    if (redirectTarget) {
      redirect(`/${locale}/tours/${redirectTarget.currentSlug}`);
    }
    notFound();
  }

  const title = locale === 'de' && tour.title_de ? tour.title_de : tour.title;
  const description = locale === 'de' && tour.description_de ? tour.description_de : tour.description;
  const currency = locale === 'de' && tour.priceEUR != null && tour.priceEUR > 0 ? 'EUR' : 'USD';
  const price =
    locale === 'de' && tour.priceEUR != null && tour.priceEUR > 0 ? tour.priceEUR! : tour.price;
  const displayPrice =
    tour.onSale && tour.discount
      ? Math.round(price - (price * tour.discount) / 100)
      : price;
  const imageUrl = resolveOgImage(tour, baseUrl);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description ? truncateMetaDescription(description, 500) : undefined,
    ...(imageUrl && { image: imageUrl }),
    offers: {
      '@type': 'Offer',
      price: displayPrice,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
