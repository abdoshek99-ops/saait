import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, type = 'EMAIL_VERIFY' } = await req.json()

    // âœ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† ÙˆØ¬ÙˆØ¯ Ø§Ù„Ø¨Ø±ÙŠØ¯
    if (!email) {
      return NextResponse.json(
        { error: 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù…Ø·Ù„ÙˆØ¨' },
        { status: 400 }
      )
    }

    // âœ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† ÙˆØ¬ÙˆØ¯ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' },
        { status: 404 }
      )
    }

    // âœ… Ø­Ø°Ù Ø§Ù„Ø±Ù…ÙˆØ² Ø§Ù„Ù‚Ø¯ÙŠÙ…Ø© ØºÙŠØ± Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…Ø©
    await prisma.verificationToken.deleteMany({
      where: {
        email,
        type,
        used: false
      }
    })

    // âœ… Ø¥Ù†Ø´Ø§Ø¡ Ø±Ù…Ø² Ø¬Ø¯ÙŠØ¯
    const otp = generateOTP()

    await prisma.verificationToken.create({
      data: {
        email,
        token: otp,
        type,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 Ø¯Ù‚Ø§Ø¦Ù‚
      }
    })

    // âœ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¥ÙŠÙ…ÙŠÙ„
    const result = await sendVerificationEmail(
      email,
      otp,
      user.name || 'Ø¹Ø²ÙŠØ²ÙŠ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…'
    )

    if (!result.success) {
      return NextResponse.json(
        { error: 'ÙØ´Ù„ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¥ÙŠÙ…ÙŠÙ„ØŒ Ø­Ø§ÙˆÙ„ Ù…Ø¬Ø¯Ø¯Ø§Ù‹' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø±Ù…Ø² Ø§Ù„ØªØ­Ù‚Ù‚ Ø¥Ù„Ù‰ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ'
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø®Ø§Ø¯Ù…' },
      { status: 500 }
    )
  }
}

