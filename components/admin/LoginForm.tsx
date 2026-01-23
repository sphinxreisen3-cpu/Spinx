'use client';

import styles from '@/styles/components/admin/LoginForm.module.css';

export function LoginForm() {
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Password</label>
        <input type="password" className={styles.input} placeholder="Enter admin password" />
      </div>
      <button type="submit" className={styles.submitButton}>
        Login
      </button>
    </form>
  );
}
