'use client';

import styles from '@/styles/components/tours/TourItinerary.module.css';

interface TourItineraryProps {
  tour: {
    id: string;
    pickupLocation?: string;
    pickupLocation_de?: string;
    vanLocation?: string;
    vanLocation_de?: string;
    location1?: string;
    location1_de?: string;
    location2?: string;
    location2_de?: string;
    location3?: string;
    location3_de?: string;
    location4?: string;
    location4_de?: string;
    location5?: string;
    location5_de?: string;
    location6?: string;
    location6_de?: string;
  };
}

export function TourItinerary({ tour }: TourItineraryProps) {
  // Mock language detection - replace with actual i18n
  const isGerman = false; // TODO: Use actual language detection

  const itineraryItems = [
    {
      field: 'pickupLocation',
      labelEn: 'Pickup Location',
      labelDe: 'Abholort',
      marker: '📌',
      isSpecial: false,
    },
    {
      field: 'vanLocation',
      labelEn: 'Van Location',
      labelDe: 'Van-Standort',
      marker: '🚐',
      isSpecial: false,
    },
    {
      field: 'location1',
      labelEn: 'Location 1',
      labelDe: 'Standort 1',
      marker: '1',
      isSpecial: false,
    },
    {
      field: 'location2',
      labelEn: 'Location 2',
      labelDe: 'Standort 2',
      marker: '2',
      isSpecial: false,
    },
    {
      field: 'location3',
      labelEn: 'Location 3',
      labelDe: 'Standort 3',
      marker: '3',
      isSpecial: false,
    },
    {
      field: 'location4',
      labelEn: 'Location 4',
      labelDe: 'Standort 4',
      marker: '4',
      isSpecial: false,
    },
    {
      field: 'location5',
      labelEn: 'Location 5',
      labelDe: 'Standort 5',
      marker: '5',
      isSpecial: false,
    },
    {
      field: 'location6',
      labelEn: 'Location 6',
      labelDe: 'Standort 6',
      marker: '6',
      isSpecial: true, // Last item gets special styling
    },
  ];

  const validItems = itineraryItems.filter((item) => {
    const value =
      isGerman && tour[`${item.field}_de` as keyof typeof tour]
        ? tour[`${item.field}_de` as keyof typeof tour]
        : tour[item.field as keyof typeof tour];
    return value && (value as string).trim();
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>🗺️</span>
        <h3 className={styles.headerTitle}>{isGerman ? 'Reiseroute' : 'Tour Itinerary'}</h3>
      </div>

      <div className={styles.itemList}>
        {validItems.length > 0 ? (
          validItems.map((item, _index) => {
            const value =
              isGerman && tour[`${item.field}_de` as keyof typeof tour]
                ? (tour[`${item.field}_de` as keyof typeof tour] as string)
                : (tour[item.field as keyof typeof tour] as string);

            return (
              <div key={item.field} className={styles.item}>
                <div
                  className={`${styles.markerBase} ${
                    item.isSpecial ? styles.markerSpecial : styles.markerNormal
                  }`}
                >
                  {item.marker}
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemText}>{value}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            {isGerman
              ? 'Reisedetails werden bei der Buchung bereitgestellt'
              : 'Itinerary details will be provided upon booking'}
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapContent}>
              <div className={styles.mapIcon}>📍</div>
              <div className={styles.mapTitle}>Hurghada, Egypt</div>
              <div className={styles.mapCoordinates}>27.2579°N, 33.8116°E</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
