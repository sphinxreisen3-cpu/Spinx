'use client';

import { useTranslations } from 'next-intl';
import styles from '@/styles/components/home/LocationMap.module.css';

const mapEmbedSrc =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55263.4190838134!2d33.7485!3d27.2579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144d7f316b86886f%3A0x4372c1b5f4bfd96c!2sHurghada%2C%20Red%20Sea%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus';

export function LocationMap() {
  const t = useTranslations();
  return (
    <section className={styles.section} id="map">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('home.map.title')}</h2>
          <div className={styles.subtitle}>
            <span className={styles.subtitleIcon}>📍</span>
            {t('home.map.subtitle')}
          </div>
          <div className={styles.titleUnderline}></div>
        </div>

        <div className={styles.mapWrapper}>
          <div className={styles.mapContainer}>
            <iframe
              title={t('home.map.iframeTitle')}
              src={mapEmbedSrc}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapFrame}
            ></iframe>
          </div>
        </div>

        <div className={styles.infoSection}>
          <p className={styles.description}>
            {t('home.map.description')}
          </p>
        </div>
      </div>
    </section>
  );
}
