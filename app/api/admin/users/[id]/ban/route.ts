import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({ where: { id: id } })
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    if (user.role === 'admin') {
      return NextResponse.json({ error: 'لا يمكن حظر مدير' }, { status: 403 })
    }

    await prisma.user.update({
      where: { id: id },
      data: { banned: true }
    })

    return NextResponse.json({ success: true, message: `تم حظر ${user.name}` })
  } catch (error) {
    console.error('Ban user error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}