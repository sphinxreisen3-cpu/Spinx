import type { Metadata } from 'next';
import { Oswald, Lato, Montserrat } from 'next/font/google';
import './globals.css';
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

export const metadata: Metadata = {
  title: {
    default: 'Sphinx Reisen - Ihr Reiseveranstalter',
    template: '%s | Sphinx Reisen',
  },
  description: 'Entdecken Sie unvergessliche Reisen mit Sphinx Reisen',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${lato.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
