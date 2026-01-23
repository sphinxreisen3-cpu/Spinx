import Link from 'next/link';
import styles from '@/styles/pages/contact/ContactPage.module.css';

const contacts = [
  {
    title: 'Call Us',
    value: '+20 100 905 9295',
    href: 'tel:+201009059295',
    cta: 'Call now',
  },
  {
    title: 'WhatsApp',
    value: '+20 100 905 9295',
    href: 'https://wa.link/l3auw8',
    cta: 'Open WhatsApp',
  },
  {
    title: 'Email',
    value: 'sphinxreisen3@gmail.com',
    href: 'mailto:sphinxreisen3@gmail.com',
    cta: 'Send email',
  },
  {
    title: 'Visit Us',
    value: 'Cairo, Egypt',
    href: 'https://maps.app.goo.gl/w6UgCtGAbvvNc6L3A',
    cta: 'View on Maps',
  },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>We are here for you</p>
          <h1 className={styles.title}>Let&apos;s plan your next unforgettable journey</h1>
          <p className={styles.subtitle}>
            Reach out by phone, WhatsApp, or email. Our travel specialists respond quickly with
            tailored recommendations, accurate pricing, and the local insights you need.
          </p>
          <div className={styles.heroActions}>
            <Link href="https://wa.link/l3auw8" className={styles.primaryCta} target="_blank">
              Chat on WhatsApp
            </Link>
            <Link href="mailto:sphinxreisen3@gmail.com" className={styles.secondaryCta}>
              Send us an email
            </Link>
          </div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.cardHeader}>Response time</div>
          <div className={styles.responseTime}>Under 1 hour</div>
          <p className={styles.cardNote}>During business hours. We often reply within minutes.</p>
          <div className={styles.badge}>24/7 guest support</div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Contact options</p>
            <h2 className={styles.sectionTitle}>Choose how you want to connect</h2>
            <p className={styles.sectionSubtitle}>
              We speak English and German. Tell us your travel dates, group size, and
              preferences—we&apos;ll craft the perfect itinerary.
            </p>
          </div>
        </div>
        <div className={styles.contactGrid}>
          {contacts.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              className={styles.contactCard}
            >
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardValue}>{item.value}</div>
              <span className={styles.cardCta}>{item.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Tell us about your trip</p>
            <h2 className={styles.sectionTitle}>Quick enquiry</h2>
            <p className={styles.sectionSubtitle}>
              Share the essentials—we&apos;ll respond with tailored options, transparent pricing,
              and timelines.
            </p>
          </div>
        </div>
        <form className={styles.form} action="https://formspree.io/f/xayrnnov" method="POST">
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Your Name *</span>
              <input name="name" type="text" placeholder="Alex Johnson" required />
            </label>
            <label className={styles.field}>
              <span>Phone Number</span>
              <input name="phone" type="tel" placeholder="+20 100 905 9295" />
            </label>
            <label className={styles.field}>
              <span>Your Email *</span>
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label className={styles.field}>
              <span>Subject *</span>
              <input name="subject" type="text" placeholder="Trip inquiry or question" required />
            </label>
          </div>
          <label className={styles.field}>
            <span>More Details</span>
            <textarea
              name="message"
              rows={5}
              placeholder="Share dates, destinations, group size, or any specifics you want."
              required
            ></textarea>
          </label>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryCta}>
              Send enquiry
            </button>
            <span className={styles.responseHint}>We reply quickly—usually within an hour.</span>
          </div>
        </form>
      </section>
    </div>
  );
}
