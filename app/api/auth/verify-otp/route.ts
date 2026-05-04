import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, otp, type = 'EMAIL_VERIFY' } = await req.json()

    // âœ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Ø§Ù„Ø¨Ø±ÙŠØ¯ ÙˆØ§Ù„Ø±Ù…Ø² Ù…Ø·Ù„ÙˆØ¨Ø§Ù†' },
        { status: 400 }
      )
    }

    // âœ… Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø§Ù„Ø±Ù…Ø² ÙÙŠ Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
        token: otp,
        type,
        used: false,
        expiresAt: { gt: new Date() } // Ù„Ù… ØªÙ†ØªÙ‡ ØµÙ„Ø§Ø­ÙŠØªÙ‡
      }
    })

    // âœ… Ø§Ù„Ø±Ù…Ø² ØºÙŠØ± ØµØ­ÙŠØ­ Ø£Ùˆ Ù…Ù†ØªÙ‡ÙŠ
    if (!token) {
      return NextResponse.json(
        { error: 'Ø§Ù„Ø±Ù…Ø² ØºÙŠØ± ØµØ­ÙŠØ­ Ø£Ùˆ Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØªÙ‡' },
        { status: 400 }
      )
    }

    // âœ… ØªØ­Ø¯ÙŠØ« Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª (Ø§Ù„Ø±Ù…Ø² + Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…) ÙÙŠ Ù†ÙØ³ Ø§Ù„ÙˆÙ‚Øª
    await prisma.$transaction([
      // ØªØ¹ÙŠÙŠÙ† Ø§Ù„Ø±Ù…Ø² ÙƒÙ…Ø³ØªØ®Ø¯Ù…
      prisma.verificationToken.update({
        where: { id: token.id },
        data: { used: true }
      }),
      // ØªÙØ¹ÙŠÙ„ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù„Ù„Ù…Ø³ØªØ®Ø¯Ù…
      prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date()
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'ØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø¨Ù†Ø¬Ø§Ø­! ðŸŽ‰'
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø®Ø§Ø¯Ù…' },
      { status: 500 }
    )
  }
}

