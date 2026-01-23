import { redirect } from 'next/navigation';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Redirect to the tours list within the current locale
  redirect(`/${locale}/admin/tours`);
}
