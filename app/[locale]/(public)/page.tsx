import dynamic from 'next/dynamic';
import { HeroSlider } from '@/components/home/HeroSlider';
import { TravelTicker } from '@/components/home/TravelTicker';
import { ServicesSection } from '@/components/home/ServicesSection';
import { LatestTrips } from '@/components/home/LatestTrips';
import { CTASection } from '@/components/home/CTASection';
import { LocationMapClient } from '@/components/home/LocationMap.client';

// Skeleton loader styles for better UX during lazy loading
const skeletonStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '8px',
};

// Dynamically import heavy components with lazy loading
const SpecialDeals = dynamic(
  () => import('@/components/home/SpecialDeals').then((mod) => ({ default: mod.SpecialDeals })),
  {
    loading: () => (
      <section style={{ padding: '80px 20px', minHeight: '600px', background: '#1a1a1a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div
              style={{
                ...skeletonStyle,
                height: '60px',
                width: '300px',
                margin: '0 auto 1rem',
                background: '#333',
              }}
            />
            <div
              style={{
                ...skeletonStyle,
                height: '30px',
                width: '400px',
                margin: '0 auto',
                background: '#333',
              }}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...skeletonStyle, height: '400px', background: '#333' }} />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const ToursSection = dynamic(
  () => import('@/components/home/ToursSection').then((mod) => ({ default: mod.ToursSection })),
  {
    loading: () => (
      <section style={{ padding: '60px 20px', minHeight: '500px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ ...skeletonStyle, height: '40px', width: '250px', marginBottom: '40px' }} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...skeletonStyle, height: '350px' }} />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

const Testimonials = dynamic(
  () => import('@/components/home/Testimonials').then((mod) => ({ default: mod.Testimonials })),
  {
    loading: () => (
      <section style={{ padding: '60px 20px', minHeight: '350px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{ ...skeletonStyle, height: '40px', width: '200px', margin: '0 auto 40px' }}
          />
          <div style={{ ...skeletonStyle, height: '200px', maxWidth: '600px', margin: '0 auto' }} />
        </div>
      </section>
    ),
  }
);

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <TravelTicker />
      <SpecialDeals />
      <ToursSection />
      <ServicesSection />
      <LatestTrips />
      <Testimonials />
      <LocationMapClient />
      <CTASection />
    </>
  );
}
