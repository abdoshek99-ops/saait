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
      return NextResponse.json({ error: 'لا يمكن تسجيل خروج مدير' }, { status: 403 })
    }

    // أنت تستخدم JWT — لا يوجد جدول Session
    // الحل: حذف رموز التحقق ليضطر المستخدم لإعادة تسجيل الدخول
    await prisma.verificationToken.deleteMany({
      where: { email: user.email }
    })

    return NextResponse.json({
      success: true,
      message: `تم تسجيل خروج ${user.name} — سيحتاج لإعادة الدخول`
    })
  } catch (error) {
    console.error('Force logout error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}