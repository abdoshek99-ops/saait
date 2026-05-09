import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USERNAME = 'saait'
const ADMIN_PASSWORD = 'abda0987654321mmzz0p@saait'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      await new Promise(r => setTimeout(r, 1000))
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور خاطئة' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set('admin_token', ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}