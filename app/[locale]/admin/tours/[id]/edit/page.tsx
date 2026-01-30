import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { TourForm } from '@/components/admin/TourForm';
import { getBaseUrl } from '@/lib/utils/helpers';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import type { Tour } from '@/types/tour.types';

async function getTourById(id: string): Promise<Tour | null> {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const res = await fetch(`${baseUrl}/api/tours/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.tour ?? null;
}

export default async function EditTourPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link
            href="/admin/tours"
            className={styles.secondaryButton}
            style={{ marginBottom: '0.5rem', display: 'inline-flex' }}
          >
            <FaArrowLeft /> Back to Tours
          </Link>
          <h1 className={styles.title} style={{ marginBottom: 0 }}>
            Edit Tour
          </h1>
        </div>
      </div>
      <div className={styles.card}>
        <TourForm tour={tour} />
      </div>
    </div>
  );
}
