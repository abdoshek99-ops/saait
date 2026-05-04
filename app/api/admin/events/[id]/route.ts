import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }
    const event = await prisma.event.findUnique({ where: { id: params.id } })
    if (!event) return NextResponse.json({ error: 'الفعالية غير موجودة' }, { status: 404 })

    await prisma.event.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: 'تم حذف الفعالية' })
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }
    const body = await req.json()
    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(body.title       && { title: body.title }),
        ...(body.type        && { type: body.type }),
        ...(body.date        && { date: new Date(body.date) }),
        ...(body.location    && { location: body.location }),
        ...(body.description && { description: body.description }),
      }
    })
    return NextResponse.json({ success: true, event })
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}