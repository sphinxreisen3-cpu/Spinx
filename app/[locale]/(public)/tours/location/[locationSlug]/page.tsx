import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getLocationBySlug } from '@/config/locations';
import styles from '@/styles/pages/tours/ToursPage.module.css';
import gridStyles from '@/styles/components/tours/TourGrid.module.css';
import type { Tour } from '@/types/tour.types';

async function getToursByLocation(locationSlug: string, locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl.replace(/\/$/, '')}/api/tours?primaryLocation=${encodeURIComponent(locationSlug)}&limit=50&isActive=true`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const tours: Tour[] = data?.data?.tours ?? [];
  const isDe = locale === 'de';
  return tours.map((tour) => ({
    id: tour._id,
    slug: tour.slug,
    title: isDe && tour.title_de ? tour.title_de : tour.title,
    category: isDe && tour.category_de ? tour.category_de : tour.category,
    duration: isDe && tour.travelType_de ? tour.travelType_de : tour.travelType,
    price:
      tour.onSale && tour.discount
        ? Math.round((tour.priceEUR && isDe ? tour.priceEUR : tour.price) * (1 - tour.discount / 100))
        : tour.priceEUR && isDe ? tour.priceEUR : tour.price,
    image: tour.image1 || '/images/tours/pyramid-sky-desert-ancient.jpg',
    description: isDe && tour.description_de ? tour.description_de : tour.description,
    isOnSale: !!(tour.onSale && tour.discount),
    currencySymbol: isDe && tour.priceEUR ? '€' : '$',
  }));
}

export default async function LocationLandingPage({
  params,
}: {
  params: Promise<{ locale: string; locationSlug: string }>;
}) {
  const { locale, locationSlug } = await params;
  const loc = getLocationBySlug(locationSlug);
  if (!loc) notFound();

  const t = await getTranslations('tours.page');
  const isDe = locale === 'de';
  const name = isDe && loc.nameDe ? loc.nameDe : loc.name;
  const intro = isDe && loc.introDe ? loc.introDe : loc.intro;
  const tours = await getToursByLocation(locationSlug, locale);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>{t('hero.kicker')}</p>
          <h1 className={styles.title}>{name} {isDe ? 'Touren' : 'Tours'}</h1>
          <p className={styles.subtitle}>
            {intro ||
              (isDe
                ? `Entdecken Sie unsere Touren in ${name}. Buchen Sie Tagesausflüge und Erlebnisse.`
                : `Discover our tours in ${name}. Book day trips and experiences.`)}
          </p>
          <div className={styles.heroActions}>
            <a href="#tours" className={styles.primaryCta}>
              {isDe ? 'Touren anzeigen' : 'View tours'}
            </a>
          </div>
        </div>
      </section>

      <section id="tours" className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {isDe ? `Touren in ${name}` : `Tours in ${name}`}
          </h2>
        </div>
        {tours.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            {isDe ? 'Keine Touren für diese Region gefunden.' : 'No tours found for this location.'}
          </p>
        ) : (
          <div className={gridStyles.grid}>
            {tours.map((tour) => (
              <Link
                key={tour.id}
                href={`/${locale}/tours/${tour.slug}#book`}
                className={gridStyles.cardLink}
              >
                <div className={gridStyles.card}>
                  <div className={gridStyles.imageWrapper}>
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className={gridStyles.image}
                      loading="lazy"
                    />
                    {tour.isOnSale && (
                      <div className={gridStyles.saleBadge}>Sale</div>
                    )}
                    <div className={gridStyles.categoryBadge}>{tour.category}</div>
                  </div>
                  <div className={gridStyles.cardContent}>
                    <h3 className={gridStyles.cardTitle}>{tour.title}</h3>
                    <p className={gridStyles.cardDescription}>{tour.description?.slice(0, 120)}…</p>
                    <div className={gridStyles.cardMeta}>
                      <span className={gridStyles.metaItem}>{tour.duration}</span>
                    </div>
                    <div className={gridStyles.cardFooter}>
                      <span className={gridStyles.price}>
                        {tour.currencySymbol}{tour.price}
                      </span>
                      <span className={gridStyles.bookButton}>
                        {isDe ? 'Buchen' : 'Book now'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
