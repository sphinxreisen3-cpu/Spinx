import Image from 'next/image';
import styles from '@/styles/pages/about/AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroLayout}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Welcome to Egypt-Tours</h1>
              <div className={styles.heroDivider}></div>
              <h2 className={styles.heroSubtitle}>
                Your Gateway to Egypt&apos;s Wonders &amp; Hurghada&apos;s Paradise
              </h2>
              <p className={styles.heroText}>
                Discover the magic of ancient Egypt and the beauty of Hurghada&apos;s Red Sea coast.
                With over 15 years of experience, we specialize in creating unforgettable journeys
                through Egypt&apos;s rich history and stunning beach destinations. From the majestic
                pyramids of Giza to the pristine beaches of Hurghada, we bring you the best of both
                worlds.
              </p>
              <button type="button" className={styles.heroButton}>
                Explore Egypt
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
              <h3 className={styles.serviceTitle}>Ancient Tours</h3>
              <p className={styles.serviceText}>
                Explore the wonders of ancient Egypt including the Pyramids of Giza, Luxor Temple,
                Valley of the Kings, and Abu Simbel with expert Egyptologist guides.
              </p>
            </div>

            {/* Hurghada Resorts */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <span className={styles.serviceIcon}>🏖️</span>
              </div>
              <h3 className={styles.serviceTitle}>Hurghada Resorts</h3>
              <p className={styles.serviceText}>
                Experience luxury beach resorts in Hurghada with stunning Red Sea views, water
                sports, diving excursions, and relaxing spa treatments.
              </p>
            </div>

            {/* Red Sea Diving */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <span className={styles.serviceIcon}>🤿</span>
              </div>
              <h3 className={styles.serviceTitle}>Red Sea Diving</h3>
              <p className={styles.serviceText}>
                Discover the underwater paradise of the Red Sea with world-class diving sites,
                colorful coral reefs, and exotic marine life in Hurghada.
              </p>
            </div>

            {/* Nile Cruises */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <span className={styles.serviceIcon}>🚢</span>
              </div>
              <h3 className={styles.serviceTitle}>Nile Cruises</h3>
              <p className={styles.serviceText}>
                Sail along the legendary Nile River on luxury cruises from Luxor to Aswan, visiting
                ancient temples and experiencing timeless Egyptian culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.timelineHeader}>
            <h2 className={styles.timelineTitle}>Egypt-Tours Journey</h2>
            <div className={styles.timelineDivider}></div>
            <p className={styles.timelineSubtitle}>
              Our story of bringing Egypt&apos;s wonders to the world, from ancient pyramids to Red
              Sea paradise
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
                    <h3 className={styles.timelineCardTitle}>Founded in Hurghada</h3>
                    <p className={styles.timelineCardText}>
                      Started as a small local tour operator focusing on Red Sea diving and beach
                      holidays in Hurghada with just 3 team members.
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
                    <h3 className={styles.timelineCardTitle}>Expanded to Cairo & Luxor</h3>
                    <p className={styles.timelineCardText}>
                      Added classic Egypt tours covering pyramids, temples, and Nile cruises. Team
                      grew to 15 professional Egyptologist guides.
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
                    <h3 className={styles.timelineCardTitle}>Luxury Resort Partnerships</h3>
                    <p className={styles.timelineCardText}>
                      Partnered with 5-star resorts in Hurghada and Sharm El Sheikh to offer premium
                      beach holiday packages with world-class amenities.
                    </p>
                  </div>
                </div>

                {/* 2020 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timelineMarkerWrapper}>
                    <div className={styles.timelineMarker}>20</div>
                  </div>
                  <div className={styles.timelineCard}>
                    <h3 className={styles.timelineCardTitle}>Digital Transformation</h3>
                    <p className={styles.timelineCardText}>
                      Launched online booking platform and virtual tours, serving over 10,000
                      customers annually from 50+ countries worldwide.
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
            <strong>The most affordable prices!</strong> Choose your favorite destination!
            <button type="button" className={styles.ctaLink}>
              Order a tour!
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
