import styles from '@/styles/components/home/ServicesSection.module.css';

export function ServicesSection() {
  const services = [
    {
      icon: 'mdi-car',
      title: 'Transportations',
      description:
        'We provide reliable and comfortable transportation services including airport transfers, private car rentals, and luxury vehicle options to ensure your travel is seamless and stress-free.',
    },
    {
      icon: 'mdi-map-marker',
      title: 'Tour Guiding',
      description:
        'Our professional tour guides are knowledgeable locals who provide insightful commentary, historical context, and personalized attention to make your sightseeing experiences truly memorable and educational.',
    },
    {
      icon: 'mdi-compass',
      title: 'Exploring',
      description:
        'Discover hidden gems and off-the-beaten-path destinations with our curated exploration packages. From adventure activities to cultural immersion, we help you explore the world like never before.',
    },
    {
      icon: 'mdi-star',
      title: 'Luxury',
      description:
        'Experience the pinnacle of comfort and elegance with our luxury travel services. From VIP airport lounges to five-star accommodations and exclusive experiences, we cater to discerning travelers seeking the best.',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our Services</h2>
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
