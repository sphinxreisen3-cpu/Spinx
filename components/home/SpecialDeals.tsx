'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Tour } from '@/types/tour.types';

interface SaleTourCard {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  originalPrice: string;
  discountedPrice: string;
  discount: number;
  image: string;
  description: string;
}

export function SpecialDeals() {
  const locale = useLocale();
  const t = useTranslations();
  const [saleTours, setSaleTours] = useState<SaleTourCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaleTours = async () => {
      try {
        const response = await fetch('/api/tours?onSale=true&limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch sale tours');
        }
        const data = await response.json();
        const apiTours: Tour[] = data.data.tours;

        // Map API tours to SaleTourCard format
        const isGerman = locale === 'de';
        const mappedTours: SaleTourCard[] = apiTours.map((tour: Tour) => {
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

        setSaleTours(mappedTours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sale tours');
        console.error('Error fetching sale tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleTours();
  }, [locale]);

  return (
    <section
      style={{
        background: 'linear-gradient(314deg, rgb(255, 255, 255) 0%, rgb(167 119 61 / 22%) 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          padding: '0 1rem',
          maxWidth: '1280px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: '#f32626',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            🔥 {t('home.specialDeals.title')}
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(0, 0, 0, 0.8)', marginBottom: '2rem' }}>
            {t('home.specialDeals.subtitle')}
          </p>
          <div
            style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
              margin: '0 auto',
              borderRadius: '2px',
            }}
          ></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.6 }}>🏷️</div>
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1rem',
              }}
            >
              {t('home.specialDeals.loadingTitle')}
            </h3>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {t('home.specialDeals.loadingDesc')}
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.6 }}>❌</div>
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1rem',
              }}
            >
              {t('home.specialDeals.errorTitle')}
            </h3>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {error}
            </p>
          </div>
        ) : saleTours.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.6 }}>🎉</div>
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1rem',
              }}
            >
              {t('home.specialDeals.noDealsTitle')}
            </h3>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              {t('home.specialDeals.noDealsDesc')}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginTop: '3rem',
            }}
          >
            {saleTours.map((tour) => (
              <div
                key={tour.id}
                style={{
                  position: 'relative',
                  height: '400px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: '#333',
                }}
              >
                <div
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                >
                  <img
                    src={tour.image}
                    alt={tour.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/tours/pyramid-sky-desert-ancient.jpg';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '25px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    {tour.discount}% OFF
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2rem',
                    color: 'white',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {tour.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      marginBottom: '1rem',
                      opacity: 0.9,
                    }}
                  >
                    {tour.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          textDecoration: 'line-through',
                          opacity: 0.7,
                        }}
                      >
                        {tour.originalPrice}
                      </span>
                      <span
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: '#ff6b6b',
                          marginLeft: '0.5rem',
                        }}
                      >
                        {tour.discountedPrice}
                      </span>
                    </div>
                    <Link href={`/${locale}/tours/${tour.slug}#book`}>
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {t('home.specialDeals.bookNow')}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
