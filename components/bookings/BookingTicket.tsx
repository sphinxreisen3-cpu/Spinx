'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
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

  const formatBookingId = (id?: string) => {
    if (!id) return 'N/A';
    return id.substring(0, 8).toUpperCase();
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      if (document?.fonts?.ready) {
        await document.fonts.ready;
      }

      const images = Array.from(ticketRef.current.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );

      // Dynamically import libraries to avoid build-time issues
      const [html2canvas, jsPDF] = await Promise.all([import('html2canvas'), import('jspdf')]);

      // Create canvas from ticket element
      const canvas = await html2canvas.default(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
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

  const tourTitle = booking.tourTitle || booking.confirmTrip || '';
  const totalTickets = booking.adults + booking.children + booking.infants;
  const ticketCount = totalTickets > 0 ? totalTickets : 1;
  const statusText = booking.status ? booking.status.toUpperCase() : 'CONFIRMED';
  const pickupText = booking.pickupLocation || 'Pickup details shared after confirmation';

  return (
    <div className={styles.ticketOverlay} onClick={onClose}>
      <div className={styles.ticketContainer} onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            x
          </button>
        )}

        <div ref={ticketRef} className={styles['m-ticket']}>
          <div className={styles['ticket-logo']}>
            <Image src="/images/logo/logo.webp" alt="Site logo" width={120} height={40} priority />
          </div>
          <p className={styles.m}>M-Ticket</p>

          <div className={styles['movie-details']}>
            <div className={styles.movie}>
              <h4>{tourTitle}</h4>
              <p>{formatTravelers()}</p>
              <p>{formatShortDate(booking.travelDate)}</p>
              <p>{pickupText}</p>
            </div>
          </div>

          <div className={styles.info}>we will contact you soon</div>

          <div className={styles['ticket-details']}>
            <img
              className={styles.scan}
              src="/images/ticket-logo.png"
              alt="Ticket logo"
            />

            <div className={styles.ticket}>
              <p>{ticketCount}Ticket(s)</p>
              <b>{statusText}</b>
              <p>{pickupText}</p>
              <h6>
                {t('bookingReference')}: {formatBookingId(booking._id)}
              </h6>
            </div>
          </div>

          <div className={styles['info-cancel']}>Thank you for booking with us!</div>
          <p>pay on arrival</p>

          <div className={styles['total-amount']}>
            <p>{t('totalAmount')}</p>
            <p>
              {booking.currencySymbol}
              {booking.totalPrice.toLocaleString()}
            </p>
          </div>

          <button type="button" className={styles['download-button']} onClick={downloadTicket}>
            {t('downloadTicket')}
          </button>
        </div>
      </div>
    </div>
  );
}
