import { ReactNode } from 'react';
import { FaInbox } from 'react-icons/fa';
import styles from '@/styles/components/admin/DataTable.module.css';

export interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  emptyDescription?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = 'No data found',
  emptyDescription = 'There are no items to display.',
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>
          <FaInbox className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>{emptyMessage}</h3>
          <p className={styles.emptyText}>{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`${styles.tableHeaderCell} ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {data.map((item) => (
            <tr key={String(item[keyField])} className={styles.tableRow}>
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`${styles.tableCell} ${col.className || ''}`}
                  data-label={col.label}
                >
                  {col.render
                    ? col.render(item)
                    : col.key !== 'actions'
                      ? String(item[col.key as keyof T] ?? '')
                      : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
