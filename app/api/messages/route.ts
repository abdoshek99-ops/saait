import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// âœ… Ø¯Ø§Ù„Ø© Ù…Ø³Ø§Ø¹Ø¯Ø© Ù„Ø¬Ù„Ø¨ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø§Ù„Ø­Ø§Ù„ÙŠ
async function getCurrentUser(session: any) {
  if (!session?.user?.email) return null
  return await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, banned: true }
  })
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const currentUser = await getCurrentUser(session)
    if (!currentUser) return NextResponse.json({ error: 'user not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const withUserId = searchParams.get('with')

    if (withUserId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId: withUserId },
            { senderId: withUserId, receiverId: currentUser.id },
          ],
        },
        include: {
          sender:   { select: { id: true, name: true, profile: { select: { avatar: true } } } },
          receiver: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
        },
        orderBy: { createdAt: 'asc' },
      })

      // ØªØ¹ÙŠÙŠÙ† Ø§Ù„Ø±Ø³Ø§Ø¦Ù„ ÙƒÙ…Ù‚Ø±ÙˆØ¡Ø©
      await prisma.message.updateMany({
        where: { senderId: withUserId, receiverId: currentUser.id, read: false },
        data:  { read: true },
      })

      return NextResponse.json(messages)
    }

    // Ø¬Ù„Ø¨ ÙƒÙ„ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø§Øª
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId:   currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      include: {
        sender:   { select: { id: true, name: true, profile: { select: { avatar: true } } } },
        receiver: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
      },
      orderBy:  { createdAt: 'desc' },
      distinct: ['senderId', 'receiverId'],
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('GET messages error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const currentUser = await getCurrentUser(session)
    if (!currentUser) return NextResponse.json({ error: 'user not found' }, { status: 404 })
    if (currentUser.banned) return NextResponse.json({ error: 'Ø­Ø³Ø§Ø¨Ùƒ Ù…Ø­Ø¸ÙˆØ±' }, { status: 403 })

    const body = await req.json()
    const { receiverId, content, type, imageUrl } = body

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Ø§Ù„Ø±Ø³Ø§Ù„Ø© ÙˆØ§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ Ù…Ø·Ù„ÙˆØ¨Ø§Ù†' }, { status: 400 })
    }

    // Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† ÙˆØ¬ÙˆØ¯ Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true }
    })
    if (!receiver) return NextResponse.json({ error: 'Ø§Ù„Ù…Ø³ØªÙ‚Ø¨Ù„ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯' }, { status: 404 })

    const message = await prisma.message.create({
      data: {
        content,
        type:      type     || 'text',
        imageUrl:  imageUrl || null,
        senderId:  currentUser.id,
        receiverId,
      },
      include: {
        sender:   { select: { id: true, name: true, profile: { select: { avatar: true } } } },
        receiver: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
      },
    })

    // Ø¥Ø´Ø¹Ø§Ø± Ù„Ù„Ù…Ø³ØªÙ‚Ø¨Ù„
    await prisma.notification.create({
      data: {
        userId:  receiverId,
        title:   'Ø±Ø³Ø§Ù„Ø© Ø¬Ø¯ÙŠØ¯Ø©',
        message: `Ø£Ø±Ø³Ù„ Ù„Ùƒ ${currentUser.name} Ø±Ø³Ø§Ù„Ø© Ø¬Ø¯ÙŠØ¯Ø©`,
        type:    'message',
        link:    `/messages?with=${currentUser.id}`,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('POST message error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

