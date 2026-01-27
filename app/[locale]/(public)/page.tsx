import dynamic from 'next/dynamic';
import { HeroSlider } from '@/components/home/HeroSlider';
import { TravelTicker } from '@/components/home/TravelTicker';
import { ServicesSection } from '@/components/home/ServicesSection';
import { LatestTrips } from '@/components/home/LatestTrips';
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

export const revalidate = 60;

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

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const [saleToursData, toursData, latestTripsData, testimonialsData] = await Promise.all([
    fetchTours('onSale=true&limit=6'),
    fetchTours('onSale=false&limit=12'),
    fetchTours('limit=12&isActive=true'),
    fetchTestimonials(50),
  ]);

  const saleTours = saleToursData ? mapSaleTours(saleToursData, locale) : undefined;
  const tours = toursData ? mapTours(toursData, locale) : undefined;
  const latestTrips = latestTripsData ? mapLatestTrips(latestTripsData, locale) : undefined;
  const testimonials = testimonialsData ?? undefined;

  return (
    <>
      <HeroSlider />
      <TravelTicker />
      <SpecialDeals initialTours={saleTours} initialLocale={locale} />
      <ToursSection initialTours={tours} initialLocale={locale} />
      <ServicesSection />
      <LatestTrips initialTours={latestTrips} initialLocale={locale} />
      <Testimonials initialTestimonials={testimonials} initialLocale={locale} />
      <QuickEnquirySection />
      <LocationMapClient />
      <CTASection />
    </>
  );
}
