import { NextRequest, NextResponse } from 'next/server'

// âœ… Ø¶Ø¹ Ù‡Ù†Ø§ Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ÙˆÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø§Ù„Ø®Ø§ØµØ© Ø¨Ùƒ
const ADMIN_USERNAME = 'saait'
const ADMIN_PASSWORD = 'abda0987654321mmzz0p@saait'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      // ØªØ£Ø®ÙŠØ± Ù„Ù…Ù†Ø¹ Brute Force
      await new Promise(r => setTimeout(r, 1000))
      return NextResponse.json({ error: 'Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø£Ùˆ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø®Ø§Ø·Ø¦Ø©' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })

    // âœ… Ø­ÙØ¸ Ø§Ù„Ø¬Ù„Ø³Ø© ÙÙŠ Cookie Ù…Ø´ÙØ±Ø©
    response.cookies.set('admin_token', ADMIN_PASSWORD, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   60 * 60 * 8, // 8 Ø³Ø§Ø¹Ø§Øª
      path:     '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø®Ø§Ø¯Ù…' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}

