import { Metadata } from 'next';
import AdminLayoutClient from '@/components/layout/AdminLayoutClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
