import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const LOCALES = ['en', 'de'] as const;

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  if (LOCALES.includes(locale as (typeof LOCALES)[number])) {
    response.headers.set('x-next-locale', locale);
  }
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
