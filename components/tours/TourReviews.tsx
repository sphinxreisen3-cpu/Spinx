'use client';

import { useState } from 'react';
import styles from '@/styles/components/tours/TourReviews.module.css';

interface TourReviewsProps {
  tourId: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

// Mock reviews - replace with API call
const mockReviews: Review[] = [
  {
    id: '1',
    name: 'Ann McMillan',
    rating: 5,
    reviewText:
      "My experience traveling to Egypt with Sealine Travel was absolutely unforgettable! The pyramids of Giza were breathtaking up close, and walking among these ancient wonders took me back thousands of years. Our expert guide made the history come alive, explaining the construction techniques and daily life of the pharaohs. The accommodations in Cairo were luxurious and comfortable. I'll never forget riding a camel at sunset against the desert backdrop - it was pure magic!",
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'Debra Ortega',
    rating: 5,
    reviewText:
      "Visiting the Nile Valley and Alexandria with Sealine Travel was a dream come true! Sailing on a traditional felucca at sunset while watching the sun set behind ancient temples was pure magic. Our guide's stories about Cleopatra and the pharaohs brought the ancient world to life. The temples of Luxor and Karnak were absolutely magnificent - walking through courtyards built thousands of years ago gave me chills.",
    createdAt: '2026-01-10',
  },
  {
    id: '3',
    name: 'Samantha Smith',
    rating: 5,
    reviewText:
      "Exploring the Sinai Peninsula with Sealine Travel was absolutely incredible! The Red Sea diving experience was world-class with crystal clear waters and vibrant coral reefs teeming with marine life. Visiting Saint Catherine's Monastery was a profound spiritual experience. The Mount Sinai sunrise was absolutely breathtaking.",
    createdAt: '2026-01-05',
  },
];

export function TourReviews({ tourId: _tourId }: TourReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    reviewText: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.reviewText || formData.rating === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        name: formData.name,
        rating: formData.rating,
        reviewText: formData.reviewText,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setReviews((prev) => [newReview, ...prev]);
      setFormData({ name: '', email: '', rating: 0, reviewText: '' });
      setShowForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number, interactive = false, onClick?: (rating: number) => void) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => onClick?.(star) : undefined}
            className={`${styles.starButton} ${interactive ? styles.starInteractive : ''} ${
              star <= rating ? styles.starActive : styles.starInactive
            }`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Customer Reviews</h2>
        <div className={styles.ratingWrapper}>
          <div className={styles.ratingBox}>
            <div className={styles.starsWrapper}>
              {renderStars(Math.round(averageRating))}
              <span className={styles.ratingScore}>{averageRating.toFixed(1)}</span>
            </div>
            <div className={styles.reviewCount}>
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      <div className={styles.buttonSection}>
        <button onClick={() => setShowForm(!showForm)} className={styles.writeReviewButton}>
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.ratingField}>
              <label className={styles.ratingLabel}>Rating:</label>
              <div className={styles.ratingInput}>
                {renderStars(formData.rating, true, handleRatingChange)}
                <span className={styles.ratingHint}>
                  {formData.rating > 0
                    ? `${formData.rating} star${formData.rating !== 1 ? 's' : ''}`
                    : 'Select rating'}
                </span>
              </div>
            </div>

            <div className={styles.textareaField}>
              <textarea
                name="reviewText"
                value={formData.reviewText}
                onChange={handleInputChange}
                rows={4}
                placeholder="Share your experience with this tour..."
                required
                className={styles.textarea}
              ></textarea>
            </div>

            <div className={styles.submitSection}>
              <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className={styles.reviewsList}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewContent}>
                <div className={styles.avatar}>{review.name.charAt(0).toUpperCase()}</div>
                <div className={styles.reviewBody}>
                  <div className={styles.reviewHeader}>
                    <h4 className={styles.reviewerName}>{review.name}</h4>
                    <span className={styles.reviewDate}>{review.createdAt}</span>
                  </div>
                  <div className={styles.reviewRating}>{renderStars(review.rating)}</div>
                  <p className={styles.reviewText}>{review.reviewText}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <p className={styles.emptyText}>
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
