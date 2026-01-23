import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sphinx Reisen',
  description: 'Travel agency booking system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
