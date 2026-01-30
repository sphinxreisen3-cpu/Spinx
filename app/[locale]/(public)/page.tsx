import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { TravelTicker } from '@/components/home/TravelTicker';
import { ServicesSection } from '@/components/home/ServicesSection';
import { CTASection } from '@/components/home/CTASection';
import { LocationMapClient } from '@/components/home/LocationMap.client';
import { QuickEnquirySection } from '@/components/home/QuickEnquirySection';
import type { Tour } from '@/types/tour.types';
import type {
  HomeLatestTripCard,
  HomeSaleTourCard,
  HomeTestimonial,
  HomeTourCard,
} from '@/types/home.types';
import { normalizeBaseUrl } from '@/lib/utils/helpers';

export const revalidate = 60;

// Skeleton loader styles for better UX during lazy loading
const skeletonStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '8px',
};

const TravelTickerFallback = () => (
  <section style={{ padding: '8px 0', background: '#ffffff' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{ ...skeletonStyle, height: '32px', borderRadius: '9999px' }} />
    </div>
  </section>
);

const SpecialDealsFallback = () => (
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
);

const ToursSectionFallback = () => (
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
);

const LatestTripsFallback = () => (
  <section style={{ padding: '60px 20px', minHeight: '500px' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ ...skeletonStyle, height: '40px', width: '220px', marginBottom: '40px' }} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ ...skeletonStyle, height: '360px' }} />
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsFallback = () => (
  <section style={{ padding: '60px 20px', minHeight: '350px', background: '#f9fafb' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ ...skeletonStyle, height: '40px', width: '200px', margin: '0 auto 40px' }} />
      <div style={{ ...skeletonStyle, height: '200px', maxWidth: '600px', margin: '0 auto' }} />
    </div>
  </section>
);

// Dynamically import heavy components with lazy loading
const SpecialDeals = dynamic(
  () => import('@/components/home/SpecialDeals').then((mod) => ({ default: mod.SpecialDeals })),
  {
    loading: () => <SpecialDealsFallback />,
  }
);

const ToursSection = dynamic(
  () => import('@/components/home/ToursSection').then((mod) => ({ default: mod.ToursSection })),
  {
    loading: () => <ToursSectionFallback />,
  }
);

const LatestTrips = dynamic(
  () => import('@/components/home/LatestTrips').then((mod) => ({ default: mod.LatestTrips })),
  {
    loading: () => <LatestTripsFallback />,
  }
);

const Testimonials = dynamic(
  () => import('@/components/home/Testimonials').then((mod) => ({ default: mod.Testimonials })),
  {
    loading: () => <TestimonialsFallback />,
  }
);

type ToursApiResponse = {
  success: boolean;
  data?: {
    tours?: Tour[];
  };
};

type TestimonialsApiResponse = {
  success: boolean;
  data?: {
    testimonials?: Array<Record<string, unknown>>;
  };
};

const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(
  /\/$/,
  ''
);

