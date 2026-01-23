import styles from '@/styles/pages/admin/AdminPage.module.css';

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Booking Details</h1>
      <p>Booking ID: {id}</p>
    </div>
  );
}
