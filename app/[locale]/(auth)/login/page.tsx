import { LoginForm } from '@/components/admin/LoginForm';
import styles from '@/styles/pages/admin/AdminPage.module.css';

export default function LoginPage() {
  return (
    <div className={styles.card}>
      <h1 className={styles.titleCenter}>Admin Login</h1>
      <LoginForm />
    </div>
  );
}
