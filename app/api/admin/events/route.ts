import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­' }, { status: 403 })
    }
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, type: true, date: true, location: true, createdAt: true }
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø®Ø§Ø¯Ù…' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'ØºÙŠØ± Ù…ØµØ±Ø­' }, { status: 403 })
    }
    const body = await req.json()
    const { title, type, date, location, description } = body
    if (!title || !date) return NextResponse.json({ error: 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù† ÙˆØ§Ù„ØªØ§Ø±ÙŠØ® Ù…Ø·Ù„ÙˆØ¨Ø§Ù†' }, { status: 400 })

    const event = await prisma.event.create({
      data: { title, type, date: new Date(date), location, description }
    })
    return NextResponse.json({ success: true, event })
  } catch (error) {
    return NextResponse.json({ error: 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø®Ø§Ø¯Ù…' }, { status: 500 })
  }
}

