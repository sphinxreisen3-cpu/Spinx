import { TourGrid } from '@/components/tours/TourGrid';
import { TourFilters } from '@/components/tours/TourFilters';
import { getTranslations } from 'next-intl/server';
import styles from '@/styles/pages/tours/ToursPage.module.css';

export default async function ToursPage() {
  const t = await getTranslations('tours.page');

  const stats = [
    { label: t('hero.stats.destinations'), value: '120+' },
    { label: t('hero.stats.happyTravelers'), value: '25K+' },
    { label: t('hero.stats.expertGuides'), value: '80+' },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>{t('hero.kicker')}</p>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.subtitle}>{t('hero.subtitle')}</p>
          <div className={styles.heroActions}>
            <a href="#filters" className={styles.primaryCta}>
              {t('hero.browseTours')}
            </a>
            <a
              href="https://wa.link/l3auw8"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryCta}
            >
              {t('hero.talkExpert')}
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
          <div className={styles.heroBadge}>{t('hero.badge')}</div>
          <div className={styles.heroImage}>
            <div className={styles.heroOverlay}></div>
          </div>
        </div>
      </section>

      <section id="filters" className={styles.filtersSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>{t('filters.kicker')}</p>
            <h2 className={styles.sectionTitle}>{t('filters.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('filters.subtitle')}</p>
          </div>
        </div>
        <TourFilters />
      </section>

      <section className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>{t('grid.kicker')}</p>
            <h2 className={styles.sectionTitle}>{t('grid.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('grid.subtitle')}</p>
          </div>
        </div>
        <TourGrid />
      </section>
    </div>
  );
}
