import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true }
    })
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

    const job = await prisma.job.findUnique({ where: { id: id } })
    if (!job) return NextResponse.json({ error: 'الوظيفة غير موجودة' }, { status: 404 })

    // ✅ فقط صاحب الوظيفة أو الأدمن يمكنه الحذف
    if (job.postedById !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'لا يمكنك حذف هذه الوظيفة' }, { status: 403 })
    }

    await prisma.job.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}