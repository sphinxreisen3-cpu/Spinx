import { getTranslations } from 'next-intl/server';
import styles from '@/styles/components/home/QuickEnquirySection.module.css';

export async function QuickEnquirySection() {
  const t = await getTranslations('contact');

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionKicker}>{t('form.kicker')}</p>
          <h2 className={styles.sectionTitle}>{t('form.title')}</h2>
          <div className={styles.sectionTitleUnderline}></div>
          <p className={styles.sectionSubtitle}>{t('form.subtitle')}</p>
        </div>
      </div>
      <div className={styles.cardSurface}>
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
      </div>
    </section>
  );
}
