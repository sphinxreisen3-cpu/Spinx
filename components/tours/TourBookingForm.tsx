'use client';

import { useState, useEffect, useCallback } from 'react';
import _styles from '@/styles/components/tours/TourBookingForm.module.css';

// Use direct CSS class names to avoid CSS modules hydration issues
const cssClasses = {
  bookingForm: 'booking-form',
  formTitle: 'form-title',
  formRow: 'form-row',
  formGroup: 'form-group',
  formControl: 'form-control',
  travelerControls: 'traveler-controls',
  travelerControlGroup: 'traveler-control-group',
  travelerLabel: 'traveler-label',
  quantityControl: 'quantity-control',
  quantityBtn: 'quantity-btn',
  quantityMinus: 'quantity-minus',
  quantityPlus: 'quantity-plus',
  quantityInput: 'quantity-input',
  travelerAge: 'traveler-age',
  textWarning: 'text-warning',
  submitBtn: 'btn btn-primary btn-sm',
};

interface TourBookingFormProps {
  tour: {
    id: string;
    title: string;
    price: number;
    isOnSale: boolean;
    discountPercentage: number;
  };
}

export function TourBookingForm({ tour }: TourBookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    pickupLocation: '',
    pickupLocationOutside: '',
    message: '',
  });

  // Global variables to store base tour price (matching original HTML)
  const [baseTourPrice, setBaseTourPrice] = useState(0);
  const [_totalPrice, setTotalPrice] = useState(0);

  // Calculate and update total price based on traveler counts
  const updateTotalPrice = useCallback(
    (price?: number) => {
      const effectivePrice = price ?? baseTourPrice;
      if (effectivePrice === 0) return;

      const adultsElement = document.getElementById('adults') as HTMLInputElement;
      const childrenElement = document.getElementById('children') as HTMLInputElement;
      const infantsElement = document.getElementById('infants') as HTMLInputElement;

      const adults = parseInt(adultsElement?.value || '1') || 1;
      const children = parseInt(childrenElement?.value || '0') || 0;
      const infants = parseInt(infantsElement?.value || '0') || 0;

      // Calculate total price:
      // Adults: base price × adults
      // Children: base price × 0.5 × children
      // Infants: base price × 0.25 × infants
      const total =
        adults * effectivePrice + children * effectivePrice * 0.5 + infants * effectivePrice * 0.25;

      // Update the display
      const priceElement = document.getElementById('tour-price');
      if (priceElement) {
        priceElement.textContent = total.toFixed(2);
      }
      setTotalPrice(total);
    },
    [baseTourPrice]
  );

  // Initialize quantity control buttons (exact replica of original HTML)
  const initializeQuantityControls = useCallback(() => {
    const quantityControls = document.querySelectorAll('.quantity-control');

    quantityControls.forEach((control) => {
      const minusBtn = control.querySelector('.quantity-minus');
      const plusBtn = control.querySelector('.quantity-plus');
      const input = control.querySelector('.quantity-input');

      if (minusBtn && plusBtn && input) {
        const targetId = (minusBtn as HTMLElement).getAttribute('data-target') || input.id;
        const targetInput = document.getElementById(targetId) as HTMLInputElement;

        if (targetInput) {
          // Add event listeners for quantity changes
          minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(targetInput.value) || 0;
            const minValue = parseInt(targetInput.min) || 0;
            if (currentValue > minValue) {
              targetInput.value = (currentValue - 1).toString();
              updateTotalPrice();
            }
          });

          plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(targetInput.value) || 0;
            const maxValue = parseInt(targetInput.max) || 999;
            if (currentValue < maxValue) {
              targetInput.value = (currentValue + 1).toString();
              updateTotalPrice();
            }
          });

          // Also listen for direct input changes
          targetInput.addEventListener('change', () => updateTotalPrice());
          targetInput.addEventListener('input', () => updateTotalPrice());
        }
      }
    });
  }, [updateTotalPrice]);

  // Initialize quantity controls on mount (matching original HTML functionality)
  useEffect(() => {
    // Check if tour is on sale and use discounted price if available
    let displayPrice = tour.price;
    if (tour.isOnSale && tour.discountPercentage > 0) {
      displayPrice = Math.round(tour.price - (tour.price * tour.discountPercentage) / 100);
    }

    setBaseTourPrice(displayPrice);
    updateTotalPrice(displayPrice);

    // Initialize quantity controls
    initializeQuantityControls();
  }, [tour, updateTotalPrice, initializeQuantityControls]);

  const _handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const _handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking submission
    console.log('Booking data:', formData);
  };

  return (
    <div className={cssClasses.bookingForm} style={{ padding: '15px' }}>
      <h3
        className={cssClasses.formTitle}
        style={{ fontSize: '25px', fontWeight: 600, marginBottom: '1rem' }}
      >
        Book Now
      </h3>
      <form id="booking-form">
        {/* Personal Information Row */}
        <div className={cssClasses.formRow}>
          <div className={cssClasses.formGroup}>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={cssClasses.formControl}
              placeholder="Your full name"
            />
          </div>
          <div className={cssClasses.formGroup}>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={cssClasses.formControl}
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Contact Information Row */}
        <div className={cssClasses.formRow}>
          <div className={cssClasses.formGroup}>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className={cssClasses.formControl}
              placeholder="+1-555-0123"
            />
          </div>
          <div className={cssClasses.formGroup}>
            <input
              type="date"
              id="travel-date"
              name="travel-date"
              required
              className={cssClasses.formControl}
            />
          </div>
        </div>

        {/* Traveler Controls Row */}
        <div className={cssClasses.formRow}>
          <div className={cssClasses.formGroup}>
            <div className={cssClasses.travelerControls}>
              {/* Adults */}
              <div className={cssClasses.travelerControlGroup}>
                <label htmlFor="adults" className={cssClasses.travelerLabel}>
                  Adults
                </label>
                <div className={cssClasses.quantityControl}>
                  <button
                    type="button"
                    className={`${cssClasses.quantityBtn} ${cssClasses.quantityMinus}`}
                    data-target="adults"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    value="1"
                    min="1"
                    max="20"
                    readOnly
                    required
                    className={cssClasses.quantityInput}
                  />
                  <button
                    type="button"
                    className={`${cssClasses.quantityBtn} ${cssClasses.quantityPlus}`}
                    data-target="adults"
                  >
                    +
                  </button>
                </div>
                <span className={cssClasses.travelerAge}>Age 11-99</span>
              </div>

              {/* Children */}
              <div className={cssClasses.travelerControlGroup}>
                <label htmlFor="children" className={cssClasses.travelerLabel}>
                  Children
                </label>
                <div className={cssClasses.quantityControl}>
                  <button
                    type="button"
                    className={`${cssClasses.quantityBtn} ${cssClasses.quantityMinus}`}
                    data-target="children"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="children"
                    name="children"
                    value="0"
                    min="0"
                    max="20"
                    readOnly
                    className={cssClasses.quantityInput}
                  />
                  <button
                    type="button"
                    className={`${cssClasses.quantityBtn} ${cssClasses.quantityPlus}`}
                    data-target="children"
                  >
                    +
                  </button>
                </div>
                <span className={cssClasses.travelerAge}>Age 2-10</span>
              </div>

              {/* Infants */}
              <div className={cssClasses.travelerControlGroup}>
                <label htmlFor="infants" className={cssClasses.travelerLabel}>
                  Infants
                </label>
                <div className={cssClasses.quantityControl}>
                  <button
                    type="button"
                    className={`${cssClasses.quantityBtn} ${cssClasses.quantityMinus}`}
                    data-target="infants"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="infants"
                    name="infants"
                    value="0"
                    min="0"
                    max="20"
                    readOnly
                    className={cssClasses.quantityInput}
                  />
                  <button
                    type="button"
                    className={`${cssClasses.quantityBtn} ${cssClasses.quantityPlus}`}
                    data-target="infants"
                  >
                    +
                  </button>
                </div>
                <span className={cssClasses.travelerAge}>Under 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Row */}
        <div className={cssClasses.formRow}>
          <div className={cssClasses.formGroup}>
            <input
              type="text"
              id="pickup-location"
              name="pickup-location"
              className={cssClasses.formControl}
              placeholder="Enter pickup location (optional)"
            />
          </div>
          <div className={cssClasses.formGroup}>
            <input
              type="text"
              id="pickup-location-outside"
              name="pickup-location-outside"
              className={cssClasses.formControl}
              placeholder="location Outside Hurghdah"
            />
            <small className={cssClasses.textWarning}>⚠️ Extra fee applies</small>
          </div>
        </div>

        {/* Hidden Fields */}
        <input type="hidden" id="tour-id" name="tour-id" />
        <input type="hidden" id="confirm-trip" name="confirm-trip" />

        {/* Special Requests */}
        <div className={cssClasses.formGroup}>
          <textarea
            id="message"
            name="message"
            rows={3}
            className={cssClasses.formControl}
            placeholder="Any special requirements or questions..."
          ></textarea>
        </div>

        {/* Price Display and Submit */}
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <div
            id="price-display-container"
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#D4AF37',
              marginBottom: '10px',
            }}
          >
            Total: $<span id="tour-price">0</span>
          </div>
          <button
            type="submit"
            className={cssClasses.submitBtn}
            style={{
              width: '100%',
              fontSize: '20px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Reserve Your Spot
          </button>
        </div>
      </form>
    </div>
  );
}
