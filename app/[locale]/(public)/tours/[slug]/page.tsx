'use client';

import React from 'react';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { BookingTicket } from '@/components/bookings/BookingTicket';
import type { Tour } from '@/types/tour.types';

interface TourReviewItem {
  _id: string;
  name: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export default function TourDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const t = useTranslations('tourDetail');
  const isGerman = locale === 'de';

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [reviews, setReviews] = useState<TourReviewItem[]>([]);
  const [reviewsAverage, setReviewsAverage] = useState<{ average: number; count: number } | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [bookingData, setBookingData] = useState<{
    _id?: string;
    name: string;
    email: string;
    phone: string;
    tourTitle: string;
    travelDate: string;
    adults: number;
    children: number;
    infants: number;
    totalPrice: number;
    currencySymbol: string;
    pickupLocation?: string;
    requirements?: string;
    message?: string;
    status?: string;
    createdAt?: string;
  } | null>(null);

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours/${slug}`);
        if (!response.ok) {
          throw new Error('Tour not found');
        }
        const data = await response.json();
        setTour(data.data.tour);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tour');
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTour();
    }
  }, [slug]);

  // Scroll to booking form if hash is present in URL
  useEffect(() => {
    if (!loading && tour && window.location.hash === '#book') {
      setTimeout(() => {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [loading, tour]);

  // Fetch reviews for this tour
  useEffect(() => {
    const fetchReviews = async () => {
      if (!tour?._id) return;

      try {
        const response = await fetch(`/api/reviews?tourId=${tour._id}&limit=50`);
        const data = await response.json();

        if (data?.success && data?.data?.reviews) {
          setReviews(data.data.reviews as TourReviewItem[]);
          setReviewsAverage(data.data.averageRating || null);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, [tour?._id]);

  // Get bilingual tour content helper
  const getTourField = useMemo(() => {
    return (field: string, fieldDe?: string) => {
      return isGerman && fieldDe ? fieldDe : field;
    };
  }, [isGerman]);

  // Compute all bilingual tour content (safe even when tour is null)
  const tourContent = useMemo(() => {
    if (!tour) {
      return {
        tourTitle: '',
        tourCategory: '',
      tourDescription: '',
      tourLongDescription: '',
      tourDescription2: '',
      tourDetails: '',
      tourTransportation: '',
      tourPickup: '',
      tourPickupLocation: '',
      tourVanLocation: '',
      tourBriefing: '',
      tourDaysDurations: '',
      tourLocation: '',
      tourProgram: '',
      tourFoodBeverages: '',
      tourWhatToTake: '',
      tourHighlights: [] as string[],
      tourTrip: '',
      tourTravelType: '',
    };
    }

    return {
      tourTitle: getTourField(tour.title, tour.title_de),
      tourCategory: getTourField(tour.category, tour.category_de),
      tourDescription: getTourField(tour.description, tour.description_de),
      tourLongDescription: getTourField(tour.longDescription || '', tour.longDescription_de),
      tourDescription2: getTourField(tour.description2 || '', tour.description2_de),
      tourDetails: getTourField(tour.details || '', tour.details_de),
      tourTransportation: getTourField(tour.transportation || '', tour.transportation_de),
      tourPickup: getTourField(tour.pickup || '', tour.pickup_de),
      tourPickupLocation: getTourField(tour.pickupLocation || '', tour.pickupLocation_de),
      tourVanLocation: getTourField(tour.vanLocation || '', tour.vanLocation_de),
      tourBriefing: getTourField(tour.briefing || '', tour.briefing_de),
      tourDaysDurations: getTourField(tour.daysAndDurations || '', tour.daysAndDurations_de),
      tourLocation: getTourField(tour.location || '', tour.location_de),
      tourProgram: getTourField(tour.program || '', tour.program_de),
      tourFoodBeverages: getTourField(tour.foodAndBeverages || '', tour.foodAndBeverages_de),
      tourWhatToTake: getTourField(tour.whatToTake || '', tour.whatToTake_de),
      tourHighlights: isGerman && tour.highlights_de ? tour.highlights_de : tour.highlights || [],
      tourTrip: getTourField(tour.trip || '', tour.trip_de),
      tourTravelType: getTourField(tour.travelType, tour.travelType_de),
    };
  }, [tour, getTourField, isGerman]);

  // Get location markers with bilingual support
  const getLocation = useMemo(() => {
    return (index: number) => {
      if (!tour) return '';
      const locations = [
        { en: tour.location1, de: tour.location1_de },
        { en: tour.location2, de: tour.location2_de },
        { en: tour.location3, de: tour.location3_de },
        { en: tour.location4, de: tour.location4_de },
        { en: tour.location5, de: tour.location5_de },
        { en: tour.location6, de: tour.location6_de },
      ];
      const loc = locations[index];
      return isGerman && loc.de ? loc.de : loc.en || '';
    };
  }, [tour, isGerman]);

  // Build slider images array
  const sliderImages = useMemo(() => {
    if (!tour || !tourContent.tourTitle) return [];
    const images: { src: string; alt: string }[] = [];
    if (tour.image1) images.push({ src: tour.image1, alt: tourContent.tourTitle });
    if (tour.image2) images.push({ src: tour.image2, alt: tourContent.tourTitle });
    if (tour.image3) images.push({ src: tour.image3, alt: tourContent.tourTitle });
    if (tour.image4) images.push({ src: tour.image4, alt: tourContent.tourTitle });
    return images;
  }, [tour, tourContent.tourTitle]);

  // Image slider auto-advance effect
  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

  // Early returns for loading and error states (AFTER all hooks)
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</div>;
  }

  if (error || !tour) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        {error || t('notFound')}
      </div>
    );
  }

  // Destructure tour content for easier use
  const {
    tourTitle,
    tourCategory,
    tourDescription,
    tourLongDescription,
    tourDescription2,
    tourDetails,
    tourTransportation,
    tourPickup,
    tourPickupLocation,
    tourVanLocation,
    tourBriefing,
    tourDaysDurations,
    tourLocation,
    tourProgram,
    tourFoodBeverages,
    tourWhatToTake,
    tourHighlights,
    tourTrip,
    tourTravelType,
  } = tourContent;

  // Calculate prices based on actual tour price
  const getTourPrice = () => {
    if (!tour) return 0;
    const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
    const basePrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
    // Use discounted price if on sale
    if (tour.onSale && tour.discount > 0) {
      return Math.round(basePrice - (basePrice * tour.discount) / 100);
    }
    return basePrice;
  };

  const pricePerAdult = getTourPrice();
  const pricePerChild = Math.round(pricePerAdult * 0.5); // 50% of adult price
  const pricePerInfant = Math.round(pricePerAdult * 0.25); // 25% of adult price
  const totalPrice = adults * pricePerAdult + children * pricePerChild + infants * pricePerInfant;
  const useEUR = isGerman && tour?.priceEUR != null && tour.priceEUR > 0;
  const currencySymbol = useEUR ? '€' : '$';
  const currency = useEUR ? 'EUR' : 'USD';
  const averageRating = reviewsAverage?.average || 0;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour?._id) return;

    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);

    // Validate travel date is in the future
    const travelDate = String(formData.get('date') || '');
    const selectedDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert(t('form.travelDate') + ' must be in the future');
      return;
    }

    const requirementsText = String(formData.get('requirements') || '');
    const payload = {
      name: String(formData.get('fullname') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      travelDate: String(formData.get('date') || ''),
      adults: Number(adults),
      children: Number(children),
      infants: Number(infants),
      confirmTrip: tourTitle,
      tourTitle: tourTitle,
      pickupLocation: String(formData.get('pickup') || ''),
      pickupLocationOutside: String(formData.get('outside-pickup') || ''),
      message: requirementsText,
      requirements: requirementsText,
      totalPrice: Number(totalPrice),
      currency: currency,
      currencySymbol: currencySymbol,
    };

    try {
      setIsSubmittingBooking(true);
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        // Store booking data and show ticket
        setBookingData({
          ...result.data.booking,
          tourTitle: tourTitle,
        });
        setShowTicket(true);
        formEl.reset();
        setAdults(1);
        setChildren(0);
        setInfants(0);
        // Scroll to top to show ticket
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(result?.error || t('booking.submitError'));
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert(t('booking.error'));
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour?._id) return;

    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);

    const payload = {
      name: String(formData.get('reviewName') || ''),
      email: String(formData.get('reviewEmail') || ''),
      rating: Number(formData.get('reviewRating') || 0),
      reviewText: String(formData.get('reviewText') || ''),
      tourId: tour._id,
    };

    if (!payload.name || !payload.email || !payload.reviewText || !payload.rating) {
      alert(t('reviews.fillAllFields'));
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        const reviewsRes = await fetch(`/api/reviews?tourId=${tour._id}&limit=50`);
        const reviewsJson = await reviewsRes.json();
        if (reviewsJson?.success && reviewsJson?.data?.reviews) {
          setReviews(reviewsJson.data.reviews as TourReviewItem[]);
          setReviewsAverage(reviewsJson.data.averageRating || null);
        }

        setShowReviewForm(false);
        formEl.reset();
        alert(t('reviews.submitSuccess'));
      } else {
        alert(result?.error || t('reviews.submitError'));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(t('reviews.submitError'));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="tour-page">
      {/* Booking Confirmation Ticket */}
      {showTicket && bookingData && (
        <BookingTicket
          booking={bookingData}
          onClose={() => setShowTicket(false)}
        />
      )}

      {/* Section 1: Booking Form */}
      <section id="booking-section" className="booking-section">
        <div className="booking-container">
          <h1 className="booking-title">{t('bookNow')}</h1>

          <form className="booking-form" onSubmit={handleBookingSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullname">{t('form.fullName')}</label>
                <input type="text" id="fullname" name="fullname" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('form.email')}</label>
                <input type="email" id="email" name="email" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">{t('form.phone')}</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className="form-group">
                <label htmlFor="date">{t('form.travelDate')}</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="travelers-section">
              <div className="traveler-group">
                <div className="traveler-label">
                  <label>{t('form.adults')}</label>
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
                  <label>{t('form.children')}</label>
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
                  <label>{t('form.infants')}</label>
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
                <label htmlFor="pickup">{t('form.pickupLocation')}</label>
                <input
                  type="text"
                  id="pickup"
                  name="pickup"
                  placeholder={t('form.pickupPlaceholder')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="outside-pickup">{t('form.outsidePickup')}</label>
                <input type="text" id="outside-pickup" name="outside-pickup" />
                <span className="warning-note">
                  {t('form.outsidePickupWarning')}
                </span>
              </div>
            </div>

            <div className="form-group full-width">
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                placeholder={t('form.requirements')}
              ></textarea>
            </div>

            <div className="price-section">
              <div className="price-breakdown">
                <div className="price-item">
                  <span>
                    {adults} {t('price.adults')} × {currencySymbol}{pricePerAdult}
                  </span>
                  <span>{currencySymbol}{adults * pricePerAdult}</span>
                </div>
                {children > 0 && (
                  <div className="price-item">
                    <span>
                      {children} {t('price.children')} × {currencySymbol}{pricePerChild}
                    </span>
                    <span>{currencySymbol}{children * pricePerChild}</span>
                  </div>
                )}
                <div className="price-total">
                  <span>{t('price.totalCost')}</span>
                  <span className="total-amount">{currencySymbol}{totalPrice}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmittingBooking}>
              {isSubmittingBooking ? t('form.submitting') : t('form.submit')}
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
            aria-label={t('slider.prevAria')}
          >
            ‹
          </button>
          <button
            className="slider-nav next"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
            aria-label={t('slider.nextAria')}
          >
            ›
          </button>
        </div>
      </section>

      {/* Section 4: Tour Information & Itinerary */}
      <section className="tour-info-section">
        <div className="tour-info-container">
          <div className="tour-details-column">
            <h2 className="section-title">{t('details.title')}</h2>
            <div className="details-table">
              <div className="detail-row">
                <span className="detail-label">{t('details.tourTitle')}</span>
                <span className="detail-value">{tourTitle}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('details.category')}</span>
                <span className="detail-value">{tourCategory}</span>
              </div>
              <div className="detail-row highlight">
                <span className="detail-label">{t('details.price')}</span>
                <span className="detail-value price-value">
                  {(() => {
                    const useEUR = isGerman && tour.priceEUR != null && tour.priceEUR > 0;
                    const displayPrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
                    const currencySymbol = useEUR ? '€' : '$';
                    const originalPrice = useEUR ? (tour.priceEUR || tour.price) : tour.price;
                    
                    if (tour.onSale && tour.discount > 0) {
                      const discountedPrice = Math.round(originalPrice - (originalPrice * tour.discount) / 100);
                      return (
                        <>
                          <span style={{ textDecoration: 'line-through', opacity: 0.7, marginRight: '0.5rem' }}>
                            {currencySymbol}{originalPrice}
                          </span>
                          <span style={{ color: '#ef4444', fontWeight: 700 }}>
                            {currencySymbol}{discountedPrice}
                          </span>
                          <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem', color: '#ef4444' }}>
                            ({tour.discount}% OFF)
                          </span>
                        </>
                      );
                    }
                    return `${currencySymbol}${displayPrice}`;
                  })()}{' '}
                  {t('price.perPerson')}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('details.description')}</span>
                <span className="detail-value">
                  {tourDescription}
                  {tourLongDescription && (
                    <>
                      <br />
                      <br />
                      {tourLongDescription}
                    </>
                  )}
                  {tourDescription2 && (
                    <>
                      <br />
                      <br />
                      {tourDescription2}
                    </>
                  )}
                </span>
              </div>
              {tourDetails && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.details')}</span>
                  <span className="detail-value">{tourDetails}</span>
                </div>
              )}
              {tourTransportation && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.transportation')}</span>
                  <span className="detail-value">{tourTransportation}</span>
                </div>
              )}
              {tourPickup && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.pickup')}</span>
                  <span className="detail-value">{tourPickup}</span>
                </div>
              )}
              {tourPickupLocation && (
                <div className="detail-row">
                  <span className="detail-label">📍 Pickup Location</span>
                  <span className="detail-value">{tourPickupLocation}</span>
                </div>
              )}
              {tourVanLocation && (
                <div className="detail-row">
                  <span className="detail-label">🚐 Van/Bus Meeting Point</span>
                  <span className="detail-value">{tourVanLocation}</span>
                </div>
              )}
              {tourBriefing && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.briefing')}</span>
                  <span className="detail-value">{tourBriefing}</span>
                </div>
              )}
              {tourDaysDurations && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.daysDurations')}</span>
                  <span className="detail-value">{tourDaysDurations}</span>
                </div>
              )}
              {(tourLocation || getLocation(0)) && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.location')}</span>
                  <span className="detail-value">
                    {tourLocation ||
                      [
                        getLocation(0),
                        getLocation(1),
                        getLocation(2),
                        getLocation(3),
                        getLocation(4),
                        getLocation(5),
                      ]
                        .filter(Boolean)
                        .join(', ')}
                  </span>
                </div>
              )}
              {tourProgram && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.program')}</span>
                  <span className="detail-value">{tourProgram}</span>
                </div>
              )}
              {tourFoodBeverages && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.inclusions')}</span>
                  <span className="detail-value">{tourFoodBeverages}</span>
                </div>
              )}
              {tourWhatToTake && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.whatToBring')}</span>
                  <span className="detail-value">{tourWhatToTake}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">{t('details.duration')}</span>
                <span className="detail-value">{tourTravelType || tour.travelType}</span>
              </div>
              {tourHighlights && tourHighlights.length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">{t('details.highlights')}</span>
                  <span className="detail-value">
                    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                      {tourHighlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="itinerary-column">
            <h2 className="section-title">{t('itinerary.title')}</h2>
            <div className="itinerary-list">
              {/* Display location stops */}
              {[
                getLocation(0),
                getLocation(1),
                getLocation(2),
                getLocation(3),
                getLocation(4),
                getLocation(5),
              ]
                .filter(Boolean)
                .map((location, index) => (
                  <div key={`location-${index}`} className="itinerary-item">
                    <span className="itinerary-number">{index + 1}</span>
                    <span className="itinerary-text">{location}</span>
                  </div>
                ))}

              {/* Display trip highlights if available */}
              {tourTrip && (
                <div className="itinerary-item">
                  <span className="itinerary-number">
                    {[
                      getLocation(0),
                      getLocation(1),
                      getLocation(2),
                      getLocation(3),
                      getLocation(4),
                      getLocation(5),
                    ].filter(Boolean).length + 1}
                  </span>
                  <span className="itinerary-text">
                    <strong>{t('itinerary.tripHighlights')}</strong> {tourTrip}
                  </span>
                </div>
              )}

              {/* Show message if no itinerary data */}
              {(() => {
                const locationStops = [
                  getLocation(0),
                  getLocation(1),
                  getLocation(2),
                  getLocation(3),
                  getLocation(4),
                  getLocation(5),
                ].filter(Boolean);

                return locationStops.length === 0 && !tourTrip ? (
                  <div className="itinerary-item">
                    <span className="itinerary-text" style={{ fontStyle: 'italic', color: '#666' }}>
                      {t('itinerary.noItinerary')}
                    </span>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Customer Reviews */}
      <section className="reviews-section">
        <div className="reviews-container">
          <h2 className="reviews-title">{t('reviews.title')}</h2>

          <div className="reviews-summary">
            <div className="rating-display">
              <div className="stars">
                {'★'.repeat(Math.floor(averageRating))}
                <span className="half-star">★</span>
              </div>
              <span className="rating-number">{averageRating.toFixed(2)}</span>
              <span className="review-count">
                {t('reviews.basedOn')} {reviewsAverage?.count ?? reviews.length} {t('reviews.reviews')}
              </span>
            </div>

            <button className="write-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? t('reviews.cancelReview') : t('reviews.writeReview')}
            </button>
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleAddReview}>
              <div className="review-form-row">
                <div className="form-group">
                  <label htmlFor="reviewName">{t('reviews.form.name')}</label>
                  <input type="text" id="reviewName" name="reviewName" required />
                </div>
                <div className="form-group">
                  <label htmlFor="reviewEmail">{t('reviews.form.email')}</label>
                  <input type="email" id="reviewEmail" name="reviewEmail" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reviewRating">{t('reviews.form.rating')}</label>
                <select id="reviewRating" name="reviewRating" defaultValue="5" required>
                  <option value="5">{t('reviews.form.ratingOptions.5')}</option>
                  <option value="4">{t('reviews.form.ratingOptions.4')}</option>
                  <option value="3">{t('reviews.form.ratingOptions.3')}</option>
                  <option value="2">{t('reviews.form.ratingOptions.2')}</option>
                  <option value="1">{t('reviews.form.ratingOptions.1')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reviewText">{t('reviews.form.text')}</label>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  rows={5}
                  placeholder={t('reviews.form.placeholder')}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-review-btn">
                {isSubmittingReview ? t('reviews.form.submitting') : t('reviews.form.submit')}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="review-author-info">
                    <h4 className="review-author">{review.name}</h4>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="review-rating">{'★'.repeat(review.rating)}</div>
                </div>
                <p className="review-text">{review.reviewText}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
