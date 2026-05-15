import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: true,
        _count: {
          select: {
            ownedProjects: true,
            posts: true,
            sentMessages: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({ where: { id: id } })
    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    if (user.role === 'admin') {
      return NextResponse.json({ error: 'لا يمكن حذف مدير النظام' }, { status: 403 })
    }

    await prisma.$transaction(async (tx) => {
      // حذف الرسائل المرسلة والمستقبلة
      await tx.message.deleteMany({
        where: { OR: [{ senderId: id }, { receiverId: id }] }
      })
      // حذف عضوية المشاريع
      await tx.projectMember.deleteMany({ where: { userId: id } })
      // حذف المشاريع المملوكة
      await tx.project.deleteMany({ where: { ownerId: id } })
      // حذف المواضيع
      await tx.post.deleteMany({ where: { authorId: id } })
      // حذف الإشعارات
      await tx.notification.deleteMany({ where: { userId: id } })
      // حذف الأفكار
      await tx.idea.deleteMany({ where: { authorId: id } })
      // حذف تسجيلات الفعاليات
      await tx.eventRegistration.deleteMany({ where: { userId: id } })
      // حذف الشارات
      await tx.userBadge.deleteMany({ where: { userId: id } })
      // حذف المهارات
      await tx.userSkill.deleteMany({ where: { userId: id } })
      // حذف رموز التحقق
      await tx.verificationToken.deleteMany({ where: { email: user.email } })
      // حذف الملف الشخصي
      await tx.profile.deleteMany({ where: { userId: id } })
      // حذف المستخدم أخيراً
      await tx.user.delete({ where: { id: id } })
    })

    return NextResponse.json({
      success: true,
      message: `تم حذف ${user.name} وجميع بياناته نهائياً`
    })
  } catch (error) {
    console.error('Admin user DELETE error:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const body = await req.json()

    const user = await prisma.user.update({
      where: { id: id },
      data: {
        ...(body.role   !== undefined && { role: body.role }),
        ...(body.banned !== undefined && { banned: body.banned }),
        ...(body.points !== undefined && { points: body.points }),
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}