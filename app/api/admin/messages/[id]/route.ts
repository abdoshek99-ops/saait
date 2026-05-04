import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true, content: true, createdAt: true,
        sender:   { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true } }
      }
    })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}