import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaBanner } from '@/components/layout/CtaBanner';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { getBaseUrl } from '@/lib/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const segments = pathname.split('/').filter(Boolean);
  const rest = segments.slice(1).join('/');
  const languages: Record<string, string> = {
    en: `${baseUrl}/en${rest ? `/${rest}` : ''}`,
    de: `${baseUrl}/de${rest ? `/${rest}` : ''}`,
    'x-default': `${baseUrl}/en${rest ? `/${rest}` : ''}`,
  };
  return {
    alternates: {
      languages,
    },
  };
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <ScrollToTop />
      <CtaBanner />
      <Footer />
    </>
  );
}
