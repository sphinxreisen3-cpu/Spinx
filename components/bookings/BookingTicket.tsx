'use client';

import React, { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from '@/styles/components/bookings/BookingTicket.module.css';

interface BookingTicketProps {
  booking: {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    tourTitle?: string;
    confirmTrip?: string;
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
  };
  onClose?: () => void;
}

export function BookingTicket({ booking, onClose }: BookingTicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations('booking.ticket');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatBookingId = (id?: string) => {
    if (!id) return 'N/A';
    return id.substring(0, 8).toUpperCase();
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      // Dynamically import libraries to avoid build-time issues
      const [html2canvas, jsPDF] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      // Create canvas from ticket element
      const canvas = await html2canvas.default(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Create PDF
      const { default: jsPDFClass } = jsPDF;
      const pdf = new jsPDFClass('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`booking-ticket-${formatBookingId(booking._id)}.pdf`);
    } catch (error) {
      console.error('Error generating ticket:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  const formatTravelers = () => {
    const parts: string[] = [];
    if (booking.adults > 0) {
      parts.push(`${booking.adults} ${booking.adults === 1 ? t('adult') : t('adults')}`);
    }
    if (booking.children > 0) {
      parts.push(`${booking.children} ${booking.children === 1 ? t('child') : t('children')}`);
    }
    if (booking.infants > 0) {
      parts.push(`${booking.infants} ${booking.infants === 1 ? t('infant') : t('infants')}`);
    }
    return parts.join(', ');
  };

  return (
    <div className={styles.ticketOverlay} onClick={onClose}>
      <div className={styles.ticketContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ticketHeader}>
          <h2 className={styles.ticketTitle}>{t('title')}</h2>
          {onClose && (
            <button onClick={onClose} className={styles.closeButton} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        <div ref={ticketRef} className={styles.ticket}>
          <div className={styles.ticketContent}>
            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{t('tourName')}:</span>
              <span className={styles.ticketValue}>{booking.tourTitle || booking.confirmTrip || ''}</span>
            </div>

            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{t('travelDate')}:</span>
              <span className={styles.ticketValue}>{formatDate(booking.travelDate)}</span>
            </div>

            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{t('travelers')}:</span>
              <span className={styles.ticketValue}>{formatTravelers()}</span>
            </div>

            {booking.pickupLocation && (
              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>{t('pickupLocation')}:</span>
                <span className={styles.ticketValue}>{booking.pickupLocation}</span>
              </div>
            )}

            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{t('totalAmount')}:</span>
              <span className={styles.ticketValuePrice}>
                {booking.currencySymbol}
                {booking.totalPrice.toLocaleString()}
              </span>
            </div>

            <div className={styles.ticketRow}>
              <span className={styles.ticketLabel}>{t('bookingReference')}:</span>
              <span className={styles.ticketValueRef}>#{formatBookingId(booking._id)}</span>
            </div>
          </div>

          <div className={styles.ticketFooter}>
            <button onClick={downloadTicket} className={styles.downloadButton}>
              {t('downloadTicket')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
