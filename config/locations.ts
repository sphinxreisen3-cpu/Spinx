/**
 * Location-based landing pages (Cairo, Giza, Luxor, Hurghada, etc.)
 * Tours can set primaryLocation to one of these slugs (or display names) to appear on the landing page.
 */

export interface LocationSeo {
  slug: string;
  name: string;
  nameDe?: string;
  /** SEO title override (≤60 chars) */
  seoTitle?: string;
  /** Meta description override (150–160 chars) */
  seoDescription?: string;
  /** Unique intro content above tour listings */
  intro?: string;
  introDe?: string;
}

export const LOCATIONS: LocationSeo[] = [
  {
    slug: 'cairo',
    name: 'Cairo',
    nameDe: 'Kairo',
    seoTitle: 'Cairo Tours & Day Trips | Sphinx Reisen',
    seoDescription:
      'Discover Cairo tours, pyramids, and cultural experiences. Book day trips and multi-day tours from Cairo with Sphinx Reisen.',
    intro: 'Explore the heart of Egypt with our curated Cairo tours, from the Pyramids of Giza to the Egyptian Museum.',
    introDe:
      'Entdecken Sie das Herz Ägyptens mit unseren Kairo-Touren – von den Pyramiden von Gizeh bis zum Ägyptischen Museum.',
  },
  {
    slug: 'giza',
    name: 'Giza',
    nameDe: 'Gizeh',
    seoTitle: 'Giza Pyramids Tours | Sphinx Reisen',
    seoDescription:
      'Book Giza Pyramids tours and Sphinx visits. Half-day and full-day trips from Cairo. Best prices and expert guides.',
    intro: 'Stand at the feet of the Great Pyramids and the Sphinx. Our Giza tours include skip-the-line access and expert guides.',
    introDe:
      'Erleben Sie die Großen Pyramiden und die Sphinx. Unsere Gizeh-Touren beinhalten Eintritt und erfahrene Reiseleiter.',
  },
  {
    slug: 'luxor',
    name: 'Luxor',
    nameDe: 'Luxor',
    seoTitle: 'Luxor Tours & Nile Cruises | Sphinx Reisen',
    seoDescription:
      'Luxor tours, Valley of the Kings, Karnak Temple, and Nile cruises. Multi-day packages from Cairo or Hurghada.',
    intro: 'From the Valley of the Kings to Karnak Temple, discover ancient Thebes with our Luxor tours and Nile experiences.',
    introDe:
      'Vom Tal der Könige bis zum Tempel von Karnak – entdecken Sie das antike Theben mit unseren Luxor-Touren.',
  },
  {
    slug: 'hurghada',
    name: 'Hurghada',
    nameDe: 'Hurghada',
    seoTitle: 'Hurghada Tours & Red Sea Excursions | Sphinx Reisen',
    seoDescription:
      'Tours from Hurghada: Luxor, Cairo, desert safaris, and Red Sea activities. Day trips and multi-day packages.',
    intro: 'Base yourself in Hurghada and explore Luxor, Cairo, or the Eastern Desert. Beach and culture combined.',
    introDe:
      'Von Hurghada aus Luxor, Kairo oder die Wüste entdecken. Strand und Kultur in einem.',
  },
  {
    slug: 'alexandria',
    name: 'Alexandria',
    nameDe: 'Alexandria',
    seoTitle: 'Alexandria Day Tours from Cairo | Sphinx Reisen',
    seoDescription:
      'Alexandria day trips from Cairo. Visit the Library, Citadel, and Mediterranean coast. One-day tours with pickup.',
    intro: 'Discover Alexandria’s Greco-Roman heritage and Mediterranean charm on a day tour from Cairo.',
    introDe:
      'Entdecken Sie Alexandrias griechisch-römisches Erbe und die Mittelmeerküste bei einer Tagestour ab Kairo.',
  },
];

export function getLocationBySlug(slug: string): LocationSeo | undefined {
  return LOCATIONS.find((loc) => loc.slug === slug.toLowerCase());
}

export function getLocationSlugs(): string[] {
  return LOCATIONS.map((loc) => loc.slug);
}
