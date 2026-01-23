'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

export default function TourDetailsPage() {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    { src: '/images/tours/pyramid-sky-desert-ancient.jpg', alt: 'Egyptian Pyramids' },
    { src: '/images/tours/08.webp', alt: 'Ancient Egyptian Temple' },
    { src: '/images/tours/iStock-508838512-1-scaled.webp', alt: 'Great Sphinx of Giza' },
    { src: '/images/tours/istockphoto-1085592710-612x612.webp', alt: 'Nile River Sailboat' },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      date: 'December 15, 2024',
      rating: 5,
      text: 'An absolutely incredible experience! The expert guides knew everything about Egyptian history and culture. The camel ride through the desert was unforgettable. Highly recommend to anyone visiting Egypt!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      date: 'December 8, 2024',
      rating: 5,
      text: 'Perfectly organized tour with amazing views of the pyramids. The Sphinx was even more impressive in person. The lunch break by the Nile was a nice touch. Great value for money!',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      date: 'November 28, 2024',
      rating: 4,
      text: 'Really enjoyed the tour overall. The itinerary was well-planned and not too rushed. Would have appreciated more time at the temple, but the photography opportunities were excellent.',
    },
  ]);

  const pricePerAdult = 150;
  const pricePerChild = 75;
  const pricePerInfant = 0;
  const totalPrice = adults * pricePerAdult + children * pricePerChild + infants * pricePerInfant;
  const averageRating = 4.67;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newReview = {
      id: reviews.length + 1,
      name: formData.get('reviewName') as string,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      rating: parseInt(formData.get('reviewRating') as string),
      text: formData.get('reviewText') as string,
    };
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="tour-page">
      {/* Section 1: Booking Form */}
      <section className="booking-section">
        <div className="booking-container">
          <h1 className="booking-title">Book Now</h1>

          <form className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input type="text" id="fullname" name="fullname" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className="form-group">
                <label htmlFor="date">Travel Date</label>
                <input type="date" id="date" name="date" required />
              </div>
            </div>

            <div className="travelers-section">
              <div className="traveler-group">
                <div className="traveler-label">
                  <label>Adults - standard</label>
                </div>
                <div className="quantity-selector">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-value">{adults}</span>
                  <button type="button" onClick={() => setAdults(adults + 1)} className="qty-btn">
                    +
                  </button>
                </div>
              </div>

              <div className="traveler-group">
                <div className="traveler-label">
                  <label>Children - Standard</label>
                </div>
                <div className="quantity-selector">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-value">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="traveler-group">
                <div className="traveler-label">
                  <label>Infants - Standard</label>
                </div>
                <div className="quantity-selector">
                  <button
                    type="button"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-value">{infants}</span>
                  <button type="button" onClick={() => setInfants(infants + 1)} className="qty-btn">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickup">Pickup Location (Optional)</label>
                <input
                  type="text"
                  id="pickup"
                  name="pickup"
                  placeholder="e.g., Your hotel or landmark"
                />
              </div>
              <div className="form-group">
                <label htmlFor="outside-pickup">Outside Pickup Location</label>
                <input type="text" id="outside-pickup" name="outside-pickup" />
                <span className="warning-note">
                  ⚠ Additional charges may apply for locations outside the city center
                </span>
              </div>
            </div>

            <div className="form-group full-width">
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                placeholder="Please let us know any special requirements or dietary restrictions..."
              ></textarea>
            </div>

            <div className="price-section">
              <div className="price-breakdown">
                <div className="price-item">
                  <span>
                    {adults} Adult(s) × ${pricePerAdult}
                  </span>
                  <span>${adults * pricePerAdult}</span>
                </div>
                {children > 0 && (
                  <div className="price-item">
                    <span>
                      {children} Child(ren) × ${pricePerChild}
                    </span>
                    <span>${children * pricePerChild}</span>
                  </div>
                )}
                <div className="price-total">
                  <span>Total Cost:</span>
                  <span className="total-amount">${totalPrice}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Reserve Your Spot
            </button>
          </form>
        </div>
      </section>

      {/* Section 2: Image Slider */}
      <section className="slider-section">
        <div className="slider-container">
          <div className="slider-wrapper">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sliderImages.map((image, index) => (
                <div key={index} className="slide">
                  <Image
                    src={image.src || '/placeholder.svg'}
                    alt={image.alt}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="slider-indicators">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="slider-nav prev"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
            }
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="slider-nav next"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </section>

      {/* Section 4: Company Branding Section */}
      <section className="branding-section">
        <div className="branding-content">
          <h2 className="branding-tagline">Your Dream Journey Awaits</h2>
          <p className="branding-subtitle">
            Experience the wonders of Egypt with our expert guides
          </p>
        </div>
      </section>

      {/* Section 5: Tour Information & Itinerary */}
      <section className="tour-info-section">
        <div className="tour-info-container">
          <div className="tour-details-column">
            <h2 className="section-title">Tour Details</h2>
            <div className="details-table">
              <div className="detail-row">
                <span className="detail-label">🎫 Tour Title</span>
                <span className="detail-value">Egyptian Pyramids & Sphinx Experience</span>
              </div>
              <div className="detail-row highlight">
                <span className="detail-label">💰 Price</span>
                <span className="detail-value price-value">From $150 per person</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📝 Description</span>
                <span className="detail-value">
                  Embark on an unforgettable journey through ancient Egypt. Visit the iconic
                  Pyramids of Giza, marvel at the Great Sphinx, and explore the rich cultural
                  heritage of one of the world&apos;s oldest civilizations.
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🚗 Transportation</span>
                <span className="detail-value">
                  Air-conditioned vehicle with professional driver and tour guide
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📍 Location</span>
                <span className="detail-value">Cairo, Egypt - Giza Plateau</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ℹ️ Tour Details</span>
                <span className="detail-value">
                  Guided tour with expert Egyptologist, camel riding opportunity, and photo stops
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🏨 Pickup Location</span>
                <span className="detail-value">
                  Hotel pickup available within Cairo city center
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🎯 Program</span>
                <span className="detail-value">
                  Full-day tour starting at 8:00 AM, returning by 6:00 PM
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🍽️ Inclusions</span>
                <span className="detail-value">
                  Lunch, bottled water, and light snacks throughout the day
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🎒 What to Bring</span>
                <span className="detail-value">
                  Sunscreen, hat, comfortable walking shoes, and camera
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">⏱️ Duration</span>
                <span className="detail-value">10 hours (8:00 AM - 6:00 PM)</span>
              </div>
            </div>
          </div>

          <div className="itinerary-column">
            <h2 className="section-title">Itinerary</h2>
            <div className="itinerary-list">
              <div className="itinerary-item">
                <span className="itinerary-number">1</span>
                <span className="itinerary-text">
                  Hotel Pickup - Meet your guide and begin your Egyptian adventure
                </span>
              </div>
              <div className="itinerary-item">
                <span className="itinerary-number">2</span>
                <span className="itinerary-text">
                  Travel to Giza Plateau - Scenic drive through Cairo with historical commentary
                </span>
              </div>
              <div className="itinerary-item">
                <span className="itinerary-number">3</span>
                <span className="itinerary-text">
                  Pyramids of Giza - Explore the ancient tombs and learn about pharaohs
                </span>
              </div>
              <div className="itinerary-item">
                <span className="itinerary-number">4</span>
                <span className="itinerary-text">
                  Great Sphinx - Stand before the legendary monument and capture amazing photos
                </span>
              </div>
              <div className="itinerary-item">
                <span className="itinerary-number">5</span>
                <span className="itinerary-text">
                  Lunch Break - Enjoy traditional Egyptian cuisine at a local restaurant
                </span>
              </div>
              <div className="itinerary-item">
                <span className="itinerary-number">6</span>
                <span className="itinerary-text">
                  Valley Temple & Camel Ride - Experience the desert and ride camels like ancient
                  travelers
                </span>
              </div>
              <div className="itinerary-item">
                <span className="itinerary-number">7</span>
                <span className="itinerary-text">
                  Return Journey - Scenic drive back to your hotel with final views of the pyramids
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Customer Reviews */}
      <section className="reviews-section">
        <div className="reviews-container">
          <h2 className="reviews-title">Customer Reviews</h2>

          <div className="reviews-summary">
            <div className="rating-display">
              <div className="stars">
                {'★'.repeat(Math.floor(averageRating))}
                <span className="half-star">★</span>
              </div>
              <span className="rating-number">{averageRating.toFixed(2)}</span>
              <span className="review-count">Based on {reviews.length} reviews</span>
            </div>

            <button className="write-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleAddReview}>
              <div className="review-form-row">
                <div className="form-group">
                  <label htmlFor="reviewName">Your Name</label>
                  <input type="text" id="reviewName" name="reviewName" required />
                </div>
                <div className="form-group">
                  <label htmlFor="reviewEmail">Your Email</label>
                  <input type="email" id="reviewEmail" name="reviewEmail" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reviewRating">Star Rating</label>
                <select id="reviewRating" name="reviewRating" defaultValue="5" required>
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reviewText">Your Review</label>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  rows={5}
                  placeholder="Share your experience with this tour..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-author-info">
                    <h4 className="review-author">{review.name}</h4>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-rating">{'★'.repeat(review.rating)}</div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
