'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/components/home/ToursSection.module.css';

const staticTours = [
  {
    id: '1',
    slug: 'pyramids-of-giza-tour',
    title: 'Egyptian Pyramids Tour',
    category: 'Ancient Wonders',
    duration: '1 Day',
    rating: 4.8,
    price: '$299',
    image: '/images/tours/pyramid-sky-desert-ancient.jpg',
    description:
      'Explore the ancient Pyramids of Giza, Sphinx, and other wonders of ancient Egypt.',
  },
  {
    id: '2',
    slug: 'red-sea-diving-adventure',
    title: 'Red Sea Diving Adventure',
    category: 'Water Sports',
    duration: '2 Days',
    rating: 4.9,
    price: '$499',
    image: '/images/tours/istockphoto-1085592710-612x612.webp',
    description: 'Experience world-class diving in the crystal clear waters of the Red Sea.',
  },
  {
    id: '3',
    slug: 'luxury-resort-stay',
    title: 'Luxury Resort Stay',
    category: 'Beach Resort',
    duration: '3 Days',
    rating: 4.7,
    price: '$699',
    image: '/images/tours/iStock-508838512-1-scaled.webp',
    description: "Indulge in luxury at one of Hurghada's finest beach resorts.",
  },
  {
    id: '4',
    slug: 'nile-cruise-experience',
    title: 'Nile River Cruise',
    category: 'Cultural',
    duration: '4 Days',
    rating: 4.9,
    price: '$899',
    image: '/images/tours/08.webp',
    description: 'Sail along the legendary Nile River visiting ancient temples and monuments.',
  },
  {
    id: '5',
    slug: 'desert-safari-adventure',
    title: 'Desert Safari Experience',
    category: 'Adventure',
    duration: '1 Day',
    rating: 4.6,
    price: '$199',
    image: '/images/tours/pyramid-sky-desert-ancient.jpg',
    description: 'Experience the thrill of desert safari with quad biking and Bedouin hospitality.',
  },
  {
    id: '6',
    slug: 'luxor-temples-tour',
    title: 'Luxor Temples & Valley of Kings',
    category: 'Historical',
    duration: '2 Days',
    rating: 4.8,
    price: '$399',
    image: '/images/tours/istockphoto-1085592710-612x612.webp',
    description: 'Discover the magnificent temples of Luxor and the Valley of Kings.',
  },
];

export function ToursSection() {
  return (
    <section className={styles.section} id="tours-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🏖️ Amazing Destinations
            <div className={styles.titleUnderline}></div>
          </h2>
        </div>

        {/* Search and Filter */}
        <div className={styles.filterSection}>
          <div className={styles.filterWrapper}>
            <div className={styles.filterRow}>
              <div className={styles.searchWrapper}>
                <div className={styles.searchInputWrapper}>
                  <input
                    type="text"
                    id="tours-search"
                    placeholder="Search tours by destination, activity, or description..."
                    className={styles.searchInput}
                  />
                  <span className={styles.searchIcon}>🔍</span>
                </div>
              </div>

              <div className={styles.selectWrapper}>
                <select id="category-filter" className={styles.selectInput}>
                  <option value="">All Categories</option>
                  <option value="Ancient Wonders">Ancient Wonders</option>
                  <option value="Water Sports">Water Sports</option>
                  <option value="Beach Resort">Beach Resort</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Historical">Historical</option>
                </select>
                <span className={styles.selectIcon}>📂</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        <div className={styles.grid}>
          {staticTours.map((tour) => (
            <div key={tour.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className={styles.image}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className={styles.categoryBadge}>{tour.category}</div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{tour.title}</h3>

                <p className={styles.cardDescription}>{tour.description}</p>

                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>⏱️</span>
                    {tour.duration}
                  </span>
                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>⭐</span>
                    {tour.rating}
                  </span>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.price}>{tour.price}</span>
                  <Link href={`/tours/${tour.slug}`}>
                    <button className={styles.bookButton}>Book Now</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
