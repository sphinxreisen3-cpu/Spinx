import { TourGrid } from '@/components/tours/TourGrid';
import { TourFilters } from '@/components/tours/TourFilters';
import styles from '@/styles/pages/tours/ToursPage.module.css';

const stats = [
  { label: 'Destinations', value: '120+' },
  { label: 'Happy Travelers', value: '25K+' },
  { label: 'Expert Guides', value: '80+' },
];

export default function ToursPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Tailored experiences</p>
          <h1 className={styles.title}>Find your next unforgettable tour</h1>
          <p className={styles.subtitle}>
            Browse curated adventures across Egypt and beyond. Filter by vibe, duration, and season
            to match the journey you want—luxury cruises, desert escapes, cultural dives, and more.
          </p>
          <div className={styles.heroActions}>
            <a href="#filters" className={styles.primaryCta}>
              Browse tours
            </a>
            <a
              href="https://wa.link/l3auw8"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryCta}
            >
              Talk to an expert
            </a>
          </div>
          <div className={styles.heroStats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroBadge}>Top picks updated weekly</div>
          <div className={styles.heroImage}>
            <div className={styles.heroOverlay}></div>
          </div>
        </div>
      </section>

      <section id="filters" className={styles.filtersSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Filter & discover</p>
            <h2 className={styles.sectionTitle}>Dial in your perfect trip</h2>
            <p className={styles.sectionSubtitle}>
              Narrow by destination, dates, budget, and style. Save favorites and compare options
              side by side.
            </p>
          </div>
        </div>
        <TourFilters />
      </section>

      <section className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>All tours</p>
            <h2 className={styles.sectionTitle}>Curated for every traveler</h2>
            <p className={styles.sectionSubtitle}>
              Scroll the collection—luxury Nile cruises, Red Sea retreats, Sahara safaris, city
              breaks, and family getaways.
            </p>
          </div>
        </div>
        <TourGrid />
      </section>
    </div>
  );
}
