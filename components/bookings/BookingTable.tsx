import styles from '@/styles/components/bookings/BookingTable.module.css';

export function BookingTable() {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableHeaderCell}>Name</th>
            <th className={styles.tableHeaderCell}>Tour</th>
            <th className={styles.tableHeaderCell}>Status</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>{/* TODO: Map bookings */}</tbody>
      </table>
    </div>
  );
}
