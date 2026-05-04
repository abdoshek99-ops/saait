import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const tools = await prisma.aITool.findMany({
      where: { ...(category && { category }) },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tools)
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'ÙŠØ¬Ø¨ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„' }, { status: 401 })
    }

    // âœ… Ø£ÙŠ Ø¹Ø¶Ùˆ ÙŠØ³ØªØ·ÙŠØ¹ Ø§Ù„Ø¥Ø¶Ø§ÙØ©
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, banned: true }
    })
    if (!user) return NextResponse.json({ error: 'Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' }, { status: 404 })
    if (user.banned) return NextResponse.json({ error: 'Ø­Ø³Ø§Ø¨Ùƒ Ù…Ø­Ø¸ÙˆØ±' }, { status: 403 })

    const body = await req.json()
    const { name, description, category, url, imageUrl, isFree, pricing } = body

    if (!name || !description || !url) {
      return NextResponse.json({ error: 'Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„ÙˆØµÙ ÙˆØ§Ù„Ø±Ø§Ø¨Ø· Ù…Ø·Ù„ÙˆØ¨Ø©' }, { status: 400 })
    }

    const tool = await prisma.aITool.create({
      data: {
        name, description, category,
        url,
        imageUrl: imageUrl || null,
        isFree:   isFree   ?? true,
        pricing:  pricing  || null,
      },
    })

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('POST ai-tool error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

