import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { TourForm } from '@/components/admin/TourForm';
import styles from '@/styles/pages/admin/AdminPage.module.css';

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: _id } = await params;
  // TODO: Fetch tour data by id and pass to TourForm
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
        <TourForm />
      </div>
    </div>
  );
}
