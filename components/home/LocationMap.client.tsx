'use client';

import dynamic from 'next/dynamic';

// Client-only wrapper to allow disabling SSR for the map widget
const LocationMapLazy = dynamic(
  () => import('./LocationMap').then((mod) => ({ default: mod.LocationMap })),
  {
    ssr: false,
    loading: () => (
      <section style={{ padding: '40px 20px', minHeight: '450px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '8px',
              height: '400px',
            }}
          />
        </div>
      </section>
    ),
  }
);

export function LocationMapClient() {
  return <LocationMapLazy />;
}
