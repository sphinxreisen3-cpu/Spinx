'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaFacebookF, FaInstagram, FaMapMarkerAlt, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import styles from '../../styles/components/layout/Header.module.css';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'tours', href: '/tours' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

const socialLinks = [
  { label: 'WhatsApp', href: 'https://wa.link/l3auw8', icon: <FaWhatsapp /> },
  { label: 'Facebook', href: 'https://www.facebook.com/waelmohammed554', icon: <FaFacebookF /> },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sphinxreisen/?igsh=OTgxaXB1dHNicDcy#',
    icon: <FaInstagram />,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@sphinx.reisen?_r=1&_t=ZS-92Q1hv6Fys6',
    icon: <FaTiktok />,
  },
];

export function Header() {
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const basePath = pathname.startsWith(`/${locale}`)
    ? pathname.slice(locale.length + 1) || '/'
    : pathname;

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    const query = searchParams.toString();
    router.push(`/${newLocale}${basePath === '/' ? '' : basePath}${query ? `?${query}` : ''}`);
  };

  const langButton = (code: string) => (
    <button
      key={code}
      onClick={() => switchLanguage(code)}
      data-lang={code}
      className={`${styles.langButton} ${locale === code ? styles.langButtonActive : styles.langButtonInactive}`}
      aria-pressed={locale === code}
      title={code === 'en' ? 'English' : 'Deutsch'}
    >
      {code.toUpperCase()}
    </button>
  );

  return (
    <header className={styles.header}>
      {/* Desktop top panel */}
      <div className={styles.desktopTopPanel}>
        <div className={styles.desktopContainer}>
          <div className={styles.navContainer}>
            <Link href={`/${locale}`} className={styles.logoLink}>
              <Image
                src="/images/logo/logo.webp"
                alt="Sphinx Reisen Logo"
                width={200}
                height={66}
                priority
              />
            </Link>
            <nav className={styles.navContainer}>
              {navLinks.map(({ key, href }) => {
                const isActive = basePath === href;
                return (
                  <Link
                    key={href}
                    href={`/${locale}${href === '/' ? '' : href}`}
                    className={`${styles.navButton} ${isActive ? styles.navButtonActive : styles.navButtonInactive}`}
                    aria-current={isActive ? 'page' : undefined}
                    prefetch={true}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.rightSection}>
            {/* <div className={styles.phoneSection}>
              <FaPhoneAlt className={styles.phoneIcon} aria-hidden />
              <Link href="tel:+201009059295" className={styles.phoneLink}>
                <span className={styles.phoneHighlight}>
                  +<span>20</span>
                </span>
                100<span>9</span>05
                <span>9</span>2<span>9</span>5
              </Link>
            </div> */}

            <div className={styles.socialSection}>
              <Link
                href={`/${locale}#map`}
                className={styles.mapIcon}
                aria-label="View map section"
                title="View map section"
              >
                <FaMapMarkerAlt aria-hidden />
              </Link>
              <Link
                href="https://wa.link/l3auw8"
                target="_blank"
                className={styles.socialLink}
                aria-label="WhatsApp"
              >
                <FaWhatsapp className={styles.whatsappIcon} />
              </Link>
              <Link
                href="https://www.facebook.com/waelmohammed554"
                target="_blank"
                aria-label="Facebook"
                className={styles.facebookLink}
              >
                <FaFacebookF />
              </Link>
              <Link
                href="https://www.instagram.com/sphinxreisen/?igsh=OTgxaXB1dHNicDcy#"
                target="_blank"
                aria-label="Instagram"
                className={styles.instagramLink}
              >
                <FaInstagram />
              </Link>
              <Link
                href="https://www.tiktok.com/@sphinx.reisen?_r=1&_t=ZS-92Q1hv6Fys6"
                target="_blank"
                aria-label="TikTok"
                className={styles.tiktokLink}
              >
                <FaTiktok />
              </Link>
              <Link
                href="https://mail.google.com/mail/?view=cm&to=sphinxreisen3@gmail.com"
                target="_blank"
                aria-label="Email"
                className={styles.emailLink}
                style={{ display: 'none' }}
              >
                {/* Email icon removed on request */}
              </Link>
              <div className={styles.langSwitcher}>
                {langButton('en')}
                <span className={styles.langSeparator}>|</span>
                {langButton('de')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileContainer}>
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
            className={styles.mobileMenuButton}
          >
            <span className={styles.mobileMenuButtonSpan}>≡</span>
          </button>

          <Link
            href={`/${locale}`}
            className={styles.mobileLogoLink}
            aria-label="Sphinx Reisen Home"
          >
            <Image
              src="/images/logo/logo.webp"
              alt="Sphinx Reisen Logo"
              width={120}
              height={26}
              priority
            />
          </Link>

          <div className={styles.mobileRightSection}>
            <div className={styles.mobileLangSwitcher}>
              {langButton('en')}
              <span className={styles.langSeparator}>|</span>
              {langButton('de')}
            </div>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNavMenu}>
            <nav className={styles.mobileNav}>
              {navLinks.map(({ key, href }) => (
                <Link
                  key={href}
                  href={`/${locale}${href === '/' ? '' : href}`}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                  prefetch={true}
                >
                  {t(`nav.${key}`)}
                </Link>
              ))}
            </nav>
            <div className={styles.mobileSocialGrid}>
              {socialLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  className={styles.mobileSocialLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
