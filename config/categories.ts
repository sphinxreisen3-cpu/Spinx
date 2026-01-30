/**
 * Category landing pages SEO config.
 * Categories are also stored on tours (tour.category). This config adds SEO overrides and featured order.
 * Slug should match a normalized form of the category (e.g. "Desert Safari" -> "desert-safari").
 */

export interface CategorySeo {
  /** Slug used in URL; should match tour category when normalized */
  slug: string;
  /** Display name (can match tour category) */
  name: string;
  nameDe?: string;
  /** SEO title override (≤60 chars) */
  seoTitle?: string;
  /** Meta description override (150–160 chars) */
  seoDescription?: string;
  /** Intro content above listings */
  intro?: string;
  introDe?: string;
  /** Optional: order of tour IDs for "featured" section (improves internal linking) */
  featuredTourIds?: string[];
}

/** Normalize category string to slug (e.g. "Desert Safari" -> "desert-safari") */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Category SEO overrides. Add entries for categories you use on tours.
 * If a category is not listed here, the landing page will use auto-generated title/description.
 */
export const CATEGORY_SEO: CategorySeo[] = [
  {
    slug: 'desert-safari',
    name: 'Desert Safari',
    nameDe: 'Wüstensafari',
    seoTitle: 'Desert Safari Tours in Egypt | Sphinx Reisen',
    seoDescription:
      'Book desert safari tours from Cairo, Hurghada, and Luxor. Quad biking, camel rides, and Bedouin experiences.',
    intro: 'Experience the Egyptian desert with our safari tours: quad biking, camel rides, and traditional Bedouin evenings.',
    introDe:
      'Erleben Sie die ägyptische Wüste: Quad fahren, Kamelritte und beduinische Abende.',
  },
  {
    slug: 'cultural',
    name: 'Cultural Tours',
    nameDe: 'Kulturreisen',
    seoTitle: 'Cultural Tours in Egypt | Sphinx Reisen',
    seoDescription:
      'Cultural and historical tours: pyramids, temples, museums. Expert guides and small groups.',
    intro: 'Dive into ancient and modern Egypt with our cultural tours to temples, museums, and historic sites.',
    introDe:
      'Tauchen Sie ein in das alte und moderne Ägypten mit unseren Kulturreisen zu Tempeln und Museen.',
  },
  {
    slug: 'nile-cruise',
    name: 'Nile Cruise',
    nameDe: 'Nilkreuzfahrt',
    seoTitle: 'Nile Cruise Tours | Luxor to Aswan | Sphinx Reisen',
    seoDescription:
      'Nile cruise packages from Luxor to Aswan. Multi-day cruises with temple visits and onboard comfort.',
    intro: 'Sail the Nile from Luxor to Aswan with temple stops and full-board accommodation.',
    introDe:
      'Segeln Sie von Luxor nach Assuan mit Tempelstopps und Vollpension an Bord.',
  },
];

export function getCategorySeoBySlug(slug: string): CategorySeo | undefined {
  return CATEGORY_SEO.find((c) => c.slug === slug.toLowerCase());
}

export function getCategorySlugs(): string[] {
  return CATEGORY_SEO.map((c) => c.slug);
}
