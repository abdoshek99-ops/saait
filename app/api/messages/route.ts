import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function getCurrentUser(session: any) {
  if (!session?.user?.email) return null
  return await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, banned: true },
  })
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })

    const currentUser = await getCurrentUser(session)
    if (!currentUser) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

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

      await prisma.message.updateMany({
        where: { senderId: withUserId, receiverId: currentUser.id, read: false },
        data:  { read: true },
      })

      return NextResponse.json(messages)
    }

    // جلب آخر رسالة لكل محادثة
    const allMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      include: {
        sender:   { select: { id: true, name: true, profile: { select: { avatar: true } } } },
        receiver: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // استخراج محادثة واحدة لكل مستخدم
    const seen = new Set<string>()
    const conversations = allMessages.filter(msg => {
      const otherId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId
      if (seen.has(otherId)) return false
      seen.add(otherId)
      return true
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('GET messages error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })

    const currentUser = await getCurrentUser(session)
    if (!currentUser) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (currentUser.banned) return NextResponse.json({ error: 'حسابك محظور' }, { status: 403 })

    const body = await req.json()
    const { receiverId, content, imageUrl } = body

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'الرسالة والمستقبل مطلوبان' }, { status: 400 })
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true },
    })
    if (!receiver) return NextResponse.json({ error: 'المستقبل غير موجود' }, { status: 404 })

    const message = await prisma.message.create({
      data: {
        content:    content.trim(),
        type:       'text',
        imageUrl:   imageUrl || null,
        senderId:   currentUser.id,
        receiverId,
      },
      include: {
        sender:   { select: { id: true, name: true, profile: { select: { avatar: true } } } },
        receiver: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
      },
    })

    await prisma.notification.create({
      data: {
        userId:  receiverId,
        title:   'رسالة جديدة',
        message: `أرسل لك ${currentUser.name} رسالة جديدة`,
        type:    'message',
        link:    `/messages?with=${currentUser.id}`,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('POST message error:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
