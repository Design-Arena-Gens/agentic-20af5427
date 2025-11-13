import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
const COOKIE_NAME = 'akari_user';

const protectedPaths = ['/profile', '/planner', '/diff', '/translator'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!protectedPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/profile/:path*', '/planner/:path*', '/diff/:path*', '/translator/:path*'],
};
