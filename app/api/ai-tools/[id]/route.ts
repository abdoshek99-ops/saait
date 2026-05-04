import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true }
    })
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

    // ✅ الأدمن فقط يحذف (أو نضيف addedById لاحقاً)
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح بالحذف' }, { status: 403 })
    }

    await prisma.aITool.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}