import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Oswald, Lato, Montserrat } from 'next/font/google';
import './globals.css';
import { normalizeBaseUrl, getBaseUrl } from '@/lib/utils/helpers';
/*
 * DEV STYLES: Imported after globals so temporary styles can override
 * project defaults at equal specificity. Remove before production or
 * ensure the file is empty. See styles/dev.css for usage instructions.
 */
import '../styles/dev.css';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  preload: true,
});

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  preload: true,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false, // Less critical font, load on demand
});

const defaultTitle = 'Sphinx Reisen - Ihr Reiseveranstalter';
const defaultDescription = 'Entdecken Sie unvergessliche Reisen mit Sphinx Reisen';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: '%s | Sphinx Reisen',
  },
  description: defaultDescription,
  icons: {
    icon: '/images/favicon.png',
  },
  metadataBase: new URL(
    normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  ),
  openGraph: {
    siteName: 'Sphinx Reisen',
    type: 'website',
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
  },
};

function OrganizationJsonLd() {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sphinx Reisen',
    url: baseUrl,
    logo: `${baseUrl}/images/logo/logo.webp`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const locale = headersList.get('x-next-locale') || 'en';
  const lang = ['en', 'de'].includes(locale) ? locale : 'en';

  return (
    <html lang={lang} className={`${oswald.variable} ${lato.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
