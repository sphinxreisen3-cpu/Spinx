import { getTranslations } from 'next-intl/server';
import styles from '@/styles/components/home/ServicesSection.module.css';

export async function ServicesSection() {
  const t = await getTranslations();
  const services = [
    {
      icon: 'mdi-car',
      title: t('home.services.transportations.title'),
      description: t('home.services.transportations.description'),
    },
    {
      icon: 'mdi-map-marker',
      title: t('home.services.guiding.title'),
      description: t('home.services.guiding.description'),
    },
    {
      icon: 'mdi-compass',
      title: t('home.services.exploring.title'),
      description: t('home.services.exploring.description'),
    },
    {
      icon: 'mdi-star',
      title: t('home.services.luxury.title'),
      description: t('home.services.luxury.description'),
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('home.services.title')}</h2>
        <div className={styles.titleUnderline}></div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconCircle}>
                  <span className={styles.icon}>
                    {service.icon === 'mdi-car' && '🚗'}
                    {service.icon === 'mdi-map-marker' && '📍'}
                    {service.icon === 'mdi-compass' && '🧭'}
                    {service.icon === 'mdi-star' && '⭐'}
                  </span>
                </div>
              </div>

              <h3 className={styles.cardTitle}>{service.title}</h3>
              <div className={styles.cardUnderline}></div>
              <p className={styles.cardDescription}>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
