import { NextRequest, NextResponse } from 'next/server'
const ADMIN_USERNAME = 'saait'
const ADMIN_PASSWORD = 'abda0987654321mmzz0p@saait' // نفس الكلمة في auth/route.ts

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // حماية مسارات /admin فقط (ماعدا صفحة login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value

    if (!token || token !== ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}