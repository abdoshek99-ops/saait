import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { _count: { select: { registrations: true } } },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      select: { id: true }
    })
    if (!user) return NextResponse.json({ error: 'Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' }, { status: 404 })

    const body = await req.json()
    const { title, description, type, date, speaker, location, isOnline, streamUrl, registerUrl, maxAttendees, imageUrl, endDate } = body

    if (!title || !description || !type || !date) {
      return NextResponse.json({ error: 'Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ù†Ø§Ù‚ØµØ©' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        date:         new Date(date),
        speaker:      speaker      || null,
        location:     location     || null,
        isOnline:     isOnline     ?? true,
        streamUrl:    streamUrl    || null,
        registerUrl:  registerUrl  || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        imageUrl:     imageUrl     || null,
        endDate:      endDate      ? new Date(endDate) : null,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST event error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

