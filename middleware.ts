import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'de'] as const,
  defaultLocale: 'en',
  localePrefix: 'never',
});

export default function middleware(request: NextRequest) {
  // Apply internationalization only
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
