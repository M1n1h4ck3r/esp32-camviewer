// ESP32 CamViewer - Middleware for Route Protection
// Generated: 2025-10-19
// Note: Since we're using localStorage for auth, protection happens client-side

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all routes to pass through
  // Auth protection is handled client-side via useEffect in pages
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
