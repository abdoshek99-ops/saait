import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = 'abda0987654321mmzz0p@saait'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value

    if (!token || token !== ADMIN_PASSWORD) {
      const loginUrl = new URL('/admin/login', req.url)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}