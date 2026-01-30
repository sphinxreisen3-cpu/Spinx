'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_URL = 'https://wa.link/l3auw8';

export function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname?.includes('/admin')) {
    return null;
  }

  return (
    <div className="floating-whatsapp">
      <Link
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="floating-whatsapp__link"
      >
        <div className="floating-whatsapp__icon">
          <FaWhatsapp aria-hidden />
        </div>
      </Link>
      <p className="floating-whatsapp__text">Talk to us?</p>
    </div>
  );
}

export default FloatingWhatsApp;
