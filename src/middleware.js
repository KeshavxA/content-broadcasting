import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;

  let user = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch (e) {
    user = null;
  }

  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/principal');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && user) {

    if (pathname.startsWith('/principal') && user.role !== 'principal') {
      return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
    }

    if (pathname.startsWith('/teacher') && user.role !== 'teacher') {
      return NextResponse.redirect(new URL('/principal/dashboard', request.url));
    }

    if (pathname === '/login') {
      const dashboardPath = user.role === 'teacher' ? '/teacher/dashboard' : '/principal/dashboard';
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/teacher/:path*',
    '/principal/:path*',
    '/live/:path*',
    '/login'
  ],
};
