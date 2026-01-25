'use client';

import styles from '@/styles/components/tours/TourDetailsTable.module.css';

interface TourDetailsTableProps {
  locale: string;
  tour: {
    id: string;
    title: string;
    title_de?: string;
    price: number;
    description: string;
    description_de?: string;
    transportation?: string;
    transportation_de?: string;
    location?: string;
    location_de?: string;
    details?: string;
    details_de?: string;
    description2?: string;
    description2_de?: string;
    daysAndDurations?: string;
    daysAndDurations_de?: string;
    pickup?: string;
    pickup_de?: string;
    briefing?: string;
    briefing_de?: string;
    trip?: string;
    trip_de?: string;
    program?: string;
    program_de?: string;
    foodAndBeverages?: string;
    foodAndBeverages_de?: string;
    whatToTake?: string;
    whatToTake_de?: string;
  };
}

export function TourDetailsTable({ tour, locale }: TourDetailsTableProps) {
  const isGerman = locale === 'de';

  const numberLocale = isGerman ? 'de-DE' : 'en-US';
  const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
  const currency = useEUR ? 'EUR' : 'USD';
  const displayPrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(numberLocale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);

  const fields = [
    {
      key: 'title',
      labelEn: 'Tour Title',
      labelDe: 'Tour-Titel',
      icon: '🏷️',
      value: isGerman && tour.title_de ? tour.title_de : tour.title,
    },
    {
      key: 'price',
      labelEn: 'Price',
      labelDe: 'Preis',
      icon: '💰',
      value: formatCurrency(displayPrice),
    },
    {
      key: 'description',
      labelEn: 'Description',
      labelDe: 'Beschreibung',
      icon: '📖',
      value: isGerman && tour.description_de ? tour.description_de : tour.description,
    },
  ];

  const optionalFields = [
    {
      key: 'transportation',
      labelEn: 'Transportation',
      labelDe: 'Transport',
      icon: '🚗',
      value: isGerman && tour.transportation_de ? tour.transportation_de : tour.transportation,
    },
    {
      key: 'location',
      labelEn: 'Location',
      labelDe: 'Ort',
      icon: '📍',
      value: isGerman && tour.location_de ? tour.location_de : tour.location,
    },
    {
      key: 'details',
      labelEn: 'Details',
      labelDe: 'Details',
      icon: 'ℹ️',
      value: isGerman && tour.details_de ? tour.details_de : tour.details,
    },
    {
      key: 'description2',
      labelEn: 'Additional Description',
      labelDe: 'Zusätzliche Beschreibung',
      icon: '📝',
      value: isGerman && tour.description2_de ? tour.description2_de : tour.description2,
    },
    {
      key: 'daysAndDurations',
      labelEn: 'Days of the week & durations',
      labelDe: 'Tage und Dauer',
      icon: '📅',
      value:
        isGerman && tour.daysAndDurations_de ? tour.daysAndDurations_de : tour.daysAndDurations,
    },
    {
      key: 'pickup',
      labelEn: 'Pick up',
      labelDe: 'Abholung',
      icon: '🚐',
      value: isGerman && tour.pickup_de ? tour.pickup_de : tour.pickup,
    },
    {
      key: 'briefing',
      labelEn: 'Briefing',
      labelDe: 'Einweisung',
      icon: '📋',
      value: isGerman && tour.briefing_de ? tour.briefing_de : tour.briefing,
    },
    {
      key: 'trip',
      labelEn: 'Trip',
      labelDe: 'Reise',
      icon: '🗺️',
      value: isGerman && tour.trip_de ? tour.trip_de : tour.trip,
    },
    {
      key: 'program',
      labelEn: 'Program',
      labelDe: 'Programm',
      icon: '📋',
      value: isGerman && tour.program_de ? tour.program_de : tour.program,
    },
    {
      key: 'foodAndBeverages',
      labelEn: 'Food and beverages',
      labelDe: 'Essen und Getränke',
      icon: '🍽️',
      value:
        isGerman && tour.foodAndBeverages_de ? tour.foodAndBeverages_de : tour.foodAndBeverages,
    },
    {
      key: 'whatToTake',
      labelEn: 'What you need to take with you',
      labelDe: 'Was mitzunehmen',
      icon: '🎒',
      value: isGerman && tour.whatToTake_de ? tour.whatToTake_de : tour.whatToTake,
    },
  ];

  const allFields = [
    ...fields,
    ...optionalFields.filter((field) => field.value && field.value.trim()),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>📋</span>
        <h3 className={styles.headerTitle}>
          {isGerman ? 'Tour-Informationen' : 'Tour Information'}
        </h3>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <tbody>
            {allFields.map((field, index) => (
              <tr
                key={field.key}
                className={`${styles.tableRow} ${index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}`}
              >
                <td className={styles.tableLabel}>
                  <span className={styles.tableLabelIcon}>{field.icon}</span>
                  {isGerman ? field.labelDe : field.labelEn}
                </td>
                <td className={styles.tableValue}>
                  {field.key === 'price' ? (
                    <strong className={styles.priceValue}>{field.value}</strong>
                  ) : (
                    field.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
