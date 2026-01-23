import styles from '@/styles/components/admin/StatusBadge.module.css';

type StatusType =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'sale';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const displayLabel = label || status;

  return <span className={`${styles.badge} ${styles[status]}`}>{displayLabel}</span>;
}
