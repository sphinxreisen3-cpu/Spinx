'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaEdit, FaExternalLinkAlt } from 'react-icons/fa';
import type { Tour } from '@/types/tour.types';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import tableStyles from '@/styles/components/admin/DataTable.module.css';

const TITLE_MAX = 60;
const DESC_MAX = 160;

function completenessScore(tour: Tour): number {
  let score = 0;
  const checks = [
    !!tour.title?.trim(),
    !!tour.description?.trim(),
    !!tour.slug?.trim(),
    !!tour.image1?.trim(),
    (tour.seoTitle?.trim()?.length ?? 0) <= TITLE_MAX && (tour.seoTitle?.trim()?.length ?? 0) > 0 || !tour.seoTitle,
    (tour.seoDescription?.trim()?.length ?? 0) <= DESC_MAX && (tour.seoDescription?.trim()?.length ?? 0) >= 50 || !tour.seoDescription,
  ];
  score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return score;
}

export function SeoAdminPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/tours?limit=200&isActive=true');
        if (!res.ok) throw new Error('Failed to fetch tours');
        const data = await res.json();
        setTours(data?.data?.tours ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load tours');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>SEO & Content</h1>
        <div className={styles.card}>
          <p>Loading tours…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>SEO & Content</h1>
        <div className={styles.card}>
          <p style={{ color: 'var(--destructive)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>SEO & Content</h1>
      </div>
      <p style={{ marginBottom: '1rem', color: 'hsl(var(--muted-foreground))' }}>
        Per-tour SEO overrides with safe fallbacks. Title ≤60 chars, description 150–160 chars. Only noindex per item.
      </p>
      <div className={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Tour</th>
                <th>Slug</th>
                <th>SEO Title</th>
                <th>Meta Desc</th>
                <th>Noindex</th>
                <th>Location</th>
                <th>Score</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => {
                const titleLen = (tour.seoTitle || tour.title || '').length;
                const descLen = (tour.seoDescription || tour.description || '').length;
                const score = completenessScore(tour);
                return (
                  <tr key={tour._id}>
                    <td>
                      <strong>{tour.title || '—'}</strong>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.8rem' }}>{tour.slug || '—'}</code>
                    </td>
                    <td>
                      <span title={tour.seoTitle || '(auto)'}>
                        {tour.seoTitle ? `${titleLen}/60` : 'auto'}
                      </span>
                    </td>
                    <td>
                      <span title={(tour.seoDescription || tour.description || '').slice(0, 80) + '…'}>
                        {tour.seoDescription ? `${descLen}/160` : 'auto'}
                      </span>
                    </td>
                    <td>{tour.seoNoindex ? 'noindex' : 'index'}</td>
                    <td>{tour.primaryLocation || '—'}</td>
                    <td>
                      <span style={{ color: score >= 80 ? 'green' : score >= 50 ? 'orange' : 'gray' }}>
                        {score}%
                      </span>
                    </td>
                    <td>
                      {tour.updatedAt
                        ? new Date(tour.updatedAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <Link
                        href={`/${locale}/admin/tours/${tour._id}/edit`}
                        className={styles.secondaryButton}
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        <FaEdit /> Edit
                      </Link>
                      {' '}
                      <a
                        href={`/${locale}/tours/${tour.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryButton}
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        <FaExternalLinkAlt /> View
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tours.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem' }}>No tours found.</p>
        )}
      </div>
    </div>
  );
}
