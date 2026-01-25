import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from '@/styles/pages/about/AboutPage.module.css';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroLayout}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
              <div className={styles.heroDivider}></div>
              <h2 className={styles.heroSubtitle}>
                {t('hero.subtitle')}
              </h2>
              <p className={styles.heroText}>
                {t('hero.description')}
              </p>
              <button type="button" className={styles.heroButton}>
                {t('hero.button')}
              </button>
            </div>
            <div className={styles.heroImageWrapper}>
              <div className={styles.heroImageCard}>
                <Image
                  src="/images/tours/pyramid-sky-desert-ancient.jpg"
                  alt="Egypt Pyramids"
                  width={600}
                  height={400}
                  className={styles.heroImage}
                  loading="lazy"
                />
                <div className={styles.heroImageOverlay}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            {/* Ancient Tours */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <span className={styles.serviceIcon}>🏛️</span>
              </div>
              <h3 className={styles.serviceTitle}>{t('services.ancient.title')}</h3>
              <p className={styles.serviceText}>
                {t('services.ancient.description')}
              </p>
            </div>

            {/* Hurghada Resorts */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <span className={styles.serviceIcon}>🏖️</span>
              </div>
              <h3 className={styles.serviceTitle}>{t('services.resorts.title')}</h3>
              <p className={styles.serviceText}>
                {t('services.resorts.description')}
              </p>
            </div>

            {/* Red Sea Diving */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <span className={styles.serviceIcon}>🤿</span>
              </div>
              <h3 className={styles.serviceTitle}>{t('services.diving.title')}</h3>
              <p className={styles.serviceText}>
                {t('services.diving.description')}
              </p>
            </div>

            {/* Nile Cruises */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <span className={styles.serviceIcon}>🚢</span>
              </div>
              <h3 className={styles.serviceTitle}>{t('services.cruises.title')}</h3>
              <p className={styles.serviceText}>
                {t('services.cruises.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.timelineHeader}>
            <h2 className={styles.timelineTitle}>{t('timeline.title')}</h2>
            <div className={styles.timelineDivider}></div>
            <p className={styles.timelineSubtitle}>
              {t('timeline.subtitle')}
            </p>
          </div>

          <div className={styles.timelineLayout}>
            {/* Timeline */}
            <div className={styles.timelineList}>
              <div className={styles.timelineStack}>
                {/* 2008 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarkerWrapper}>
                    <div className={styles.timelineMarker}>08</div>
                    <div className={styles.timelineConnector}></div>
                  </div>
                  <div className={styles.timelineCard}>
                    <h3 className={styles.timelineCardTitle}>{t('timeline.items.2008.title')}</h3>
                    <p className={styles.timelineCardText}>
                      {t('timeline.items.2008.description')}
                    </p>
                  </div>
                </div>

                {/* 2012 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarkerWrapper}>
                    <div className={styles.timelineMarker}>12</div>
                    <div className={styles.timelineConnector}></div>
                  </div>
                  <div className={styles.timelineCard}>
                    <h3 className={styles.timelineCardTitle}>{t('timeline.items.2012.title')}</h3>
                    <p className={styles.timelineCardText}>
                      {t('timeline.items.2012.description')}
                    </p>
                  </div>
                </div>

                {/* 2018 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarkerWrapper}>
                    <div className={styles.timelineMarker}>18</div>
                    <div className={styles.timelineConnector}></div>
                  </div>
                  <div className={styles.timelineCard}>
                    <h3 className={styles.timelineCardTitle}>{t('timeline.items.2018.title')}</h3>
                    <p className={styles.timelineCardText}>
                      {t('timeline.items.2018.description')}
                    </p>
                  </div>
                </div>

                {/* 2020 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarkerWrapper}>
                    <div className={styles.timelineMarker}>20</div>
                  </div>
                  <div className={styles.timelineCard}>
                    <h3 className={styles.timelineCardTitle}>{t('timeline.items.2020.title')}</h3>
                    <p className={styles.timelineCardText}>
                      {t('timeline.items.2020.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className={styles.timelineImages}>
              <div className={styles.timelineImageStack}>
                <div className={styles.timelineImageCard}>
                  <Image
                    src="/images/tours/08.webp"
                    alt="Egypt Tours"
                    width={400}
                    height={267}
                    className={styles.timelineImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.timelineImageCard}>
                  <Image
                    src="/images/tours/istockphoto-1085592710-612x612.webp"
                    alt="Hurghada Beach"
                    width={400}
                    height={267}
                    className={styles.timelineImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.timelineImageCard}>
                  <Image
                    src="/images/tours/iStock-508838512-1-scaled.webp"
                    alt="Red Sea Resort"
                    width={400}
                    height={267}
                    className={styles.timelineImage}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <p className={styles.ctaText}>
            <strong>{t('cta.strong')}</strong> {t('cta.text')}
            <button type="button" className={styles.ctaLink}>
              {t('cta.button')}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
