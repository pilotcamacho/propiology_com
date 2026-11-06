import { NextRequest, NextResponse } from 'next/server';
import { UNDER_CONSTRUCTION } from '@/lib/site/status';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['en', 'es'];
const DEFAULT_LOCALE = 'en';

function preferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('Accept-Language') ?? '';
  return (
    SUPPORTED_LOCALES.find((locale) => acceptLanguage.toLowerCase().includes(locale)) ??
    DEFAULT_LOCALE
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (UNDER_CONSTRUCTION && pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Service under construction' }, { status: 503 });
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  if (UNDER_CONSTRUCTION) {
    // Only the locale home pages are served; everything else goes there.
    if (SUPPORTED_LOCALES.some((locale) => pathname === `/${locale}`)) return;
    const segment = pathname.split('/')[1];
    const locale = SUPPORTED_LOCALES.includes(segment) ? segment : preferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    url.search = '';
    return NextResponse.redirect(url, 307);
  }

  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Static files and _next assets are filtered out in code above.
  matcher: ['/((?!_next/static|_next/image).*)'],
};
