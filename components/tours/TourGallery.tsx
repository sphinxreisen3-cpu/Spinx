'use client';

import Image from 'next/image';
import styles from '@/styles/components/tours/TourGallery.module.css';

interface TourGalleryProps {
  tour: {
    id: string;
    imageUrl: string;
    imageUrl2?: string;
    imageUrl3?: string;
    imageUrl4?: string;
  };
}

export function TourGallery({ tour }: TourGalleryProps) {
  const images = [tour.imageUrl4, tour.imageUrl3, tour.imageUrl2, tour.imageUrl].filter(
    (img): img is string => Boolean(img)
  ); // Remove undefined images

  if (images.length <= 1) {
    return null; // Don't show gallery if only main image exists
  }

  return (
    <div className={styles.grid}>
      {images.map((imageUrl, index) => (
        <div key={index} className={styles.imageCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={`Tour view ${index + 1}`}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className={styles.imageOverlay}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
