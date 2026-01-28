import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaBanner } from '@/components/layout/CtaBanner';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

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
