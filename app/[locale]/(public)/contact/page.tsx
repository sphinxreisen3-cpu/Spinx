import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import styles from '@/styles/pages/contact/ContactPage.module.css';

export default async function ContactPage() {
  const t = await getTranslations('contact');

  const contacts = [
    {
      title: t('options.callUs'),
      value: '+20 100 905 9295',
      href: 'tel:+201009059295',
      cta: t('options.callNow'),
    },
    {
      title: t('options.whatsApp'),
      value: '+20 100 905 9295',
      href: 'https://wa.link/l3auw8',
      cta: t('options.openWhatsApp'),
    },
    {
      title: t('options.email'),
      value: 'sphinxreisen3@gmail.com',
      href: 'mailto:sphinxreisen3@gmail.com',
      cta: t('options.sendEmail'),
    },
    {
      title: t('options.visitUs'),
      value: 'Cairo, Egypt',
      href: 'https://maps.app.goo.gl/w6UgCtGAbvvNc6L3A',
      cta: t('options.viewMaps'),
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>{t('hero.kicker')}</p>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.subtitle}>{t('hero.subtitle')}</p>
          <div className={styles.heroActions}>
            <Link href="https://wa.link/l3auw8" className={styles.primaryCta} target="_blank">
              {t('hero.chatWhatsApp')}
            </Link>
            <Link href="mailto:sphinxreisen3@gmail.com" className={styles.secondaryCta}>
              {t('hero.sendEmail')}
            </Link>
          </div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.cardHeader}>{t('hero.responseTime')}</div>
          <div className={styles.responseTime}>{t('hero.underHour')}</div>
          <p className={styles.cardNote}>{t('hero.cardNote')}</p>
          <div className={styles.badge}>{t('hero.badge')}</div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>{t('options.kicker')}</p>
            <h2 className={styles.sectionTitle}>{t('options.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('options.subtitle')}</p>
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
            <p className={styles.sectionKicker}>{t('form.kicker')}</p>
            <h2 className={styles.sectionTitle}>{t('form.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('form.subtitle')}</p>
          </div>
        </div>
        <form className={styles.form} action="https://formspree.io/f/xayrnnov" method="POST">
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t('form.name')}</span>
              <input name="name" type="text" placeholder={t('form.namePlaceholder')} required />
            </label>
            <label className={styles.field}>
              <span>{t('form.phone')}</span>
              <input name="phone" type="tel" placeholder={t('form.phonePlaceholder')} />
            </label>
            <label className={styles.field}>
              <span>{t('form.email')}</span>
              <input name="email" type="email" placeholder={t('form.emailPlaceholder')} required />
            </label>
            <label className={styles.field}>
              <span>{t('form.subject')}</span>
              <input name="subject" type="text" placeholder={t('form.subjectPlaceholder')} required />
            </label>
          </div>
          <label className={styles.field}>
            <span>{t('form.details')}</span>
            <textarea
              name="message"
              rows={5}
              placeholder={t('form.detailsPlaceholder')}
              required
            ></textarea>
          </label>
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryCta}>
              {t('form.submit')}
            </button>
            <span className={styles.responseHint}>{t('form.responseHint')}</span>
          </div>
        </form>
      </section>
    </div>
  );
}
