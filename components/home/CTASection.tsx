import { getTranslations } from 'next-intl/server';
import styles from '../../styles/components/home/CTASection.module.css';

export async function CTASection() {
  const t = await getTranslations();
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerSection}>
            <h2 className={styles.title}>{t('home.cta.title')}</h2>
            <p className={styles.description}>
              {t('home.cta.description')}
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <a href="#" className={styles.ctaButton}>
              {t('home.cta.button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
