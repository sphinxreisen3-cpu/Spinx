import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import styles from '../../styles/components/layout/CtaBanner.module.css';

export async function CtaBanner() {
  const t = await getTranslations();

  return (
    <section className={styles.ctaBanner}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <span className={styles.pill}>{t('home.cta.pill')}</span>
            <h3 className={styles.heading}>{t('home.cta.title')}</h3>
            <p className={styles.description}>
              {t('home.cta.description')}
            </p>
            <p className={styles.subtext}>
              {t('home.cta.subtext')}
            </p>
          </div>
          <Link className={styles.ctaButton} href="/tours">
            <span>{t('home.cta.button')}</span>
            <span className={styles.arrow} aria-hidden>
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