const fetchTours = async (query: string): Promise<Tour[] | null> => {
  try {
    const response = await fetch(`${baseUrl}/api/tours?${query}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as ToursApiResponse;
    const tours = json?.data?.tours;
    return Array.isArray(tours) ? tours : null;
  } catch {
    return null;
  }
};

const fetchTestimonials = async (limit: number): Promise<HomeTestimonial[] | null> => {
  try {
    const response = await fetch(`${baseUrl}/api/testimonials?limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as TestimonialsApiResponse;
    const raw = json?.data?.testimonials;
    if (!Array.isArray(raw)) return null;

    const mapped = raw
      .map((item) => ({
        id: String((item._id as string) || (item.id as string) || ''),
        name: String(item.name || ''),
        country: item.country ? String(item.country) : undefined,
        role: item.role ? String(item.role) : undefined,
        role_de: item.role_de ? String(item.role_de) : undefined,
        initials: String(item.initials || ''),
        image: String(item.image || 'blue'),
        text: String(item.text || ''),
        text_de: item.text_de ? String(item.text_de) : undefined,
      }))
      .filter((item) => Boolean(item.id && item.name && item.initials && item.text));

    return mapped;
  } catch {
    return null;
  }
};

const mapSaleTours = (tours: Tour[], locale: string): HomeSaleTourCard[] => {
  const isGerman = locale === 'de';
  return tours.map((tour) => {
    const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
    const basePrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
    const currencySymbol = useEUR ? '€' : '$';
    const discountedPrice = Math.round(basePrice - (basePrice * tour.discount) / 100);

    return {
      id: tour._id,
      slug: tour.slug,
      title: isGerman && tour.title_de ? tour.title_de : tour.title,
      category: isGerman && tour.category_de ? tour.category_de : tour.category,
      duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
      originalPrice: `${currencySymbol}${basePrice}`,
      discountedPrice: `${currencySymbol}${discountedPrice}`,
      discount: tour.discount,
      image: tour.image1 || '/images/placeholder-tour.jpg',
      description: isGerman && tour.description_de ? tour.description_de : tour.description,
    };
  });
};

const mapTours = (tours: Tour[], locale: string): HomeTourCard[] => {
  const isGerman = locale === 'de';
  return tours.map((tour) => {
    const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
    const displayPrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
    const currencySymbol = useEUR ? '€' : '$';

    return {
      id: tour._id,
      slug: tour.slug,
      title: isGerman && tour.title_de ? tour.title_de : tour.title,
      category: isGerman && tour.category_de ? tour.category_de : tour.category,
      duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
      rating: 4.8,
      price: `${currencySymbol}${displayPrice}`,
      image: tour.image1 || '/images/placeholder-tour.jpg',
      description: isGerman && tour.description_de ? tour.description_de : tour.description,
    };
  });
};

const mapLatestTrips = (tours: Tour[], locale: string): HomeLatestTripCard[] => {
  const isGerman = locale === 'de';

  return tours.map((tour) => {
    const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
    const basePrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
    const currencySymbol = useEUR ? '€' : '$';
    const isOnSale = tour.onSale && tour.discount > 0;
    const discountedPrice = isOnSale
      ? Math.round(basePrice - (basePrice * tour.discount) / 100)
      : basePrice;

    return {
      id: tour._id,
      slug: tour.slug,
      title: isGerman && tour.title_de ? tour.title_de : tour.title,
      image: tour.image1 || '/images/placeholder-tour.jpg',
      category: isGerman && tour.category_de ? tour.category_de : tour.category,
      duration: isGerman && tour.travelType_de ? tour.travelType_de : tour.travelType,
      rating: 4.8,
      price: `${currencySymbol}${discountedPrice}`,
      originalPrice: isOnSale ? `${currencySymbol}${basePrice}` : undefined,
      discount: tour.discount,
      isOnSale,
    };
  });
};

async function SpecialDealsSection({ locale }: { locale: string }) {
  const saleToursData = await fetchTours('onSale=true&limit=6');
  const saleTours = saleToursData ? mapSaleTours(saleToursData, locale) : undefined;
  return <SpecialDeals initialTours={saleTours} initialLocale={locale} />;
}

async function ToursSectionBlock({ locale }: { locale: string }) {
  const toursData = await fetchTours('onSale=false&limit=12');
  const tours = toursData ? mapTours(toursData, locale) : undefined;
  return <ToursSection initialTours={tours} initialLocale={locale} />;
}

async function LatestTripsSection({ locale }: { locale: string }) {
  const latestTripsData = await fetchTours('limit=12&isActive=true');
  const latestTrips = latestTripsData ? mapLatestTrips(latestTripsData, locale) : undefined;
  return <LatestTrips initialTours={latestTrips} initialLocale={locale} />;
}

async function TestimonialsSection({ locale }: { locale: string }) {
  const testimonialsData = await fetchTestimonials(50);
  const testimonials = testimonialsData ?? undefined;
  return <Testimonials initialTestimonials={testimonials} initialLocale={locale} />;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <>
      <HeroSlider />
      <Suspense fallback={<TravelTickerFallback />}>
        <TravelTicker />
      </Suspense>
      <Suspense fallback={<SpecialDealsFallback />}>
        <SpecialDealsSection locale={locale} />
      </Suspense>
      <Suspense fallback={<ToursSectionFallback />}>
        <ToursSectionBlock locale={locale} />
      </Suspense>
      <Suspense fallback={null}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<LatestTripsFallback />}>
        <LatestTripsSection locale={locale} />
      </Suspense>
      <Suspense fallback={<TestimonialsFallback />}>
        <TestimonialsSection locale={locale} />
      </Suspense>
      <Suspense fallback={null}>
        <QuickEnquirySection />
      </Suspense>
      <LocationMapClient />
      <Suspense fallback={null}>
        <CTASection />
      </Suspense>
    </>
  );
}
