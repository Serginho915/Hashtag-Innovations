import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from './Lib/adminAuth';

const locales = ['en', 'bg'];
const defaultLocale = 'bg';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/api' || pathname.startsWith('/admin/api/')) {
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const isLoginPage = pathname === '/admin/login';
    const isAuthenticated = await verifyAdminSession(
      request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
    );

    if (isAuthenticated) {
      return NextResponse.next();
    }

    if (isLoginPage) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\..*).*)',
  ],
};
