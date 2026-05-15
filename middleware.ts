import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = 'abda0987654321mmzz0p@saait'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value

    if (!token || token !== ADMIN_PASSWORD) {
      const loginUrl = new URL('/admin/login', req.url)
      // احذف الكوكي القديم وأعد التوجيه لصفحة تسجيل الدخول
      const response = NextResponse.redirect(loginUrl)
      response.cookies.set('admin_token', '', {
        maxAge: 0,
        path: '/',
        secure: true,
        sameSite: 'none',
      })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
