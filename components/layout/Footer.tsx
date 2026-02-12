'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import styles from '../../styles/components/layout/Footer.module.css';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'tours', href: '/tours' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

const socialLinks = [
  {
    href: 'https://www.facebook.com/waelmohammed554',
    label: 'Facebook',
    icon: <FaFacebookF />,
  },
  {
    href: 'https://www.instagram.com/sphinx.elite.reisen',
    label: 'Instagram',
    icon: <FaInstagram />,
  },
  {
    href: 'https://www.tiktok.com/@sphinxelitereisen',
    label: 'TikTok',
    icon: <FaTiktok />,
  },
  {
    href: 'https://wa.link/l3auw8',
    label: 'WhatsApp',
    icon: <FaWhatsapp />,
  },
] as const;

export function Footer() {
  const locale = useLocale();
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoBlock}>
          <Link href={`/${locale}`} className={styles.logoLink}>
            <Image
              src="/images/logo/logo.webp"
              alt="Sealine Travel Logo"
              width={208}
              height={46}
              className="h-auto w-[208px]"
              priority
            />
          </Link>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
        </div>

        <div className={styles.footerNav}>
          <div className={styles.navTitle}>{t('footer.navigateTitle')}</div>
          <div className={styles.navButtons}>
            {navLinks.map(({ key, href }) => (
              <Link
                key={href}
                href={`/${locale}${href === '/' ? '' : href}`}
                className={styles.navButton}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.contactSection}>
          <div className={styles.navTitle}>{t('footer.contactTitle')}</div>
          <div className={styles.contactList}>
            <a href="tel:+201009059295" className={styles.contactItem}>
              <FaPhoneAlt aria-hidden />
              <span>+20 100 905 9295</span>
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&to=sphinxreisen3@gmail.com"
              target="_blank"
              rel="noreferrer"
              className={styles.contactItem}
            >
              <MdEmail aria-hidden />
              <span>sphinxreisen3@gmail.com</span>
            </a>
            <a
              href="https://wa.link/l3auw8"
              target="_blank"
              rel="noreferrer"
              className={styles.contactItem}
            >
              <FaWhatsapp aria-hidden />
              <span>{t('footer.whatsappSupport')}</span>
            </a>
            <a href="#map" className={styles.contactItem}>
              <FaMapMarkerAlt aria-hidden />
              <span>{t('footer.findUsOnMap')}</span>
            </a>
          </div>
        </div>

        <div className={styles.socialSection}>
          <div className={styles.navTitle}>{t('footer.followTitle')}</div>
          <div className={styles.socialGrid}>
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={styles.socialLink}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <span>
            © {year} {t('footer.rights')}
          </span>
          <a href="#" className={styles.copyrightLink}>
            {t('footer.designBy')}
          </a>
        </div>
      </div>
    </footer>
  );
}
