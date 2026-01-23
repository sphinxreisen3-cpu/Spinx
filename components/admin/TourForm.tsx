'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Tour, CreateTourInput } from '@/types/tour.types';
import styles from '@/styles/components/admin/TourForm.module.css';
import pageStyles from '@/styles/pages/admin/AdminPage.module.css';

const travelTypes = ['1 day', '2 days', '3 days', '1 week', '2 weeks'];
const categories = ['Cultural', 'Adventure', 'Historical', 'Beach', 'Desert', 'Cruise'];

interface TourFormProps {
  tour?: Tour;
  onSubmit?: (data: CreateTourInput) => Promise<void>;
}

export function TourForm({ tour, onSubmit }: TourFormProps) {
  const isEdit = Boolean(tour);

  const [formData, setFormData] = useState<CreateTourInput>({
    title: tour?.title || '',
    title_de: tour?.title_de || '',
    price: tour?.price || 0,
    travelType: tour?.travelType || '1 day',
    category: tour?.category || '',
    description: tour?.description || '',
    description_de: tour?.description_de || '',
    longDescription: tour?.longDescription || '',
    longDescription_de: tour?.longDescription_de || '',
    highlights: tour?.highlights || [],
    highlights_de: tour?.highlights_de || [],
  });

  const [isActive, setIsActive] = useState(tour?.isActive ?? true);
  const [onSale, setOnSale] = useState(tour?.onSale ?? false);
  const [discount, setDiscount] = useState(tour?.discount ?? 0);
  const [images, setImages] = useState({
    image1: tour?.image1 || '',
    image2: tour?.image2 || '',
    image3: tour?.image3 || '',
    image4: tour?.image4 || '',
  });
  const [locations, setLocations] = useState({
    location1: tour?.location1 || '',
    location2: tour?.location2 || '',
    location3: tour?.location3 || '',
    location4: tour?.location4 || '',
    location5: tour?.location5 || '',
    location6: tour?.location6 || '',
  });

  const [highlightsText, setHighlightsText] = useState((tour?.highlights || []).join('\n'));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData: CreateTourInput = {
      ...formData,
      highlights: highlightsText.split('\n').filter((h) => h.trim()),
    };

    // TODO: Add API call
    console.log('Submit data:', { ...submitData, isActive, onSale, discount, images, locations });

    if (onSubmit) {
      await onSubmit(submitData);
    }

    setIsSubmitting(false);
  };

  const updateField = <K extends keyof CreateTourInput>(key: K, value: CreateTourInput[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Basic Information */}
      <section>
        <h3 className={styles.sectionTitle}>Basic Information</h3>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title (English) *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter tour title"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title (German)</label>
            <input
              type="text"
              className={styles.input}
              value={formData.title_de || ''}
              onChange={(e) => updateField('title_de', e.target.value)}
              placeholder="Tourname auf Deutsch"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Category *</label>
            <select
              className={styles.select}
              value={formData.category}
              onChange={(e) => updateField('category', e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Duration *</label>
            <select
              className={styles.select}
              value={formData.travelType}
              onChange={(e) => updateField('travelType', e.target.value)}
              required
            >
              {travelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Price (USD) *</label>
            <input
              type="number"
              className={styles.input}
              value={formData.price}
              onChange={(e) => updateField('price', Number(e.target.value))}
              min={0}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Discount (%)</label>
            <input
              type="number"
              className={styles.input}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>
        </div>
      </section>

      {/* Description */}
      <section>
        <h3 className={styles.sectionTitle}>Description</h3>

        <div className={styles.formGroup}>
          <label className={styles.label}>Short Description (English) *</label>
          <textarea
            className={styles.textarea}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Brief tour description"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Short Description (German)</label>
          <textarea
            className={styles.textarea}
            value={formData.description_de || ''}
            onChange={(e) => updateField('description_de', e.target.value)}
            placeholder="Kurze Tourbeschreibung"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Description (English)</label>
          <textarea
            className={styles.textarea}
            style={{ minHeight: '10rem' }}
            value={formData.longDescription || ''}
            onChange={(e) => updateField('longDescription', e.target.value)}
            placeholder="Detailed tour description"
          />
        </div>
      </section>

      {/* Highlights */}
      <section>
        <h3 className={styles.sectionTitle}>Highlights</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>Highlights (one per line)</label>
          <textarea
            className={styles.textarea}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            placeholder="Great Pyramid of Giza&#10;Sphinx&#10;Valley Temple"
          />
          <p className={styles.helpText}>Enter each highlight on a new line</p>
        </div>
      </section>

      {/* Locations */}
      <section>
        <h3 className={styles.sectionTitle}>Locations</h3>
        <div className={styles.formRow}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className={styles.formGroup}>
              <label className={styles.label}>Location {num}</label>
              <input
                type="text"
                className={styles.input}
                value={locations[`location${num}` as keyof typeof locations]}
                onChange={(e) =>
                  setLocations((prev) => ({
                    ...prev,
                    [`location${num}`]: e.target.value,
                  }))
                }
                placeholder={`Location ${num}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Images */}
      <section>
        <h3 className={styles.sectionTitle}>Images</h3>
        <div className={styles.formRow}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={styles.formGroup}>
              <label className={styles.label}>Image {num} URL</label>
              <input
                type="url"
                className={styles.input}
                value={images[`image${num}` as keyof typeof images]}
                onChange={(e) =>
                  setImages((prev) => ({
                    ...prev,
                    [`image${num}`]: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Status */}
      <section>
        <h3 className={styles.sectionTitle}>Status</h3>
        <div className={styles.formRow}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isActive"
              className={styles.checkbox}
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label htmlFor="isActive" className={styles.checkboxLabel}>
              Active (visible to public)
            </label>
          </div>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="onSale"
              className={styles.checkbox}
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
            />
            <label htmlFor="onSale" className={styles.checkboxLabel}>
              On Sale
            </label>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className={styles.buttonGroup}>
        <button type="submit" className={pageStyles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Tour' : 'Create Tour'}
        </button>
        <Link href="/admin/tours" className={styles.cancelButton}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
